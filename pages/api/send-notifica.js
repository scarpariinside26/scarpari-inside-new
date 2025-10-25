import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('📧 [API] Ricevuta richiesta send-notifica');
  
  if (req.method !== 'POST') {
    console.log('❌ [API] Method non permesso:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 [API] Body ricevuto:', JSON.stringify(req.body, null, 2));
    
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
    const adminEmail = process.env.ADMIN_EMAIL;
    const gmailUser = process.env.GMAIL_USER;           // ✅ CORRETTO
    const gmailPass = process.env.GMAIL_APP_PASSWORD;   // ✅ CORRETTO
    
    console.log('📧 [API] Config:', {
      isTestMode,
      adminEmail,
      gmailUser: gmailUser ? '***' : 'MISSING',
      hasGmailPass: !!gmailPass
    });

    // Verifica che le variabili esistano
    if (!gmailUser || !gmailPass) {
      throw new Error('Environment variables GMAIL_USER o GMAIL_APP_PASSWORD mancanti');
    }

    // Configura transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,    // ✅ CORRETTO
        pass: gmailPass     // ✅ CORRETTO
      }
    });

    const { evento, emailDestinatario } = req.body;
    const emailFinale = isTestMode ? adminEmail : emailDestinatario;

    console.log('📧 [API] Invio a:', emailFinale);

    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${gmailUser}>`,
      to: emailFinale,
      subject: `⚽ ${evento.nome_evento} - ${new Date(evento.data_ora).toLocaleDateString('it-IT')}`,
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
            </div>

            <p>Ciao! 🏃‍♂️ Sei stato invitato a partecipare a questo evento.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://scarpari-inside.vercel.app/eventi/${evento.id}" 
                 style="background: #2d5a9a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                📱 VAI ALL'EVENTO
              </a>
            </div>
          </div>
        </div>
      `
    });

    console.log('✅ [API] Email inviata con successo:', info.messageId);

    res.status(200).json({ 
      success: true, 
      testMode: isTestMode,
      originalRecipient: emailDestinatario,
      actualRecipient: emailFinale,
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ [API] Errore:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Controlla le environment variables su Vercel'
    });
  }
}
