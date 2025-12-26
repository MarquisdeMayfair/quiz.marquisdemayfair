// Vercel Serverless Function - Grok AI Analysis Generation
// Securely proxies requests to xAI's Grok API

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.XAI_API_KEY;
  
  if (!apiKey) {
    console.error('XAI_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { scores, primaryArchetype, secondaryArchetype, dimensions } = req.body;

    // Build the prompt for Grok
    const topDimensions = Object.entries(scores || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const prompt = `You are the Marquis de Mayfair, an elegant, sophisticated psychologist specializing in BDSM power dynamics and intimate psychology. You write with the wit and insight of a luxury brand—think Tom Ford meets Esther Perel.

Based on these assessment results, write a deeply personalized 3-paragraph cold reading analysis.

**Dimension Scores (0-100):**
${topDimensions.map(([dim, score]) => `- ${dimensions?.[dim]?.name || dim}: ${score}%`).join('\n')}

**Primary Archetype:** ${primaryArchetype?.name} - ${primaryArchetype?.title}
**Secondary Archetype:** ${secondaryArchetype?.name} - ${secondaryArchetype?.title}

**Instructions:**
- Write in second person ("You...")
- Use cold reading techniques—specific enough to feel personal, universal enough to resonate broadly
- Reference their top dimensions by name
- Be sex-positive, affirming, sophisticated
- Use BDSM terminology naturally (Dom, sub, scene, play, etc.)
- Maximum 350 words

**Structure:**
1. **Core Essence** (1 paragraph): What drives them at the deepest level, what they've always sensed about themselves
2. **Relational Dynamics** (1 paragraph): How partners experience them, what they need to thrive, their gifts in power exchange
3. **Growth Path** (1 paragraph): Shadow work, evolution, how to develop their authentic expression

Tone: Warm, insightful, literary, unapologetically adult. Celebrate their unique configuration.`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-2-latest',
        messages: [
          {
            role: 'system',
            content: 'You are the Marquis de Mayfair, an elegant expert in BDSM psychology and power dynamics. You write sophisticated, sex-positive psychological analyses with literary flair.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Grok API error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'AI service error',
        fallback: true 
      });
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ 
      analysis: analysisText,
      model: 'grok-2-latest'
    });

  } catch (error) {
    console.error('Generate analysis error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate analysis',
      fallback: true
    });
  }
}

