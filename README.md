# hono-vue-ssr-template

Minimal Cloudflare Workers template using **Hono** for routing and **Vue 3 SSR** for rendering. No D1 / R2 / KV / AI bindings — just a worker that server-renders Vue components and serves a few static assets.

## Routes

| Route          | What it does                                                                 |
| -------------- | ---------------------------------------------------------------------------- |
| `/`            | Home page (SSR)                                                              |
| `/about`       | About page (SSR)                                                             |
| `/word/:w`     | Dynamic page; `og:image` is `https://www.moedict.tw/{w}.png`                 |
| `/api/hello`   | Returns `Hello World!`                                                       |
| `*`            | Falls back to the `ASSETS` binding (`./public/`)                             |

## Stack

- [Hono](https://hono.dev) — the worker / router
- [Vue 3](https://vuejs.org) + `@vue/server-renderer` — SSR
- [Vite](https://vite.dev) + `@vitejs/plugin-vue` + `@cloudflare/vite-plugin` — build / dev
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — deploy

## Layout

```
src/
├── index.ts             # Hono worker entry — defines all routes
├── ssr/
│   ├── render.ts        # createSSRApp + renderToString → full HTML page
│   └── heads.ts         # per-route <title> / OG meta builders
├── views/
│   ├── Home.vue
│   ├── About.vue
│   └── Word.vue
└── components/
    └── NavBar.vue
public/                  # static assets, served via ASSETS binding
├── styles.css
└── favicon.svg
```

## Develop

```bash
npm install
npm run dev          # vite dev — runs the worker locally with HMR
```

## Deploy

```bash
npm run deploy       # vite build + wrangler deploy
```

## Adding a route

1. Create a `.vue` file in `src/views/`.
2. Add a `headForX(...)` function in `src/ssr/heads.ts`.
3. Wire a route in `src/index.ts`:

   ```ts
   app.get('/foo', async (c) => {
     const origin = new URL(c.req.url).origin
     const html = await renderPage(FooView, {}, headForFoo(origin))
     return c.html(html)
   })
   ```

## Dynamic HEAD

Each route builds a `HeadConfig` (title + meta) before rendering. `/word/:w`
sets `og:image` to `https://www.moedict.tw/{w}.png` — see `headForWord` in
`src/ssr/heads.ts` for the pattern. Add more `og:` / `twitter:` tags or extend
`HeadConfig` as needed.

## License

MIT — see [LICENSE](./LICENSE).
