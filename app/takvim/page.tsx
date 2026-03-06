export default function Takvim() {
  const aylar = [
    {
      ay: 'Ocak', icon: '❄️',
      gorevler: ['Kovanları kontrol et, nem ve soğuktan koru', 'Kışlık besin yeterliliğini kontrol et', 'Ekipmanları temizle ve onar']
    },
    {
      ay: 'Şubat', icon: '🌨️',
      gorevler: ['İlk uçuş günlerini gözlemle', 'Kovan ağırlığını kontrol et', 'Ana arı varlığını doğrula']
    },
    {
      ay: 'Mart', icon: '🌱',
      gorevler: ['Bahar temizliği yap', 'Varroa kontrolü başlat', 'Koloninin gelişimini izle', 'Gerekirse şeker şurubu ver']
    },
    {
      ay: 'Nisan', icon: '🌸',
      gorevler: ['Oğul önlemi al', 'Yeni çerçeve ekle', 'Ana arı kalitesini değerlendir', 'İlk bal hasadına hazırlan']
    },
    {
      ay: 'Mayıs', icon: '🌼',
      gorevler: ['Oğul mevsimi — günlük kontrol', 'Fazla balı hasat et', 'Yeni koloniler kur', 'Varroa sayımı yap']
    },
    {
      ay: 'Haziran', icon: '☀️',
      gorevler: ['Ana bal akışı dönemi', 'Ballık eklemeyi unutma', 'Havalandırmayı artır', 'Yaz bakımlarını yap']
    },
    {
      ay: 'Temmuz', icon: '🔥',
      gorevler: ['Sıcaktan koru, gölge sağla', 'Su kaynağı mutlaka olsun', 'Varroa tedavisini planla', 'Bal hasadı']
    },
    {
      ay: 'Ağustos', icon: '🍯',
      gorevler: ['Son bal hasadı', 'Varroa tedavisi uygula', 'Kışlık hazırlığa başla', 'Zayıf kolonileri birleştir']
    },
    {
      ay: 'Eylül', icon: '🍂',
      gorevler: ['Kışlık besin hazırla', 'Son varroa kontrolü', 'Fare kapanı koy', 'Uçuş tahtasını daralt']
    },
    {
      ay: 'Ekim', icon: '🍁',
      gorevler: ['Kışlık şeker şurubu ver', 'Kovan izolasyonunu kontrol et', 'Son dış kontroller', 'Kayıtları tamamla']
    },
    {
      ay: 'Kasım', icon: '🌧️',
      gorevler: ['Kışlık hazırlık tamamla', 'Havalandırma deliklerini kontrol et', 'Minimum müdahale dönemi başlar']
    },
    {
      ay: 'Aralık', icon: '❄️',
      gorevler: ['Kovanları rahatsız etme', 'Dışarıdan sessiz gözlem', 'Yeni sezon planlaması yap', 'Ekipman bakımı']
    }
  ]

  const buAy = new Date().getMonth()

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#E8960A', marginBottom: '0.5rem' }}>📅 Mevsim Takvimi</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Aylık arıcılık görev rehberi</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {aylar.map((ay, i) => (
          <div key={i} style={{
            background: i === buAy ? '#2a1500' : '#1a1a1a',
border: i === buAy ? '1px solid #E8960A' : '1px solid #333',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ color: '#E8960A', marginBottom: '0.75rem' }}>
              {ay.icon} {ay.ay}
              {i === buAy && <span style={{ fontSize: '0.7rem', background: '#E8960A', color: '#000', padding: '0.1rem 0.5rem', borderRadius: '10px', marginLeft: '0.5rem' }}>Bu Ay</span>}
            </h3>
            <ul style={{ paddingLeft: '1rem', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.8' }}>
              {ay.gorevler.map((g, j) => <li key={j}>{g}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

