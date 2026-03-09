# 6NGen — Arıcılık Platformu

## Tech Stack
- Next.js 15 + TypeScript (strict)
- Supabase (auth + database + realtime)
- Vercel (deployment)

## Repo
https://github.com/6NGen/6NGen

## Canlı Site
https://6ngen.vercel.app

## Supabase
- Region: Frankfurt
- Email: durnaciomer24@hotmail.com

## Kurallar
- any tipi yasak, strict TypeScript
- RTL uyumlu (paddingInline, marginBlock vb.)
- Modüler bileşenler (components klasörü)
- Her fonksiyona yorum satırı
- Yeni tablo açınca: id, created_at, user_id zorunlu
- RLS aktif tüm tablolarda

## Tablolar
- aricilar (id uuid, user_id, ad_soyad, email, il, deneyim_yili, kovan_sayisi, ari_turleri)
- kovanlar (id, user_id, isim, tur, konum, notlar)
- kovan_kayitlari (id, kovan_id, tip, tarih, notlar)
- ilanlar (id, user_id, baslik, aciklama, fiyat, kategori, il, satici_email)
- mesajlar (id, gonderen_id, alici_id, gonderen_email, alici_email, icerik, okundu)
- bildirimler (id, alici_id, alici_email, mesaj, okundu, tip)
- mentor_istekleri (id, gonderen_id, alan_id, gonderen_email, alan_email, durum)
- uyarilar (id, user_id, baslik, aciklama, il, tur, kullanici_email)

## Tamamlanan Sayfalar
- / ana sayfa
- /aricilar
- /pazar + /pazar/yeni
- /giris
- /kayit
- /profil
- /kovanlar + /kovanlar/[id]
- /takvim
- /uyarilar
- /mentor
- /mesajlar
- /bildirimler

## Dosya Yapısı
- app/ — sayfalar
- components/ui/ — Button, Input, Card
- components/layout/ — Navbar
- types/index.ts — tüm TypeScript tipleri
- lib/supabase.ts — Supabase bağlantısı

## Çalışma Yöntemi
VS Code'da kod yaz → localhost:3000'de test et → git add, commit, push → Vercel otomatik deploy eder
## CSS Stratejisi
- Tailwind CSS v3.4.17 kurulu
- Mevcut sayfalar: inline style (dokunma)
- Yeni sayfalar: Tailwind className ile yaz
- tailwind.config.js ve postcss.config.js proje kökünde
## Gelecek Özellikler (Yol Haritası)
- Mera Rehberi: Harita tabanlı konaklama, çiçeklenme ve su kaynakları
- Eğitim & Akademi: Canlı yayın, hastalık teşhis video kütüphanesi  
- Bal Ormanı: Arıcı-yatırımcı kitle fonlama sistemi