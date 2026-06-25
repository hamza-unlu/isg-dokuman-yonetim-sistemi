// utils/emailGonder.js
const nodemailer = require('nodemailer');

/**
 * SMTP transporter — Gmail için App Password ile çalışır
 * .env içinde SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM tanımlı olmalı
 *
 * GMAIL KULLANIMI:
 *   1. Google Hesap → Güvenlik → 2 Adımlı Doğrulama'yı aç
 *   2. Google Hesap → Güvenlik → Uygulama Şifreleri → Yeni bir şifre oluştur
 *   3. Çıkan 16 karakterlik şifreyi SMTP_PASS olarak .env'e ekle
 *
 * OUTLOOK/HOTMAIL:
 *   SMTP_HOST=smtp-mail.outlook.com  SMTP_PORT=465
 */
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT, 10),
  secure: parseInt(process.env.SMTP_PORT, 10) === 465, // 465 ise TLS, 587 ise STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Başlangıçta SMTP bağlantısını test et — sunucu açılırken hata verir
 */
const baglantiTest = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP bağlantısı hazır');
  } catch (err) {
    console.error('❌ SMTP bağlantı hatası:', err.message);
  }
};

/**
 * E-posta gönderir
 * @param {Object} param0
 * @param {string} param0.kime   - Alıcı e-posta adresi
 * @param {string} param0.konu   - E-posta konusu
 * @param {string} param0.html   - HTML içerik
 * @param {string} [param0.text] - Düz metin (HTML'i destekleyemeyen istemciler için)
 */
const emailGonder = async ({ kime, konu, html, text }) => {
  const info = await transporter.sendMail({
    from:    process.env.SMTP_FROM || `"ÜNLÜ İSG" <${process.env.SMTP_USER}>`,
    to:      kime,
    subject: konu,
    html,
    text:    text || html.replace(/<[^>]*>/g, ''),
  });

  console.log(`📧 E-posta gönderildi → ${kime} (id: ${info.messageId})`);
  return info;
};

/**
 * Şifre sıfırlama e-postası için hazır HTML şablon
 */
const sifreSifirlamaSablonu = (adSoyad, resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
    <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #3b82f6;">
      <h2 style="color: #1e40af; margin: 0;">🛡️ ÜNLÜ İSG</h2>
      <p style="color: #64748b; margin: 4px 0 0;">İSG Doküman Yönetim Sistemi</p>
    </div>

    <div style="padding: 24px 0;">
      <h3 style="color: #1e293b;">Merhaba ${adSoyad},</h3>
      <p style="color: #334155; line-height: 1.6;">
        Hesabınız için bir şifre sıfırlama isteği aldık. Şifrenizi yenilemek için aşağıdaki butona tıklayın:
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}"
           style="background:#3b82f6;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;display:inline-block;font-weight:600;">
          Şifremi Sıfırla
        </a>
      </div>

      <p style="color: #64748b; font-size: 13px; line-height: 1.6;">
        Bu bağlantı <strong>15 dakika</strong> boyunca geçerlidir. Süre dolduktan sonra yeni bir istek oluşturmanız gerekir.
      </p>

      <p style="color: #64748b; font-size: 13px; line-height: 1.6;">
        Butona tıklayamıyorsanız, aşağıdaki bağlantıyı tarayıcınıza kopyalayıp yapıştırabilirsiniz:
      </p>
      <p style="word-break: break-all; color: #3b82f6; font-size: 12px;">${resetUrl}</p>

      <div style="margin-top: 32px; padding: 16px; background:#fef3c7; border-radius:8px; border:1px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 13px;">
          ⚠️ <strong>Güvenlik uyarısı:</strong> Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz;
          şifreniz değişmeyecektir. Şüpheli bir durum fark ederseniz sistem yöneticinizle iletişime geçin.
        </p>
      </div>
    </div>

    <div style="padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
      <p>Bu otomatik bir e-postadır, lütfen yanıtlamayın.</p>
      <p>© ${new Date().getFullYear()} ÜNLÜ İSG — Tüm hakları saklıdır.</p>
    </div>
  </div>
`;

module.exports = { emailGonder, sifreSifirlamaSablonu, baglantiTest };