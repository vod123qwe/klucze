import type { AppliancePart, Finish, IllustrationStyle } from '@/lib/agd/types'

const PALETTE: Record<Finish, { body: string; glass: string; trim: string; accent: string }> = {
  black: { body: '#1c1f24', glass: '#0d0f12', trim: '#3a3f47', accent: '#9aa3ad' },
  inox: { body: '#c9ced4', glass: '#15181c', trim: '#8f969e', accent: '#e9ecef' },
  graphite: { body: '#3b3f45', glass: '#111316', trim: '#5c6269', accent: '#b8bec5' },
}

interface Props {
  category: AppliancePart
  finish?: Finish
  style?: IllustrationStyle
  className?: string
}

/**
 * Rysunek urządzenia w stylu zdjęcia produktowego. Używany, gdy nie mamy
 * zdjęcia z CDN (sieci sklepów blokują hotlinki) — dzięki temu zestaw
 * zawsze wygląda spójnie obok siebie.
 */
export function ApplianceIllustration({ category, finish = 'black', style, className }: Props) {
  const c = PALETTE[finish]

  switch (category) {
    case 'hood':
      return style === 'chimney' ? (
        <svg viewBox="0 0 200 120" className={className} role="img" aria-label="Okap kominowy">
          <rect x="84" y="6" width="32" height="54" rx="2" fill={c.trim} />
          <path d="M40 60 H160 L176 96 H24 Z" fill={c.body} />
          <rect x="24" y="96" width="152" height="10" rx="2" fill={c.glass} />
          <rect x="130" y="99" width="30" height="4" rx="2" fill={c.accent} opacity=".7" />
        </svg>
      ) : style === 'ceiling' ? (
        <svg viewBox="0 0 200 120" className={className} role="img" aria-label="Okap wyspowy">
          <line x1="60" y1="4" x2="60" y2="62" stroke={c.trim} strokeWidth="2" />
          <line x1="140" y1="4" x2="140" y2="62" stroke={c.trim} strokeWidth="2" />
          <rect x="30" y="62" width="140" height="34" rx="6" fill={c.body} />
          <rect x="44" y="92" width="112" height="3" rx="1.5" fill="#fff6d8" opacity=".9" />
        </svg>
      ) : (
        <svg viewBox="0 0 200 120" className={className} role="img" aria-label="Okap teleskopowy">
          {/* szafka nad okapem */}
          <rect x="22" y="14" width="156" height="62" rx="3" fill="#eef0f2" stroke="#d9dde1" />
          <rect x="22" y="76" width="156" height="14" rx="1" fill={c.trim} />
          <rect x="22" y="88" width="156" height="12" rx="2" fill={c.body} />
          <rect x="30" y="100" width="140" height="3" rx="1.5" fill="#fff6d8" opacity=".9" />
          <circle cx="160" cy="94" r="2" fill={c.accent} />
          <circle cx="152" cy="94" r="2" fill={c.accent} />
          <circle cx="144" cy="94" r="2" fill={c.accent} />
        </svg>
      )

    case 'hob': {
      const flush = style === 'flush'
      const matte = style === 'matte'
      const flex = style === 'flex' || flush || matte
      return (
        <svg viewBox="0 0 200 120" className={className} role="img" aria-label="Płyta indukcyjna">
          <defs>
            <linearGradient id="hobShine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity=".12" />
              <stop offset=".5" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {flush ? (
            <rect x="8" y="10" width="184" height="100" rx="1" fill="#d8cfc3" />
          ) : (
            <rect x="12" y="12" width="176" height="96" rx="6" fill={matte ? '#1d1f22' : c.trim} />
          )}
          <rect x={flush ? 16 : 15} y={flush ? 16 : 15} width={flush ? 168 : 170} height={flush ? 88 : 90} rx={flush ? 1 : 5} fill={matte ? '#2b2d31' : '#101216'} />
          {!matte && <rect x="15" y="15" width="170" height="90" rx="5" fill="url(#hobShine)" />}
          {flex ? (
            <>
              <rect x="30" y="24" width="52" height="60" rx="8" fill="none" stroke="#565c66" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="56" cy="40" r="10" fill="none" stroke="#6b727d" strokeWidth="1.2" />
              <circle cx="56" cy="68" r="10" fill="none" stroke="#6b727d" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <circle cx="56" cy="40" r="15" fill="none" stroke="#6b727d" strokeWidth="1.5" />
              <circle cx="56" cy="72" r="12" fill="none" stroke="#6b727d" strokeWidth="1.5" />
            </>
          )}
          <circle cx="132" cy="38" r="12" fill="none" stroke="#6b727d" strokeWidth="1.5" />
          <circle cx="132" cy="70" r="17" fill="none" stroke="#6b727d" strokeWidth="1.5" />
          <rect x="60" y="92" width="80" height="4" rx="2" fill="#3b4049" />
          <rect x="60" y="92" width="34" height="4" rx="2" fill="#e8533f" opacity=".85" />
        </svg>
      )
    }

    case 'oven':
      return (
        <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Piekarnik do zabudowy">
          <rect x="6" y="6" width="108" height="108" rx="3" fill={c.body} />
          <rect x="6" y="6" width="108" height="20" rx="3" fill={c.glass} />
          <rect x="44" y="11" width="32" height="10" rx="2" fill="#0a2230" />
          <text x="60" y="19" textAnchor="middle" fontSize="7" fill="#7fd4ff" fontFamily="monospace">
            180°
          </text>
          {style === 'knobs' && (
            <>
              <circle cx="22" cy="16" r="5" fill={c.trim} />
              <circle cx="98" cy="16" r="5" fill={c.trim} />
            </>
          )}
          <rect x="14" y="30" width="92" height="5" rx="2.5" fill={c.accent} />
          <rect x="12" y="40" width="96" height="68" rx="3" fill={c.glass} />
          <rect x="22" y="48" width="76" height="50" rx="3" fill="#20242b" />
          <rect x="22" y="48" width="76" height="50" rx="3" fill="#ffb347" opacity=".12" />
          <line x1="26" y1="80" x2="94" y2="80" stroke="#3a3f47" strokeWidth="1" />
        </svg>
      )

    case 'microwave':
      return (
        <svg viewBox="0 0 160 100" className={className} role="img" aria-label="Mikrofalówka do zabudowy">
          <rect x="6" y="10" width="148" height="80" rx="3" fill={c.body} />
          <rect x="12" y="16" width="104" height="68" rx="2" fill={c.glass} />
          <rect x="22" y="24" width="84" height="52" rx="2" fill="#20242b" />
          <rect x="122" y="16" width="26" height="68" rx="2" fill={c.glass} />
          <rect x="126" y="22" width="18" height="8" rx="1" fill="#0a2230" />
          <circle cx="135" cy="48" r="7" fill={c.trim} />
          <rect x="128" y="66" width="14" height="4" rx="2" fill={c.accent} opacity=".7" />
        </svg>
      )

    case 'dishwasher':
      return (
        <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Zmywarka do zabudowy">
          {/* w pełni zintegrowana: widać front meblowy, a panel sterowania jest na górnej krawędzi drzwi */}
          <rect x="10" y="8" width="100" height="6" rx="1.5" fill={c.body} />
          <rect x="44" y="9.5" width="32" height="3" rx="1" fill="#0a2230" />
          <rect x="10" y="14" width="100" height="92" rx="2" fill="#eef0f2" stroke="#d3d8dd" />
          <rect x="40" y="22" width="40" height="4" rx="2" fill="#8f969e" />
          <rect x="10" y="106" width="100" height="8" rx="1" fill="#d9dde1" />
          <circle cx="60" cy="110" r="1.6" fill="#e8533f" opacity=".9" />
          <text x="60" y="70" textAnchor="middle" fontSize="7" fill="#9aa3ad" fontFamily="sans-serif">
            front meblowy
          </text>
        </svg>
      )

    case 'fridge':
      return (
        <svg viewBox="0 0 100 200" className={className} role="img" aria-label="Lodówka do zabudowy">
          {/* korpus do zabudowy — fronty meblowe montuje się na drzwiach */}
          <rect x="14" y="6" width="72" height="188" rx="3" fill="#f4f5f6" stroke="#cfd4d9" />
          <rect x="18" y="10" width="64" height="118" rx="2" fill="#ffffff" stroke="#dde1e5" />
          <rect x="18" y="132" width="64" height="58" rx="2" fill="#ffffff" stroke="#dde1e5" />
          <rect x="74" y="20" width="3" height="28" rx="1.5" fill={style === 'sliding' ? '#b9c0c7' : '#8f969e'} />
          <rect x="74" y="140" width="3" height="18" rx="1.5" fill="#8f969e" />
          <rect x="26" y="18" width="18" height="5" rx="1" fill="#1c1f24" />
          <circle cx="29" cy="20.5" r="1" fill="#4fc3f7" />
          <text x="50" y="112" textAnchor="middle" fontSize="7" fill="#9aa3ad" fontFamily="sans-serif">
            do zabudowy
          </text>
        </svg>
      )
  }
}
