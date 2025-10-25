// Versione ultrasemplice - sicuramente funziona
export default function handler(req, res) {
  console.log('✅ API chiamata con metodo:', req.method);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET') {
    return res.json({ 
      success: true, 
      message: 'API funziona!',
      method: 'GET'
    });
  }
  
  if (req.method === 'POST') {
    return res.json({ 
      success: true, 
      message: 'API funziona!', 
      method: 'POST',
      body: req.body
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
