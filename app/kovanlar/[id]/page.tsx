// 6NGen — Dosya: app/kovanlar/[id]/page.tsx
// Görev: Kovan detay sayfası ve bakım geçmişi — Tailwind CSS v3

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Kovan, KovanKayit } from '@/types'

interface KayitForm {
  tarih: string
  tip: string
  notlar: string
}

const KAYIT_TIPLERI = ['Muayene', 'Besleme', 'Varroa Tedavisi', 'Hasat', 'Ana Arı Değişimi', 'Diğer']

export default function KovanDetay() {
  const params = useParams()
  const [kovan, setKovan] = useState<Kovan | null>(null)
  const [kayitlar, setKayitlar] = useState<KovanKayit[]>([])
  const [ekleMode, setEkleMode] = useState(false)
  const [form, setForm] = useState<KayitForm>({ tarih: '', tip: 'Muayene', notlar: '' })
  const [mesaj, setMesaj] = useState('')

  // Kovan ve kayıtları yükle
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
  }, [params.id])

  // Yeni bakım kaydı ekle
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
      setMesaj('✅ Kayıt eklendi!')
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <a href="/kovanlar" className="text-gray-400 text-sm hover:text-orange-500 transition-colors">
        ← Kovanlarıma Dön
      </a>

      {kovan && (
        <div className="my-6">
          <h1 className="text-2xl font-bold text-orange-500 mb-1">🏠 {kovan.isim}</h1>
          <p className="text-gray-300">🐝 {kovan.tur} &nbsp;|&nbsp; 📍 {kovan.konum}</p>
          {kovan.notlar && (
            <p className="text-gray-500 italic mt-2">📝 {kovan.notlar}</p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-semibold">Bakım Geçmişi</h2>
        <button
          onClick={() => setEkleMode(!ekleMode)}
          className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2 rounded-lg transition-colors"
        >
          + Kayıt Ekle
        </button>
      </div>

      {ekleMode && (
        <div className="bg-gray-900 border border-orange-500 rounded-xl p-6 mb-6 space-y-4">
          <select
            value={form.tip}
            onChange={e => setForm({ ...form, tip: e.target.value })}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {KAYIT_TIPLERI.map(tip => (
              <option key={tip} value={tip}>{tip}</option>
            ))}
          </select>

          <input
            type="date"
            value={form.tarih}
            onChange={e => setForm({ ...form, tarih: e.target.value })}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <textarea
            placeholder="Notlar..."
            value={form.notlar}
            onChange={e => setForm({ ...form, notlar: e.target.value })}
            rows={3}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />

          <button
            onClick={handleEkle}
            className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Kaydet
          </button>
        </div>
      )}

      {mesaj && <p className="text-green-400 mb-4">{mesaj}</p>}

      {kayitlar.length === 0 ? (
        <p className="text-gray-500">Henüz bakım kaydı yok. İlk kaydı ekle!</p>
      ) : (
        <div className="space-y-3">
          {kayitlar.map(k => (
            <div key={k.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                  {k.tip}
                </span>
                <span className="text-gray-400 text-sm">{k.tarih}</span>
              </div>
              <p className="text-gray-300">{k.notlar}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}