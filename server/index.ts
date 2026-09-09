// Backend Express — API chatbot + serve front em produção
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sendMessageToGemini, streamMessageToGemini, type ChatMessage } from './gemini.js'

dotenv.config()

const app = express()
const PORT = Number(process.env['PORT'] ?? 3001)

app.use(cors())
app.use(express.json({ limit: '64kb' }))

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (m) =>
      typeof m === 'object' &&
      m !== null &&
      (m as ChatMessage).role !== undefined &&
      ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'model') &&
      typeof (m as ChatMessage).text === 'string',
  )
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', geminiConfigured: Boolean(process.env['GEMINI_API_KEY'] ?? process.env['VITE_GEMINI_API_KEY']) })
})

// Chat não-streaming
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body as { message?: unknown; history?: unknown }
  console.log('[API /api/chat] →', { hasMessage: typeof message === 'string', historyLength: Array.isArray(history) ? (history as unknown[]).length : 0 })

  if (typeof message !== 'string' || !message.trim()) {
    console.warn('[API /api/chat] ❌ message inválida', { message })
    res.status(400).json({ error: 'Campo `message` é obrigatório e deve ser string não vazia.' })
    return
  }

  const cleanMessage = message.trim().slice(0, 2000)
  const cleanHistory: ChatMessage[] = isValidHistory(history) ? (history as ChatMessage[]).slice(-20) : []
  if (!isValidHistory(history) && history !== undefined) console.warn('[API /api/chat] ⚠️ history inválido', { history })

  try {
    console.log('[API /api/chat] sendMessageToGemini...', { cleanMessage: cleanMessage.slice(0, 80), cleanHistoryLength: cleanHistory.length })
    const reply = await sendMessageToGemini(cleanHistory, cleanMessage)
    console.log('[API /api/chat] ← Reply', { length: reply.length, preview: reply.slice(0, 150) })
    if (!reply.trim()) console.warn('[API /api/chat] ⚠️ Reply vazio')
    res.json({ reply })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    console.error('[API /api/chat] ❌ Erro', { error: msg, stack: err instanceof Error ? err.stack : undefined })
    res.status(500).json({ error: msg })
  }
})

// Chat streaming SSE
app.post('/api/chat/stream', async (req, res) => {
  const { message, history } = req.body as { message?: unknown; history?: unknown }
  console.log('[API /api/chat/stream] →', { hasMessage: typeof message === 'string', historyLength: Array.isArray(history) ? (history as unknown[]).length : 0 })

  if (typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Campo `message` é obrigatório.' })
    return
  }

  const cleanMessage = message.trim().slice(0, 2000)
  const cleanHistory: ChatMessage[] = isValidHistory(history) ? (history as ChatMessage[]).slice(-20) : []

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  // @ts-ignore flushHeaders existe no Node
  if (typeof res.flushHeaders === 'function') res.flushHeaders()

  const sendEvent = (data: unknown) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  try {
    for await (const chunk of streamMessageToGemini(cleanHistory, cleanMessage)) {
      if (chunk) {
        console.log('[API /api/chat/stream] delta', { preview: String(chunk).slice(0, 60) })
        sendEvent({ text: chunk })
      }
    }
    sendEvent('[DONE]')
    res.end()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro interno'
    console.error('[API /api/chat/stream] ❌ Erro', { error: msg, stack: err instanceof Error ? err.stack : undefined })
    try {
      sendEvent({ error: msg })
      sendEvent('[DONE]')
      res.end()
    } catch {
      if (!res.headersSent) res.status(500).json({ error: msg })
      else res.end()
    }
  }
})

// Serve front em produção
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import fs from 'node:fs'

const candidatePaths = [
  path.resolve(__dirname, '../../dist'),
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, '../..', 'dist'),
]
const distPath = candidatePaths.find((p) => {
  try {
    return fs.existsSync(path.join(p, 'index.html'))
  } catch {
    return false
  }
}) ?? path.resolve(__dirname, '../../dist')

if (process.env['NODE_ENV'] === 'production') {
  app.use(express.static(distPath))
  // Express 5 exige nome no curinga
  app.get('/{*any}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

export { app }

const isVitest = Boolean(process.env['VITEST'])
if (!isVitest) {
  app.listen(PORT, () => {
    console.log(`[server] Unex backend rodando em http://localhost:${PORT}`)
    console.log(`[server] POST http://localhost:${PORT}/api/chat`)
    if (process.env['NODE_ENV'] === 'production') console.log(`[server] Servindo front-end de ${distPath}`)
  })
}
