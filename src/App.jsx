import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getOrCreateSessionId, rotateSessionId } from './utils/session'
import { askQuestion, fetchHistory, clearHistory } from './services/api'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'

export default function App() {
  const [sessionId, setSessionId] = useState(getOrCreateSessionId())
  const [messages, setMessages] = useState([])
  const [botTyping, setBotTyping] = useState(false)
  const abortRef = useRef(null)

  const api = useMemo(() => ({ ask: askQuestion, history: fetchHistory, clear: clearHistory }), [])

  // Load history on mount & whenever session changes
  useEffect(() => {
    let mounted = true
    api.history(sessionId)
      .then((hist) => { if (mounted) setMessages(hist || []) })
      .catch(() => { if (mounted) setMessages([]) })
    return () => { mounted = false }
  }, [sessionId, api])

  const handleSend = async (text) => {
    if (!text.trim()) return

    // push user msg
    const userMsg = { role: 'user', content: text, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])

    setBotTyping(true)
    try {
      const controller = new AbortController()
      abortRef.current = controller
      const res = await api.ask({ sessionId, query: text, signal: controller.signal })

      // ensure string
      const finalText = (typeof res?.answer === 'string' && res.answer.length)
        ? res.answer
        : 'No answer returned.'

      // add assistant bubble and type out
      const botMsg = { role: 'assistant', content: '', ts: Date.now() }
      setMessages((prev) => [...prev, botMsg])

      await typeOut(finalText, (chunk) => {
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: chunk }
          return copy
        })
      })
    } catch (err) {
      console.error('ask error', err)
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Error fetching answer.', ts: Date.now() }])
    } finally {
      setBotTyping(false)
      abortRef.current = null
    }
  }

  const typeOut = (fullText, onUpdate) => {
    return new Promise((resolve) => {
      const chars = [...fullText]
      let i = 0
      const tick = () => {
        i++
        onUpdate(chars.slice(0, i).join(''))
        if (i < chars.length) setTimeout(tick, Math.min(22, 4000 / chars.length))
        else resolve()
      }
      tick()
    })
  }

  const onResetSession = async () => {
    try { await api.clear(sessionId) } catch {
      // intentionally ignored
    }
    const newId = rotateSessionId()
    setSessionId(newId)
    setMessages([])
  }

  const onAbort = () => {
    try { abortRef.current?.abort() } catch {
      // intentionally ignored
    }
    setBotTyping(false)
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="brand">
          <span className="logo">🗞️</span>
          <div>
            <h1>NewsChat</h1>
            <p className="subtitle">RAG over ~50 news articles</p>
          </div>
        </div>
        <div className="actions">
          <button className="btn btn--ghost" onClick={onResetSession}>Reset</button>
          {botTyping && <button className="btn btn--danger" onClick={onAbort}>Stop</button>}
        </div>
      </header>

      <main className="app__main">
        <div className="messages">
          <MessageList messages={messages} botTyping={botTyping} />
        </div>
      </main>

      <footer className="app__footer">
        <ChatInput disabled={botTyping} onSend={handleSend} />
      </footer>
    </div>
  )
}