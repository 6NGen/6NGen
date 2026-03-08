// 6NGen — Dosya: app/pazar/yeni/page.tsx
// Görev: Yeni ilan verme formu — Tailwind CSS v3, auth korumalı

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Ilan } from '@/types'

interface IlanForm {
  baslik: string
  aciklama: string
  fiyat: string
  kategori: string
  il: string
}

const KATEGORILER = ['Bal', 'Kovan', 'Ana Arı', 'Ekipman', 'Diğer']

const ILLER = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya',
  'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın',
  'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay',
  'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük',
  'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli',
  'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',
  'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun',
  'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova',
  'Yozgat', 'Zonguldak'
]

export default function YeniIlan() {
  const router = useRouter()
  const [form, setForm] = useState<IlanForm>({
    baslik: '', aciklama: '', fiyat: '', kategori: 'Bal', il: 'Erzincan'
  })
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  // Auth kontrolü
  useEffect(() => {
    const kontrol = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/giris')
    }
    kontrol()
  }, [router])

  // Formu gönder
  const handleSubmit = async () => {
    if (!form.baslik || !form.fiyat) {
      setHata('Başlık ve fiyat zorunludur!')
      return
    }

    setYukleniyor(true)
    setHata('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/giris'); return }

    const { error } = await supabase.from('ilanlar').insert([{
      user_id: user.id,
      satici_email: user.email,
      baslik: form.baslik,
      aciklama: form.aciklama,
      fiyat: parseFloat(form.fiyat) || 0,
      kategori: form.kategori,
      il: form.il,
    }])

    if (error) {
      setHata('Hata: ' + error.message)
      setYukleniyor(false)
      return
    }

    router.push('/pazar')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-1">🛒 Yeni İlan Ver</h1>
        <p className="text-gray-400">Ürününü platforma ekle</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">

        {/* Başlık */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Başlık *</label>
          <input
            type="text"
            placeholder="örn: Organik Çiçek Balı 1kg"
            value={form.baslik}
            onChange={e => setForm({ ...form, baslik: e.target.value })}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Açıklama</label>
          <textarea
            placeholder="Ürününüz hakkında detaylı bilgi..."
            value={form.aciklama}
            onChange={e => setForm({ ...form, aciklama: e.target.value })}
            rows={4}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        {/* Fiyat */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Fiyat (₺) *</label>
          <input
            type="number"
            placeholder="0"
            value={form.fiyat}
            onChange={e => setForm({ ...form, fiyat: e.target.value })}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Kategori</label>
          <select
            value={form.kategori}
            onChange={e => setForm({ ...form, kategori: e.target.value })}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {KATEGORILER.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* İl */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">İl</label>
          <select
            value={form.il}
            onChange={e => setForm({ ...form, il: e.target.value })}
            className="w-full bg-black border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {ILLER.map(il => (
              <option key={il} value={il}>{il}</option>
            ))}
          </select>
        </div>

        {/* Hata mesajı */}
        {hata && (
          <p className="text-red-400 text-sm">{hata}</p>
        )}

        {/* Butonlar */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={yukleniyor}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
          >
            {yukleniyor ? 'Kaydediliyor...' : '+ İlanı Yayınla'}
          </button>
          <button
            onClick={() => router.push('/pazar')}
            className="px-6 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}