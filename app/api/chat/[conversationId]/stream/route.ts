import { getConversationParticipant } from '@/entities/conversation-participant/index.server';
import { subscribeToConversation } from '@/entities/message/index.server';
import { isAuthUser } from '@/shared/lib';
import { auth } from '@/shared/lib/index.server';

interface StreamRouteContext {
  params: Promise<{ conversationId: string }>;
}

export const GET = async (request: Request, { params }: StreamRouteContext) => {
  const session = await auth();

  if (!isAuthUser(session?.user)) {
    return new Response(null, { status: 401 });
  }

  const { conversationId } = await params;

  const participant = await getConversationParticipant(conversationId, session.user.id);

  if (!participant) {
    return new Response(null, { status: 403 });
  }

  const encoder = new TextEncoder();
  let unsubscribe = () => {};

  const stream = new ReadableStream({
    start: (controller) => {
      unsubscribe = subscribeToConversation(conversationId, (message) => {
        const data = JSON.stringify(message);
        const event = `data: ${data}\n\n`;

        controller.enqueue(encoder.encode(event));
      });

      request.signal.addEventListener('abort', unsubscribe, { once: true });

      controller.enqueue(encoder.encode(': connected\n\n'));
    },

    cancel: () => {
      request.signal.removeEventListener('abort', unsubscribe);

      unsubscribe();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
};
