📌 Overview

React + SCSS chat UI for the News RAG bot.

Persists sessionId in localStorage

Loads chat history on reload

Sends queries to backend; bot reply types out (pseudo-stream)

Reset button clears Redis history & rotates session

Abort button cancels in-flight answer

Live App: https://voosh-news-rag-frontend.vercel.app/
Backend API: https://voosh-news-rag-backend.onrender.com/

✨ Features

Chat Screen: message bubbles (user right, bot left), avatars, typing indicator

Session Handling: sessionId persisted; history fetched via API

Message Flow: optimistic user push → /api/ask → typed bot reply → abort support

UI/UX: dark theme, responsive, auto-expanding textarea

Resilience: normalizes history payloads; filters blanks; scrolls to bottom

🗂️ Folder Structure
src/
  assets/
  components/         # MessageList, MessageBubble, ChatInput
  services/api.js     # axios client with baseURL
  styles/
  App.jsx, main.jsx
vite.config.js
index.html

🛠️ Install & Run
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview      # local preview of the production build


🚀 Deploy (Vercel)

Import repo in Vercel → New Project

Framework: Vite (auto)

Build: npm ci && npm run build

Output Dir: dist

Env:

VITE_API_BASE_URL = https://voosh-news-rag-backend.onrender.com/api

Deploy → open the URL and test

🧪 Manual Test Plan

Load app → it creates a sessionId and calls /history/:sid

Ask a question → see typed reply + sources in console/network

Reload → history is restored

Click Reset → history clears; sessionId rotates

Abort while answering → request stops

🔧 Troubleshooting

Double /api in Network tab → fix by either:

Set VITE_API_BASE_URL with /api and use endpoints like "/ask", or

Set base without /api and call "/api/ask"


Empty history after reload → ensure sessionId persisted before fetching
