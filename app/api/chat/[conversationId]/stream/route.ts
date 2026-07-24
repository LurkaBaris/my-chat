import { getConversationParticipant } from '@/entities/conversation-participant/index.server';
import type { MessageWithSender } from '@/entities/message';
import { getMessagesAfter, subscribeToConversation } from '@/entities/message/index.server';
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
  const currentUserId = session.user.id;

  const participant = await getConversationParticipant(conversationId, currentUserId);

  if (!participant) {
    return new Response(null, { status: 403 });
  }

  const url = new URL(request.url);

  if (url.searchParams.get('check') === 'access') {
    return new Response(null, { status: 204 });
  }

  const lastMessageId =
    request.headers.get('last-event-id') ?? url.searchParams.get('lastMessageId');
  const encoder = new TextEncoder();
  let unsubscribe = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const sendMessage = (message: MessageWithSender) => {
        const event = `id: ${message.id}\ndata: ${JSON.stringify(message)}\n\n`;

        controller.enqueue(encoder.encode(event));
      };

      unsubscribe = subscribeToConversation(conversationId, (message) => {
        sendMessage(message);
      });

      request.signal.addEventListener('abort', unsubscribe, { once: true });

      controller.enqueue(encoder.encode(': connected\n\n'));

      const missedMessages = await getMessagesAfter(conversationId, lastMessageId);

      if (request.signal.aborted) return;

      missedMessages.forEach(sendMessage);
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
