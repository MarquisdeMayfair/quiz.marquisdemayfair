// Vercel Serverless Function - Admin Authentication

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not configured');
    return res.status(500).json({ error: 'Admin password not configured on server' });
  }

  if (password === adminPassword) {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false, error: 'Invalid password' });
  }
}

