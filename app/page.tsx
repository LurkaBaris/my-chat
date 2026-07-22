import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'My Chat',
  description: 'Перейдите к своим чатам в My Chat',
}

export default function RootRoute() {
  redirect('/chat')
}
