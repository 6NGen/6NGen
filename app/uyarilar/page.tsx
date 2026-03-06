'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Uyarilar() {
  const [uyarilar, setUyarilar] = useState<any[]>([])
  const [kullanici, setKullanici] = useState<any>(null)
  const [ekleMode, setEkleMode] = useState(false)
  const [form, setForm] = useState({ baslik: '', aciklama: '', il: '', tur: 'Varroa' })
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setKullanici(user)
      const { data } = await supabase.from('uyarilar').select('*').order('created_at', { ascending: false })
      if (data) setUyarilar(data)
    }
    getData()
  }, [])

  const handleEkle = async () => {
    if (!kullanici) { window.location.href = '/giris'; return }
    const { error } = await supabase.from('uyarilar').insert([{
      ...form,
      kullanici_email: kullanici.email
    }])
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('Uyarı yayınlandı!')
      setEkleMode(false)
      setForm({ baslik: '', aciklama: '', il: '', tur: 'Varroa' })
      const { data } = await supabase.from('uyarilar').select('*').order('created_at', { ascending: false })
      if (data) setUyarilar(data)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#e74c3c', marginBottom: '0.25rem' }}>Bölge Uyarıları</h1>
          <p style={{ color: '#888' }}>Arıcılardan gelen hastalık ve tehlike bildirimleri</p>
        </div>
        <button onClick={() => setEkleMode(!ekleMode)} style={{ background: '#e74c3c', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
          + Uyarı Bildir
        </button>
      </div>

      {ekleMode && (
        <div style={{ background: '#1a1a1a', border: '1px solid #e74c3c', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Yeni Uyarı</h3>
          <select onChange={e => setForm({...form, tur: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <option>Varroa</option>
            <option>Nosema</option>
            <option>Amerika Yavru Curuklugu</option>
            <option>Hirsiz Ari</option>
            <option>Diger</option>
          </select>
          <input placeholder="Baslik" value={form.baslik} onChange={e => setForm({...form, baslik: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
          <input placeholder="Il" value={form.il} onChange={e => setForm({...form, il: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
          <textarea placeholder="Aciklama" value={form.aciklama} onChange={e => setForm({...form, aciklama: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', height: '80px' }} />
          <button onClick={handleEkle} style={{ background: '#e74c3c', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
            Yayinla
          </button>
        </div>
      )}

      {mesaj && <p style={{ color: '#4CAF50', marginBottom: '1rem' }}>{mesaj}</p>}

      {uyarilar.length === 0 ? (
        <p style={{ color: '#888' }}>Henuz bolge uyarisi yok.</p>
      ) : (
        uyarilar.map((u, i) => (
          <div key={i} style={{ background: '#1a1a1a', border: '1px solid #e74c3c', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ color: '#e74c3c' }}>{u.baslik}</h3>
              <span style={{ background: '#e74c3c', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>{u.tur}</span>
            </div>
            <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>{u.aciklama}</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Konum: {u.il}</p>
          </div>
        ))
      )}
    </div>
  )
}


