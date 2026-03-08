'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Ilan } from '@/types'

const KATEGORILER = ['Tümü', 'Bal', 'Kovan', 'Ana Arı', 'Ekipman', 'Diğer']

export default function Pazar() {
  const [ilanlar, setIlanlar] = useState<Ilan[]>([])
  const [aramaMetni, setAramaMetni] = useState('')
  const [kategoriFiltre, setKategoriFiltre] = useState('Tümü')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [mesajHedef, setMesajHedef] = useState<string | null>(null)

  // Supabase tarafında filtrele — tarayıcıda değil
  const yukle = useCallback(async () => {
    setYukleniyor(true)
    let sorgu = supabase.from('ilanlar').select('*').order('created_at', { ascending: false })

    if (aramaMetni.trim()) {
      sorgu = sorgu.or(
        `baslik.ilike.%${aramaMetni}%,aciklama.ilike.%${aramaMetni}%,il.ilike.%${aramaMetni}%`
      )
    }
    if (kategoriFiltre !== 'Tümü') {
      sorgu = sorgu.eq('kategori', kategoriFiltre)
    }

    const { data } = await sorgu
    if (data) setIlanlar(data)
    setYukleniyor(false)
  }, [aramaMetni, kategoriFiltre])

  useEffect(() => {
    const timeout = setTimeout(yukle, 300) // debounce
    return () => clearTimeout(timeout)
  }, [yukle])

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#E8960A', marginBlockEnd: '0.25rem' }}>🛒 Pazar</h1>
          <p style={{ color: '#888' }}>Arıcılık ürünleri alım satım ilanları</p>
        </div>
        <a href="/pazar/yeni" style={{
          background: '#E8960A', color: '#000',
          paddingBlock: '0.6rem', paddingInline: '1.5rem',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'
        }}>
          + İlan Ver
        </a>
      </div>

      {/* Arama */}
      <input
        placeholder="Başlık, açıklama veya il ara..."
        value={aramaMetni}
        onChange={e => setAramaMetni(e.target.value)}
        style={{
          display: 'block', width: '100%',
          paddingBlock: '0.75rem', paddingInline: '1rem',
          marginBlockEnd: '1rem', background: '#1a1a1a',
          border: '1px solid #333', color: 'white',
          borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box'
        }}
      />

      {/* Kategori filtreleri */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBlockEnd: '2rem' }}>
        {KATEGORILER.map(k => (
          <button key={k} onClick={() => setKategoriFiltre(k)} style={{
            background: kategoriFiltre === k ? '#E8960A' : '#1a1a1a',
            color: kategoriFiltre === k ? '#000' : '#ccc',
            border: '1px solid ' + (kategoriFiltre === k ? '#E8960A' : '#333'),
            borderRadius: '20px', paddingBlock: '0.35rem', paddingInline: '1rem',
            cursor: 'pointer', fontWeight: kategoriFiltre === k ? 'bold' : 'normal',
            fontSize: '0.85rem'
          }}>
            {k}
          </button>
        ))}
      </div>

      {yukleniyor && <p style={{ color: '#888' }}>Yükleniyor...</p>}

      {!yukleniyor && ilanlar.length === 0 && (
        <p style={{ color: '#888' }}>İlan bulunamadı.</p>
      )}

      {ilanlar.map(ilan => (
        <div key={ilan.id} style={{
          background: '#1a1a1a', border: '1px solid #333',
          borderRadius: '12px', paddingBlock: '1.25rem',
          paddingInline: '1.5rem', marginBlockEnd: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBlockEnd: '0.5rem' }}>
            <h2 style={{ color: '#E8960A' }}>{ilan.baslik}</h2>
            {ilan.kategori && (
              <span style={{
                background: '#2a1500', color: '#E8960A',
                border: '1px solid #E8960A',
                paddingBlock: '0.2rem', paddingInline: '0.75rem',
                borderRadius: '20px', fontSize: '0.8rem',
                fontWeight: 'bold', whiteSpace: 'nowrap'
              }}>
                {ilan.kategori}
              </span>
            )}
          </div>

          <p style={{ color: '#ccc', marginBlockEnd: '0.75rem' }}>{ilan.aciklama}</p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', marginBlockEnd: '0.75rem' }}>
            <span>📍 {ilan.il}</span>
            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>💰 {ilan.fiyat} ₺</span>
          </div>

          {/* Email gizleme — direkt göstermek yerine mesaj butonu */}
          {mesajHedef === ilan.satici_email ? (
            <p style={{ color: '#4CAF50', fontSize: '0.85rem' }}>
              ✅ Satıcıya mesaj göndermek için{' '}
              <a href={'/mesajlar?hedef=' + ilan.satici_email} style={{ color: '#E8960A' }}>
                mesajlar sayfasına git →
              </a>
            </p>
          ) : (
            <button
              onClick={() => setMesajHedef(ilan.satici_email)}
              style={{
                background: 'transparent', border: '1px solid #E8960A',
                color: '#E8960A', borderRadius: '8px',
                paddingBlock: '0.4rem', paddingInline: '1rem',
                cursor: 'pointer', fontSize: '0.85rem'
              }}
            >
              💬 Satıcıya Mesaj Gönder
            </button>
          )}
        </div>
      ))}
    </div>
  )
}