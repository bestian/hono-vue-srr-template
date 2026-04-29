import { createSSRApp, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { renderHeadTags, type HeadConfig } from './heads'

export async function renderPage(
  component: Component,
  props: Record<string, unknown>,
  head: HeadConfig,
): Promise<string> {
  const app = createSSRApp(component, props)
  const bodyHtml = await renderToString(app)
  const headTags = renderHeadTags(head)
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    ${headTags}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div id="app">${bodyHtml}</div>
  </body>
</html>`
}
