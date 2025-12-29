import Stripe from 'stripe';
import { kv } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Stripe needs raw body for signature verification
  },
};

// Helper to get raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      console.log('Payment successful!', {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
        paymentStatus: session.payment_status,
      });

      // Get the metadata we stored during checkout
      const metadata = session.metadata || {};
      const customerEmail = session.customer_details?.email || metadata.email;
      const archetype = metadata.archetype;
      const purchaseType = metadata.purchaseType; // 'pdf', 'pdf_guide', 'giftcard_99', 'giftcard_250'

      // Store the purchase in Vercel KV
      const purchase = {
        sessionId: session.id,
        email: customerEmail,
        archetype: archetype,
        purchaseType: purchaseType,
        amountTotal: session.amount_total / 100, // Convert from pence to pounds
        currency: session.currency,
        paymentStatus: session.payment_status,
        timestamp: new Date().toISOString(),
        lineItems: metadata.lineItems || '',
      };

      // Save to KV database
      const purchaseKey = `purchase:${session.id}`;
      await kv.set(purchaseKey, JSON.stringify(purchase));

      // Mark customer as paid for PDF
      const paidKey = `paid:${customerEmail}`;
      await kv.set(paidKey, JSON.stringify({
        paid: true,
        purchaseType: purchaseType,
        timestamp: new Date().toISOString(),
        sessionId: session.id
      }));

      // Add to purchases list for the email
      const emailPurchasesKey = `purchases:${customerEmail}`;
      const existingPurchases = await kv.get(emailPurchasesKey) || '[]';
      const purchases = JSON.parse(existingPurchases);
      purchases.push(purchase);
      await kv.set(emailPurchasesKey, JSON.stringify(purchases));

      // Track total purchases
      const totalKey = 'stats:total_purchases';
      const currentTotal = await kv.get(totalKey) || 0;
      await kv.set(totalKey, currentTotal + 1);

      // Track revenue
      const revenueKey = 'stats:total_revenue';
      const currentRevenue = await kv.get(revenueKey) || 0;
      await kv.set(revenueKey, currentRevenue + (session.amount_total / 100));

      console.log('Purchase recorded:', purchaseKey);

      // TODO: If this is a gift card purchase, generate/assign a voucher code
      // TODO: Send confirmation email with PDF download link or voucher code
    }

    // Return success
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

