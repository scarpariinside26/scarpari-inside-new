// pages/api/send-email.js - Email REALI
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 PROVA EMAIL REALE...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: `"Scarpari Inside" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🎉 TEST EMAIL REALE - Nodemailer Funziona!',
      html: '<h1>SUCCESSO!</h1><p>Se ricevi questa, NODEMAILER FUNZIONA!</p>'
    });

    console.log('✅ EMAIL REALE INVIATA:', info.messageId);

    res.status(200).json({
      success: true,
      message: '✅ EMAIL REALE INVIATA!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Errore email reale:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
