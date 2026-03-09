// 6NGen — Dosya: app/giris/page.tsx
// Görev: Kullanıcı giriş sayfası — Tailwind CSS v3, Supabase Auth

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Giris() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  // Giriş işlemini gerçekleştir
  const handleGiris = async () => {
    if (!email || !sifre) { setMesaj('Email ve şifre zorunludur!'); return }
    setYukleniyor(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Giriş başarılı!')
      window.location.href = '/'
    }
    setYukleniyor(false)
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-orange-500 text-center mb-2">🍯 6NGen</h1>
      <p className="text-gray-400 text-center mb-8">Hesabına giriş yap</p>

      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={sifre}
        onChange={e => setSifre(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleGiris()}
        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <button
        onClick={handleGiris}
        disabled={yukleniyor}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-black font-bold py-3 rounded-lg transition-colors"
      >
        {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>

      {mesaj && (
        <p className={`mt-4 text-center text-sm ${mesaj.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {mesaj}
        </p>
      )}

      <p className="text-gray-500 text-center mt-6 text-sm">
        Hesabın yok mu?{' '}
        <a href="/kayit" className="text-orange-500 hover:underline">Kayıt Ol</a>
      </p>
    </div>
  )
}