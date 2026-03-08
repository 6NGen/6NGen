'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Kovan } from '@/types'

interface KovanForm {
  isim: string
  tur: string
  konum: string
  notlar: string
}

export default function Kovanlar() {
  const [kovanlar, setKovanlar] = useState<Kovan[]>([])
  const [ekleMode, setEkleMode] = useState(false)
  const [form, setForm] = useState<KovanForm>({ isim: '', tur: '', konum: '', notlar: '' })
  const [mesaj, setMesaj] = useState('')

  // Kullanıcının kovanlarını yükle
  useEffect(() => {
    const yukle = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/giris'; return }

      const { data } = await supabase
        .from('kovanlar')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setKovanlar(data)
    }
    yukle()
  }, [])

  // Yeni kovan ekle
  const handleEkle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('kovanlar').insert([{
      user_id: user.id,
      isim: form.isim,
      tur: form.tur,
      konum: form.konum,
      notlar: form.notlar
    }])

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Kovan eklendi!')
      setEkleMode(false)
      setForm({ isim: '', tur: '', konum: '', notlar: '' })
      const { data } = await supabase.from('kovanlar').select('*').order('created_at', { ascending: false })
      if (data) setKovanlar(data)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '2rem' }}>
        <h1 style={{ color: '#E8960A' }}>🏠 Kovan Günlüğüm</h1>
        <button onClick={() => setEkleMode(!ekleMode)} style={{
          background: '#E8960A', border: 'none', borderRadius: '8px',
          paddingBlock: '0.5rem', paddingInline: '1.5rem',
          cursor: 'pointer', fontWeight: 'bold'
        }}>
          + Kovan Ekle
        </button>
      </div>

      {ekleMode && (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem', marginBlockEnd: '2rem' }}>
          <h3 style={{ color: '#E8960A', marginBlockEnd: '1rem' }}>Yeni Kovan</h3>
          {[
            { key: 'isim', placeholder: 'Kovan ismi (örn: Kovan-1)' },
            { key: 'tur', placeholder: 'Arı türü (örn: Anadolu)' },
            { key: 'konum', placeholder: 'Konum (örn: Bahçe)' },
          ].map(alan => (
            <input key={alan.key} placeholder={alan.placeholder}
              value={form[alan.key as keyof KovanForm]}
              onChange={e => setForm({ ...form, [alan.key]: e.target.value })}
              style={{ display: 'block', width: '100%', paddingBlock: '0.75rem', paddingInline: '1rem', marginBlockEnd: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', boxSizing: 'border-box' }} />
          ))}
          <textarea placeholder="Notlar..."
            value={form.notlar}
            onChange={e => setForm({ ...form, notlar: e.target.value })}
            style={{ display: 'block', width: '100%', paddingBlock: '0.75rem', paddingInline: '1rem', marginBlockEnd: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', height: '80px', boxSizing: 'border-box' }} />
          <button onClick={handleEkle} style={{
            background: '#E8960A', border: 'none', borderRadius: '8px',
            paddingBlock: '0.75rem', paddingInline: '2rem',
            cursor: 'pointer', fontWeight: 'bold'
          }}>
            Kaydet
          </button>
        </div>
      )}

      {mesaj && <p style={{ color: '#4CAF50', marginBlockEnd: '1rem' }}>{mesaj}</p>}

      {kovanlar.length === 0 ? (
        <p style={{ color: '#888' }}>Henüz kovan eklenmemiş. İlk kovanını ekle!</p>
      ) : (
        kovanlar.map(kovan => (
          <div key={kovan.id} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', paddingBlock: '1.25rem', paddingInline: '1.5rem', marginBlockEnd: '1rem' }}>
            <a href={'/kovanlar/' + kovan.id} style={{ color: '#E8960A', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold', display: 'block', marginBlockEnd: '0.5rem' }}>
              🏠 {kovan.isim}
            </a>
            <p>🐝 {kovan.tur}</p>
            <p>📍 {kovan.konum}</p>
            {kovan.notlar && <p style={{ color: '#ccc', marginBlockStart: '0.5rem', fontStyle: 'italic' }}>📝 {kovan.notlar}</p>}
          </div>
        ))
      )}
    </div>
  )
}
