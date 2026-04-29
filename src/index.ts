import { Hono } from 'hono'
import HomeView from './views/Home.vue'
import AboutView from './views/About.vue'
import WordView from './views/Word.vue'
import { renderPage } from './ssr/render'
import { headForHome, headForAbout, headForWord } from './ssr/heads'

type Bindings = {
  ASSETS?: {
    fetch: (request: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  }
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/api/hello', (c) => c.text('Hello World!'))

app.get('/', async (c) => {
  const origin = new URL(c.req.url).origin
  const html = await renderPage(HomeView, {}, headForHome(origin))
  return c.html(html)
})

app.get('/about', async (c) => {
  const origin = new URL(c.req.url).origin
  const html = await renderPage(AboutView, {}, headForAbout(origin))
  return c.html(html)
})

app.get('/word/:w', async (c) => {
  const word = decodeURIComponent(c.req.param('w'))
  const origin = new URL(c.req.url).origin
  const html = await renderPage(WordView, { word }, headForWord(word, origin))
  return c.html(html)
})

// Fallback: hand off to ASSETS for static files (favicon, styles, etc.)
app.get('*', async (c) => {
  if (!c.env.ASSETS) return c.notFound()
  return c.env.ASSETS.fetch(c.req.raw)
})

export default app
