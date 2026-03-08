'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Arici } from '@/types'

interface ProfilForm {
  ad_soyad: string
  il: string
  deneyim_yili: string
  kovan_sayisi: string
  ari_turleri: string
}

export default function Profil() {
  const [profil, setProfil] = useState<Arici | null>(null)
  const [email, setEmail] = useState('')
  const [duzenleMode, setDuzenleMode] = useState(false)
  const [form, setForm] = useState<ProfilForm>({
    ad_soyad: '', il: '', deneyim_yili: '', kovan_sayisi: '', ari_turleri: ''
  })
  const [mesaj, setMesaj] = useState('')

  // Kullanıcı profilini yükle
  useEffect(() => {
    const yukle = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/giris'; return }
      setEmail(user.email ?? '')

      const { data } = await supabase
        .from('aricilar')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfil(data)
        setForm({
          ad_soyad: data.ad_soyad,
          il: data.il ?? '',
          deneyim_yili: String(data.deneyim_yili),
          kovan_sayisi: String(data.kovan_sayisi),
          ari_turleri: data.ari_turleri ?? ''
        })
      }
    }
    yukle()
  }, [])

  // Profili güncelle
  const handleGuncelle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('aricilar')
      .update({
        ad_soyad: form.ad_soyad,
        il: form.il,
        deneyim_yili: parseInt(form.deneyim_yili) || 0,
        kovan_sayisi: parseInt(form.kovan_sayisi) || 0,
        ari_turleri: form.ari_turleri
      })
      .eq('user_id', user.id)

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Profil güncellendi!')
      setDuzenleMode(false)
      const { data } = await supabase.from('aricilar').select('*').eq('user_id', user.id).single()
      if (data) setProfil(data)
    }
  }

  const cikisYap = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '2rem' }}>
        <h1 style={{ color: '#E8960A' }}>👤 Profilim</h1>
        <button onClick={cikisYap} style={{
          background: 'transparent', border: '1px solid #E8960A',
          color: '#E8960A', borderRadius: '8px',
          paddingBlock: '0.4rem', paddingInline: '1rem', cursor: 'pointer'
        }}>
          Çıkış Yap
        </button>
      </div>

      <p style={{ color: '#888', marginBlockEnd: '1.5rem' }}>✉️ {email}</p>

      {profil ? (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem' }}>
          {duzenleMode ? (
            <>
              {[
                { key: 'ad_soyad', placeholder: 'Ad Soyad', type: 'text' },
                { key: 'il', placeholder: 'İl', type: 'text' },
                { key: 'deneyim_yili', placeholder: 'Deneyim Yılı', type: 'number' },
                { key: 'kovan_sayisi', placeholder: 'Kovan Sayısı', type: 'number' },
                { key: 'ari_turleri', placeholder: 'Arı Türleri', type: 'text' },
              ].map(alan => (
                <input key={alan.key} type={alan.type} placeholder={alan.placeholder}
                  value={form[alan.key as keyof ProfilForm]}
                  onChange={e => setForm({ ...form, [alan.key]: e.target.value })}
                  style={{ display: 'block', width: '100%', paddingBlock: '0.75rem', paddingInline: '1rem', marginBlockEnd: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', boxSizing: 'border-box' }} />
              ))}
              <button onClick={handleGuncelle} style={{
                background: '#E8960A', border: 'none', borderRadius: '8px',
                paddingBlock: '0.75rem', paddingInline: '2rem', cursor: 'pointer', fontWeight: 'bold'
              }}>
                Kaydet
              </button>
            </>
          ) : (
            <>
              <p>👤 <strong>{profil.ad_soyad}</strong></p>
              <p>📍 {profil.il}</p>
              <p>🏠 {profil.kovan_sayisi} kovan</p>
              <p>🐝 {profil.ari_turleri}</p>
              <p>⏳ {profil.deneyim_yili} yıl deneyim</p>
              <button onClick={() => setDuzenleMode(true)} style={{
                background: '#E8960A', border: 'none', borderRadius: '8px',
                paddingBlock: '0.5rem', paddingInline: '1.5rem',
                cursor: 'pointer', fontWeight: 'bold', marginBlockStart: '1rem'
              }}>
                Düzenle
              </button>
            </>
          )}
        </div>
      ) : (
        <p style={{ color: '#888' }}>Profil bulunamadı.</p>
      )}

      {mesaj && <p style={{ color: '#4CAF50', marginBlockStart: '1rem' }}>{mesaj}</p>}
    </div>
  )
}