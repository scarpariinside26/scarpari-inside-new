// ✅ CORRETTO per ES Modules
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('📧 API chiamata - metodo:', req.method);
  
  // Imposta header
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gestione OPTIONS per CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Se è GET, restituisci info
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: '✅ API Email Scarpari Inside - ONLINE',
        timestamp: new Date().toISOString(),
        config: {
          hasGmailUser: !!process.env.GMAIL_USER,
          hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
          testMode: process.env.EMAIL_TEST_MODE === 'true',
          adminEmail: process.env.ADMIN_EMAIL
        }
      });
    }

    // Se è POST, simulazione
    if (req.method === 'POST') {
      const { evento, emailDestinatario } = req.body || {};
      const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      
      const emailFinale = isTestMode ? adminEmail : (emailDestinatario || 'test@example.com');

      console.log('📧 Simulazione email per:', evento?.nome_evento);
      
      return res.status(200).json({
        success: true,
        testMode: isTestMode,
        simulated: true,
        message: '✅ Email simulata con successo',
        details: {
          evento: evento?.nome_evento,
          destinatario: emailFinale,
          config: {
            hasGmailConfig: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
            testMode: isTestMode
          }
        }
      });
    }

    // Se metodo non supportato
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });

  } catch (error) {
    console.error('❌ Errore API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
