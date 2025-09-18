import React, { useEffect, useRef, useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const taRef = useRef(null)

  useEffect(() => { taRef.current?.focus() }, [])

  // auto-grow textarea
  useEffect(() => {
    if (!taRef.current) return
    taRef.current.style.height = 'auto'
    taRef.current.style.height = taRef.current.scrollHeight + 'px'
  }, [text])

  const submit = (e) => {
    e.preventDefault()
    const val = text.trim()
    if (!val) return
    onSend(val)
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) submit(e)
  }

  return (
    <form className="chatbox" onSubmit={submit}>
      <textarea
        ref={taRef}
        className="chatbox__input"
        placeholder="Ask anything about the news corpus…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        disabled={disabled}
      />
      <button className="btn" type="submit" disabled={disabled || !text.trim()}>Send</button>
    </form>
  )
}