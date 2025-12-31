import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Check admin password
  const adminPassword = req.headers['x-admin-password'];
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Get invites list
    let invites = [];
    try {
      invites = await kv.lrange('invites', 0, -1) || [];
    } catch (kvError) {
      console.log('KV not available for invites');
      return res.status(200).json({ count: 0, recent: [], warning: 'Database not connected' });
    }
    
    // Parse invites
    const parsedInvites = invites.map(invite => {
      if (typeof invite === 'string') {
        try {
          return JSON.parse(invite);
        } catch {
          return null;
        }
      }
      return invite;
    }).filter(Boolean);
    
    // Sort by timestamp (newest first) and get recent
    const sorted = parsedInvites.sort((a, b) => 
      new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );
    
    return res.status(200).json({
      count: parsedInvites.length,
      recent: sorted.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Error fetching invites:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



