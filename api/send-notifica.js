const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Imposta header JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Gestione CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 🔧 PER TESTING: Se è GET, restituisci info
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'API Email Scarpari Inside',
      status: 'online',
      config: {
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
        testMode: process.env.EMAIL_TEST_MODE === 'true'
      }
    });
  }

  try {
    console.log('📧 [API] Ricevuta richiesta POST');
    
    // DEBUG delle environment variables
    console.log('🔧 [DEBUG] Environment variables:', {
      GMAIL_USER: process.env.GMAIL_USER ? '***' : 'MISSING',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? '***' : 'MISSING', 
      EMAIL_TEST_MODE: process.env.EMAIL_TEST_MODE,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL
    });

    // Verifica che le environment variables esistano
    if (!process.env.GMAIL_USER) {
      throw new Error('GMAIL_USER mancante su Vercel');
    }
    if (!process.env.GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_APP_PASSWORD mancante su Vercel');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const { evento, emailDestinatario } = req.body || {};
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL mancante su Vercel');
    }

    const emailFinale = isTestMode ? adminEmail : (emailDestinatario || 'test@example.com');

    console.log('📧 [API] Invio email a:', emailFinale);

    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
      to: emailFinale,
      subject: `✅ Test Email - ${evento?.nome_evento || 'Scarpari Inside'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>🎉 Test Email Scarpari Inside</h1>
          <div style="background: #f0f8ff; padding: 15px; border-radius: 8px;">
            <h2>${evento?.nome_evento || 'Evento di Test'}</h2>
            <p><strong>Data:</strong> ${evento?.data_ora ? new Date(evento.data_ora).toLocaleDateString('it-IT') : 'Oggi'}</p>
            <p><strong>Luogo:</strong> ${evento?.luogo || 'Test'}</p>
            <p><strong>Modalità Test:</strong> ${isTestMode ? '✅ ATTIVA' : '❌ Disattiva'}</p>
          </div>
          <p>Se ricevi questa email, il sistema di notifica funziona! 🚀</p>
        </div>
      `
    });

    console.log('✅ [API] Email inviata con successo:', info.messageId);

    res.status(200).json({
      success: true,
      testMode: isTestMode,
      message: 'Email inviata con successo',
      to: emailFinale,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ [API] Errore:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      debug: {
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
        hasAdminEmail: !!process.env.ADMIN_EMAIL
      }
    });
  }
};
