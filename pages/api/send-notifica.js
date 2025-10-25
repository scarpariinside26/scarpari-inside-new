// ✅ VERSIONE AGGIORNATA CON NODEMAILER
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  console.log('🚀 API CON NODEMAILER - Inizio');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    console.log('🔍 Check nodemailer:', typeof nodemailer);
    console.log('🔍 Environment:', {
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
      testMode: process.env.EMAIL_TEST_MODE
    });

    // GET - Info con stato nodemailer
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: '✅ API Email - ONLINE CON NODEMAILER',
        timestamp: new Date().toISOString(),
        nodemailer: typeof nodemailer !== 'undefined',
        config: {
          hasGmailUser: !!process.env.GMAIL_USER,
          hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
          testMode: process.env.EMAIL_TEST_MODE === 'true',
          adminEmail: process.env.ADMIN_EMAIL
        }
      });
    }

    // POST - Prova email REALE con nodemailer
    if (req.method === 'POST') {
      const { evento, emailDestinatario } = req.body;
      const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
      const adminEmail = process.env.ADMIN_EMAIL;
      
      const emailFinale = isTestMode ? adminEmail : (emailDestinatario || 'test@example.com');

      console.log('📧 Tentativo email REALE a:', emailFinale);

      // PROVA NODEMAILER REALE
      if (typeof nodemailer !== 'undefined') {
        console.log('🎯 NODEMAILER TROVATO - Invio email REALE');
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });

        const info = await transporter.sendMail({
          from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
          to: emailFinale,
          subject: `🎉 ${evento.nome_evento} - Scarpari Inside`,
          html: `
            <h1>🎉 EMAIL REALE DA NODEMAILER!</h1>
            <p><strong>Evento:</strong> ${evento.nome_evento}</p>
            <p><strong>Data:</strong> ${new Date(evento.data_ora).toLocaleDateString('it-IT')}</p>
            <p><strong>Luogo:</strong> ${evento.luogo}</p>
            <p style="color: green; font-weight: bold;">SE RICEVI QUESTA, NODEMAILER FUNZIONA! 🚀</p>
          `
        });

        console.log('✅ EMAIL REALE INVIATA! Message ID:', info.messageId);

        return res.status(200).json({
          success: true,
          simulated: false,
          message: '✅ EMAIL REALE INVIATA CON SUCCESSO',
          messageId: info.messageId,
          testMode: isTestMode,
          details: {
            evento: evento.nome_evento,
            destinatario: emailFinale,
            nodemailer: true
          }
        });

      } else {
        // Fallback a simulazione
        console.log('❌ Nodemailer non disponibile - Simulazione');
        return res.status(200).json({
          success: true,
          simulated: true,
          message: 'Email simulate - Nodemailer non attivo',
          testMode: isTestMode,
          details: {
            evento: evento.nome_evento,
            destinatario: emailFinale
          }
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Errore API:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
