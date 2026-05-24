// config/mevzuatListesi.js
// ═══════════════════════════════════════════════════════════════════════════
// TAKİP EDİLECEK İSG MEVZUAT LİSTESİ
// ───────────────────────────────────────────────────────────────────────────
// Her mevzuat için 3 katmanlı URL stratejisi:
//   1. pdfURL    → Direkt PDF linki (varsa, en hızlı yol)
//   2. htmlURL   → mevzuat.gov.tr HTML sayfası (içinden PDF bulunacak)
//   3. mevzuatNo + tur + tertip → URL pattern tahmini (son çare)
//
// Yeni mevzuat eklemek için en altına yeni bir obje ekle, başka dosyaya
// dokunmana gerek yok. Sistem otomatik takip etmeye başlar.
// ═══════════════════════════════════════════════════════════════════════════

module.exports = [
    // ════════════════════════════════════════════════════════════════════
    // 🏛️ KANUN (1 adet)
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:    'isg_kanunu_6331',
        ad:         '6331 Sayılı İş Sağlığı ve Güvenliği Kanunu',
        kategori:   'Kanun',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/1.5.6331.pdf',
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6331&MevzuatTur=1&MevzuatTertip=5',
        mevzuatNo:  '6331',
        tur:        '1',  // 1 = Kanun
        tertip:     '5',
        aciklama:   'İSG\'nin temel kanunu, tüm İSG mevzuatının dayanağı',
    },

    // ════════════════════════════════════════════════════════════════════
    // 📘 ANA YÖNETMELİKLER (5 adet)
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:    'egitim_yonetmeligi',
        ad:         'Çalışanların İSG Eğitimlerinin Usul ve Esasları Hakkında Yönetmelik',
        kategori:   'Yönetmelik',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.45087.pdf', // Discovery script ile bulunacak
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=45087&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '45087',
        tur:        '7',  // 7 = Yönetmelik
        tertip:     '5',
        aciklama:   'Eğitim periyotları ve süreleri (3 yıl/2 yıl/1 yıl, 8/12/16 saat)',
    },
    {
        anahtar:    'risk_degerlendirmesi_yonetmeligi',
        ad:         'İSG Risk Değerlendirmesi Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16925&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '16925',
        tur:        '7',
        tertip:     '5',
        aciklama:   'Risk değerlendirmesi yenilenme periyotları (2/4/6 yıl)',
    },
    {
        anahtar:    'acil_durum_yonetmeligi',
        ad:         'İşyerlerinde Acil Durumlar Hakkında Yönetmelik',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18493&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18493',
        tur:        '7',
        tertip:     '5',
        aciklama:   'Acil durum planı revizyonu ve yıllık tatbikat',
    },
    {
        anahtar:    'isg_kurullari_yonetmeligi',
        ad:         'İSG Kurulları Hakkında Yönetmelik',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17031&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '17031',
        tur:        '7',
        tertip:     '5',
        aciklama:   'Kurul toplantı sıklığı (1/2/3 ay)',
    },
    {
        anahtar:    'ilkyardim_yonetmeligi',
        ad:         'İlkyardım Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.20992.pdf',
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=20992&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '20992',
        tur:        '7',
        tertip:     '5',
        aciklama:   'İlkyardımcı oranı (10/15/20 kişide 1) ve 3 yıllık yenileme',
    },

    // ════════════════════════════════════════════════════════════════════
    // 📗 SAĞLIK PERSONELİ YÖNETMELİKLERİ (2 adet)
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:    'isyeri_hekimi_yonetmeligi',
        ad:         'İşyeri Hekimi ve Diğer Sağlık Personelinin Görev, Yetki, Sorumluluk ve Eğitimleri Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.18615.pdf',
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18615&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18615',
        tur:        '7',
        tertip:     '5',
        aciklama:   'Periyodik sağlık muayenesi periyotları',
    },
    {
        anahtar:    'isg_hizmetleri_yonetmeligi',
        ad:         'İş Sağlığı ve Güvenliği Hizmetleri Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.16924.pdf',
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16924&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '16924',
        tur:        '7',
        tertip:     '5',
        aciklama:   'OSGB ve İSG profesyonelleri ile ilgili düzenlemeler',
    },

    // ════════════════════════════════════════════════════════════════════
    // 📕 İŞYERİ ŞARTLARI YÖNETMELİKLERİ (4 adet)
    // ════════════════════════════════════════════════════════════════════
    {
        anahtar:    'isyeri_bina_yonetmeligi',
        ad:         'İşyeri Bina ve Eklentilerinde Alınacak Sağlık ve Güvenlik Önlemlerine İlişkin Yönetmelik',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18592&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18592',
        tur:        '7',
        tertip:     '5',
        aciklama:   'Bina ve eklentilerinde alınacak SG önlemleri',
    },
    {
        anahtar:    'is_ekipmanlari_yonetmeligi',
        ad:         'İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.18318.pdf',
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18318&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18318',
        tur:        '7',
        tertip:     '5',
        aciklama:   'İş ekipmanlarının kullanımı, periyodik kontrolleri',
    },
    {
        anahtar:    'kkd_yonetmeligi',
        ad:         'Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik',
        kategori:   'Yönetmelik',
        pdfURL:     'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.18540.pdf',
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18540&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18540',
        tur:        '7',
        tertip:     '5',
        aciklama:   'KKD seçimi, kullanımı ve bakımı',
    },
    {
        anahtar:    'patlayici_ortam_yonetmeligi',
        ad:         'Çalışanların Patlayıcı Ortamların Tehlikelerinden Korunması Hakkında Yönetmelik',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18335&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18335',
        tur:        '7',
        tertip:     '5',
        aciklama:   'ATEX direktifi kapsamında patlayıcı ortam yönetimi',
    },

    // ════════════════════════════════════════════════════════════════════
    // 📙 ÖLÇÜM VE SEKTÖREL YÖNETMELİKLER (2 adet)
    // ════════════════════════════════════════════════════════════════════
    

    {
        anahtar:    'maden_isg_yonetmeligi',
        ad:         'Maden İşyerlerinde İş Sağlığı ve Güvenliği Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18858&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18858',
        tur:        '7',
        tertip:     '5',
        aciklama:   'Maden sektörü için özel İSG düzenlemeleri',
    },
    {
        anahtar:    'yapi_isleri_isg_yonetmeligi',
        ad:         'Yapı İşlerinde İş Sağlığı ve Güvenliği Yönetmeliği',
        kategori:   'Yönetmelik',
        pdfURL:     null,
        htmlURL:    'https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18928&MevzuatTur=7&MevzuatTertip=5',
        mevzuatNo:  '18928',
        tur:        '7',
        tertip:     '5',
        aciklama:   'İnşaat sektörü için özel İSG düzenlemeleri',
    },
];