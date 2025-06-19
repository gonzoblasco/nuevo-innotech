import { Metadata } from 'next'
import ChatInterface from '@/components/chat/ChatInterface'

interface PageProps {
  params: Promise<{
    sessionId: string
  }>
}

export const metadata: Metadata = {
  title: 'Chat con Arquitecto de Decisiones | InnoTech Solutions',
  description: 'Conversación en tiempo real con tu Arquitecto de Decisiones Estratégicas'
}

export default async function ChatPage({ params }: PageProps) {
  // ✅ AWAIT params antes de usarlo (Next.js 15 requirement)
  const { sessionId } = await params

  return <ChatInterface sessionId={sessionId} />
}