'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Bildirimler() {
  const [bildirimler, setBildirimler] = useState<any[]>([])
  const [kullanici, setKullanici] = useState<any>(null)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/giris'; return }
      setKullanici(user)

      const { data } = await supabase
        .from('bildirimler')
        .select('*')
        .eq('alici_email', user.email)
        .order('created_at', { ascending: false })
      if (data) setBildirimler(data)

      await supabase
        .from('bildirimler')
        .update({ okundu: true })
        .eq('alici_email', user.email)
        .eq('okundu', false)
    }
    getData()
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', marginBottom: '2rem' }}>🔔 Bildirimler</h1>

      {bildirimler.length === 0 ? (
        <p style={{ color: '#888' }}>Henüz bildirim yok.</p>
      ) : (
        bildirimler.map((b, i) => (
          <div key={i} style={{
            background: b.okundu ? '#1a1a1a' : '#2a1500',
            border: '1px solid ' + (b.okundu ? '#333' : '#E8960A'),
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: b.okundu ? '#ccc' : 'white' }}>🔔 {b.mesaj}</p>
            {!b.okundu && <span style={{ fontSize: '0.75rem', color: '#E8960A' }}>Yeni</span>}
          </div>
        ))
      )}
    </div>
  )
}
