// Pobiera zdjęcia produktowe AGD do public/agd/img/ — uruchamiane w GitHub Actions,
// bo tam jest dostęp do stron sklepów. Źródła, po kolei:
// 1) og:image / JSON-LD ze strony produktu (storeUrl), 2) pierwszy wynik Ceneo, 3) Bing Images.
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

async function get(url, accept = 'text/html') {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, accept, 'accept-language': 'pl-PL,pl;q=0.9' },
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

function fromProductPage(html, base) {
  const og = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i)
  if (og) return abs(og[1], base)
  const ld = html.match(/"image"\s*:\s*\[?\s*"([^"]+\.(?:jpe?g|png|webp)[^"]*)"/i)
  return ld ? abs(ld[1], base) : null
}

async function viaStore(p) {
  if (!p.storeUrl || /;szukaj-|search|listing/.test(p.storeUrl)) return null
  const html = await (await get(p.storeUrl)).text()
  return fromProductPage(html, p.storeUrl)
}

async function viaCeneo(p) {
  const url = `https://www.ceneo.pl/;szukaj-${encodeURIComponent(`${p.brand} ${p.model}`)}`
  const html = await (await get(url)).text()
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
  return urls.find(u => u.toLowerCase().replace(/[^a-z0-9]/g, '').includes(model)) ?? urls[0] ?? null
}

async function download(url, slug) {
  const res = await get(url, 'image/avif,image/webp,image/png,image/jpeg,*/*')
  const type = res.headers.get('content-type') ?? ''
  if (!type.startsWith('image/')) throw new Error(`not an image: ${type}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 4000) throw new Error(`too small: ${buf.length} B`)
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : type.includes('avif') ? 'avif' : 'jpg'
  const file = `${slug}.${ext}`
  await writeFile(`${OUT}/${file}`, buf)
  return file
}

const sources = { store: viaStore, ceneo: viaCeneo, bing: viaBing }
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
  }
  if (!done) console.log(`✗ ${p.slug}`)
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 1) + '\n')
console.log(`\nZdjęcia: ${Object.keys(manifest).length}/${products.length}`)
