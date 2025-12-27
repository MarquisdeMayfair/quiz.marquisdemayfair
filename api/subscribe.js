// Vercel Serverless Function - Email Subscription
// Stores leads in Vercel KV with full quiz data
// Syncs to Shopify Customers with tags
// Includes reCAPTCHA verification and 6-month rate limiting

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 months in milliseconds

// Sync customer to Shopify
async function syncToShopify(email, firstName, archetype, secondaryArchetype) {
  const shopifyUrl = process.env.SHOPIFY_STORE_URL;
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  
  console.log('Shopify sync starting for:', email);
  console.log('Shopify URL configured:', shopifyUrl ? 'YES' : 'NO');
  console.log('Shopify Token configured:', accessToken ? 'YES (length: ' + accessToken.length + ')' : 'NO');
  
  if (!shopifyUrl || !accessToken) {
    console.log('Shopify credentials not configured, skipping sync');
    return;
  }
  
  try {
    // Build tags array
    const tags = ['quiz-lead'];
    if (archetype) {
      tags.push(`archetype-${archetype.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
    }
    if (secondaryArchetype) {
      tags.push(`secondary-${secondaryArchetype.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
    }
    
    const apiBase = `https://${shopifyUrl}/admin/api/2024-01`;
    const headers = {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    };
    
    console.log('Shopify API base:', apiBase);
    
    // Search for existing customer by email
    const searchRes = await fetch(
      `${apiBase}/customers/search.json?query=email:${encodeURIComponent(email)}`,
      { headers }
    );
    
    console.log('Shopify search response status:', searchRes.status);
    const searchData = await searchRes.json();
    console.log('Shopify search result:', JSON.stringify(searchData).substring(0, 500));
    
    if (searchData.customers && searchData.customers.length > 0) {
      // Customer exists - update their tags
      const customer = searchData.customers[0];
      const existingTags = customer.tags ? customer.tags.split(', ').filter(t => t) : [];
      
      // Merge tags (avoid duplicates)
      const allTags = [...new Set([...existingTags, ...tags])];
      
      // Update customer
      const updateRes = await fetch(`${apiBase}/customers/${customer.id}.json`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          customer: {
            id: customer.id,
            tags: allTags.join(', '),
            // Update first name if provided and customer doesn't have one
            ...(firstName && !customer.first_name ? { first_name: firstName } : {})
          }
        })
      });
      
      if (updateRes.ok) {
        console.log(`Shopify: Updated existing customer ${customer.id} with tags: ${allTags.join(', ')}`);
      } else {
        const errorData = await updateRes.json();
        console.warn('Shopify update error:', errorData);
      }
    } else {
      // Create new customer
      const createRes = await fetch(`${apiBase}/customers.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customer: {
            email: email,
            first_name: firstName || '',
            tags: tags.join(', '),
            email_marketing_consent: {
              state: 'subscribed',
              opt_in_level: 'single_opt_in',
              consent_updated_at: new Date().toISOString()
            }
          }
        })
      });
      
      if (createRes.ok) {
        const newCustomer = await createRes.json();
        console.log(`Shopify: Created new customer ${newCustomer.customer?.id} with tags: ${tags.join(', ')}`);
      } else {
        const errorData = await createRes.json();
        console.warn('Shopify create error:', errorData);
      }
    }
  } catch (shopifyError) {
    console.error('Shopify sync error:', shopifyError.message);
    // Don't throw - we don't want to fail the subscription if Shopify is down
  }
}

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

    // Sync to Shopify (wait for it to complete)
    try {
      await syncToShopify(normalizedEmail, firstName, archetype, secondaryArchetype);
      console.log('Shopify sync completed');
    } catch (shopifyErr) {
      console.error('Shopify sync failed:', shopifyErr.message);
      // Don't fail the request if Shopify fails
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

