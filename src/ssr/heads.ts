export type MetaEntry =
  | { name: string; content: string }
  | { property: string; content: string }

export interface HeadConfig {
  title: string
  description?: string
  meta?: MetaEntry[]
}

const SITE_NAME = 'Hono Vue SSR Template'
const DEFAULT_OG_IMAGE = '/og-default.png'

function buildOg(
  title: string,
  description: string,
  image: string,
  url: string,
): MetaEntry[] {
  return [
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
}

export function headForHome(origin: string): HeadConfig {
  const title = `${SITE_NAME} — Home`
  const description = 'A minimal Hono + Vue SSR template on Cloudflare Workers.'
  return {
    title,
    description,
    meta: buildOg(title, description, `${origin}${DEFAULT_OG_IMAGE}`, `${origin}/`),
  }
}

export function headForAbout(origin: string): HeadConfig {
  const title = `About — ${SITE_NAME}`
  const description = 'About this template: Hono + Vue + Vue SSR on Cloudflare Workers.'
  return {
    title,
    description,
    meta: buildOg(title, description, `${origin}${DEFAULT_OG_IMAGE}`, `${origin}/about`),
  }
}

export function headForWord(word: string, origin: string): HeadConfig {
  const title = `${word} — ${SITE_NAME}`
  const description = `Word page for: ${word}`
  const ogImage = `https://www.moedict.tw/${encodeURIComponent(word)}.png`
  return {
    title,
    description,
    meta: buildOg(title, description, ogImage, `${origin}/word/${encodeURIComponent(word)}`),
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderHeadTags(head: HeadConfig): string {
  const parts: string[] = [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<title>${escapeHtml(head.title)}</title>`,
  ]
  if (head.description) {
    parts.push(`<meta name="description" content="${escapeHtml(head.description)}" />`)
  }
  for (const m of head.meta ?? []) {
    if ('name' in m) {
      parts.push(`<meta name="${escapeHtml(m.name)}" content="${escapeHtml(m.content)}" />`)
    } else {
      parts.push(`<meta property="${escapeHtml(m.property)}" content="${escapeHtml(m.content)}" />`)
    }
  }
  return parts.join('\n    ')
}
