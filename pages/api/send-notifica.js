// ✅ VERSIONE CORRETTA - NODEMAILER
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('🚀 API Email - Richiesta ricevuta:', req.method);
  
  // Configurazione CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Test API
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: '✅ API Email - ONLINE',
        timestamp: new Date().toISOString(),
        nodemailer: true,
        environment: {
          hasGmailUser: !!process.env.GMAIL_USER,
          hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    // POST - Invia email
    if (req.method === 'POST') {
      const { evento, emailDestinatario } = req.body;
      
      if (!evento || !evento.nome_evento) {
        return res.status(400).json({
          success: false,
          error: 'Dati evento mancanti'
        });
      }

      // Configura destinatario
      const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
      const emailFinale = isTestMode 
        ? (process.env.ADMIN_EMAIL || 'test@example.com') 
        : (emailDestinatario || process.env.ADMIN_EMAIL);

      console.log('📧 Preparazione email per:', emailFinale);

      // Configura Nodemailer
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // Invio email
      const info = await transporter.sendMail({
        from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
        to: emailFinale,
        subject: `🎉 ${evento.nome_evento} - Scarpari Inside`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2c5aa0;">🎉 Scarpari Inside</h1>
            <h2>${evento.nome_evento}</h2>
            <p>Grazie per il tuo interesse!</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              Email inviata automaticamente dal sistema Scarpari Inside
            </p>
          </div>
        `
      });

      console.log('✅ Email inviata con successo! ID:', info.messageId);

      return res.status(200).json({
        success: true,
        message: 'Email inviata con successo',
        messageId: info.messageId,
        testMode: isTestMode,
        destinatario: emailFinale
      });
    }

    // Metodo non supportato
    return res.status(405).json({
      success: false,
      error: 'Metodo non supportato'
    });

  } catch (error) {
    console.error('❌ Errore API email:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Errore nell\'invio dell\'email'
    });
  }
}
