// utils/emailGonder.js
// Çevreye göre otomatik geçiş: Mailtrap (test) | Brevo HTTP API (production)

const axios = require('axios');

// ─────────────────────────────────────────
// SAĞLAYICI KARARI: .env'deki MAIL_PROVIDER değişkeni
// ─────────────────────────────────────────
const SAGLAYICI = (process.env.MAIL_PROVIDER || 'brevo').toLowerCase();
console.log(`📬 Mail sağlayıcı: ${SAGLAYICI.toUpperCase()}`);

let mailtrapClient = null;

// ─── Mailtrap (HTTP API — test/sandbox) ─────────────────────
if (SAGLAYICI === 'mailtrap') {
    const { MailtrapClient } = require('mailtrap');
    mailtrapClient = new MailtrapClient({
        token:       process.env.MAILTRAP_API_TOKEN,
        testInboxId: parseInt(process.env.MAILTRAP_INBOX_ID),
        sandbox:     true,
    });
}

// ─── BAĞLANTI TESTİ ──────────────────────────────────────────
const baglantiTest = async () => {
    try {
        if (SAGLAYICI === 'mailtrap') {
            if (!process.env.MAILTRAP_API_TOKEN) {
                console.error('❌ MAILTRAP_API_TOKEN eksik');
                return;
            }
            console.log('✅ Mailtrap API hazır (test modu — HTTP üzerinden)');
        } else {
            // Brevo API anahtarı varlık kontrolü
            if (!process.env.BREVO_API_KEY) {
                console.error('❌ BREVO_API_KEY eksik');
                return;
            }
            console.log('✅ Brevo HTTP API hazır');
        }
    } catch (err) {
        console.error('❌ Mail servisi bağlantı hatası:', err.message);
    }
};

// ─── MAİL GÖNDERME ───────────────────────────────────────────
const emailGonder = async ({ kime, konu, html, text, attachments }) => {
    try {
        if (SAGLAYICI === 'mailtrap') {
            const info = await mailtrapClient.send({
                from:    { email: 'bildirim@unlu-isg.com', name: 'ÜNLÜ İSG' },
                to:      [{ email: kime }],
                subject: konu,
                html,
                text:    text || html.replace(/<[^>]*>/g, ''),
            });
            console.log(`📧 [Mailtrap] E-posta gönderildi → ${kime}`);
            return info;
        } else {
            // ─── Brevo Transactional Email HTTP API ───────────────
            const payload = {
                sender:      { name: 'ÜNLÜ İSG', email: process.env.BREVO_FROM_EMAIL || 'hamzaunlu57@gmail.com' },
                to:          [{ email: kime }],
                subject:     konu,
                htmlContent: html,
                textContent: text || html.replace(/<[^>]*>/g, ''),
            };

            // Nodemailer formatını Brevo formatına çevir
            // Nodemailer: { filename, content (base64), encoding, contentType }
            // Brevo:      { name, content (base64) }
            if (Array.isArray(attachments) && attachments.length > 0) {
                payload.attachment = attachments.map(att => ({
                    name:    att.filename || att.name || 'belge',
                    content: att.content, // zaten base64
                }));
            }

            const response = await axios.post(
                'https://api.brevo.com/v3/smtp/email',
                payload,
                {
                    headers: {
                        'api-key':      process.env.BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        'Accept':       'application/json',
                    },
                    timeout: 15000,
                }
            );

            console.log(`📧 [Brevo API] E-posta gönderildi → ${kime} (messageId: ${response.data.messageId})`);
            return response.data;
        }
    } catch (err) {
        const detay = err.response?.data || err.message;
        console.error(`❌ Mail gönderim hatası (${kime}):`, detay);
        throw new Error(typeof detay === 'object' ? JSON.stringify(detay) : detay);
    }
};

// ─── ŞİFRE SIFIRLAMA ŞABLONU ─────────────────────────────────
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
        Bu bağlantı <strong>15 dakika</strong> boyunca geçerlidir.
      </p>
      <p style="color: #64748b; font-size: 13px;">
        Butona tıklayamıyorsanız, aşağıdaki bağlantıyı tarayıcınıza kopyalayıp yapıştırabilirsiniz:
      </p>
      <p style="word-break: break-all; color: #3b82f6; font-size: 12px;">${resetUrl}</p>
      <div style="margin-top: 32px; padding: 16px; background:#fef3c7; border-radius:8px; border:1px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 13px;">
          ⚠️ <strong>Güvenlik uyarısı:</strong> Bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
        </p>
      </div>
    </div>
    <div style="padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
      <p>Bu otomatik bir e-postadır, lütfen yanıtlamayın.</p>
      <p>© ${new Date().getFullYear()} ÜNLÜ İSG</p>
    </div>
  </div>
`;

module.exports = { emailGonder, sifreSifirlamaSablonu, baglantiTest };
