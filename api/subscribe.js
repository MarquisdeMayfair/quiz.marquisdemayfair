// Vercel Serverless Function - Email Subscription
// Stores leads in Vercel KV with full quiz data

import { kv } from '@vercel/kv';

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

  try {
    const { 
      email, 
      firstName,
      archetype, 
      secondaryArchetype,
      scores, 
      optIn,
      timestamp 
    } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Create lead record
    const leadId = `lead:${Date.now()}:${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const lead = {
      id: leadId,
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim() || null,
      archetype: archetype || null,
      secondaryArchetype: secondaryArchetype || null,
      scores: scores || {},
      optIn: optIn === true,
      createdAt: timestamp || new Date().toISOString(),
      source: 'quiz'
    };

    // Store in Vercel KV
    await kv.set(leadId, lead);
    
    // Also add to a list for easy retrieval
    await kv.lpush('leads:all', leadId);
    
    // Increment counter
    await kv.incr('leads:count');

    return res.status(200).json({ 
      success: true,
      message: 'Subscription successful'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    
    // If KV is not configured, still return success but log warning
    if (error.message?.includes('KV')) {
      console.warn('Vercel KV not configured - lead not stored');
      return res.status(200).json({ 
        success: true,
        warning: 'Database not configured'
      });
    }
    
    return res.status(500).json({ error: 'Subscription failed' });
  }
}

