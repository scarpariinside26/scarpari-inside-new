module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: '✅ API Email Scarpari Inside',
      status: 'online',
      config: {
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
        testMode: process.env.EMAIL_TEST_MODE === 'true',
        adminEmail: process.env.ADMIN_EMAIL
      },
      nextSteps: 'Installa nodemailer per inviare email reali'
    });
  }

  try {
    const { evento, emailDestinatario } = req.body || {};
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const emailFinale = isTestMode ? process.env.ADMIN_EMAIL : (emailDestinatario || 'test@example.com');

    console.log('📧 [SIMULAZIONE] Email per:', evento?.nome_evento);
    console.log('📧 [SIMULAZIONE] Destinatario:', emailFinale);

    // Simulazione invio email
    res.status(200).json({
      success: true,
      testMode: isTestMode,
      simulated: true,
      message: '✅ Email simulata - Sistema pronto',
      details: {
        evento: evento?.nome_evento,
        destinatarioReale: emailFinale,
        destinatarioOriginale: emailDestinatario,
        config: {
          hasGmailConfig: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
          testMode: isTestMode
        }
      },
      note: 'Installa nodemailer per email reali: npm install nodemailer'
    });

  } catch (error) {
    console.error('❌ Errore:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
