'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

// Kayıt formu için tip tanımı
interface KayitForm {
  ad_soyad: string
  email: string
  sifre: string
  il: string
  deneyim_yili: string
  kovan_sayisi: string
  ari_turleri: string
}

export default function Kayit() {
  const [form, setForm] = useState<KayitForm>({
    ad_soyad: '',
    email: '',
    sifre: '',
    il: '',
    deneyim_yili: '',
    kovan_sayisi: '',
    ari_turleri: ''
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
      setMesaj('Ad soyad, email ve şifre zorunludur!')
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

  const alanlar = [
    { key: 'ad_soyad',      placeholder: 'Ad Soyad *',                    type: 'text'     },
    { key: 'email',         placeholder: 'Email *',                        type: 'email'    },
    { key: 'sifre',         placeholder: 'Şifre * (en az 6 karakter)',     type: 'password' },
    { key: 'il',            placeholder: 'İl (örn: Erzincan)',             type: 'text'     },
    { key: 'deneyim_yili',  placeholder: 'Deneyim Yılı',                   type: 'number'   },
    { key: 'kovan_sayisi',  placeholder: 'Kovan Sayısı',                   type: 'number'   },
    { key: 'ari_turleri',   placeholder: 'Arı Türleri (örn: Anadolu)',     type: 'text'     },
  ]

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', marginBlockEnd: '0.5rem' }}>🐝 6NGen — Kayıt Ol</h1>
      <p style={{ color: '#888', marginBlockEnd: '2rem' }}>Türkiye'nin arıcılık platformuna katıl</p>

      {alanlar.map(alan => (
        <input
          key={alan.key}
          type={alan.type}
          placeholder={alan.placeholder}
          onChange={e => guncelle(alan.key as keyof KayitForm, e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            paddingBlock: '0.75rem',
            paddingInline: '1rem',
            marginBlockEnd: '1rem',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: 'white',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      ))}

      <button
        onClick={handleSubmit}
        disabled={yukleniyor}
        style={{
          width: '100%',
          paddingBlock: '0.75rem',
          background: '#E8960A',
          border: 'none',
          borderRadius: '8px',
          cursor: yukleniyor ? 'default' : 'pointer',
          fontWeight: 'bold',
          fontSize: '1rem',
          opacity: yukleniyor ? 0.7 : 1
        }}
      >
        {yukleniyor ? 'Kaydediliyor...' : 'Kayıt Ol'}
      </button>

      {mesaj && (
        <p style={{
          marginBlockStart: '1rem',
          color: mesaj.includes('✅') ? '#4CAF50' : '#e74c3c'
        }}>
          {mesaj}
        </p>
      )}

      <p style={{ color: '#888', marginBlockStart: '1.5rem', textAlign: 'center' }}>
        Zaten üye misin?{' '}
        <a href="/giris" style={{ color: '#E8960A' }}>Giriş Yap</a>
      </p>
    </div>
  )
}