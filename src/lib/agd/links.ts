const enc = encodeURIComponent

/** Linki wyszukiwania w popularnych sklepach — działają nawet gdy nie mamy bezpośredniego URL produktu */
const STORE_SEARCH: { match: RegExp; url: (q: string) => string }[] = [
  { match: /media\s*expert/i, url: q => `https://www.mediaexpert.pl/search?query%5Bquerystring%5D=${enc(q)}` },
  { match: /rtv\s*euro|euro\s*agd/i, url: q => `https://www.euro.com.pl/search.bhtml?keyword=${enc(q)}` },
  { match: /oleole/i, url: q => `https://www.oleole.pl/search.bhtml?keyword=${enc(q)}` },
  { match: /neonet/i, url: q => `https://www.neonet.pl/search.html?query=${enc(q)}` },
  { match: /x-kom/i, url: q => `https://www.x-kom.pl/szukaj?q=${enc(q)}` },
  { match: /allegro/i, url: q => `https://allegro.pl/listing?string=${enc(q)}` },
  { match: /ceneo/i, url: q => `https://www.ceneo.pl/;szukaj-${enc(q)}` },
]

export function storeSearchUrl(store: string, query: string) {
  const known = STORE_SEARCH.find(s => s.match.test(store))
  return known ? known.url(query) : `https://www.google.com/search?q=${enc(`${query} ${store}`)}`
}

export function ceneoUrl(query: string) {
  return `https://www.ceneo.pl/;szukaj-${enc(query)}`
}

export function imagesUrl(query: string) {
  return `https://www.google.com/search?tbm=isch&q=${enc(query)}`
}
