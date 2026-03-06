'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Kayit() {
  const [form, setForm] = useState({
    ad_soyad: '',
    email: '',
    il: '',
    deneyim_yili: '',
    kovan_sayisi: '',
    ari_turleri: ''
  })
  const [mesaj, setMesaj] = useState('')

  const handleSubmit = async () => {
    const { error } = await supabase.from('aricilar').insert([form])
    if (error) {
      setMesaj('Hata: ' + error.message)
    } else {
      setMesaj('✅ Kayıt başarılı! Hoş geldiniz.')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>6NGen — Arıcı Kaydı</h1>
      <input placeholder="Ad Soyad" onChange={e => setForm({...form, ad_soyad: e.target.value})} style={{ display:'block', margin:'0.5rem 0', padding:'0.5rem', width:'100%' }} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} style={{ display:'block', margin:'0.5rem 0', padding:'0.5rem', width:'100%' }} />
      <input placeholder="İl (örn: Erzurum)" onChange={e => setForm({...form, il: e.target.value})} style={{ display:'block', margin:'0.5rem 0', padding:'0.5rem', width:'100%' }} />
      <input placeholder="Deneyim Yılı" type="number" onChange={e => setForm({...form, deneyim_yili: e.target.value})} style={{ display:'block', margin:'0.5rem 0', padding:'0.5rem', width:'100%' }} />
      <input placeholder="Kovan Sayısı" type="number" onChange={e => setForm({...form, kovan_sayisi: e.target.value})} style={{ display:'block', margin:'0.5rem 0', padding:'0.5rem', width:'100%' }} />
      <input placeholder="Arı Türleri (örn: Anadolu, Kafkas)" onChange={e => setForm({...form, ari_turleri: e.target.value})} style={{ display:'block', margin:'0.5rem 0', padding:'0.5rem', width:'100%' }} />
      <button onClick={handleSubmit} style={{ marginTop:'1rem', padding:'0.75rem 2rem', background:'#E8960A', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }}>
        Kayıt Ol
      </button>
      {mesaj && <p style={{ marginTop:'1rem', color:'green' }}>{mesaj}</p>}
    </div>
  )
}
