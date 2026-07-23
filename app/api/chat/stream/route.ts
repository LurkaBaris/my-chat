import { subscribeToChatList } from '@/entities/conversation/index.server'
import { isAuthUser } from '@/shared/lib'
import { auth } from '@/shared/lib/index.server'

export const GET = async (request: Request) => {
  const session = await auth()

  if (!isAuthUser(session?.user)) {
    return new Response(null, { status: 401 })
  }

  const currentUserId = session.user.id
  const encoder = new TextEncoder()
  let unsubscribe = () => {}

  const stream = new ReadableStream({
    start: (controller) => {
      unsubscribe = subscribeToChatList(currentUserId, (chatListEvent) => {
        const data = JSON.stringify(chatListEvent)
        const event = `data: ${data}\n\n`

        controller.enqueue(encoder.encode(event))
      })

      request.signal.addEventListener('abort', unsubscribe, { once: true })

      controller.enqueue(encoder.encode(': connected\n\n'))
    },

    cancel: () => {
      request.signal.removeEventListener('abort', unsubscribe)

      unsubscribe()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
