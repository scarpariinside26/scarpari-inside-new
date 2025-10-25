import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('🔧 [DEBUG] API chiamata - Inizio');
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    console.log('🔧 [DEBUG] Environment variables:', {
      GMAIL_USER: process.env.GMAIL_USER ? '***' : 'MISSING',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? '***' : 'MISSING',
      EMAIL_TEST_MODE: process.env.EMAIL_TEST_MODE,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL
    });

    // Verifica nodemailer
    console.log('🔧 [DEBUG] Nodemailer:', typeof nodemailer);
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Environment variables mancanti');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Test connessione
    console.log('🔧 [DEBUG] Test connessione Gmail...');
    await transporter.verify();
    console.log('✅ [DEBUG] Connessione Gmail OK');

    const { evento, emailDestinatario } = req.body;
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const emailFinale = isTestMode ? process.env.ADMIN_EMAIL : (emailDestinatario || 'test@example.com');

    console.log('📧 [DEBUG] Invio email a:', emailFinale);

    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
      to: emailFinale,
      subject: `🎯 TEST EMAIL - ${evento.nome_evento}`,
      text: `Test email reale per: ${evento.nome_evento}`,
      html: `<h1>TEST EMAIL REALE</h1><p>Evento: ${evento.nome_evento}</p><p>Se ricevi questa, NODEMAILER FUNZIONA! 🎉</p>`
    });

    console.log('✅ [DEBUG] Email REALE inviata! Message ID:', info.messageId);

    res.status(200).json({
      success: true,
      testMode: isTestMode,
      simulated: false,
      message: '✅ Email REALE inviata con successo',
      messageId: info.messageId,
      debug: {
        hasNodemailer: true,
        envVars: true,
        gmailConnected: true
      }
    });

  } catch (error) {
    console.error('❌ [DEBUG] Errore completo:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        hasNodemailer: typeof nodemailer !== 'undefined',
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
        stack: error.stack
      }
    });
  }
}
