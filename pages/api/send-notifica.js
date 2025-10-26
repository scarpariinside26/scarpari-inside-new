// ✅ NUOVA VERSIONE CON NODEMAILER - ELIMINA LA VECCHIA!
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  console.log('🚀 NUOVA API CON NODEMAILER - Inizio');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    console.log('🔍 Check nodemailer:', typeof nodemailer);
    
    // GET - Info API
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: '✅ NUOVA API CON NODEMAILER - ONLINE',
        nodemailer: typeof nodemailer !== 'undefined',
        config: {
          hasGmailUser: !!process.env.GMAIL_USER,
          hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
          testMode: process.env.EMAIL_TEST_MODE === 'true'
        }
      });
    }

    // POST - Email REALE
    if (req.method === 'POST') {
      const { evento, emailDestinatario } = req.body;
      const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
      const emailFinale = isTestMode ? process.env.ADMIN_EMAIL : (emailDestinatario || 'test@example.com');

      console.log('📧 NUOVA API - Invio email REALE a:', emailFinale);

      // VERIFICA NODEMAILER
      if (typeof nodemailer === 'undefined') {
        throw new Error('NODEMAILER NON TROVATO');
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // INVIO EMAIL REALE
      const info = await transporter.sendMail({
        from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
        to: emailFinale,
        subject: `🎉 NUOVA API - ${evento.nome_evento}`,
        html: `
          <h1>🎉 EMAIL REALE DA NUOVA API!</h1>
          <p><strong>Evento:</strong> ${evento.nome_evento}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
          <p style="color: green; font-weight: bold;">SE RICEVI QUESTA, LA NUOVA API FUNZIONA! 🚀</p>
        `
      });

      console.log('✅ EMAIL REALE INVIATA! Message ID:', info.messageId);

      return res.status(200).json({
        success: true,
        simulated: false,
        message: '✅ EMAIL REALE INVIATA DA NUOVA API',
        messageId: info.messageId,
        testMode: isTestMode,
        details: {
          evento: evento.nome_evento,
          destinatario: emailFinale
        }
      });
    }

  } catch (error) {
    console.error('❌ Errore nuova API:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      simulated: true
    });
  }
}
