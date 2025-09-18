import ky from 'ky'

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export const api = axios.create({ baseURL: API_BASE });

const client = ky.create({
  prefixUrl: API_BASE,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' }
})

export async function askQuestion({ sessionId, query, signal }) {
  return client.post('api/ask', { json: { sessionId, query }, signal }).json()
}

export async function fetchHistory(sessionId) {
  try {
    const res = await client.get(`api/history/${sessionId}`).json()
    const arr = Array.isArray(res) ? res : (res?.history || [])
    // Normalize defensively to { role, content }
    return arr.map((m) => ({
      role: m.role || m.sender || (m.user ? 'user' : 'assistant') || 'assistant',
      content: m.content ?? m.text ?? m.message ?? ''
    }))
  } catch (e) {
    console.warn('history error', e)
    return []
  }
}

export async function clearHistory(sessionId) {
  try { return await client.delete(`api/history/${sessionId}`).json() }
  catch { return { ok: false } }
}