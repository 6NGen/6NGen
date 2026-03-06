'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Giris() {
  const [mod, setMod] = useState<'giris' | 'kayit'>('giris')
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [mesaj, setMesaj] = useState('')

  const handleGiris = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Giriş başarılı!')
      window.location.href = '/'
    }
  }

  const handleKayit = async () => {
    const { error } = await supabase.auth.signUp({ email, password: sifre })
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Hesap oluşturuldu! Giriş yapabilirsiniz.')
      setMod('giris')
    }
  }

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', textAlign: 'center', marginBottom: '0.5rem' }}>🍯 6NGen</h1>
      <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>
        {mod === 'giris' ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}
      </p>

      <div style={{ display: 'flex', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
        <button onClick={() => setMod('giris')} style={{ flex: 1, padding: '0.75rem', background: mod === 'giris' ? '#E8960A' : 'transparent', color: mod === 'giris' ? '#000' : '#888', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Giriş Yap
        </button>
        <button onClick={() => setMod('kayit')} style={{ flex: 1, padding: '0.75rem', background: mod === 'kayit' ? '#E8960A' : 'transparent', color: mod === 'kayit' ? '#000' : '#888', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Kayıt Ol
        </button>
      </div>

      <input
        type="email"
        placeholder="E-posta"
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', fontSize: '1rem' }}
      />
      <input
        type="password"
        placeholder="Şifre"
        onChange={e => setSifre(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1.5rem', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px', fontSize: '1rem' }}
      />

      <button
        onClick={mod === 'giris' ? handleGiris : handleKayit}
        style={{ width: '100%', padding: '0.75rem', background: '#E8960A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
      >
        {mod === 'giris' ? 'Giriş Yap' : 'Hesap Oluştur'}
      </button>

      {mesaj && <p style={{ marginTop: '1rem', color: '#4CAF50', textAlign: 'center' }}>{mesaj}</p>}
    </div>
  )
}
