'use client'

import { useState, useEffect, useCallback } from 'react'

const PASS_HASH = '7faeb5eb61aca167d840dd840c16dd7cf12e784463c7d08969413737a73319d8'
const SESSION_KEY = 'klucze_auth'

async function hashInput(value: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(value))
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true)
    }
    setReady(true)
  }, [])

  const submit = useCallback(async () => {
    const hash = await hashInput(value)
    if (hash === PASS_HASH) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setShaking(true)
      setValue('')
      setTimeout(() => setShaking(false), 500)
    }
  }, [value])

  if (!ready) return null

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Klucze</h1>
          <p className="text-sm text-muted-foreground">Wpisz hasło, aby kontynuować</p>
        </div>

        <div
          className={`flex flex-col gap-3 w-72 transition-transform ${shaking ? 'animate-shake' : ''}`}
          style={shaking ? { animation: 'shake 0.4s ease' } : {}}
        >
          <input
            type="password"
            value={value}
            autoFocus
            placeholder="Hasło"
            className={`w-full h-10 rounded-lg border bg-background px-3 text-sm outline-none transition-colors
              focus:border-primary focus:ring-2 focus:ring-primary/20
              ${error ? 'border-destructive' : 'border-input'}`}
            onChange={e => { setValue(e.target.value); setError(false) }}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
          />
          {error && (
            <p className="text-xs text-destructive text-center -mt-1">Nieprawidłowe hasło</p>
          )}
          <button
            onClick={submit}
            className="h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Odblokuj
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
