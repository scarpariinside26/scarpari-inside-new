const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 [API] Ricevuta richiesta send-notifica');
    
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const adminEmail = process.env.ADMIN_EMAIL;
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    
    console.log('📧 [API] Config test:', {
      isTestMode,
      adminEmail,
      gmailUser: gmailUser ? '***' : 'MISSING',
      hasGmailPass: !!gmailPass
    });

    if (!gmailUser || !gmailPass) {
      throw new Error('Environment variables mancanti');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    const { evento, emailDestinatario } = req.body;
    const emailFinale = isTestMode ? adminEmail : emailDestinatario;

    console.log('📧 [API] Invio a:', emailFinale);

    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${gmailUser}>`,
      to: emailFinale,
      subject: `⚽ ${evento.nome_evento}`,
      html: `
        <h2>⚽ Nuovo Evento: ${evento.nome_evento}</h2>
        <p><strong>📅 Data:</strong> ${new Date(evento.data_ora).toLocaleDateString('it-IT')}</p>
        <p><strong>📍 Luogo:</strong> ${evento.luogo}</p>
        <p><strong>👥 Partecipanti:</strong> Max ${evento.max_partecipanti}</p>
        ${isTestMode ? `<p style="color: red;"><strong>🛡️ TEST MODE:</strong> Email inviata a te invece che a: ${emailDestinatario}</p>` : ''}
      `
    });

    console.log('✅ [API] Email inviata con successo');

    res.status(200).json({ 
      success: true, 
      testMode: isTestMode,
      originalRecipient: emailDestinatario,
      actualRecipient: emailFinale,
      message: 'Email inviata con successo'
    });

  } catch (error) {
    console.error('❌ [API] Errore:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
};
