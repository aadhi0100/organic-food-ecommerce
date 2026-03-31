const express = require('express')
const next = require('next')

const isProduction = process.argv.includes('--prod') || process.env.NODE_ENV === 'production'
const dev = !isProduction
const port = Number(process.env.PORT || 3000)

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.disable('x-powered-by')

  server.get('/healthz', (_req, res) => {
    res.status(200).json({
      ok: true,
      environment: dev ? 'development' : 'production',
    })
  })

  server.use((req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port} (${dev ? 'development' : 'production'})`)
  })
})
