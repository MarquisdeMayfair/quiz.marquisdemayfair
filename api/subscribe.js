// Vercel Serverless Function - Email Subscription
// Stores leads in Vercel KV with full quiz data
// Includes reCAPTCHA verification and 6-month rate limiting

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 months in milliseconds

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
      timestamp,
      recaptchaToken
    } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify reCAPTCHA if token provided and secret key configured
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && recaptchaToken) {
      try {
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${recaptchaSecret}&response=${recaptchaToken}`
        });
        const recaptchaData = await recaptchaResponse.json();
        
        // Check if verification passed and score is acceptable (0.5+ is generally human)
        if (!recaptchaData.success || recaptchaData.score < 0.3) {
          console.warn('reCAPTCHA failed:', recaptchaData);
          return res.status(403).json({ 
            error: 'Security verification failed. Please try again.',
            code: 'CAPTCHA_FAILED'
          });
        }
        console.log('reCAPTCHA passed with score:', recaptchaData.score);
      } catch (captchaError) {
        console.warn('reCAPTCHA verification error:', captchaError.message);
        // Continue anyway if reCAPTCHA service fails
      }
    }

    // Try to check rate limiting and store in Vercel KV
    try {
      const { kv } = await import('@vercel/kv');
      
      // Check if email has been used recently (6-month cooldown)
      const emailKey = `email:${normalizedEmail.replace(/[^a-zA-Z0-9@.]/g, '_')}`;
      const existingEntry = await kv.get(emailKey);
      
      if (existingEntry) {
        const lastSubmission = new Date(existingEntry.lastSubmission).getTime();
        const now = Date.now();
        const timeSince = now - lastSubmission;
        
        if (timeSince < SIX_MONTHS_MS) {
          const daysRemaining = Math.ceil((SIX_MONTHS_MS - timeSince) / (24 * 60 * 60 * 1000));
          console.log(`Email ${normalizedEmail} rate limited. ${daysRemaining} days remaining.`);
          return res.status(429).json({ 
            error: `This email has already received a personalized report. You can request another in ${daysRemaining} days.`,
            code: 'RATE_LIMITED',
            daysRemaining
          });
        }
      }
      
      // Create lead record
      const leadId = `lead:${Date.now()}:${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const lead = {
        id: leadId,
        email: normalizedEmail,
        firstName: firstName?.trim() || null,
        archetype: archetype || null,
        secondaryArchetype: secondaryArchetype || null,
        scores: scores || {},
        optIn: optIn === true,
        createdAt: timestamp || new Date().toISOString(),
        source: 'quiz'
      };

      // Store the lead
      await kv.set(leadId, lead);
      await kv.lpush('leads:all', leadId);
      await kv.incr('leads:count');
      
      // Update email tracking for rate limiting
      await kv.set(emailKey, {
        email: normalizedEmail,
        lastSubmission: new Date().toISOString(),
        submissionCount: (existingEntry?.submissionCount || 0) + 1
      });
      
      console.log('Lead stored successfully:', leadId);
    } catch (kvError) {
      // KV not configured - log but don't fail
      console.warn('Vercel KV not available:', kvError.message);
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

