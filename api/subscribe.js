// Vercel Serverless Function - Email Subscription
// Stores leads in Vercel KV with full quiz data

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

    // Try to store in Vercel KV if available
    try {
      const { kv } = await import('@vercel/kv');
      await kv.set(leadId, lead);
      await kv.lpush('leads:all', leadId);
      await kv.incr('leads:count');
      console.log('Lead stored successfully:', leadId);
    } catch (kvError) {
      // KV not configured - log but don't fail
      console.warn('Vercel KV not available, lead not stored:', kvError.message);
    }

    return res.status(200).json({ 
      success: true,
      message: 'Subscription successful'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    // Return success anyway - don't block user experience
    return res.status(200).json({ 
      success: true,
      warning: 'Processed with warnings'
    });
  }
}

