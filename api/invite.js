import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { invitedEmail, referrerEmail, referrerArchetype } = req.body;
    
    if (!invitedEmail || !invitedEmail.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    
    // Store invite with referrer information
    const inviteData = {
      invitedEmail: invitedEmail.toLowerCase().trim(),
      referrerEmail: referrerEmail?.toLowerCase().trim() || 'unknown',
      referrerArchetype: referrerArchetype || 'unknown',
      type: 'invite',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    // Store in KV with invite: prefix
    const inviteKey = `invite:${Date.now()}:${invitedEmail.toLowerCase().trim()}`;
    
    try {
      await kv.set(inviteKey, inviteData);
      
      // Also add to invites list for easy retrieval
      await kv.lpush('invites', JSON.stringify(inviteData));
      
      console.log('Invite stored:', inviteKey, inviteData);
    } catch (kvError) {
      console.log('KV not available, logging invite:', inviteData);
      // Continue anyway - don't block the user experience
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Invite sent successfully'
    });
    
  } catch (error) {
    console.error('Invite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


