import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const { 
      email, 
      archetype, 
      archetypeTitle,
      scores,
      priceId = 'price_1SjmpuCew9W9Vmz4D5m9V4pe' // Default to PDF price
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://quiz.marquisdemayfair.com'}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'https://quiz.marquisdemayfair.com'}/?payment=cancelled`,
      metadata: {
        email: email,
        archetype: archetype || '',
        archetypeTitle: archetypeTitle || '',
        purchaseType: 'pdf_report',
        scores: scores ? JSON.stringify(scores).substring(0, 500) : '', // Stripe metadata limit
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}

