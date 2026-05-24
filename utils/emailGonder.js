// utils/emailGonder.js
// Çevreye göre otomatik geçiş: Mailtrap (test) veya SMTP (production - Brevo/Gmail)

const dns = require('dns');
try {
    dns.setDefaultResultOrder('ipv4first');
} catch (e) { /* sessiz */ }

const nodemailer = require('nodemailer');

// ─────────────────────────────────────────
// SAĞLAYICI KARARI: .env'deki MAIL_PROVIDER değişkeni
// ─────────────────────────────────────────
const SAGLAYICI = (process.env.MAIL_PROVIDER || 'smtp').toLowerCase();
console.log(`📬 Mail sağlayıcı: ${SAGLAYICI.toUpperCase()}`);

let mailtrapClient = null;
let smtpTransporter = null;

// ─── Mailtrap (HTTP API) ─────────────────────────────────────
if (SAGLAYICI === 'mailtrap') {
    const { MailtrapClient } = require('mailtrap');
    mailtrapClient = new MailtrapClient({
        token:       process.env.MAILTRAP_API_TOKEN,
        testInboxId: parseInt(process.env.MAILTRAP_INBOX_ID),
        sandbox:     true,
    });
}

// ─── SMTP (Brevo, Gmail, vs.) ────────────────────────────────
if (SAGLAYICI === 'smtp') {
    const portNo = parseInt(process.env.SMTP_PORT) || 587;
    smtpTransporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   portNo,
        secure: portNo === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        family: 4,
        tls: { rejectUnauthorized: false },
        connectionTimeout: 15000,
        greetingTimeout:   10000,
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
            await smtpTransporter.verify();
            console.log(`✅ SMTP bağlantısı hazır (${process.env.SMTP_HOST}:${process.env.SMTP_PORT})`);
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
            const info = await smtpTransporter.sendMail({
                from:    process.env.SMTP_FROM || `"ÜNLÜ İSG" <${process.env.SMTP_USER}>`,
                to:      kime,
                subject: konu,
                html,
                text:    text || html.replace(/<[^>]*>/g, ''),
                ...(attachments && attachments.length ? { attachments } : {}),
            });
            console.log(`📧 [SMTP] E-posta gönderildi → ${kime} (id: ${info.messageId})`);
            return info;
        }
    } catch (err) {
        console.error(`❌ Mail gönderim hatası (${kime}):`, err.message);
        throw err;
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
