// Vercel Serverless Function - Grok AI Analysis Generation
// Generates comprehensive 1500+ word personalized BDSM psychology report

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
    const { scores, primaryArchetype, secondaryArchetype, dimensions, answers, questions } = req.body;

    // Build comprehensive dimension scores section
    const allDimensionScores = Object.entries(scores || {})
      .sort(([, a], [, b]) => b - a)
      .map(([dim, score]) => {
        const dimInfo = dimensions?.[dim];
        return `- ${dimInfo?.name || dim}: ${score}% ${score >= 70 ? '(HIGH)' : score <= 30 ? '(LOW)' : '(MODERATE)'}`;
      })
      .join('\n');

    // Build answer context - map answers to questions for insight
    let answerContext = '';
    if (answers && questions) {
      const significantAnswers = questions
        .filter(q => answers[q.id] !== undefined)
        .map(q => {
          const answerValue = answers[q.id];
          const intensity = answerValue >= 4 ? 'strongly agrees' : answerValue <= 2 ? 'strongly disagrees' : 'is neutral about';
          return `- "${q.text}" → User ${intensity} (${answerValue}/5)`;
        })
        .slice(0, 20); // Include top 20 most relevant for context
      
      answerContext = significantAnswers.join('\n');
    }

    // Build product recommendations section
    const products = primaryArchetype?.suggestedProducts || [];
    const productContext = products.map(p => 
      `- ${p.name}: ${p.reason} (URL: https://www.marquisdemayfair.com${p.url})`
    ).join('\n');

    const prompt = `You are the Marquis de Mayfair, an elegant, sophisticated psychologist specializing in BDSM power dynamics, intimate psychology, and sexual self-discovery. You write with the insight of a master therapist combined with the wit of a luxury brand—think Esther Perel meets Tom Ford, with the psychological depth of Carl Jung.

You are writing a COMPREHENSIVE PERSONALIZED REPORT for someone who has just completed your psychometric assessment. This is the most important deliverable of the quiz—make it feel like a profound, transformative reading that reveals truths about themselves they may have sensed but never articulated.

=== ASSESSMENT RESULTS ===

**PRIMARY ARCHETYPE:** ${primaryArchetype?.name} - "${primaryArchetype?.title}"
Historical Parallel: ${primaryArchetype?.historical}
Mythological Connection: ${primaryArchetype?.mythological}

**SECONDARY ARCHETYPE:** ${secondaryArchetype?.name} - "${secondaryArchetype?.title}"

**ALL DIMENSION SCORES (16 Dimensions):**
${allDimensionScores}

**SAMPLE OF USER'S ACTUAL RESPONSES:**
${answerContext || 'Response data not available'}

**RECOMMENDED PRODUCTS FOR THIS ARCHETYPE:**
${productContext}

=== YOUR TASK ===

Write a deeply personalized, psychologically rich report of AT LEAST 1500 WORDS structured in these sections:

---

## 1. YOUR CORE IDENTITY: The ${primaryArchetype?.name} (400+ words)

Begin with a powerful opening that makes the reader feel truly SEEN. Use cold reading techniques—specific enough to feel personal, universal enough to resonate. Explain:
- What it means to embody this archetype at their core
- The historical figure (${primaryArchetype?.historical}) connection—what traits do they share? How does this historical parallel illuminate their nature?
- The mythological archetype (${primaryArchetype?.mythological})—what ancient wisdom does this reveal about their role in power dynamics?
- Why their specific combination of high/low dimension scores created this archetype result
- What they've probably always sensed about themselves that this confirms

---

## 2. YOUR PSYCHOLOGICAL LANDSCAPE (400+ words)

Analyze their dimension scores in depth. For their TOP 3 highest dimensions and their LOWEST dimension:
- What does each score reveal about their inner world?
- How do these dimensions interact and create their unique psychological fingerprint?
- What internal tensions or harmonies exist between their high and low scores?
- Use specific language: "Your ${Object.entries(scores || {}).sort(([,a],[,b]) => b - a)[0]?.[0] || 'dominant'} score of ${Object.entries(scores || {}).sort(([,a],[,b]) => b - a)[0]?.[1] || 0}% suggests..."
- Reference their actual answers where relevant to show you understand their specific responses

---

## 3. YOUR RELATIONAL DYNAMICS (300+ words)

How do they show up in intimate relationships and power exchange dynamics?
- What kind of partner brings out their best?
- What are their gifts in BDSM contexts?
- How do they communicate desire and boundaries?
- What do partners experience when in dynamic with them?
- Their secondary archetype (${secondaryArchetype?.name}) influence—how does this add nuance?

---

## 4. SHADOW WORK & GROWTH PATH (200+ words)

Every archetype has shadow aspects:
- What are the potential pitfalls or blind spots of their configuration?
- What might they need to integrate or develop?
- How can they evolve into the fullest expression of their archetype?
- What practices or awareness could support their growth?

---

## 5. YOUR CURATED COLLECTION: Tools for Your Journey (200+ words)

Introduce the products as sacred tools for their exploration. For EACH of the ${products.length} products:
- Name the product and explain WHY it specifically suits their archetype
- How would someone with their psychological profile USE this item?
- What experiences or states might it facilitate for them specifically?
- Include the full URL for each product

Products to recommend:
${productContext}

---

=== WRITING GUIDELINES ===

TONE: 
- Warm, insightful, literary, unapologetically sexual and adult
- Use BDSM terminology naturally (Dom, sub, scene, play, power exchange, dynamic, etc.)
- Sex-positive and affirming—celebrate their configuration
- Cold reading style: "You have probably always felt..." "Others may have told you..." "There's a quality in you that..."

STYLE:
- Second person throughout ("You...")
- Rich, evocative language
- Specific details that feel personal
- Psychological depth without jargon
- Sensual and sophisticated

CRITICAL REQUIREMENTS:
- AT LEAST 1500 words total
- Reference specific dimension scores by name and percentage
- Include ALL product recommendations with URLs
- Make it feel like a genuine psychological reading, not a template
- Every paragraph should feel personally relevant to THIS user's results

Begin the report now:`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: 'You are the Marquis de Mayfair, an elegant master of BDSM psychology and intimate power dynamics. You write comprehensive, deeply personalized psychological reports that combine clinical insight with literary sophistication. Your reports are thorough (1500+ words), sexually explicit when appropriate, and make readers feel profoundly understood. You always include specific product recommendations with full URLs and detailed explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.85
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Grok API error:', response.status, errorData);
      return res.status(200).json({ 
        error: 'AI service error',
        details: `Status: ${response.status}, Response: ${errorData.substring(0, 500)}`,
        fallback: true 
      });
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content || '';

    if (!analysisText) {
      return res.status(200).json({
        error: 'Empty response from AI',
        details: JSON.stringify(data).substring(0, 500),
        fallback: true
      });
    }

    return res.status(200).json({ 
      analysis: analysisText,
      model: 'grok-3',
      wordCount: analysisText.split(/\s+/).length
    });

  } catch (error) {
    console.error('Generate analysis error:', error);
    return res.status(200).json({ 
      error: 'Failed to generate analysis',
      details: error.message,
      fallback: true
    });
  }
}
