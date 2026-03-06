import { supabase } from '@/lib/supabase'

export default async function Pazar() {
  const { data: ilanlar } = await supabase.from('ilanlar').select('*')

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>🛒 6NGen — Pazar</h1>
        <a href="/pazar/yeni" style={{
          background: '#E8960A',
          color: '#000',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>+ İlan Ver</a>
      </div>

      {!ilanlar || ilanlar.length === 0 ? (
        <p style={{ color: '#888' }}>Henüz ilan yok. İlk ilanı sen ver!</p>
      ) : (
        ilanlar.map((ilan, i) => (
          <div key={i} style={{
            background: '#1a1a1a',
            border: '1px solid #E8960A',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 style={{ color: '#E8960A' }}>{ilan.baslik}</h2>
              <span style={{ background: '#E8960A', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{ilan.tur}</span>
            </div>
            <p style={{ color: '#ccc', margin: '0.5rem 0' }}>{ilan.aciklama}</p>
            <p>📍 {ilan.il} &nbsp; 🐝 {ilan.ari_turu} &nbsp; 💰 {ilan.fiyat} ₺</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>İletişim: {ilan.iletisim}</p>
          </div>
        ))
      )}
    </div>
  )
}
