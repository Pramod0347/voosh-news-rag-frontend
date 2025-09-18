import React from 'react'

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--bot'}`}>
      {!isUser && <span className="avatar">🤖</span>}
      <div className="bubble__content">
        {String(content)
          .split('\n')
          .map((line, idx) => (<p key={idx}>{line}</p>))}
      </div>
      {isUser && <span className="avatar">🧑</span>}
    </div>
  )
}