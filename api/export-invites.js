import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Check admin password
  const password = req.query.password;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Get all invites
    let invites = [];
    try {
      invites = await kv.lrange('invites', 0, -1) || [];
    } catch (kvError) {
      console.log('KV not available');
      return res.status(200)
        .setHeader('Content-Type', 'text/csv')
        .setHeader('Content-Disposition', 'attachment; filename="invites.csv"')
        .send('invited_email,referrer_email,referrer_archetype,timestamp,status\nNo data - KV not connected');
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
    
    // Sort by timestamp
    const sorted = parsedInvites.sort((a, b) => 
      new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );
    
    // Generate CSV
    const csvHeaders = ['invited_email', 'referrer_email', 'referrer_archetype', 'timestamp', 'status'];
    const csvRows = sorted.map(invite => [
      invite.invitedEmail || '',
      invite.referrerEmail || '',
      invite.referrerArchetype || '',
      invite.timestamp || '',
      invite.status || 'pending'
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
    
    const csv = [csvHeaders.join(','), ...csvRows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="marquis-invites-${new Date().toISOString().split('T')[0]}.csv"`);
    return res.status(200).send(csv);
    
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Export failed' });
  }
}

