import { supabase } from '@/lib/supabase'

export default async function Aricilar() {
  const { data: aricilar } = await supabase.from('aricilar').select('*')

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🐝 6NGen — Arıcılar</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Platformumuzdaki tüm arıcılar</p>
      
      {aricilar?.map((arici, i) => (
        <div key={i} style={{
          background: '#1a1a1a',
          border: '1px solid #E8960A',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ color: '#E8960A', marginBottom: '0.5rem' }}>👨 {arici.ad_soyad}</h2>
          <p>📍 {arici.il}</p>
          <p>🏠 {arici.kovan_sayisi} kovan</p>
          <p>🐝 {arici.ari_turleri}</p>
          <p>⏳ {arici.deneyim_yili} yıl deneyim</p>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>✉️ {arici.email}</p>
        </div>
      ))}
    </div>
  )
}
