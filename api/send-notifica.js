const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 API Email chiamata');
    
    // DEBUG info
    const config = {
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPass: !!process.env.GMAIL_APP_PASSWORD ? '***' : 'MISSING',
      testMode: process.env.EMAIL_TEST_MODE,
      adminEmail: process.env.ADMIN_EMAIL
    };
    console.log('🔧 Config:', config);

    // Verifica environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Environment variables mancanti su Vercel');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const { evento, emailDestinatario } = req.body;
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const emailFinale = isTestMode ? process.env.ADMIN_EMAIL : (emailDestinatario || 'test@example.com');

    console.log('📧 Invio email a:', emailFinale);

    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
      to: emailFinale,
      subject: '✅ Test Email da Scarpari Inside',
      text: `Test email: ${evento?.nome_evento || 'Evento di test'}`,
      html: `
        <h2>Test Email Scarpari Inside</h2>
        <p><strong>Evento:</strong> ${evento?.nome_evento || 'Test'}</p>
        <p><strong>Modalità Test:</strong> ${isTestMode ? 'ATTIVA' : 'Disattiva'}</p>
        <p>Se ricevi questa email, il sistema funziona! 🎉</p>
      `
    });

    console.log('✅ Email inviata con successo');

    res.status(200).json({
      success: true,
      testMode: isTestMode,
      message: 'Email inviata con successo',
      to: emailFinale
    });

  } catch (error) {
    console.error('❌ Errore:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      help: 'Controlla le environment variables su Vercel'
    });
  }
};
