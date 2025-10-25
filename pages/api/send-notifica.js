// ✅ CORRETTO per Next.js API Routes
export default async function handler(req, res) {
  console.log('📧 API Next.js chiamata - metodo:', req.method);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // DEBUG info
    console.log('🔧 Environment check:', {
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
      testMode: process.env.EMAIL_TEST_MODE,
      adminEmail: process.env.ADMIN_EMAIL
    });

    // GET - Info API
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: '✅ Next.js API Email - ONLINE',
        timestamp: new Date().toISOString(),
        config: {
          hasGmailUser: !!process.env.GMAIL_USER,
          hasGmailPass: !!process.env.GMAIL_APP_PASSWORD,
          testMode: process.env.EMAIL_TEST_MODE === 'true',
          adminEmail: process.env.ADMIN_EMAIL
        }
      });
    }

    // POST - Simulazione email
    if (req.method === 'POST') {
      const { evento, emailDestinatario } = req.body;
      const isTestMode = process.env.EMAIL_TEST_MODE === 'true';
      const adminEmail = process.env.ADMIN_EMAIL;
      
      const emailFinale = isTestMode ? adminEmail : (emailDestinatario || 'test@example.com');

      console.log('📧 Simulazione Next.js API:', {
        evento: evento?.nome_evento,
        destinatario: emailFinale,
        testMode: isTestMode
      });
      
      return res.status(200).json({
        success: true,
        testMode: isTestMode,
        simulated: true,
        message: '✅ Next.js API funziona - Email simulate',
        details: {
          evento: evento?.nome_evento,
          destinatarioReale: emailFinale,
          config: {
            hasGmailConfig: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
            testMode: isTestMode
          }
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Errore Next.js API:', error);
    return res.status(500).json({ error: error.message });
  }
}
