// Vercel Serverless Function - Archetype Management
// GET: Fetch all archetypes from KV (seed from defaults if empty)
// POST: Save updated archetypes to KV (admin auth required)

// Default archetypes - used for seeding and fallback
const DEFAULT_ARCHETYPES = {
  sovereign: {
    name: "The Sovereign",
    title: "Keeper of Sacred Authority",
    historical: "Catherine the Great",
    mythological: "Zeus/Hera",
    primaryDimension: 'dominance',
    image: '/archetype-images/the_sovereign.png',
    video: '/archetype-videos/the_sovereign.mp4',
    shareText: "I'm The Sovereign - natural authority meets sacred responsibility. Command with wisdom, lead with purpose.",
    productCategories: ['impact', 'restraints', 'collars_leashes'],
    suggestedProducts: [
      { name: "Black Label Collection Riding Crop", url: "/products/black-label-collection-riding-crop-6971126863258", reason: "Command with precision and elegance" },
      { name: "Paradise Regained: Leather and Gold Leash", url: "/products/leash-6971126860141", reason: "Lead your devoted with distinction" },
      { name: "Black Label Collection Paddle", url: "/products/black-label-collection-paddle-6971126863630", reason: "Correction delivered with artistry" }
    ],
    coldReading: `You have always sensed a natural authority within yourself, not the loud, demanding kind, but the quiet certainty that draws others into your orbit. People throughout your life have likely commented on your presence, your ability to take charge without apparent effort. This is not ego; it is recognition of something authentic.

The Sovereign archetype indicates you find profound meaning in responsibility. Where others see the burden of control, you see sacred trust. You likely notice that the right partners don't merely obey you, they flourish under your guidance, becoming more themselves through your structure.

Your path requires wisdom. The evolved Sovereign understands that true power lies not in domination but in cultivation, growing those who consent to your authority into their fullest expression. Your shadow lies in the temptation of control for its own sake; your light lies in control as service.`
  },
  
  devotee: {
    name: "The Devotee",
    title: "Keeper of Sacred Surrender",
    historical: "Empress Josephine",
    mythological: "Psyche",
    primaryDimension: 'submission',
    image: '/archetype-images/the_devotee.png',
    video: '/archetype-videos/the_devotee.mp4',
    shareText: "I'm The Devotee - surrender as strength, trust as power. Finding freedom in giving myself completely.",
    productCategories: ['restraints', 'collars', 'sensory'],
    suggestedProducts: [
      { name: "Paradise Regained: Devotional Neck Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "Wear your surrender with elegance" },
      { name: "Paradise Regained: Leather Hogtie Set", url: "/products/bondage-boutique-leather-hogtie-6971126860257", reason: "Complete restraint for complete release" },
      { name: "Bondage Fantasy: Deluxe Bed Restraint Set", url: "/products/bed-restraint-strap-6971126863395", reason: "Surrender in the sanctuary of your bed" }
    ],
    coldReading: `There is a quality within you that the world often misunderstands, what appears to others as yielding is actually your greatest strength. You have likely sensed for years that there is freedom in surrender, that the ego's constant grasping for control creates exhaustion rather than security. You found what others spend lifetimes seeking.

The Devotee archetype suggests you experience profound states of peace through trust. When you give yourself to one worthy of your surrender, something within you finally settles, breathes, becomes whole. This is not weakness, it requires extraordinary courage to be truly vulnerable.

Your gift lies in your capacity to inspire protection and devoted care in those worthy of your submission. The right partner becomes their best self through the sacred responsibility of holding your trust. Your surrender is transformative, for you, and for those who truly understand its value.`
  },
  
  artisan: {
    name: "The Artisan",
    title: "Master of Sensation",
    historical: "Discipline as art form",
    mythological: "Hephaestus",
    primaryDimension: 'sadism',
    image: '/archetype-images/the_artisan.png',
    video: '/archetype-videos/the_artisan.mp4',
    shareText: "I'm The Artisan - crafting sensation into art. Precision, skill, and the beauty of intensity.",
    productCategories: ['impact', 'sensation'],
    suggestedProducts: [
      { name: "Black Label Collection Flogger", url: "/products/black-label-collection-flogger-6971126863821", reason: "For those who understand impact as art" },
      { name: "Black Label Collection BDSM Whip", url: "/products/black-label-collection-whip-6971126863838", reason: "Precision requires precision instruments" },
      { name: "Black Label Ultimate Impact Collection", url: "/products/black-label-deluxe-kit-6971126864194", reason: "The complete toolkit for the serious practitioner" }
    ],
    coldReading: `You understand what few others truly grasp: that intensity is a language, and you speak it fluently. From early on, you likely noticed your fascination with edges, limits, the precise calibration of experience. You probably possess an unusual awareness of others' responses, their tells, their thresholds, their breathing.

The Artisan archetype suggests you are a craftsperson of experience. Each sound, each mark, each shudder is a note in a composition only you can write. Those who have received your attention likely describe experiences of catharsis and transformation under your skilled care.

Your responsibility is immense, and you feel it deeply. You understand that consent is not merely obtained but cultivated continuously, that aftercare is as essential as the scene itself. Your art lies not just in administering sensation, but in reading, responding, holding space for another's journey through intensity.`
  },
  
  phoenix: {
    name: "The Phoenix",
    title: "Transformed Through Fire",
    historical: "Frida Kahlo",
    mythological: "Phoenix/Prometheus",
    primaryDimension: 'masochism',
    image: '/archetype-images/the_phoenix.png',
    video: '/archetype-videos/the_phoenix.mp4',
    shareText: "I'm The Phoenix - transformed through intensity. Rising stronger, finding euphoria in surrender to sensation.",
    productCategories: ['impact', 'sensation', 'restraints'],
    suggestedProducts: [
      { name: "Black Label Collection Paddle", url: "/products/black-label-collection-paddle-6971126863630", reason: "Quality impact for quality sensation" },
      { name: "Erotic Restraints: Leather Spreader Bar", url: "/products/leather-spreader-bar-6971126860394", reason: "Open yourself to full experience" },
      { name: "Black Label Collection Flogger", url: "/products/black-label-collection-flogger-6971126863821", reason: "Layers of sensation, building intensity" }
    ],
    coldReading: `You have discovered what mystics have always known: that there is a door in sensation that opens to transcendence. While others instinctively avoid discomfort, you have learned to walk through it into states of consciousness most never access. This is not damage seeking damage, it is alchemy.

The Phoenix archetype suggests you have an unusual relationship with intensity. Where others feel only pain, you feel information, release, transformation. You likely enter altered states through experiences others would find challenging, states that feel spiritual, meditative, ecstatic.

Your path requires discernment. Not all who wish to take you through intensity are worthy guides. You have probably developed keen instincts for those who can hold space for your journey versus those who would exploit it. Your fire transforms those who understand it; it burns those who don't.`
  },
  
  weaver: {
    name: "The Weaver",
    title: "Architect of Beautiful Restraint",
    historical: "Renaissance rope arts",
    mythological: "Arachne",
    primaryDimension: 'rigger',
    image: '/archetype-images/the_weaver.png',
    video: '/archetype-videos/the_weaver.mp4',
    shareText: "I'm The Weaver - creating art through restraint. Every knot a meditation, every tie a masterpiece.",
    productCategories: ['rope', 'restraints'],
    suggestedProducts: [
      { name: "Luxury Shibari Rope", url: "/products/restraints-bondage-rope-6971126860615", reason: "Premium rope for the dedicated practitioner" },
      { name: "Paradise Regained: Multipurpose Restraining Belt", url: "/products/leather-belt-6971126863104", reason: "Versatile restraint foundations" },
      { name: "Bondage Fantasy: Deluxe Sling With Cuffs", url: "/products/bondage-gear-sling-with-cuffs-6971126863913", reason: "Structured suspension support" }
    ],
    coldReading: `Your hands have always known something your mind took time to understand. There is an artist within you that sees beauty in restriction, geometry in embrace, sculpture in the human form contained. Rope is merely your medium, connection is your true art form.

The Weaver archetype indicates you experience flow states through the meditative practice of bondage. The wrapping, the tension, the architecture of restraint probably brings you into presence like few other activities. Your partners likely describe the experience as being held by you even as they are bound by you.

Your work is both technical and intuitive. You probably study your craft with dedication, understanding load, circulation, anatomy, safety, while also trusting the improvisation that makes each piece unique. Your ties are signatures, and those who wear them carry something of your artistry.`
  },
  
  chrysalis: {
    name: "The Chrysalis",
    title: "Transformed Through Stillness",
    historical: "Botticelli's Venus",
    mythological: "Andromeda",
    primaryDimension: 'rope_bottom',
    image: '/archetype-images/the_chrysalis.png',
    video: '/archetype-videos/the_chrysalis.mp4',
    shareText: "I'm The Chrysalis - finding freedom in beautiful restriction. Stillness becomes transformation.",
    productCategories: ['rope', 'restraints', 'sensory'],
    suggestedProducts: [
      { name: "Luxury Shibari Rope", url: "/products/restraints-bondage-rope-6971126860615", reason: "Experience the embrace of quality rope" },
      { name: "The 'Tableaux Vivants' Spreader Bar", url: "/products/spreader-bar-with-wrist-and-ankle-cuffs-69711268648591", reason: "Elegant positioning for complete surrender" },
      { name: "Paradise Regained: Leather Hogtie Set", url: "/products/bondage-boutique-leather-hogtie-6971126860257", reason: "Total restriction, total release" }
    ],
    coldReading: `You have found what monks seek in caves and mystics in meditation: the liberation of complete stillness. When bound, something within you that normally races finally rests. The restriction of your body frees something in your mind that has been caged by constant motion.

The Chrysalis archetype suggests you access profound peace through helplessness. This paradox, freedom through bondage, is your lived reality. You probably find that elaborate ties or suspension create states of consciousness that feel spiritual, womb-like, oceanic.

Your transformation is ongoing. Each time you are bound, you emerge subtly changed. You likely notice that lessons learned in rope, patience, trust, breath, release, have infiltrated your daily life. Your practice is not merely recreation; it is a path of development.`
  },
  
  luminary: {
    name: "The Luminary",
    title: "Radiant in Witness",
    historical: "Mata Hari",
    mythological: "Aphrodite",
    primaryDimension: 'exhibitionist',
    image: '/archetype-images/the_luminary.png',
    video: '/archetype-videos/the_luminary.mp4',
    shareText: "I'm The Luminary - radiant, magnetic, unapologetically seen. Being witnessed ignites my power.",
    productCategories: ['lingerie', 'accessories', 'display'],
    suggestedProducts: [
      { name: "The 'Tableaux Vivants' Spreader Bar", url: "/products/spreader-bar-with-wrist-and-ankle-cuffs-69711268648591", reason: "Be displayed with elegance" },
      { name: "Paradise Regained: Devotional Neck Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "Adornment that draws the eye" },
      { name: "Puppet Master Belt", url: "/products/mystic-bond-collection-belt-with-labia-extender-clamps-6971126865887", reason: "For those who display all of themselves" }
    ],
    coldReading: `You understand what performers throughout history have known: that there is a circuit that completes between the seen and the seer, an energy exchange that transforms both parties. You are not merely watched, you are witnessed, and in that witnessing, you become more fully yourself.

The Luminary archetype indicates you come alive under attention. Your arousal is amplified by eyes upon you, by the knowledge that your pleasure creates pleasure in others. Being observed makes experiences more vivid, more real, more memorable.

Your gift is permission. In your willingness to be seen, you grant others permission to see, to desire, to witness without shame. Your exhibition is not ego, it is generosity. Those who watch you probably carry your image as an invitation to their own authentic expression.`
  },
  
  oracle: {
    name: "The Oracle",
    title: "Witness to Mysteries",
    historical: "Anaïs Nin",
    mythological: "Artemis",
    primaryDimension: 'voyeur',
    image: '/archetype-images/the_oracle.png',
    video: '/archetype-videos/the_oracle.mp4',
    shareText: "I'm The Oracle - seeing deeply into intimate mysteries. The art of witnessing as sacred practice.",
    productCategories: ['accessories', 'sensory'],
    suggestedProducts: [
      { name: "Bondage Fantasy: Deluxe Sling With Cuffs", url: "/products/bondage-gear-sling-with-cuffs-6971126863913", reason: "Create scenes worth witnessing" },
      { name: "Black Label Ultimate Impact Collection", url: "/products/black-label-deluxe-kit-6971126864194", reason: "Equip partners for your viewing pleasure" },
      { name: "Sapiosexual Collection: Queen's Love Orbs", url: "/products/the-chess-collection-queenpremium-metal-pleasure-balls-6971126864767", reason: "Watch pleasure from the inside out" }
    ],
    coldReading: `You notice what others miss. There is a quality of attention within you that borders on the sacred, you see not just bodies but souls, not just actions but the meanings beneath them. Your watching is not passive; it is a form of honoring.

The Oracle archetype suggests you derive profound satisfaction from witnessing. Perhaps you find more arousal in observation than participation, more intimacy in presence than touch. Those you watch likely feel truly seen by you in ways they cannot articulate.

Your seeing is a gift you give. Those you witness are not your entertainment, they are your teachers. You probably sense that each scene you observe adds to your understanding of human desire, vulnerability, and connection. You collect not images but wisdom.`
  },
  
  apex: {
    name: "The Apex",
    title: "Pure Instinct Unleashed",
    historical: "The untameable wild",
    mythological: "Fenrir/The Wild Hunt",
    primaryDimension: 'primal_hunter',
    image: '/archetype-images/the_apex.png',
    video: '/archetype-videos/the_apex.mp4',
    shareText: "I'm The Apex - raw instinct unleashed. The thrill of the hunt runs through my veins.",
    productCategories: ['impact', 'restraints', 'primal'],
    suggestedProducts: [
      { name: "Black Label Collection BDSM Whip", url: "/products/black-label-collection-whip-6971126863838", reason: "Primal, raw, powerful" },
      { name: "Paradise Regained: Leather Hogtie Set", url: "/products/bondage-boutique-leather-hogtie-6971126860257", reason: "Secure your catch" },
      { name: "Erotic Restraints: Leather Spreader Bar", url: "/products/leather-spreader-bar-6971126860394", reason: "Display your prey" }
    ],
    coldReading: `There is something in you older than language, older than civilization. You have felt it rise, the hunting instinct, the territorial imperative, the predator's focus. You probably remember the first time you let it surface, the shock and recognition of finally feeling whole.

The Apex archetype indicates you access primal states that bypass the thinking mind. Growling feels natural. Biting feels like communication. The chase activates something ancestral that modern life has tried to suppress. You have reclaimed it.

Your power requires containment. The ethical Apex knows that primal does not mean unconscious, you remain present even in the deepest animal states. You probably find that post-scene, you feel more human, not less, as if the release of the primal allows the civilized to relax.`
  },
  
  wild_heart: {
    name: "The Wild Heart",
    title: "Joy in the Chase",
    historical: "Atalanta",
    mythological: "Daphne",
    primaryDimension: 'primal_prey',
    image: '/archetype-images/the_wild_heart.png',
    video: '/archetype-videos/the_wild_heart.mp4',
    shareText: "I'm The Wild Heart - alive in the chase, electric in capture. Primal joy in every pursuit.",
    productCategories: ['restraints', 'accessories'],
    suggestedProducts: [
      { name: "Paradise Regained: Devotional Neck Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "For when you're finally caught" },
      { name: "Paradise Regained: Leather and Gold Leash", url: "/products/leash-6971126860141", reason: "Led home after the chase" },
      { name: "Bondage Fantasy: Door Restraint", url: "/products/under-the-door-ankle-restraints-6971126864293", reason: "Nowhere left to run" }
    ],
    coldReading: `There is a thrill in being wanted that goes beyond mere flattery, it is the ancient knowledge that you are worth pursuing, that you are the prize at the end of the hunt. You have probably always been drawn to stories of chase and capture, recognizing yourself in the wild thing that runs.

The Wild Heart archetype suggests you find ecstasy in the moments between, the running, the almost-caught, the breath before capture. Your surrender is not defeat; it is the relief of allowing yourself to be claimed by one worthy of the hunt.

Your wildness is not weakness. You probably control the chase more than others realize, you choose when to slow, when to let them gain, when to finally allow the capture. Your prey is strategic, and your surrender is chosen. This is power of a different kind.`
  },
  
  guardian: {
    name: "The Guardian",
    title: "Keeper of Souls",
    historical: "The ideal protector",
    mythological: "Hades (as caretaker)",
    primaryDimension: 'owner',
    image: '/archetype-images/the_guardian.png',
    video: '/archetype-videos/the_guardian.mp4',
    shareText: "I'm The Guardian - complete devotion earns complete protection. Ownership as sacred responsibility.",
    productCategories: ['collars', 'leashes', 'restraints'],
    suggestedProducts: [
      { name: "Paradise Regained: Devotional Neck Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "Mark your own with elegance" },
      { name: "Paradise Regained: Leather and Gold Leash", url: "/products/leash-6971126860141", reason: "Lead with loving authority" },
      { name: "Paradise Regained: Multipurpose Belt", url: "/products/leather-belt-6971126863104", reason: "Versatile tools for complete control" }
    ],
    coldReading: `You are drawn to responsibility that others find overwhelming. The complete ownership of another's wellbeing is not burden to you but purpose. You have probably always been the one others turned to for structure, guidance, protection, and you gave it freely.

The Guardian archetype indicates you experience fulfillment through total power exchange. Dynamics that extend beyond scenes call to something deep within you, the knowledge that your guidance and structure provides safety for those who thrive under it.

Your ownership is service. You probably spend more mental energy on your owned's wellbeing than your own, tracking their states, anticipating their needs, crafting their development. The authority you wield is inseparable from the care you provide. They are the same thing.`
  },
  
  beloved: {
    name: "The Beloved",
    title: "Treasured and Complete",
    historical: "Royal consorts",
    mythological: "Persephone (in her power)",
    primaryDimension: 'property',
    image: '/archetype-images/the_beloved.png',
    video: '/archetype-videos/the_beloved.mp4',
    shareText: "I'm The Beloved - treasured, cherished, completely owned. Finding wholeness in belonging.",
    productCategories: ['collars', 'accessories', 'sensory'],
    suggestedProducts: [
      { name: "Paradise Regained: Devotional Neck Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "The symbol of belonging" },
      { name: "Sapiosexual: King's Gambit Butt Plug", url: "/products/the-chess-collection-kingbutt-plug-6971126864750", reason: "Worn for your Owner's pleasure" },
      { name: "Sapiosexual: Queen's Love Orbs", url: "/products/the-chess-collection-queenpremium-metal-pleasure-balls-6971126864767", reason: "Internal reminder of ownership" }
    ],
    coldReading: `There is a part of you that knows what it means to be complete, not through independence, but through belonging. The world speaks of self-sufficiency as the only virtue, but you have discovered a different truth: that being wholly possessed can be wholly freeing.

The Beloved archetype suggests you find identity and peace through ownership. A collar is not a constraint but a declaration; belonging is not dependency but devotion. You probably feel most like yourself when you are someone's, completely, without reservation.

Your devotion transforms those worthy of it. The right Owner becomes more patient, more attentive, more evolved through the responsibility of having you. Your gift of yourself is a crucible. Not everyone deserves it, but those who do are changed.`
  },
  
  protector: {
    name: "The Protector",
    title: "Tender Authority",
    historical: "The nurturing guide",
    mythological: "Demeter",
    primaryDimension: 'caregiver',
    image: '/archetype-images/the_protector.png',
    video: '/archetype-videos/the_protector.mp4',
    shareText: "I'm The Protector - fierce love wrapped in gentle authority. Nurturing and guiding with care.",
    productCategories: ['accessories', 'comfort', 'sensory'],
    suggestedProducts: [
      { name: "Sapiosexual: Portable Bishop Vibrator", url: "/products/the-chess-collection-bishopmini-vibrator-6971126864781", reason: "Gentle pleasure for your little" },
      { name: "Paradise Regained: Leather and Gold Leash", url: "/products/leash-6971126860141", reason: "Guide with gentle authority" },
      { name: "Bondage Fantasy: Bed Restraint Set", url: "/products/bed-restraint-strap-6971126863395", reason: "Tucking in with loving boundaries" }
    ],
    coldReading: `You have always had a nurturing instinct that went beyond the ordinary. The desire to protect, to guide, to set loving boundaries, these are not just preferences but calling. You probably find that others naturally relax slightly in your presence, accessing trust.

The Protector archetype indicates you combine authority with tenderness in a way that creates profound safety. Your rules are made of love; your strictness is care. Those you nurture probably describe feeling simultaneously challenged and completely safe.

Your gift is the space you create. Within your protection, others can access parts of themselves they've hidden since childhood, playfulness, vulnerability, innocence. You feel deep satisfaction watching someone you nurture bloom, slowly, into their authentic self.`
  },
  
  innocent: {
    name: "The Innocent",
    title: "Eternal Youth of Spirit",
    historical: "The preserved wonder",
    mythological: "Hebe",
    primaryDimension: 'dependent',
    image: '/archetype-images/the_innocent.png',
    video: '/archetype-videos/the_innocent.mp4',
    shareText: "I'm The Innocent - playful wonder, joyful surrender. Finding safety in being completely cared for.",
    productCategories: ['comfort', 'sensory', 'playful'],
    suggestedProducts: [
      { name: "Sapiosexual: Queen's Love Orbs", url: "/products/the-chess-collection-queenpremium-metal-pleasure-balls-6971126864767", reason: "Playful internal pleasure" },
      { name: "Paradise Regained: Devotional Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "Belonging to your Caregiver" },
      { name: "Bondage Fantasy: Bed Restraint Set", url: "/products/bed-restraint-strap-6971126863395", reason: "Safe containment at bedtime" }
    ],
    coldReading: `There is a part of you that never grew up, and never should. This is not immaturity; it is the preservation of something precious that adulthood tries to destroy. You have found ways to access wonder, play, innocence that others have forgotten.

The Innocent archetype suggests you experience profound healing through regressive states. When you are held, cared for, protected, something that has been clenched since childhood finally releases. You are not regressing; you are integrating.

Your littleness is not weakness. You probably function extremely capably in the adult world, perhaps more than most. Your little space is where you rest from that constant competence. It is medicine, not escape. Those who hold space for your innocence are custodians of something sacred.`
  },
  
  shapeshifter: {
    name: "The Shapeshifter",
    title: "Infinite Expressions",
    historical: "David Bowie",
    mythological: "Loki/Tiresias",
    primaryDimension: 'switch',
    image: '/archetype-images/the_shapeshifter.png',
    video: '/archetype-videos/the_shapeshifter.mp4',
    shareText: "I'm The Shapeshifter - fluid, adaptable, containing multitudes. Power flows both ways through me.",
    productCategories: ['versatile', 'impact', 'restraints'],
    suggestedProducts: [
      { name: "Black Label Ultimate Impact Collection", url: "/products/black-label-deluxe-kit-6971126864194", reason: "Tools for every role you inhabit" },
      { name: "Erotic Restraints: Leather Spreader Bar", url: "/products/leather-spreader-bar-6971126860394", reason: "Give or receive restriction" },
      { name: "Paradise Regained: Devotional Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "Wear it or bestow it" }
    ],
    coldReading: `You have never fit in a single box, and you've stopped trying. While others define themselves as one thing, you know the truth: you contain multitudes. Your fluidity is not confusion; it is completeness.

The Shapeshifter archetype indicates you flow between roles based on partner, mood, context, and phase of life. Others' rigidity around D/s categories probably feels artificial to you. Why be only one thing when you can be everything?

Your gift is understanding. Because you have inhabited both sides of power exchange, you bring unusual empathy to each role. Your dominance is informed by submission; your submission is informed by dominance. This makes you a rare partner, you understand from the inside.`
  },
  
  acolyte: {
    name: "The Acolyte",
    title: "Sacred Service",
    historical: "Temple attendants",
    mythological: "Hestia",
    primaryDimension: 'service',
    image: '/archetype-images/the_acolyte.png',
    video: '/archetype-videos/the_acolyte.mp4',
    shareText: "I'm The Acolyte - devotion expressed through service. Anticipating needs is my art form.",
    productCategories: ['accessories', 'presentation'],
    suggestedProducts: [
      { name: "Paradise Regained: Devotional Collar", url: "/products/leather-cosplay-choker-6971126861261", reason: "Mark of your service" },
      { name: "Paradise Regained: Leather and Gold Leash", url: "/products/leash-6971126860141", reason: "Led to your duties" },
      { name: "Sapiosexual: Queen's Love Orbs", url: "/products/the-chess-collection-queenpremium-metal-pleasure-balls-6971126864767", reason: "Worn while serving" }
    ],
    coldReading: `You find worship in the mundane. The perfectly prepared meal, the precisely drawn bath, the anticipated need met before it's voiced, these are your prayers. Service is not submission for you; it is devotion made physical.

The Acolyte archetype suggests you derive spiritual fulfillment through acts of care. Your service probably transcends the scene, you may find yourself in helping professions, caretaking roles, or simply as the one who always remembers others' needs.

Your devotion is your art. You find deep satisfaction in the accumulation of small perfections, the training of your anticipation, the refinement of your offerings. Those you serve may not fully understand the depth of your gift, but they feel it in everything you provide.`
  }
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Fetch archetypes
  if (req.method === 'GET') {
    try {
      const { kv } = await import('@vercel/kv');
      
      // Try to get archetypes from KV
      let archetypes = await kv.get('archetypes:data');
      
      // If not in KV, seed with defaults
      if (!archetypes) {
        console.log('Seeding archetypes to KV from defaults');
        await kv.set('archetypes:data', DEFAULT_ARCHETYPES);
        archetypes = DEFAULT_ARCHETYPES;
      }
      
      return res.status(200).json({ 
        success: true, 
        archetypes,
        source: archetypes === DEFAULT_ARCHETYPES ? 'defaults' : 'kv'
      });
    } catch (kvError) {
      console.warn('KV not available, using defaults:', kvError.message);
      return res.status(200).json({ 
        success: true, 
        archetypes: DEFAULT_ARCHETYPES,
        source: 'defaults',
        warning: 'KV not available'
      });
    }
  }

  // POST - Save archetypes (admin auth required)
  if (req.method === 'POST') {
    try {
      const { password, archetypes, action, archetypeKey, archetypeData } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Verify admin password
      if (!adminPassword) {
        return res.status(500).json({ error: 'Admin password not configured' });
      }
      if (password !== adminPassword) {
        return res.status(401).json({ error: 'Invalid admin password' });
      }

      const { kv } = await import('@vercel/kv');

      // Handle different actions
      if (action === 'reset') {
        // Reset to defaults
        await kv.set('archetypes:data', DEFAULT_ARCHETYPES);
        console.log('Archetypes reset to defaults');
        return res.status(200).json({ 
          success: true, 
          message: 'Archetypes reset to defaults',
          archetypes: DEFAULT_ARCHETYPES
        });
      }

      if (action === 'update_single' && archetypeKey && archetypeData) {
        // Update a single archetype
        let currentArchetypes = await kv.get('archetypes:data');
        if (!currentArchetypes) {
          currentArchetypes = { ...DEFAULT_ARCHETYPES };
        }
        
        currentArchetypes[archetypeKey] = archetypeData;
        await kv.set('archetypes:data', currentArchetypes);
        
        console.log(`Archetype ${archetypeKey} updated`);
        return res.status(200).json({ 
          success: true, 
          message: `Archetype ${archetypeKey} updated`,
          archetypes: currentArchetypes
        });
      }

      if (action === 'reset_single' && archetypeKey) {
        // Reset a single archetype to default
        let currentArchetypes = await kv.get('archetypes:data');
        if (!currentArchetypes) {
          currentArchetypes = { ...DEFAULT_ARCHETYPES };
        }
        
        if (DEFAULT_ARCHETYPES[archetypeKey]) {
          currentArchetypes[archetypeKey] = DEFAULT_ARCHETYPES[archetypeKey];
          await kv.set('archetypes:data', currentArchetypes);
          
          console.log(`Archetype ${archetypeKey} reset to default`);
          return res.status(200).json({ 
            success: true, 
            message: `Archetype ${archetypeKey} reset to default`,
            archetypes: currentArchetypes
          });
        } else {
          return res.status(400).json({ error: `Unknown archetype: ${archetypeKey}` });
        }
      }

      // Full archetypes update
      if (archetypes && typeof archetypes === 'object') {
        await kv.set('archetypes:data', archetypes);
        console.log('All archetypes updated');
        return res.status(200).json({ 
          success: true, 
          message: 'All archetypes updated',
          archetypes
        });
      }

      return res.status(400).json({ error: 'Invalid request - specify action or archetypes' });

    } catch (error) {
      console.error('Archetypes POST error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


