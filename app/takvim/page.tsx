// 6NGen — Dosya: app/takvim/page.tsx
// Görev: Aylık arıcılık görev takvimi — Tailwind CSS v3

const AYLAR = [
  { ay: 'Ocak',    icon: '❄️', gorevler: ['Kovanları kontrol et, nem ve soğuktan koru', 'Kışlık besin yeterliliğini kontrol et', 'Ekipmanları temizle ve onar'] },
  { ay: 'Şubat',   icon: '🌨️', gorevler: ['İlk uçuş günlerini gözlemle', 'Kovan ağırlığını kontrol et', 'Ana arı varlığını doğrula'] },
  { ay: 'Mart',    icon: '🌱', gorevler: ['Bahar temizliği yap', 'Varroa kontrolü başlat', 'Koloninin gelişimini izle', 'Gerekirse şeker şurubu ver'] },
  { ay: 'Nisan',   icon: '🌸', gorevler: ['Oğul önlemi al', 'Yeni çerçeve ekle', 'Ana arı kalitesini değerlendir', 'İlk bal hasadına hazırlan'] },
  { ay: 'Mayıs',   icon: '🌼', gorevler: ['Oğul mevsimi — günlük kontrol', 'Fazla balı hasat et', 'Yeni koloniler kur', 'Varroa sayımı yap'] },
  { ay: 'Haziran', icon: '☀️', gorevler: ['Ana bal akışı dönemi', 'Ballık eklemeyi unutma', 'Havalandırmayı artır', 'Yaz bakımlarını yap'] },
  { ay: 'Temmuz',  icon: '🔥', gorevler: ['Sıcaktan koru, gölge sağla', 'Su kaynağı mutlaka olsun', 'Varroa tedavisini planla', 'Bal hasadı'] },
  { ay: 'Ağustos', icon: '🍯', gorevler: ['Son bal hasadı', 'Varroa tedavisi uygula', 'Kışlık hazırlığa başla', 'Zayıf kolonileri birleştir'] },
  { ay: 'Eylül',   icon: '🍂', gorevler: ['Kışlık besin hazırla', 'Son varroa kontrolü', 'Fare kapanı koy', 'Uçuş tahtasını daralt'] },
  { ay: 'Ekim',    icon: '🍁', gorevler: ['Kışlık şeker şurubu ver', 'Kovan izolasyonunu kontrol et', 'Son dış kontroller', 'Kayıtları tamamla'] },
  { ay: 'Kasım',   icon: '🌧️', gorevler: ['Kışlık hazırlık tamamla', 'Havalandırma deliklerini kontrol et', 'Minimum müdahale dönemi başlar'] },
  { ay: 'Aralık',  icon: '❄️', gorevler: ['Kovanları rahatsız etme', 'Dışarıdan sessiz gözlem', 'Yeni sezon planlaması yap', 'Ekipman bakımı'] },
]

export default function Takvim() {
  const buAy = new Date().getMonth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-orange-500 mb-1">📅 Mevsim Takvimi</h1>
      <p className="text-gray-400 mb-8">Aylık arıcılık görev rehberi</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AYLAR.map((ay, i) => (
          <div
            key={ay.ay}
            className={`rounded-xl p-5 border ${
              i === buAy
                ? 'bg-amber-950 border-orange-500'
                : 'bg-gray-900 border-gray-700'
            }`}
          >
            <h3 className="text-orange-500 font-bold text-lg mb-3 flex items-center gap-2">
              {ay.icon} {ay.ay}
              {i === buAy && (
                <span className="text-xs bg-orange-500 text-black px-2 py-0.5 rounded-full font-bold">
                  Bu Ay
                </span>
              )}
            </h3>
            <ul className="space-y-1">
              {ay.gorevler.map(g => (
                <li key={g} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}