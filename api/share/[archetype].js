// Vercel Serverless Function - Dynamic Share Pages
// Serves OG meta tags for social media with archetype images
// Instantly redirects human visitors to main quiz

const ARCHETYPES = {
  sovereign: {
    name: "The Sovereign",
    title: "Keeper of Sacred Authority",
    image: "the_sovereign.png",
    shareText: "I'm The Sovereign - natural authority meets sacred responsibility. Command with wisdom, lead with purpose."
  },
  devotee: {
    name: "The Devotee",
    title: "Keeper of Sacred Surrender",
    image: "the_devotee.png",
    shareText: "I'm The Devotee - surrender as strength, trust as power. Finding freedom in giving myself completely."
  },
  artisan: {
    name: "The Artisan",
    title: "Master of Sensation",
    image: "the_artisan.png",
    shareText: "I'm The Artisan - crafting sensation into art. Precision, skill, and the beauty of intensity."
  },
  phoenix: {
    name: "The Phoenix",
    title: "Transformed Through Fire",
    image: "the_phoenix.png",
    shareText: "I'm The Phoenix - transformed through intensity. Rising stronger, finding euphoria in surrender to sensation."
  },
  weaver: {
    name: "The Weaver",
    title: "Architect of Beautiful Restraint",
    image: "the_weaver.png",
    shareText: "I'm The Weaver - creating art through restraint. Every knot a meditation, every tie a masterpiece."
  },
  chrysalis: {
    name: "The Chrysalis",
    title: "Transformed Through Stillness",
    image: "the_chrysalis.png",
    shareText: "I'm The Chrysalis - finding freedom in stillness. Bound yet liberated, held yet free."
  },
  luminary: {
    name: "The Luminary",
    title: "Radiant in Witness",
    image: "the_luminary.png",
    shareText: "I'm The Luminary - radiant under the gaze of others. Power in being seen, energy in being witnessed."
  },
  oracle: {
    name: "The Oracle",
    title: "Witness to Mysteries",
    image: "the_oracle.png",
    shareText: "I'm The Oracle - seeing what others miss. The sacred witness, the keeper of unspoken truths."
  },
  apex: {
    name: "The Apex",
    title: "Pure Instinct Unleashed",
    image: "the_apex.png",
    shareText: "I'm The Apex - pure primal instinct. The thrill of pursuit, the joy of capture."
  },
  wild_heart: {
    name: "The Wild Heart",
    title: "Joy in the Chase",
    image: "the_wild_heart.png",
    shareText: "I'm The Wild Heart - alive in the chase. Elusive, untamed, gloriously free."
  },
  guardian: {
    name: "The Guardian",
    title: "Keeper of Souls",
    image: "the_guardian.png",
    shareText: "I'm The Guardian - protector and keeper. Complete ownership, sacred responsibility."
  },
  beloved: {
    name: "The Beloved",
    title: "Treasured and Complete",
    image: "the_beloved.png",
    shareText: "I'm The Beloved - treasured completely. Finding identity in belonging, power in being owned."
  },
  protector: {
    name: "The Protector",
    title: "Tender Authority",
    image: "the_protector.png",
    shareText: "I'm The Protector - nurturing through structure. Gentle guidance, firm boundaries, infinite care."
  },
  innocent: {
    name: "The Innocent",
    title: "Eternal Youth of Spirit",
    image: "the_innocent.png",
    shareText: "I'm The Innocent - wonder preserved. Trust given freely, vulnerability as gift."
  },
  shapeshifter: {
    name: "The Shapeshifter",
    title: "Infinite Expressions",
    image: "the_shapeshifter.png",
    shareText: "I'm The Shapeshifter - fluid between all roles. Today's dominant is tomorrow's devoted. Complete freedom."
  },
  acolyte: {
    name: "The Acolyte",
    title: "Sacred Service",
    image: "the_acolyte.png",
    shareText: "I'm The Acolyte - service as spiritual practice. Devotion expressed through acts of care."
  }
};

// Map URL slugs to archetype keys
const SLUG_MAP = {
  'the-sovereign': 'sovereign',
  'the-devotee': 'devotee',
  'the-artisan': 'artisan',
  'the-phoenix': 'phoenix',
  'the-weaver': 'weaver',
  'the-chrysalis': 'chrysalis',
  'the-luminary': 'luminary',
  'the-oracle': 'oracle',
  'the-apex': 'apex',
  'the-wild-heart': 'wild_heart',
  'the-guardian': 'guardian',
  'the-beloved': 'beloved',
  'the-protector': 'protector',
  'the-innocent': 'innocent',
  'the-shapeshifter': 'shapeshifter',
  'the-acolyte': 'acolyte',
  // Also support direct keys
  'sovereign': 'sovereign',
  'devotee': 'devotee',
  'artisan': 'artisan',
  'phoenix': 'phoenix',
  'weaver': 'weaver',
  'chrysalis': 'chrysalis',
  'luminary': 'luminary',
  'oracle': 'oracle',
  'apex': 'apex',
  'wild_heart': 'wild_heart',
  'wild-heart': 'wild_heart',
  'guardian': 'guardian',
  'beloved': 'beloved',
  'protector': 'protector',
  'innocent': 'innocent',
  'shapeshifter': 'shapeshifter',
  'acolyte': 'acolyte'
};

export default async function handler(req, res) {
  const { archetype: slug } = req.query;
  
  // Normalize slug and look up archetype
  const normalizedSlug = slug?.toLowerCase().replace(/\s+/g, '-');
  const archetypeKey = SLUG_MAP[normalizedSlug];
  const archetype = archetypeKey ? ARCHETYPES[archetypeKey] : null;
  
  // If invalid archetype, redirect to main quiz
  if (!archetype) {
    res.setHeader('Location', 'https://quiz.marquisdemayfair.com');
    return res.status(302).end();
  }
  
  const baseUrl = 'https://quiz.marquisdemayfair.com';
  const imageUrl = `${baseUrl}/archetype-images/${archetype.image}`;
  const pageTitle = `${archetype.name} - ${archetype.title}`;
  const description = `I am ${archetype.name} - ${archetype.title}. Discover your BDSM archetype at Marquis de Mayfair.`;
  
  // Generate HTML with OG tags and instant redirect
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Instant redirect for human visitors -->
  <meta http-equiv="refresh" content="0;url=${baseUrl}">
  
  <!-- Primary Meta Tags -->
  <title>${pageTitle} | Marquis de Mayfair Persona Assessment</title>
  <meta name="title" content="${pageTitle} | Marquis de Mayfair">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/share/${normalizedSlug}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Marquis de Mayfair">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${baseUrl}/share/${normalizedSlug}">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Age Verification -->
  <meta name="rating" content="adult">
  
  <style>
    body {
      background: #0c1c4c;
      color: #f6c541;
      font-family: system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
    }
    a { color: #f6c541; }
  </style>
</head>
<body>
  <div>
    <p>Redirecting to Marquis de Mayfair...</p>
    <p><a href="${baseUrl}">Click here if not redirected</a></p>
  </div>
  <script>window.location.href = "${baseUrl}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  return res.status(200).send(html);
}

