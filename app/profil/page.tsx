'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Profil() {
  const [kullanici, setKullanici] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [duzenle, setDuzenle] = useState(false)
  const [form, setForm] = useState({
    ad_soyad: '',
    il: '',
    deneyim_yili: '',
    kovan_sayisi: '',
    ari_turleri: ''
  })
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const getKullanici = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/giris'
        return
      }
      setKullanici(user)
      const { data } = await supabase.from('aricilar').select('*').eq('email', user.email).single()
      if (data) {
        setProfil(data)
        setForm({
          ad_soyad: data.ad_soyad || '',
          il: data.il || '',
          deneyim_yili: data.deneyim_yili || '',
          kovan_sayisi: data.kovan_sayisi || '',
          ari_turleri: data.ari_turleri || ''
        })
      }
    }
    getKullanici()
  }, [])

  const handleKaydet = async () => {
    const { error } = await supabase.from('aricilar').update(form).eq('email', kullanici.email)
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Profil güncellendi!')
      setDuzenle(false)
      setProfil({...profil, ...form})
    }
  }

  const handleCikis = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!kullanici) return <p style={{ padding: '2rem' }}>Yükleniyor...</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#E8960A' }}>👤 Profilim</h1>
        <button onClick={handleCikis} style={{ background: 'transparent', border: '1px solid #666', color: '#888', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
          Çıkış Yap
        </button>
      </div>

      <p style={{ color: '#888', marginBottom: '2rem' }}>📧 {kullanici.email}</p>

      {!duzenle ? (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem' }}>
          {profil ? (
            <>
              <p>👤 {profil.ad_soyad}</p>
              <p>📍 {profil.il}</p>
              <p>🏠 {profil.kovan_sayisi} kovan</p>
              <p>🐝 {profil.ari_turleri}</p>
              <p>⏳ {profil.deneyim_yili} yıl deneyim</p>
            </>
          ) : (
            <p style={{ color: '#888' }}>Henüz arıcı profili oluşturulmamış.</p>
          )}
          <button onClick={() => setDuzenle(true)} style={{ marginTop: '1rem', background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Düzenle
          </button>
        </div>
      ) : (
        <div>
          {['ad_soyad', 'il', 'deneyim_yili', 'kovan_sayisi', 'ari_turleri'].map(alan => (
            <input key={alan} placeholder={alan} value={(form as any)[alan]} onChange={e => setForm({...form, [alan]: e.target.value})}
              style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
          ))}
          <button onClick={handleKaydet} style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Kaydet
          </button>
        </div>
      )}

      {mesaj && <p style={{ marginTop: '1rem', color: '#4CAF50' }}>{mesaj}</p>}
    </div>
  )
}
