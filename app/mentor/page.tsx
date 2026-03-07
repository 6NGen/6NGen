'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Mentor() {
  const [aricilar, setAricilar] = useState<any[]>([])
  const [kullanici, setKullanici] = useState<any>(null)
  const [istekler, setIstekler] = useState<any[]>([])
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setKullanici(user)

      const { data: ariciData } = await supabase
        .from('aricilar')
        .select('*')
        .gte('deneyim_yili', 3)
        .order('deneyim_yili', { ascending: false })
      if (ariciData) setAricilar(ariciData)

      if (user) {
        const { data: istekData } = await supabase
          .from('mentor_istekleri')
          .select('*')
          .or('gonderen_email.eq.' + user.email + ',alan_email.eq.' + user.email)
        if (istekData) setIstekler(istekData)
      }
    }
    getData()
  }, [])

  const istekleriYenile = async () => {
    if (!kullanici) return
    const { data } = await supabase
      .from('mentor_istekleri')
      .select('*')
      .or('gonderen_email.eq.' + kullanici.email + ',alan_email.eq.' + kullanici.email)
    if (data) setIstekler(data)
  }

  const mentorIsteGonder = async (hedefEmail: string) => {
    if (!kullanici) { window.location.href = '/giris'; return }
    if (kullanici.email === hedefEmail) { setMesaj('Kendinize istek gönderemezsiniz!'); return }

    const mevcutIstek = istekler.find(i => i.gonderen_email === kullanici.email && i.alan_email === hedefEmail)
    if (mevcutIstek) { setMesaj('Bu kişiye zaten istek göndermişsiniz!'); return }

    const { error: istekError } = await supabase.from('mentor_istekleri').insert([{
      gonderen_email: kullanici.email,
      alan_email: hedefEmail,
      durum: 'beklemede'
    }])

    if (istekError) {
      setMesaj('Hata: ' + istekError.message)
      return
    }

    const { error: bildirimError } = await supabase.from('bildirimler').insert([{
      alici_email: hedefEmail,
      mesaj: kullanici.email + ' size mentor istegi gonderdi',
      okundu: false,
      tip: 'mentor_istegi'
    }])

    if (bildirimError) {
      setMesaj('Istek gönderildi fakat bildirim hatasi: ' + bildirimError.message)
    } else {
      setMesaj('Mentor istegi gönderildi!')
    }

    await istekleriYenile()
  }

  const istegiKabul = async (id: number, gonderenEmail: string) => {
    await supabase.from('mentor_istekleri').update({ durum: 'kabul edildi' }).eq('id', id)
    await supabase.from('bildirimler').insert([{
      alici_email: gonderenEmail,
      mesaj: kullanici.email + ' mentor isteginizi kabul etti',
      okundu: false,
      tip: 'mentor_kabul'
    }])

    await istekleriYenile()
    setMesaj('Istek kabul edildi!')
  }

  const bekleyenIstekler = istekler.filter(i => i.alan_email === kullanici?.email && i.durum === 'beklemede')

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', marginBottom: '0.5rem' }}>Mentor Bul</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>3+ yil deneyimli aricılardan mentorluk al</p>

      {mesaj && <p style={{ color: '#4CAF50', marginBottom: '1rem' }}>{mesaj}</p>}

      {bekleyenIstekler.length > 0 && (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#E8960A', marginBottom: '1rem' }}>Gelen Mentor Istekleri</h3>
          {bekleyenIstekler.map((istek, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ color: '#ccc' }}>{istek.gonderen_email}</p>
              <button onClick={() => istegiKabul(istek.id, istek.gonderen_email)} style={{ background: '#4CAF50', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>
                Kabul Et
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {aricilar.map((arici, i) => {
          const gonderildi = istekler.find(istek => istek.gonderen_email === kullanici?.email && istek.alan_email === arici.email)
          const kabul = gonderildi?.durum === 'kabul edildi'

          return (
            <div key={i} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#E8960A', marginBottom: '0.25rem' }}>{arici.ad_soyad}</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{arici.il} | {arici.deneyim_yili} yil deneyim | {arici.ari_turleri}</p>
                {kabul && <p style={{ color: '#4CAF50', fontSize: '0.85rem', marginTop: '0.5rem' }}>Mentor baglantisi kuruldu</p>}
              </div>
              <button
                onClick={() => mentorIsteGonder(arici.email)}
                disabled={!!gonderildi}
                style={{ background: gonderildi ? '#333' : '#E8960A', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: gonderildi ? 'default' : 'pointer', fontWeight: 'bold', color: gonderildi ? '#888' : '#000', whiteSpace: 'nowrap' }}>
                {kabul ? 'Baglandi' : gonderildi ? 'Istek Gonderildi' : 'Mentor Iste'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
