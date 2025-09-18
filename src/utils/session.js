import { v4 as uuid } from 'uuid'

const KEY = 'newschat.sessionId'

export function getOrCreateSessionId() {
  let sid = localStorage.getItem(KEY)
  if (!sid) {
    sid = uuid()
    localStorage.setItem(KEY, sid)
  }
  return sid
}

export function rotateSessionId() {
  const sid = uuid()
  localStorage.setItem(KEY, sid)
  return sid
}