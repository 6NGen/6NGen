'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Arici } from '@/types'

export default function Aricilar() {
  const [aricilar, setAricilar] = useState<Arici[]>([])
  const [aramaMetni, setAramaMetni] = useState('')

  useEffect(() => {
    const yukle = async () => {
      const { data } = await supabase
        .from('aricilar')
        .select('*')
        .order('deneyim_yili', { ascending: false })
      if (data) setAricilar(data)
    }
    yukle()
  }, [])

  // Arama filtreleme
  const filtrelenmis = aricilar.filter(a =>
    a.ad_soyad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    a.il?.toLowerCase().includes(aramaMetni.toLowerCase()) ||
    a.ari_turleri?.toLowerCase().includes(aramaMetni.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', marginBlockEnd: '0.5rem' }}>🐝 Arıcılar</h1>
      <p style={{ color: '#888', marginBlockEnd: '1.5rem' }}>Platformumuzdaki tüm arıcılar</p>

      {/* Arama kutusu */}
      <input
        placeholder="İsim, il veya arı türü ara..."
        value={aramaMetni}
        onChange={e => setAramaMetni(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          paddingBlock: '0.75rem',
          paddingInline: '1rem',
          marginBlockEnd: '2rem',
          background: '#1a1a1a',
          border: '1px solid #333',
          color: 'white',
          borderRadius: '8px',
          fontSize: '1rem',
          boxSizing: 'border-box'
        }}
      />

      {filtrelenmis.length === 0 ? (
        <p style={{ color: '#888' }}>Arıcı bulunamadı.</p>
      ) : (
        filtrelenmis.map(arici => (
          <div key={arici.id} style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            paddingBlock: '1.25rem',
            paddingInline: '1.5rem',
            marginBlockEnd: '1rem'
          }}>
            <h2 style={{ color: '#E8960A', marginBlockEnd: '0.5rem' }}>👤 {arici.ad_soyad}</h2>
            <p>📍 {arici.il}</p>
            <p>🏠 {arici.kovan_sayisi} kovan</p>
            <p>🐝 {arici.ari_turleri}</p>
            <p>⏳ {arici.deneyim_yili} yıl deneyim</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>✉️ {arici.email}</p>
          </div>
        ))
      )}
    </div>
  )
}