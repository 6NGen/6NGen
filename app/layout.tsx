// 6NGen — Ana layout dosyası
// Navbar buradan tüm sayfalara otomatik eklenir

import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: '6NGen — Arıcılık Platformu',
  description: "Türkiye'nin arıcılık platformu",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body style={{
        margin: 0,
        background: '#0a0a0a',
        color: 'white',
        fontFamily: 'sans-serif',
      }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}