// 6NGen — Dosya: app/kayit/page.tsx
// Görev: Yeni kullanıcı kayıt formu — Tailwind CSS v3, Supabase Auth

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface KayitForm {
  ad_soyad: string
  email: string
  sifre: string
  il: string
  deneyim_yili: string
  kovan_sayisi: string
  ari_turleri: string
}

const ALANLAR = [
  { key: 'ad_soyad',     placeholder: 'Ad Soyad *',                 type: 'text'     },
  { key: 'email',        placeholder: 'E-posta *',                  type: 'email'    },
  { key: 'sifre',        placeholder: 'Şifre * (en az 6 karakter)', type: 'password' },
  { key: 'il',           placeholder: 'İl (örn: Erzincan)',         type: 'text'     },
  { key: 'deneyim_yili', placeholder: 'Deneyim Yılı',               type: 'number'   },
  { key: 'kovan_sayisi', placeholder: 'Kovan Sayısı',               type: 'number'   },
  { key: 'ari_turleri',  placeholder: 'Arı Türleri (örn: Anadolu)', type: 'text'     },
]

export default function Kayit() {
  const [form, setForm] = useState<KayitForm>({
    ad_soyad: '', email: '', sifre: '', il: '',
    deneyim_yili: '', kovan_sayisi: '', ari_turleri: ''
  })
  const [mesaj, setMesaj] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  // Formdaki bir alanı güncelle
  const guncelle = (key: keyof KayitForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Kayıt işlemini gerçekleştir
  const handleSubmit = async () => {
    if (!form.email || !form.sifre || !form.ad_soyad) {
      setMesaj('Ad soyad, e-posta ve şifre zorunludur!')
      return
    }
    if (form.sifre.length < 6) {
      setMesaj('Şifre en az 6 karakter olmalıdır!')
      return
    }

    setYukleniyor(true)

    // 1. Supabase Auth'a kayıt et
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.sifre
    })

    if (authError) {
      setMesaj('Hata: ' + authError.message)
      setYukleniyor(false)
      return
    }

    // 2. Aricilar tablosuna user_id ile ekle
    const { error: dbError } = await supabase.from('aricilar').insert([{
      user_id: data.user?.id,
      ad_soyad: form.ad_soyad,
      email: form.email,
      il: form.il,
      deneyim_yili: parseInt(form.deneyim_yili) || 0,
      kovan_sayisi: parseInt(form.kovan_sayisi) || 0,
      ari_turleri: form.ari_turleri
    }])

    if (dbError) {
      setMesaj('Profil oluşturulamadı: ' + dbError.message)
    } else {
      setMesaj('✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...')
      setTimeout(() => { window.location.href = '/giris' }, 2000)
    }
    setYukleniyor(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-orange-500 text-center mb-2">🐝 6NGen</h1>
      <p className="text-gray-400 text-center mb-8">Türkiye'nin arıcılık platformuna katıl</p>

      <div className="space-y-4">
        {ALANLAR.map(alan => (
          <input
            key={alan.key}
            type={alan.type}
            placeholder={alan.placeholder}
            value={form[alan.key as keyof KayitForm]}
            onChange={e => guncelle(alan.key as keyof KayitForm, e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={yukleniyor}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-black font-bold py-3 rounded-lg transition-colors"
      >
        {yukleniyor ? 'Kaydediliyor...' : 'Kayıt Ol'}
      </button>

      {mesaj && (
        <p className={`mt-4 text-center text-sm ${mesaj.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {mesaj}
        </p>
      )}

      <p className="text-gray-500 text-center mt-6 text-sm">
        Zaten üye misin?{' '}
        <a href="/giris" className="text-orange-500 hover:underline">Giriş Yap</a>
      </p>
    </div>
  )
}