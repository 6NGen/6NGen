'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function KovanDetay() {
  const params = useParams()
  const [kovan, setKovan] = useState<any>(null)
  const [kayitlar, setKayitlar] = useState<any[]>([])
  const [ekleMode, setEkleMode] = useState(false)
  const [form, setForm] = useState({ tarih: '', tip: 'Muayene', notlar: '' })
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data: kovanData } = await supabase
        .from('kovanlar')
        .select('*')
        .eq('id', params.id)
        .single()
      if (kovanData) setKovan(kovanData)

      const { data: kayitData } = await supabase
        .from('kovan_kayitlari')
        .select('*')
        .eq('kovan_id', params.id)
        .order('tarih', { ascending: false })
      if (kayitData) setKayitlar(kayitData)
    }
    getData()
  }, [])

  const handleEkle = async () => {
    const { error } = await supabase.from('kovan_kayitlari').insert([{
      kovan_id: params.id,
      tarih: form.tarih,
      tip: form.tip,
      notlar: form.notlar
    }])
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('Kayıt eklendi!')
      setEkleMode(false)
      setForm({ tarih: '', tip: 'Muayene', notlar: '' })
      const { data } = await supabase
        .from('kovan_kayitlari')
        .select('*')
        .eq('kovan_id', params.id)
        .order('tarih', { ascending: false })
      if (data) setKayitlar(data)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <a href="/kovanlar" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem' }}>← Kovanlarıma Dön</a>

      {kovan && (
        <div style={{ margin: '1.5rem 0' }}>
          <a href={'/kovanlar/' + kovan.id} style={{ color: '#E8960A', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold' }}>🏠 {kovan.isim}</a>
          <p style={{ color: '#ccc' }}>🐝 {kovan.tur} &nbsp;|&nbsp; 📍 {kovan.konum}</p>
          {kovan.notlar && <p style={{ color: '#888', fontStyle: 'italic', marginTop: '0.5rem' }}>📝 {kovan.notlar}</p>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'white' }}>Bakım Geçmişi</h2>
        <button onClick={() => setEkleMode(!ekleMode)} style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
          + Kayıt Ekle
        </button>
      </div>

      {ekleMode && (
        <div style={{ background: '#1a1a1a', border: '1px solid #E8960A', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <select onChange={e => setForm({...form, tip: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <option>Muayene</option>
            <option>Besleme</option>
            <option>Varroa Tedavisi</option>
            <option>Hasat</option>
            <option>Ana Arı Değişimi</option>
            <option>Diğer</option>
          </select>
          <input type="date" value={form.tarih} onChange={e => setForm({...form, tarih: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px' }} />
          <textarea placeholder="Notlar..." value={form.notlar} onChange={e => setForm({...form, notlar: e.target.value})}
            style={{ display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', background: '#0a0a0a', border: '1px solid #333', color: 'white', borderRadius: '8px', height: '80px' }} />
          <button onClick={handleEkle} style={{ background: '#E8960A', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Kaydet
          </button>
        </div>
      )}

      {mesaj && <p style={{ color: '#4CAF50', marginBottom: '1rem' }}>{mesaj}</p>}

      {kayitlar.length === 0 ? (
        <p style={{ color: '#888' }}>Henüz bakım kaydı yok. İlk kaydı ekle!</p>
      ) : (
        kayitlar.map((k, i) => (
          <div key={i} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ background: '#E8960A', color: '#000', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{k.tip}</span>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>{k.tarih}</span>
            </div>
            <p style={{ color: '#ccc' }}>{k.notlar}</p>
          </div>
        ))
      )}
    </div>
  )
}
