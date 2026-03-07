export interface Kullanici {
  id: string
  email: string
}

export interface Arici {
  id: number
  user_id?: string
  ad_soyad: string
  email: string
  il: string
  deneyim_yili: number
  kovan_sayisi: number
  ari_turleri: string
  created_at?: string
}

export interface Kovan {
  id: number
  isim: string
  tur: string
  konum: string
  notlar: string
  kullanici_email: string
  created_at?: string
}

export interface KovanKayit {
  id: number
  kovan_id: number
  tip: string
  tarih: string
  notlar: string
  created_at?: string
}

export interface Ilan {
  id: number
  baslik: string
  aciklama: string
  fiyat: number
  kategori: string
  il: string
  satici_email: string
  created_at?: string
}

export interface Mesaj {
  id: number
  gonderen_email: string
  alici_email: string
  icerik: string
  okundu: boolean
  created_at?: string
}

export interface Bildirim {
  id: number
  alici_email: string
  mesaj: string
  okundu: boolean
  tip: 'mentor_istegi' | 'mentor_kabul' | 'mesaj' | 'uyari'
  created_at?: string
}

export interface Uyari {
  id: number
  baslik: string
  aciklama: string
  il: string
  tur: string
  kullanici_email: string
  created_at?: string
}

export interface MentorIstegi {
  id: number
  gonderen_email: string
  alan_email: string
  durum: 'beklemede' | 'kabul edildi' | 'reddedildi'
  created_at?: string
}
