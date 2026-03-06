export default function Home() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#E8960A', marginBottom: '0.5rem' }}>🍯 6NGen</h1>
        <p style={{ fontSize: '1.3rem', color: '#ccc', marginBottom: '2rem' }}>Türkiye'nin Arıcılık Platformu</p>
        <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: '1.8' }}>
          Arıcıları buluşturan, bilgi paylaşan, güvenli alım-satım yapılan Türkiye'nin ilk dijital arıcılık topluluğu.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/kayit" style={{ background: '#E8960A', color: '#000', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Ücretsiz Kayıt Ol
          </a>
          <a href="/pazar" style={{ background: 'transparent', color: '#E8960A', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', border: '2px solid #E8960A' }}>
            Pazara Bak
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🐝</div>
          <h3 style={{ color: '#E8960A' }}>Arıcı Profili</h3>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Profilini oluştur, deneyimini paylaş, toplulukla bağlan.</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
          <h3 style={{ color: '#E8960A' }}>Güvenli Pazar</h3>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Koloni, ana arı, bal ve ekipman al-sat. Güvenli ve şeffaf.</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <h3 style={{ color: '#E8960A' }}>Mevsim Takvimi</h3>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Bölgene özel bakım hatırlatmaları ve mevsim takvimi.</p>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
          <h3 style={{ color: '#E8960A' }}>Göç Haritası</h3>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Türkiye çiçeklenme takvimi ve arıcı haritası.</p>
        </div>
      </div>

    </div>
  )
}
