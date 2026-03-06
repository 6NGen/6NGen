'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Kovanlar() {
  const [kovanlar, setKovanlar] = useState<any[]>([])
  const [kullanici, setKullanici] = useState<any>(null)
  const [yeniKovan, setYeniKovan] = useState({ isim: '', tur: '', konum: '', notlar: '' })
  const [ekleMode, setEkleMode] = useState(false)
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const getKullanici = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/giris'
        return
      }
      setKullanici(user)
      const { data } = await supabase.from('kovanlar').select('*').eq('kullanici_email', user.email)
      if (data) setKovanlar(data)
    }
    getKullanici()
  }, [])

  const handleEkle = async () => {
    const { error } = await supabase.from('kovanlar').insert([{
      ...yeniKovan,
      kullanici_email: kullanici.email
    }])
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Kovan eklendi!')
      setEkleMode(false)
      setYeniKovan({ isim: '', tur: '', konum: '', notlar: '' })
      const { data } = await supabase.from('kovanlar').select('*').eq('kullanici_email', kullanici.email)
      if (data) setKovanlar(data)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#E8960A' }}>🏠 Kovan Günlüğüm</h1>
        <button onClick={() => setEkleMode(!ekleMode)} style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
          + Kovan Ekle
        </button>
      </div>

      {ekleMode && (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#E8960A', marginBottom: '1rem' }}>Yeni Kovan</h3>
          {[
            { key: 'isim', placeholder: 'Kovan ismi (örn: Kovan-1, Sarı Kovan)' },
            { key: 'tur', placeholder: 'Arı türü (örn: Anadolu, Kafkas)' },
            { key: 'konum', placeholder: 'Konum (örn: Bahçe, Yayla)' },
          ].map(alan => (
            <input key={alan.key} placeholder={alan.placeholder}
              value={(yeniKovan as any)[alan.key]}
              onChange={e => setYeniKovan({...yeniKovan, [alan.key]: e.target.value})}
              style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
          ))}
          <textarea placeholder="Notlar (gözlemler, bakım notları...)"
            value={yeniKovan.notlar}
            onChange={e => setYeniKovan({...yeniKovan, notlar: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', height: '80px' }} />
          <button onClick={handleEkle} style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Kaydet
          </button>
        </div>
      )}

      {mesaj && <p style={{ color: '#4CAF50', marginBottom: '1rem' }}>{mesaj}</p>}

      {kovanlar.length === 0 ? (
        <p style={{ color: '#888' }}>Henüz kovan eklenmemiş. İlk kovanını ekle!</p>
      ) : (
        kovanlar.map((kovan, i) => (
          <div key={i} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ color: '#E8960A', marginBottom: '0.5rem' }}>🏠 {kovan.isim}</h2>
            <p>🐝 {kovan.tur}</p>
            <p>📍 {kovan.konum}</p>
            {kovan.notlar && <p style={{ color: '#ccc', marginTop: '0.5rem', fontStyle: 'italic' }}>📝 {kovan.notlar}</p>}
          </div>
        ))
      )}
    </div>
  )
}
