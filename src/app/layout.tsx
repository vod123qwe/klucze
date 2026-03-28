import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Archivo } from 'next/font/google'
import './globals.css'

const heading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const body = Archivo({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Klucze — planer mieszkaniowy',
  description: 'Prywatny panel planowania zakupu mieszkania i kredytu hipotecznego',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
