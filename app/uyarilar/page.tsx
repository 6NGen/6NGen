'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Uyari } from '@/types'

interface UyariForm {
  baslik: string
  aciklama: string
  il: string
  tur: string
}

export default function Uyarilar() {
  const [uyarilar, setUyarilar] = useState<Uyari[]>([])
  const [kullanici, setKullanici] = useState<{ id: string; email: string } | null>(null)
  const [ekleMode, setEkleMode] = useState(false)
  const [form, setForm] = useState<UyariForm>({ baslik: '', aciklama: '', il: '', tur: 'Varroa' })
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const baslat = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setKullanici({ id: user.id, email: user.email ?? '' })

      // Tüm uyarıları getir
      const { data } = await supabase
        .from('uyarilar')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setUyarilar(data)
    }
    baslat()
  }, [])

  // Yeni uyarı ekle
  const handleEkle = async () => {
    if (!kullanici) { window.location.href = '/giris'; return }

    const { error } = await supabase.from('uyarilar').insert([{
      user_id: kullanici.id,
      kullanici_email: kullanici.email,
      baslik: form.baslik,
      aciklama: form.aciklama,
      il: form.il,
      tur: form.tur
    }])

    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Uyarı yayınlandı!')
      setEkleMode(false)
      setForm({ baslik: '', aciklama: '', il: '', tur: 'Varroa' })
      const { data } = await supabase.from('uyarilar').select('*').order('created_at', { ascending: false })
      if (data) setUyarilar(data)
    }
  }

  const TUR_RENK: Record<string, string> = {
    'Varroa': '#e74c3c',
    'Nosema': '#e67e22',
    'Amerika Yavru Curuklugu': '#c0392b',
    'Hirsiz Ari': '#f39c12',
    'Diger': '#95a5a6'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '2rem' }}>
        <div>
          <h1 style={{ color: '#e74c3c', marginBlockEnd: '0.25rem' }}>⚠️ Bölge Uyarıları</h1>
          <p style={{ color: '#888' }}>Arıcılardan gelen hastalık ve tehlike bildirimleri</p>
        </div>
        <button onClick={() => setEkleMode(!ekleMode)} style={{
          background: '#e74c3c', border: 'none', borderRadius: '8px',
          paddingBlock: '0.5rem', paddingInline: '1.5rem',
          cursor: 'pointer', fontWeight: 'bold', color: 'white'
        }}>
          + Uyarı Bildir
        </button>
      </div>

      {ekleMode && (
        <div style={{ background: '#1a1a1a', border: '1px solid #e74c3c', borderRadius: '12px', padding: '1.5rem', marginBlockEnd: '2rem' }}>
          <h3 style={{ color: '#e74c3c', marginBlockEnd: '1rem' }}>Yeni Uyarı</h3>
          <select onChange={e => setForm({ ...form, tur: e.target.value })}
            style={{ display: 'block', width: '100%', paddingBlock: '0.75rem', paddingInline: '1rem', marginBlockEnd: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <option>Varroa</option>
            <option>Nosema</option>
            <option>Amerika Yavru Curuklugu</option>
            <option>Hirsiz Ari</option>
            <option>Diger</option>
          </select>
          {(['baslik', 'il'] as (keyof UyariForm)[]).map(key => (
            <input key={key} placeholder={key === 'baslik' ? 'Başlık' : 'İl'}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              style={{ display: 'block', width: '100%', paddingBlock: '0.75rem', paddingInline: '1rem', marginBlockEnd: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', boxSizing: 'border-box' }} />
          ))}
          <textarea placeholder="Açıklama..." value={form.aciklama}
            onChange={e => setForm({ ...form, aciklama: e.target.value })}
            style={{ display: 'block', width: '100%', paddingBlock: '0.75rem', paddingInline: '1rem', marginBlockEnd: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', height: '80px', boxSizing: 'border-box' }} />
          <button onClick={handleEkle} style={{
            background: '#e74c3c', border: 'none', borderRadius: '8px',
            paddingBlock: '0.75rem', paddingInline: '2rem',
            cursor: 'pointer', fontWeight: 'bold', color: 'white'
          }}>
            Yayınla
          </button>
        </div>
      )}

      {mesaj && <p style={{ color: '#4CAF50', marginBlockEnd: '1rem' }}>{mesaj}</p>}

      {uyarilar.length === 0 ? (
        <p style={{ color: '#888' }}>Henüz bölge uyarısı yok.</p>
      ) : (
        uyarilar.map(u => (
          <div key={u.id} style={{ background: '#1a1a1a', border: '1px solid ' + (TUR_RENK[u.tur] || '#666'), borderRadius: '12px', paddingBlock: '1.25rem', paddingInline: '1.5rem', marginBlockEnd: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '0.5rem' }}>
              <h3 style={{ color: TUR_RENK[u.tur] || '#fff' }}>⚠️ {u.baslik}</h3>
              <span style={{ background: TUR_RENK[u.tur] || '#666', color: 'white', paddingBlock: '0.2rem', paddingInline: '0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{u.tur}</span>
            </div>
            <p style={{ color: '#ccc', marginBlockEnd: '0.5rem' }}>{u.aciklama}</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>📍 {u.il}</p>
          </div>
        ))
      )}
    </div>
  )
}