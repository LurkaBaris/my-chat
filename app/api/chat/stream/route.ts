import type { ChatListEvent } from '@/entities/conversation';
import { getConversations, subscribeToChatList } from '@/entities/conversation/index.server';
import { isAuthUser } from '@/shared/lib';
import { auth } from '@/shared/lib/index.server';

export const GET = async (request: Request) => {
  const session = await auth();

  if (!isAuthUser(session?.user)) {
    return new Response(null, { status: 401 });
  }

  const url = new URL(request.url);

  if (url.searchParams.get('check') === 'access') {
    return new Response(null, { status: 204 });
  }

  const cursor = Number(request.headers.get('last-event-id') ?? url.searchParams.get('since'));
  const updatedAfter = Number.isFinite(cursor) ? new Date(cursor) : undefined;
  const userId = session.user.id;
  const encoder = new TextEncoder();
  let unsubscribe = () => {};

  const stream = new ReadableStream({
    start: async (controller) => {
      const sendEvent = (chatListEvent: ChatListEvent) => {
        const createdAt =
          chatListEvent.type === 'message.created'
            ? chatListEvent.message.createdAt
            : (chatListEvent.conversation.lastMessage?.createdAt ??
              chatListEvent.conversation.createdAt);
        const event = `id: ${createdAt.getTime()}\ndata: ${JSON.stringify(chatListEvent)}\n\n`;

        controller.enqueue(encoder.encode(event));
      };

      unsubscribe = subscribeToChatList(userId, sendEvent);

      request.signal.addEventListener('abort', unsubscribe, { once: true });

      controller.enqueue(encoder.encode(': connected\n\n'));

      const conversations = await getConversations(userId, updatedAfter);

      if (request.signal.aborted) return;

      for (const conversation of conversations.reverse()) {
        sendEvent({
          type: 'conversation.created',
          conversation,
        });
      }
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
