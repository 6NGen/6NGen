import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '6NGen — Arıcılık Platformu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, background: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
        <nav style={{
          background: '#1a0a00',
          borderBottom: '2px solid #E8960A',
          padding: '1rem 2rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <span style={{ color: '#E8960A', fontWeight: 'bold', fontSize: '1.2rem' }}>🍯 6NGen</span>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Ana Sayfa</a>
          <a href="/aricilar" style={{ color: 'white', textDecoration: 'none' }}>Arıcılar</a>
          <a href="/pazar" style={{ color: 'white', textDecoration: 'none' }}>Pazar</a>
          <a href="/takvim" style={{ color: 'white', textDecoration: 'none' }}>Takvim</a>
          <a href="/uyarilar" style={{ color: '#e74c3c', textDecoration: 'none' }}>⚠️ Uyarılar</a>
          <a href="/kayit" style={{ color: 'white', textDecoration: 'none' }}>Kayıt Ol</a>
          <a href="/giris" style={{ color: 'white', textDecoration: 'none' }}>Giriş Yap</a>
          <a href="/kovanlar" style={{ color: 'white', textDecoration: 'none' }}>Kovanlar</a>
          <a href="/profil" style={{ color: 'white', textDecoration: 'none' }}>Profilim</a>
        </nav>
        {children}
      </body>
    </html>
  )
}



