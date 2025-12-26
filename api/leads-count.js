// Vercel Serverless Function - Get Lead Count
// For admin panel display

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORS headers
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
  const password = req.headers['x-admin-password'] || req.query.password;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const count = await kv.get('leads:count') || 0;
    
    // Get recent leads (last 5)
    const recentIds = await kv.lrange('leads:all', 0, 4);
    const recentLeads = [];
    
    for (const id of recentIds || []) {
      const lead = await kv.get(id);
      if (lead) {
        recentLeads.push({
          email: lead.email,
          archetype: lead.archetype,
          createdAt: lead.createdAt
        });
      }
    }

    return res.status(200).json({
      count: count,
      recent: recentLeads
    });

  } catch (error) {
    console.error('Leads count error:', error);
    return res.status(200).json({ 
      count: 0,
      recent: [],
      error: 'Database not configured'
    });
  }
}

