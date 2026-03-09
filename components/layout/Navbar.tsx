// 6NGen — Ana navigasyon bileşeni
// RTL uyumlu, strict TypeScript, Next.js Link optimizasyonu

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const LINKLER = [
  { href: '/',            label: 'Ana Sayfa'    },
  { href: '/aricilar',    label: 'Arıcılar'     },
  { href: '/pazar',       label: 'Pazar'        },
  { href: '/takvim',      label: 'Takvim'       },
  { href: '/uyarilar',    label: '⚠️Uyarılar'  },
  { href: '/mentor',      label: 'Mentor'       },
  { href: '/kovanlar',    label: 'Kovanlar'     },
  { href: '/mesajlar',    label: '💬Mesajlar'  },
]

export default function Navbar() {
  const [girisYapildi, setGirisYapildi] = useState(false)
  const [okunmamisSayi, setOkunmamisSayi] = useState(0)

  useEffect(() => {
    // Kullanıcı oturumunu ve okunmamış bildirimleri kontrol et
    const baslat = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setGirisYapildi(!!user)

      if (user) {
        const { count } = await supabase
          .from('bildirimler')
          .select('*', { count: 'exact', head: true })
          .eq('alici_email', user.email)
          .eq('okundu', false)
        setOkunmamisSayi(count ?? 0)

        // Realtime — yeni bildirim gelince otomatik güncelle
        supabase
          .channel('bildirimler')
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'bildirimler',
            filter: 'alici_email=eq.' + user.email
          }, () => {
            setOkunmamisSayi(prev => prev + 1)
          })
          .subscribe()
      }
    }
    baslat()
  }, [])

  const cikisYap = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav style={{
      background: '#111',
      borderBlockEnd: '2px solid #E8960A',
      paddingBlock: '1rem',
      paddingInline: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
    }}>
        {/* Logo */}
        <Link href="/" style={{ color: '#E8960A', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
       🍯 6NGen
        </Link>
      {LINKLER.map(link => (
        <Link key={link.href} href={link.href} style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '0.95rem',
        }}>
          {link.label}
        </Link>
      ))}

      {/* Bildirim zili — okunmamış sayısı rozet olarak göster */}
      <Link href="/bildirimler" style={{ position: 'relative', color: 'white', textDecoration: 'none' }}>
        🔔
        {okunmamisSayi > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            insetInlineEnd: '-10px',
            background: '#e74c3c',
            color: 'white',
            borderRadius: '50%',
            fontSize: '0.65rem',
            paddingBlock: '0.1rem',
            paddingInline: '0.35rem',
            fontWeight: 'bold',
          }}>
            {okunmamisSayi}
          </span>
        )}
      </Link>

      {girisYapildi ? (
        <>
          <Link href="/profil" style={{ color: 'white', textDecoration: 'none' }}>Profilim</Link>
          <button onClick={cikisYap} style={{
            background: 'transparent',
            border: '1px solid #E8960A',
            color: '#E8960A',
            borderRadius: '8px',
            paddingBlock: '0.3rem',
            paddingInline: '1rem',
            cursor: 'pointer',
          }}>
            Çıkış
          </button>
        </>
      ) : (
        <>
          <Link href="/kayit" style={{ color: 'white', textDecoration: 'none' }}>Kayıt Ol</Link>
          <Link href="/giris" style={{ color: 'white', textDecoration: 'none' }}>Giriş Yap</Link>
        </>
      )}
    </nav>
  )
}