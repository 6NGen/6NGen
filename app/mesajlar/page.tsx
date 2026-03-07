'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Mesajlar() {
  const [kullanici, setKullanici] = useState<any>(null)
  const [konusmalar, setKonusmalar] = useState<any[]>([])
  const [aktifKisi, setAktifKisi] = useState<string | null>(null)
  const [mesajlar, setMesajlar] = useState<any[]>([])
  const [yeniMesaj, setYeniMesaj] = useState('')
  const [yeniKisiEmail, setYeniKisiEmail] = useState('')
  const [yeniKisiMode, setYeniKisiMode] = useState(false)
  const [mesajGonderildi, setMesajGonderildi] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/giris'; return }
      setKullanici(user)
      await konusmalariYukle(user.email ?? '')
    }
    getData()
  }, [])

  const konusmalariYukle = async (email: string) => {
    const { data } = await supabase
      .from('mesajlar')
      .select('*')
      .or('gonderen_email.eq.' + email + ',alici_email.eq.' + email)
      .order('created_at', { ascending: false })

    if (data) {
      const kisiler: string[] = []
      data.forEach(m => {
        const diger = m.gonderen_email === email ? m.alici_email : m.gonderen_email
        if (!kisiler.includes(diger)) kisiler.push(diger)
      })
      setKonusmalar(kisiler)
    }
  }

  const konusmayiAc = async (kisiEmail: string) => {
    setAktifKisi(kisiEmail)
    const { data } = await supabase
      .from('mesajlar')
      .select('*')
      .or(
        'and(gonderen_email.eq.' + kullanici.email + ',alici_email.eq.' + kisiEmail + '),' +
        'and(gonderen_email.eq.' + kisiEmail + ',alici_email.eq.' + kullanici.email + ')'
      )
      .order('created_at', { ascending: true })
    if (data) setMesajlar(data)

    await supabase
      .from('mesajlar')
      .update({ okundu: true })
      .eq('alici_email', kullanici.email)
      .eq('gonderen_email', kisiEmail)
  }

  const mesajGonder = async () => {
    if (!yeniMesaj.trim()) return
    const hedef = aktifKisi || yeniKisiEmail

    const { error } = await supabase.from('mesajlar').insert([{
      gonderen_email: kullanici.email,
      alici_email: hedef,
      icerik: yeniMesaj,
      okundu: false
    }])

    if (error) {
      setMesajGonderildi('Hata: ' + error.message)
    } else {
      setYeniMesaj('')
      setYeniKisiMode(false)
      setYeniKisiEmail('')
      if (!aktifKisi) setAktifKisi(hedef)
      await konusmayiAc(hedef)
      await konusmalariYukle(kullanici.email)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#E8960A' }}>💬 Mesajlar</h1>
        <button onClick={() => { setYeniKisiMode(true); setAktifKisi(null) }}
          style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
          + Yeni Mesaj
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem', minHeight: '500px' }}>
        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '1rem', border: '1px solid #333' }}>
          <h3 style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>KONUŞMALAR</h3>
          {konusmalar.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Henüz konuşma yok</p>
          ) : (
            konusmalar.map((kisi, i) => (
              <div key={i} onClick={() => konusmayiAc(kisi)}
                style={{ padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', background: aktifKisi === kisi ? '#2a1500' : 'transparent', border: aktifKisi === kisi ? '1px solid #E8960A' : '1px solid transparent', marginBottom: '0.5rem' }}>
                <p style={{ color: aktifKisi === kisi ? '#E8960A' : '#ccc', fontSize: '0.9rem' }}>👤 {kisi.split('@')[0]}</p>
                <p style={{ color: '#666', fontSize: '0.75rem' }}>{kisi}</p>
              </div>
            ))
          )}
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
          {yeniKisiMode ? (
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#E8960A', marginBottom: '1rem' }}>Yeni Mesaj</h3>
              <input placeholder="Alıcı email adresi" value={yeniKisiEmail} onChange={e => setYeniKisiEmail(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
              <textarea placeholder="Mesajınız..." value={yeniMesaj} onChange={e => setYeniMesaj(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', height: '120px' }} />
              <button onClick={mesajGonder}
                style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold' }}>
                Gönder
              </button>
              {mesajGonderildi && <p style={{ color: '#4CAF50', marginTop: '0.5rem' }}>{mesajGonderildi}</p>}
            </div>
          ) : aktifKisi ? (
            <>
              <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
                <p style={{ color: '#E8960A', fontWeight: 'bold' }}>👤 {aktifKisi}</p>
              </div>
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', maxHeight: '350px' }}>
                {mesajlar.map((m, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: m.gonderen_email === kullanici?.email ? 'flex-end' : 'flex-start' }}>
                    <div style={{ background: m.gonderen_email === kullanici?.email ? '#E8960A' : '#333', color: m.gonderen_email === kullanici?.email ? '#000' : '#fff', padding: '0.6rem 1rem', borderRadius: '12px', maxWidth: '70%' }}>
                      <p style={{ fontSize: '0.95rem' }}>{m.icerik}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '1rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem' }}>
                <input placeholder="Mesaj yaz..." value={yeniMesaj} onChange={e => setYeniMesaj(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && mesajGonder()}
                  style={{ flex: 1, padding: '0.75rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
                <button onClick={mesajGonder}
                  style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.75rem 1.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  Gönder
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: '#666' }}>Bir konuşma seç veya yeni mesaj gönder</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

