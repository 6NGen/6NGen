'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Arici, MentorIstegi } from '@/types'

export default function Mentor() {
  const [aricilar, setAricilar] = useState<Arici[]>([])
  const [kullanici, setKullanici] = useState<{ id: string; email: string } | null>(null)
  const [istekler, setIstekler] = useState<MentorIstegi[]>([])
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const baslat = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/giris'; return }
      setKullanici({ id: user.id, email: user.email ?? '' })

      // 3+ yıl deneyimli arıcıları getir
      const { data: ariciData } = await supabase
        .from('aricilar')
        .select('*')
        .gte('deneyim_yili', 3)
        .order('deneyim_yili', { ascending: false })
      if (ariciData) setAricilar(ariciData)

      // Kullanıcının mentor isteklerini getir
      const { data: istekData } = await supabase
        .from('mentor_istekleri')
        .select('*')
        .or('gonderen_id.eq.' + user.id + ',alan_id.eq.' + user.id)
      if (istekData) setIstekler(istekData)
    }
    baslat()
  }, [])

  // İstekleri yenile
  const istekleriYenile = async () => {
    if (!kullanici) return
    const { data } = await supabase
      .from('mentor_istekleri')
      .select('*')
      .or('gonderen_id.eq.' + kullanici.id + ',alan_id.eq.' + kullanici.id)
    if (data) setIstekler(data)
  }

  // Mentor isteği gönder
  const mentorIsteGonder = async (hedefArici: Arici) => {
    if (!kullanici) return
    if (kullanici.id === hedefArici.user_id) {
      setMesaj('Kendinize istek gönderemezsiniz!')
      return
    }

    const mevcutIstek = istekler.find(i =>
      i.gonderen_id === kullanici.id && i.alan_id === hedefArici.user_id
    )
    if (mevcutIstek) { setMesaj('Bu kişiye zaten istek göndermişsiniz!'); return }

    const { error } = await supabase.from('mentor_istekleri').insert([{
      gonderen_id: kullanici.id,
      alan_id: hedefArici.user_id,
      gonderen_email: kullanici.email,
      alan_email: hedefArici.email,
      durum: 'beklemede'
    }])

    if (error) { setMesaj('Hata: ' + error.message); return }

    // Bildirim gönder
    await supabase.from('bildirimler').insert([{
      alici_id: hedefArici.user_id,
      alici_email: hedefArici.email,
      mesaj: kullanici.email + ' size mentor istegi gonderdi',
      okundu: false,
      tip: 'mentor_istegi'
    }])

    setMesaj('Mentor isteği gönderildi!')
    await istekleriYenile()
  }

  // Mentor isteğini kabul et
  const istegiKabul = async (istek: MentorIstegi) => {
    await supabase
      .from('mentor_istekleri')
      .update({ durum: 'kabul edildi' })
      .eq('id', istek.id)

    // Gönderene bildirim
    await supabase.from('bildirimler').insert([{
      alici_id: istek.gonderen_id,
      alici_email: istek.gonderen_email,
      mesaj: kullanici?.email + ' mentor isteginizi kabul etti',
      okundu: false,
      tip: 'mentor_kabul'
    }])

    setMesaj('İstek kabul edildi!')
    await istekleriYenile()
  }

  const bekleyenIstekler = istekler.filter(i =>
    i.alan_id === kullanici?.id && i.durum === 'beklemede'
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', marginBlockEnd: '0.5rem' }}>🤝 Mentor Bul</h1>
      <p style={{ color: '#888', marginBlockEnd: '2rem' }}>3+ yıl deneyimli arıcılardan mentorluk al</p>

      {mesaj && <p style={{ color: '#4CAF50', marginBlockEnd: '1rem' }}>{mesaj}</p>}

      {/* Gelen istekler */}
      {bekleyenIstekler.length > 0 && (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem', marginBlockEnd: '2rem' }}>
          <h3 style={{ color: '#E8960A', marginBlockEnd: '1rem' }}>📬 Gelen Mentor İstekleri</h3>
          {bekleyenIstekler.map(istek => (
            <div key={istek.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '0.75rem' }}>
              <p style={{ color: '#ccc' }}>{istek.gonderen_email}</p>
              <button onClick={() => istegiKabul(istek)} style={{
                background: '#4CAF50', border: 'none', borderRadius: '8px',
                paddingBlock: '0.4rem', paddingInline: '1rem',
                cursor: 'pointer', color: 'white', fontWeight: 'bold'
              }}>
                Kabul Et
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Arıcı listesi */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {aricilar.map(arici => {
          const gonderildi = istekler.find(i =>
            i.gonderen_id === kullanici?.id && i.alan_id === arici.user_id
          )
          const kabul = gonderildi?.durum === 'kabul edildi'

          return (
            <div key={arici.id} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', paddingBlock: '1.25rem', paddingInline: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#E8960A', marginBlockEnd: '0.25rem' }}>👤 {arici.ad_soyad}</h3>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  📍 {arici.il} &nbsp;|&nbsp; ⏳ {arici.deneyim_yili} yıl &nbsp;|&nbsp; 🐝 {arici.ari_turleri}
                </p>
                {kabul && (
                  <p style={{ color: '#4CAF50', fontSize: '0.85rem', marginBlockStart: '0.5rem' }}>
                    ✅ Mentor bağlantısı kuruldu
                  </p>
                )}
              </div>
              <button
                onClick={() => mentorIsteGonder(arici)}
                disabled={!!gonderildi}
                style={{
                  background: gonderildi ? '#333' : '#E8960A',
                  border: 'none', borderRadius: '8px',
                  paddingBlock: '0.5rem', paddingInline: '1.25rem',
                  cursor: gonderildi ? 'default' : 'pointer',
                  fontWeight: 'bold',
                  color: gonderildi ? '#888' : '#000',
                  whiteSpace: 'nowrap',
                  opacity: gonderildi ? 0.7 : 1
                }}>
                {kabul ? 'Bağlandı' : gonderildi ? 'İstek Gönderildi' : 'Mentor İste'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}