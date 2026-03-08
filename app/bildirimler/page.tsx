'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Bildirim } from '@/types'

export default function Bildirimler() {
const [bildirimler, setBildirimler] = useState<Bildirim[]>([])

useEffect(() => {
const baslat = async () => {
const { data: { user } } = await supabase.auth.getUser()
if (!user) { window.location.href = '/giris'; return }

  // Kullanıcının bildirimlerini getir
  const { data } = await supabase
    .from('bildirimler')
    .select('*')
    .eq('alici_id', user.id)
    .order('created_at', { ascending: false })
  if (data) setBildirimler(data)

  // Tüm bildirimleri okundu olarak işaretle
  await supabase
    .from('bildirimler')
    .update({ okundu: true })
    .eq('alici_id', user.id)
    .eq('okundu', false)
}
baslat()
}, [])

const TIP_IKON: Record<string, string> = {
mentor_istegi: '🤝',
mentor_kabul: '✅',
mesaj: '💬',
uyari: '⚠️',
}

return (
<div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
<h1 style={{ color: '#E8960A', marginBlockEnd: '2rem' }}>🔔 Bildirimler</h1>

  {bildirimler.length === 0 ? (
    <p style={{ color: '#888' }}>Henüz bildirim yok.</p>
  ) : (
    bildirimler.map(b => (
      <div key={b.id} style={{
        background: b.okundu ? '#1a1a1a' : '#2a1500',
        border: '1px solid ' + (b.okundu ? '#333' : '#E8960A'),
        borderRadius: '12px',
        paddingBlock: '1.25rem',
        paddingInline: '1.5rem',
        marginBlockEnd: '1rem',
      }}>
        <p style={{ color: b.okundu ? '#ccc' : 'white' }}>
          {TIP_IKON[b.tip] ?? '🔔'} {b.mesaj}
        </p>
        {!b.okundu && (
          <span style={{ fontSize: '0.75rem', color: '#E8960A', marginBlockStart: '0.25rem', display: 'block' }}>
            Yeni
          </span>
        )}
      </div>
    ))
  )}
</div>
)
}