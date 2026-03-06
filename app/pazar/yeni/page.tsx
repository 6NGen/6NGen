'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function YeniIlan() {
  const [form, setForm] = useState({
    baslik: '',
    tur: 'Koloni',
    aciklama: '',
    il: '',
    ari_turu: '',
    fiyat: '',
    iletisim: ''
  })
  const [mesaj, setMesaj] = useState('')

  const handleSubmit = async () => {
    const { error } = await supabase.from('ilanlar').insert([form])
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ İlanınız yayınlandı!')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>📢 Yeni İlan Ver</h1>

      <label style={{ color: '#888', fontSize: '0.85rem' }}>İlan Başlığı</label>
      <input placeholder="örn: Satılık Anadolu Kolonisi" onChange={e => setForm({...form, baslik: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px' }} />

      <label style={{ color: '#888', fontSize: '0.85rem' }}>İlan Türü</label>
      <select onChange={e => setForm({...form, tur: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px' }}>
        <option>Koloni</option>
        <option>Ana Arı</option>
        <option>Bal</option>
        <option>Ekipman</option>
        <option>Kovan</option>
      </select>

      <label style={{ color: '#888', fontSize: '0.85rem' }}>Açıklama</label>
      <textarea placeholder="İlanınızı detaylı açıklayın..." onChange={e => setForm({...form, aciklama: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px', height:'100px' }} />

      <label style={{ color: '#888', fontSize: '0.85rem' }}>İl</label>
      <input placeholder="örn: Erzurum" onChange={e => setForm({...form, il: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px' }} />

      <label style={{ color: '#888', fontSize: '0.85rem' }}>Arı Türü</label>
      <input placeholder="örn: Anadolu, Kafkas, Karniyol" onChange={e => setForm({...form, ari_turu: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px' }} />

      <label style={{ color: '#888', fontSize: '0.85rem' }}>Fiyat (₺)</label>
      <input placeholder="örn: 1500" type="number" onChange={e => setForm({...form, fiyat: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px' }} />

      <label style={{ color: '#888', fontSize: '0.85rem' }}>İletişim (telefon veya email)</label>
      <input placeholder="örn: 0555 123 45 67" onChange={e => setForm({...form, iletisim: e.target.value})} style={{ display:'block', margin:'0.25rem 0 1rem', padding:'0.5rem', width:'100%', background:'#1a1a1a', border:'1px solid #333', color:'white', borderRadius:'6px' }} />

      <button onClick={handleSubmit} style={{ marginTop:'1rem', padding:'0.75rem 2rem', background:'#E8960A', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'1rem' }}>
        İlanı Yayınla
      </button>

      {mesaj && <p style={{ marginTop:'1rem', color:'#4CAF50', fontWeight:'bold' }}>{mesaj}</p>}
    </div>
  )
}
