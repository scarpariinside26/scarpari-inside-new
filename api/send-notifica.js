const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Imposta header JSON
  res.setHeader('Content-Type', 'application/json');
  
  try {
    console.log('📧 API chiamata');
    
    // DEBUG: Log delle environment variables (senza password)
    console.log('🔧 Config:', {
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
      testMode: process.env.EMAIL_TEST_MODE,
      adminEmail: process.env.ADMIN_EMAIL
    });

    // Verifica environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Variabili GMAIL_USER o GMAIL_APP_PASSWORD mancanti');
    }

    // Configura email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const { evento, emailDestinatario } = req.body || {};
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const emailFinale = isTestMode ? process.env.ADMIN_EMAIL : (emailDestinatario || 'test@example.com');

    console.log('📧 Invio a:', emailFinale);

    // Invio email semplice
    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
      to: emailFinale,
      subject: '✅ Test Email Scarpari Inside',
      text: `Test riuscito! Evento: ${evento?.nome_evento || 'Nessun evento'}`,
      html: `<h1>Test Email Scarpari</h1><p>Funziona! 🎉</p>`
    });

    console.log('✅ Email inviata:', info.messageId);

    res.status(200).json({
      success: true,
      testMode: isTestMode,
      message: 'Email inviata con successo',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Errore API:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Controlla environment variables su Vercel'
    });
  }
};
