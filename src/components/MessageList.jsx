import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function MessageList({ messages, botTyping }) {
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, botTyping])

  if (!messages?.length) {
    return (
      <div className="empty">
        <h3>Ask about today\'s news</h3>
        <p>Try: "What\'s the latest on the Fed?"</p>
      </div>
    )
  }

  return (
    <>
      {messages.map((m, i) => (
        <MessageBubble key={(m.ts || i) + '-' + i} role={m.role} content={String(m.content ?? '')} />
      ))}
      {botTyping && <div className="typing">Assistant is thinking…</div>}
      <div ref={bottomRef} />
    </>
  )
}