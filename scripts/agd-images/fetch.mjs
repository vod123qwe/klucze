// Pobiera zdjęcia produktowe AGD do public/agd/img/ — uruchamiane w GitHub Actions,
// bo tam jest dostęp do stron sklepów. Źródła, po kolei:
// 1) og:image / JSON-LD ze strony produktu (storeUrl), 2) strona producenta (BSH),
// 3) DuckDuckGo Images, 4) Bing Images, 5) pierwszy wynik Ceneo.
// Wynik: public/agd/img/<slug>.<ext> + manifest.json { slug: { file, source } }.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const OUT = 'public/agd/img'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
const products = JSON.parse(await readFile('scripts/agd-images/products.json', 'utf8'))
const manifestPath = `${OUT}/manifest.json`
await mkdir(OUT, { recursive: true })
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {}

async function get(url, accept = 'text/html', extra = {}) {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept, 'accept-language': 'pl-PL,pl;q=0.9', ...extra },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res
}

const abs = (u, base) => {
  try {
    return new URL(u.replace(/&amp;/g, '&'), base).href
  } catch {
    return null
  }
}

const BAD_URL = /logo|banner|favicon|placeholder|sprite|icon|social|share/i

function fromProductPage(html, base) {
  // Najpierw JSON-LD Product (zwykle packshot), dopiero potem og:image (bywa logo sklepu)
  const ld = html.match(/"@type"\s*:\s*"Product"[\s\S]{0,4000}?"image"\s*:\s*\[?\s*(?:\{[^}]*?"url"\s*:\s*)?"([^"]+)"/i)
  const og = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i)
  for (const m of [ld, og]) {
    const url = m && abs(m[1], base)
    if (url && !BAD_URL.test(url)) return url
  }
  return null
}

async function viaStore(p) {
  if (!p.storeUrl || /;szukaj-|search|listing/.test(p.storeUrl)) return null
  const html = await (await get(p.storeUrl)).text()
  return fromProductPage(html, p.storeUrl)
}

const BSH_SITE = { siemens: 'siemens-home.bsh-group.com', bosch: 'bosch-home.pl' }

async function viaMaker(p) {
  const site = BSH_SITE[p.brand.toLowerCase()]
  if (!site) return null
  const url = `https://www.${site}/${site.startsWith('siemens') ? 'pl/' : ''}productlist/${encodeURIComponent(p.model)}`
  const html = await (await get(url)).text()
  return fromProductPage(html, url)
}

const sleep = ms => new Promise(r => setTimeout(r, ms))
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// DuckDuckGo ogranicza liczbę zapytań — odstęp między nimi i jedna próba po przerwie
let lastDuck = 0
async function viaDuck(p, retry = true) {
  const wait = lastDuck + 5000 - Date.now()
  if (wait > 0) await sleep(wait)
  lastDuck = Date.now()
  const q = `${p.brand} ${p.model}`
  const page = await (await get(`https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`)).text()
  const vqd = page.match(/vqd=["']?([\d-]+)/)?.[1]
  if (!vqd) throw new Error('brak tokenu vqd')
  try {
    const res = await get(
      `https://duckduckgo.com/i.js?l=pl-pl&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}&f=,,,,,&p=1`,
      'application/json, text/javascript, */*; q=0.01',
      { referer: 'https://duckduckgo.com/', 'x-requested-with': 'XMLHttpRequest' },
    )
    const { results = [] } = await res.json()
    const model = norm(p.model)
    const hits = results.filter(r => norm(`${r.title} ${r.image}`).includes(model) && !BAD_URL.test(r.image))
    return hits.find(r => !banned.has(r.image))?.image ?? null
  } catch (e) {
    if (retry && /^403/.test(e.message)) {
      console.log(`  ${p.slug} duck: 403, czekam 60 s`)
      await sleep(60000)
      return viaDuck(p, false)
    }
    throw e
  }
}

async function viaCeneo(p) {
  const url = `https://www.ceneo.pl/;szukaj-${encodeURIComponent(`${p.brand} ${p.model}`)}`
  const html = await (await get(url)).text()
  if (!html.includes('ceneostatic')) throw new Error(`brak zdjęć na stronie (${html.length} B)`)
  const m = html.match(/(?:src|data-original|data-src)=["']((?:https?:)?\/\/image\.ceneostatic\.pl\/data\/products\/[^"']+)["']/i)
  if (!m) return null
  // miniatura → większy wariant
  return abs(m[1].replace(/\/(?:i-|m-)/, '/i-'), 'https://www.ceneo.pl/')
}

async function viaBing(p) {
  const q = `${p.brand} ${p.model}`
  const html = await (await get(`https://www.bing.com/images/search?q=${encodeURIComponent(q)}&form=HDRSC2`)).text()
  const urls = [...html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]+?)&quot;/g)].map(m => m[1])
  const model = p.model.toLowerCase().replace(/[^a-z0-9]/g, '')
  // Najpierw adresy z kodem modelu w nazwie pliku — mniejsze ryzyko złego produktu
  if (urls.length === 0) throw new Error('brak wyników (limit?)')
  return urls.find(u => u.toLowerCase().replace(/[^a-z0-9]/g, '').includes(model)) ?? null
}

// Wymiary z nagłówka pliku (PNG/JPEG/WebP) — odrzucamy banery i miniatury
function imageSize(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue }
      const marker = b[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }
      }
      i += 2 + b.readUInt16BE(i + 2)
    }
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16)
    if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) }
    if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
    if (kind === 'VP8L') {
      const bits = b.readUInt32LE(21)
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 }
    }
  }
  return null
}

const banned = new Set(existsSync('scripts/agd-images/banned.json') ? JSON.parse(await readFile('scripts/agd-images/banned.json', 'utf8')) : [])

async function download(url, slug) {
  if (banned.has(url) || BAD_URL.test(url)) throw new Error('odrzucony adres')
  const res = await get(url, 'image/avif,image/webp,image/png,image/jpeg,*/*')
  const type = res.headers.get('content-type') ?? ''
  if (!type.startsWith('image/')) throw new Error(`not an image: ${type}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 4000) throw new Error(`too small: ${buf.length} B`)
  const size = imageSize(buf)
  if (size) {
    const ratio = size.w / size.h
    if (size.w < 250 || ratio > 2.3 || ratio < 0.3) throw new Error(`zły format ${size.w}x${size.h}`)
  }
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('avif') ? 'avif' : 'jpg'
  const file = `${slug}.${ext}`
  await writeFile(`${OUT}/${file}`, buf)
  return file
}

// maker (404 dla większości modeli) i ceneo (strona anty-bot) są wyłączone
const sources = { store: viaStore, duck: viaDuck, bing: viaBing }
const force = process.env.FORCE === '1'

for (const p of products) {
  if (manifest[p.slug] && !force) {
    console.log(`= ${p.slug} (już jest)`)
    continue
  }
  let done = false
  for (const [name, fn] of Object.entries(sources)) {
    try {
      const url = await fn(p)
      if (!url) {
        console.log(`  ${p.slug} ${name}: brak`)
        continue
      }
      const file = await download(url, p.slug)
      manifest[p.slug] = { file, source: name, url }
      console.log(`✓ ${p.slug} ← ${name} ${url}`)
      done = true
      break
    } catch (e) {
      console.log(`  ${p.slug} ${name}: ${e.message}`)
    }
    await sleep(800)
  }
  if (!done) console.log(`✗ ${p.slug}`)
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 1) + '\n')
console.log(`\nZdjęcia: ${Object.keys(manifest).length}/${products.length}`)
