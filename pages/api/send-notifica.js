import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('📧 API Email REALE - metodo:', req.method);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Info API
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: '✅ API Email con Nodemailer - ONLINE',
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
      const adminEmail = process.env.ADMIN_EMAIL;
      
      const emailFinale = isTestMode ? adminEmail : (emailDestinatario || 'test@example.com');

      console.log('📧 Invio email REALE a:', emailFinale);

      // Configura Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // Invio email REALE
      const info = await transporter.sendMail({
        from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
        to: emailFinale,
        subject: `⚽ ${evento.nome_evento} - Scarpari Inside`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2d5a9a; color: white; padding: 20px; text-align: center;">
              <h1>⚽ Nuovo Evento Scarpari Inside!</h1>
            </div>
            
            <div style="padding: 20px;">
              <h2>${evento.nome_evento}</h2>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <p><strong>📅 Quando:</strong> ${new Date(evento.data_ora).toLocaleDateString('it-IT')} ore ${new Date(evento.data_ora).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                <p><strong>📍 Dove:</strong> ${evento.luogo}</p>
                <p><strong>👥 Partecipanti:</strong> Max ${evento.max_partecipanti}</p>
                ${evento.descrizione ? `<p><strong>📝 Descrizione:</strong> ${evento.descrizione}</p>` : ''}
              </div>

              <p>Ciao! 🏃‍♂️ Sei stato invitato a partecipare a questo evento.</p>
              
              ${isTestMode ? `
                <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                  <strong>🛡️ MODALITÀ TEST:</strong> Questa email sarebbe andata a: ${emailDestinatario}
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://scarpari-inside.vercel.app" 
                   style="background: #2d5a9a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                  📱 VAI ALL'APP
                </a>
              </div>
            </div>
          </div>
        `
      });

      console.log('✅ Email REALE inviata:', info.messageId);

      return res.status(200).json({
        success: true,
        testMode: isTestMode,
        simulated: false,
        message: '✅ Email REALE inviata con successo',
        messageId: info.messageId,
        details: {
          evento: evento.nome_evento,
          destinatarioReale: emailFinale,
          destinatarioOriginale: emailDestinatario
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Errore invio email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      note: 'Verifica che nodemailer sia installato e le environment variables siano corrette'
    });
  }
}
