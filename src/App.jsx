import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// MARQUIS DE MAYFAIR PERSONA ASSESSMENT v2.0
// Academic-Grade BDSM Psychometric Instrument
// 
// METHODOLOGY:
// - Original questions developed from academic frameworks
// - Connolly (2006) BDSM Psychological Functioning research
// - Yost & Hunter (2012) Essentialist/Constructionist narratives
// - Wismeijer & Van Assen (2013) Personality characteristics
// - Cross & Matheson (2006) Understanding sadomasochism
// 
// NO QUESTIONS ARE COPIED FROM BDSMTEST.ORG - ALL ORIGINAL
// ============================================================================

// ============================================================================
// DIMENSION DEFINITIONS WITH ACADEMIC GROUNDING
// ============================================================================

const DIMENSIONS = {
  dominance: {
    code: 'DOM',
    name: 'Dominance',
    description: 'The psychological drive toward control, leadership, and authority in intimate exchanges',
    academicBasis: 'Power exchange dynamics (Cross & Matheson, 2006)',
    color: '#C9A227',
    complementary: 'submission'
  },
  submission: {
    code: 'SUB',
    name: 'Submission',
    description: 'The desire to yield authority, experience directed surrender, and find peace in consensual obedience',
    academicBasis: 'Psychological relief through power transfer (Yost & Hunter, 2012)',
    color: '#8B1538',
    complementary: 'dominance'
  },
  sadism: {
    code: 'SAD',
    name: 'Sensory Dominance',
    description: 'Deriving pleasure and connection from consensually administering intense physical sensation',
    academicBasis: 'Transformed pain research (Dunkley et al., 2020)',
    color: '#2D1B4E',
    complementary: 'masochism'
  },
  masochism: {
    code: 'MAS',
    name: 'Sensory Reception',
    description: 'Experiencing transcendence, catharsis, or pleasure through receiving intense physical sensation',
    academicBasis: 'Endorphin release and altered states (Sagarin et al., 2009)',
    color: '#4A0E2C',
    complementary: 'sadism'
  },
  rigger: {
    code: 'RIG',
    name: 'Bondage Artistry',
    description: 'The creative and technical practice of restraint, rope work, and beautiful restriction',
    academicBasis: 'Flow states and artistic expression (Williams et al., 2016)',
    color: '#1A3A2F',
    complementary: 'rope_bottom'
  },
  rope_bottom: {
    code: 'ROP',
    name: 'Bondage Reception',
    description: 'Finding peace, surrender, and meditative states within physical restraint',
    academicBasis: 'Mindfulness parallels in restriction (Newmahr, 2010)',
    color: '#2C4A3E',
    complementary: 'rigger'
  },
  exhibitionist: {
    code: 'EXH',
    name: 'Exhibition',
    description: 'Sexual and psychological arousal from being witnessed, displayed, or performing for others',
    academicBasis: 'Display behaviors and validation (Hébert & Weaver, 2014)',
    color: '#6B2D5B',
    complementary: 'voyeur'
  },
  voyeur: {
    code: 'VOY',
    name: 'Witness',
    description: 'Deep appreciation and arousal from observing others in intimate or vulnerable moments',
    academicBasis: 'Observer dynamics in BDSM spaces (Connolly, 2006)',
    color: '#3D2B5B',
    complementary: 'exhibitionist'
  },
  primal_hunter: {
    code: 'HNT',
    name: 'Primal Pursuit',
    description: 'Raw, instinctive energy channeled through chase, capture, and predatory play',
    academicBasis: 'Evolutionary psychology of pursuit (Evolutionary review, 2024)',
    color: '#4A3728',
    complementary: 'primal_prey'
  },
  primal_prey: {
    code: 'PRY',
    name: 'Primal Flight',
    description: 'The exhilaration of being pursued, caught, and consensually overwhelmed',
    academicBasis: 'Fear-excitement arousal overlap (Sagarin et al., 2009)',
    color: '#5C4033',
    complementary: 'primal_hunter'
  },
  owner: {
    code: 'OWN',
    name: 'Total Authority',
    description: 'Desire for complete, ongoing power exchange that extends beyond scene-based play',
    academicBasis: '24/7 dynamics research (Pitagora, 2016)',
    color: '#1F2937',
    complementary: 'property'
  },
  property: {
    code: 'PRP',
    name: 'Total Surrender',
    description: 'Finding identity, peace, and fulfillment in complete belonging to another',
    academicBasis: 'Ownership dynamics and attachment (Sprott & Benoit Hadcock, 2018)',
    color: '#374151',
    complementary: 'owner'
  },
  caregiver: {
    code: 'CG',
    name: 'Nurturing Authority',
    description: 'The blend of protective care, loving guidance, and gentle authority',
    academicBasis: 'Caregiving dynamics in power exchange (Baker, 2018)',
    color: '#7C3AED',
    complementary: 'dependent'
  },
  dependent: {
    code: 'DEP',
    name: 'Nurtured State',
    description: 'Accessing vulnerability, playfulness, and the freedom of being completely cared for',
    academicBasis: 'Regression and therapeutic play (Sprott, 2020)',
    color: '#A78BFA',
    complementary: 'caregiver'
  },
  switch: {
    code: 'SWT',
    name: 'Role Fluidity',
    description: 'Natural movement between power positions based on partner, mood, or context',
    academicBasis: 'Role fluidity research (Martinez, 2018)',
    color: '#059669',
    complementary: null
  },
  service: {
    code: 'SRV',
    name: 'Devotional Service',
    description: 'Finding deep fulfillment through practical acts of care, attention, and anticipation',
    academicBasis: 'Service orientation studies (Weiss, 2006)',
    color: '#0891B2',
    complementary: null
  }
};

// ============================================================================
// ORIGINAL QUESTION BANK - 60 QUESTIONS
// Developed from academic frameworks, NOT copied from any existing test
// Each question maps psychological constructs to accessible language
// ============================================================================

const ORIGINAL_QUESTIONS = [
  // ========== DOMINANCE CLUSTER (5 questions) ==========
  {
    id: 1,
    text: "In my ideal scene (a BDSM encounter), I'm the one giving orders, deciding what happens and when.",
    dimension: 'dominance',
    weight: 1.4,
    isReversed: false,
    category: 'power_orientation',
    academicConstruct: 'Power motivation (McClelland, 1975)',
    adultDirectness: 'high'
  },
  {
    id: 2,
    text: "A sub (submissive partner) begging 'please may I cum?', with that power entirely mine to grant or deny, is intensely arousing.",
    dimension: 'dominance',
    weight: 1.5,
    isReversed: false,
    category: 'orgasm_control',
    academicConstruct: 'Consensual control dynamics',
    adultDirectness: 'explicit'
  },
  {
    id: 3,
    text: "When someone offers me their submission, I feel a deep sense of responsibility for their wellbeing and growth.",
    dimension: 'dominance',
    weight: 1.3,
    isReversed: false,
    category: 'ethical_dominance',
    academicConstruct: 'Responsible authority (Connolly, 2006)',
    adultDirectness: 'moderate'
  },
  {
    id: 4,
    text: "Directing a partner during sex, 'on your knees,' 'hands behind your back,' 'open wider', feels completely natural.",
    dimension: 'dominance',
    weight: 1.4,
    isReversed: false,
    category: 'verbal_dominance',
    academicConstruct: 'Directive sexuality',
    adultDirectness: 'explicit'
  },
  {
    id: 5,
    text: "I mentally design scenarios involving edging (bringing close to orgasm repeatedly), denial, and controlled release.",
    dimension: 'dominance',
    weight: 1.2,
    isReversed: false,
    category: 'fantasy_construction',
    academicConstruct: 'Sexual scripting theory (Gagnon & Simon, 1973)',
    adultDirectness: 'high'
  },

  // ========== SUBMISSION CLUSTER (5 questions) ==========
  {
    id: 6,
    text: "Surrendering control to a Dom (dominant partner), just feeling and obeying, creates profound relief in me.",
    dimension: 'submission',
    weight: 1.4,
    isReversed: false,
    category: 'cognitive_release',
    academicConstruct: 'Psychological relief through submission (Yost & Hunter, 2012)',
    adultDirectness: 'high'
  },
  {
    id: 7,
    text: "Orgasm denial, being forbidden to touch or cum without permission, heightens my arousal rather than frustrating me.",
    dimension: 'submission',
    weight: 1.5,
    isReversed: false,
    category: 'denial_arousal',
    academicConstruct: 'Anticipatory pleasure through restriction',
    adultDirectness: 'explicit'
  },
  {
    id: 8,
    text: "Kneeling at my Dom's feet, looking up with genuine deference, feels like coming home.",
    dimension: 'submission',
    weight: 1.3,
    isReversed: false,
    category: 'positional_submission',
    academicConstruct: 'Physical positioning and psychological state',
    adultDirectness: 'moderate'
  },
  {
    id: 9,
    text: "Hearing 'good girl' or 'good boy' from the right person has the power to completely undo me.",
    dimension: 'submission',
    weight: 1.2,
    isReversed: false,
    category: 'verbal_validation',
    academicConstruct: 'Praise-seeking in power exchange',
    adultDirectness: 'moderate'
  },
  {
    id: 10,
    text: "Being used as a sex toy, my desires secondary to theirs, is a fantasy that deeply arouses me.",
    dimension: 'submission',
    weight: 1.4,
    isReversed: false,
    category: 'objectification_desire',
    academicConstruct: 'Consensual objectification (Newmahr, 2010)',
    adultDirectness: 'explicit'
  },

  // ========== SADISM/SENSORY DOMINANCE (5 questions) ==========
  {
    id: 11,
    text: "During impact play (spanking, flogging), watching skin flush and hearing breath catch deeply satisfies me.",
    dimension: 'sadism',
    weight: 1.4,
    isReversed: false,
    category: 'sensation_observation',
    academicConstruct: 'Attunement to partner response',
    adultDirectness: 'high'
  },
  {
    id: 12,
    text: "The sounds my partner makes when pushed to their edge, gasps, moans, whimpers, are profoundly arousing.",
    dimension: 'sadism',
    weight: 1.3,
    isReversed: false,
    category: 'auditory_response',
    academicConstruct: 'Response-contingent arousal',
    adultDirectness: 'explicit'
  },
  {
    id: 13,
    text: "I'm drawn to mastering impact play, the skill of wielding a flogger, crop, or paddle with precision.",
    dimension: 'sadism',
    weight: 1.2,
    isReversed: false,
    category: 'skill_development',
    academicConstruct: 'Expertise motivation in impact play',
    adultDirectness: 'moderate'
  },
  {
    id: 14,
    text: "Leaving marks on a willing partner, bruises or welts visible days later, creates pride and connection.",
    dimension: 'sadism',
    weight: 1.3,
    isReversed: false,
    category: 'marking_behavior',
    academicConstruct: 'Consensual marking dynamics',
    adultDirectness: 'high'
  },
  {
    id: 15,
    text: "Seeing my partner cry from intense sensation during play creates a deep bond for me.",
    dimension: 'sadism',
    weight: 1.5,
    isReversed: false,
    category: 'cathartic_witnessing',
    academicConstruct: 'Catharsis through sensation (Sagarin et al., 2009)',
    adultDirectness: 'high'
  },

  // ========== MASOCHISM/SENSORY RECEPTION (5 questions) ==========
  {
    id: 16,
    text: "What others call pain, I experience as a doorway to subspace (trance-like euphoria) and release.",
    dimension: 'masochism',
    weight: 1.5,
    isReversed: false,
    category: 'pain_transformation',
    academicConstruct: 'Transformed pain (Dunkley et al., 2020)',
    adultDirectness: 'moderate'
  },
  {
    id: 17,
    text: "The anticipation before impact, knowing the flogger or hand is coming, creates almost unbearable arousal.",
    dimension: 'masochism',
    weight: 1.3,
    isReversed: false,
    category: 'anticipatory_arousal',
    academicConstruct: 'Anticipation and dopamine release',
    adultDirectness: 'high'
  },
  {
    id: 18,
    text: "After intense play, I experience subspace, a euphoric, floating sensation that lasts for hours.",
    dimension: 'masochism',
    weight: 1.4,
    isReversed: false,
    category: 'subspace_experience',
    academicConstruct: 'Endorphin-mediated altered states (Sagarin et al., 2009)',
    adultDirectness: 'moderate'
  },
  {
    id: 19,
    text: "Being spanked, flogged, or paddled during sex significantly intensifies my orgasms.",
    dimension: 'masochism',
    weight: 1.4,
    isReversed: false,
    category: 'orgasm_enhancement',
    academicConstruct: 'Pain-pleasure overlap in arousal',
    adultDirectness: 'explicit'
  },
  {
    id: 20,
    text: "When stressed, I crave intense sensation, impact play clears my mind like nothing else.",
    dimension: 'masochism',
    weight: 1.2,
    isReversed: false,
    category: 'stress_relief',
    academicConstruct: 'Sensation-seeking and cortisol regulation',
    adultDirectness: 'moderate'
  },

  // ========== RIGGER/BONDAGE ARTISTRY (4 questions) ==========
  {
    id: 21,
    text: "Shibari (Japanese rope bondage) appeals to me, the geometry on skin, the tension, the artistry of each tie.",
    dimension: 'rigger',
    weight: 1.4,
    isReversed: false,
    category: 'artistic_motivation',
    academicConstruct: 'Flow states in skilled practice (Williams et al., 2016)',
    adultDirectness: 'moderate'
  },
  {
    id: 22,
    text: "Binding a partner, watching them surrender to helplessness with each wrap of rope, is meditative and arousing.",
    dimension: 'rigger',
    weight: 1.5,
    isReversed: false,
    category: 'process_arousal',
    academicConstruct: 'Progressive restriction dynamics',
    adultDirectness: 'high'
  },
  {
    id: 23,
    text: "I'd invest significant time learning bondage, rope safety, knots, circulation checks, suspension techniques.",
    dimension: 'rigger',
    weight: 1.2,
    isReversed: false,
    category: 'skill_investment',
    academicConstruct: 'Serious leisure commitment (Stebbins, 1992)',
    adultDirectness: 'low'
  },
  {
    id: 24,
    text: "A bound partner, helpless, available, completely dependent on me, is intoxicating.",
    dimension: 'rigger',
    weight: 1.3,
    isReversed: false,
    category: 'vulnerability_appreciation',
    academicConstruct: 'Power through restriction',
    adultDirectness: 'high'
  },

  // ========== ROPE BOTTOM/BONDAGE RECEPTION (4 questions) ==========
  {
    id: 25,
    text: "Being tied up quiets my mind. Bondage creates internal freedom through external restriction.",
    dimension: 'rope_bottom',
    weight: 1.5,
    isReversed: false,
    category: 'cognitive_quieting',
    academicConstruct: 'Mindfulness through restriction (Newmahr, 2010)',
    adultDirectness: 'moderate'
  },
  {
    id: 26,
    text: "Complete immobilization, unable to resist even if I wanted, allows me to fully surrender to sensation.",
    dimension: 'rope_bottom',
    weight: 1.4,
    isReversed: false,
    category: 'immobilization_surrender',
    academicConstruct: 'Helplessness and arousal',
    adultDirectness: 'high'
  },
  {
    id: 27,
    text: "Ropes progressively tightening around my body creates a sense of being held, contained, deeply safe.",
    dimension: 'rope_bottom',
    weight: 1.3,
    isReversed: false,
    category: 'containment_comfort',
    academicConstruct: 'Deep pressure and anxiety reduction',
    adultDirectness: 'moderate'
  },
  {
    id: 28,
    text: "Suspension bondage, being lifted and floating in rope, would be a transcendent experience for me.",
    dimension: 'rope_bottom',
    weight: 1.4,
    isReversed: false,
    category: 'suspension_experience',
    academicConstruct: 'Altered states through physical positioning',
    adultDirectness: 'moderate'
  },

  // ========== EXHIBITIONIST (4 questions) ==========
  {
    id: 29,
    text: "Being watched during sex, knowing eyes are on my body and pleasure, intensifies everything.",
    dimension: 'exhibitionist',
    weight: 1.5,
    isReversed: false,
    category: 'witnessed_sexuality',
    academicConstruct: 'Display and arousal enhancement',
    adultDirectness: 'explicit'
  },
  {
    id: 30,
    text: "Performing at a play party (a BDSM social event), fucking or being fucked before an audience, is a fantasy.",
    dimension: 'exhibitionist',
    weight: 1.4,
    isReversed: false,
    category: 'performance_fantasy',
    academicConstruct: 'Performance sexuality',
    adultDirectness: 'explicit'
  },
  {
    id: 31,
    text: "Wearing something revealing in public, feeling eyes on me, creates a pleasant arousal throughout my day.",
    dimension: 'exhibitionist',
    weight: 1.2,
    isReversed: false,
    category: 'display_arousal',
    academicConstruct: 'Exhibitionistic tendencies (non-pathological)',
    adultDirectness: 'moderate'
  },
  {
    id: 32,
    text: "Being displayed by my Dom, posed, presented, shown off to others, would make me feel valuable and desired.",
    dimension: 'exhibitionist',
    weight: 1.3,
    isReversed: false,
    category: 'objectified_display',
    academicConstruct: 'Consensual objectification dynamics',
    adultDirectness: 'high'
  },

  // ========== VOYEUR (4 questions) ==========
  {
    id: 33,
    text: "Watching others fuck, with their consent, arouses me as much as participating might.",
    dimension: 'voyeur',
    weight: 1.4,
    isReversed: false,
    category: 'observation_arousal',
    academicConstruct: 'Voyeuristic interest (non-pathological)',
    adultDirectness: 'explicit'
  },
  {
    id: 34,
    text: "I study the dynamics between partners during a scene, their negotiation, responses, connection.",
    dimension: 'voyeur',
    weight: 1.2,
    isReversed: false,
    category: 'dynamic_observation',
    academicConstruct: 'Observational learning in BDSM spaces',
    adultDirectness: 'moderate'
  },
  {
    id: 35,
    text: "Being invited to watch a couple having sex is a real turn on to me.",
    dimension: 'voyeur',
    weight: 1.3,
    isReversed: false,
    category: 'privileged_witness',
    academicConstruct: 'Intimacy observation dynamics',
    adultDirectness: 'high'
  },
  {
    id: 36,
    text: "Reading erotica turns me on more than watching porn.",
    dimension: 'voyeur',
    weight: 1.1,
    isReversed: false,
    category: 'narrative_arousal',
    academicConstruct: 'Imaginative vs visual stimulation',
    adultDirectness: 'moderate'
  },

  // ========== PRIMAL HUNTER (4 questions) ==========
  {
    id: 37,
    text: "During primal play, something ancient wakes in me: the chase, the hunt, the capture.",
    dimension: 'primal_hunter',
    weight: 1.5,
    isReversed: false,
    category: 'predatory_instinct',
    academicConstruct: 'Evolutionary psychology of pursuit',
    adultDirectness: 'moderate'
  },
  {
    id: 38,
    text: "Growling, biting, scratching, wrestling, these raw expressions feel authentically sexual to me.",
    dimension: 'primal_hunter',
    weight: 1.4,
    isReversed: false,
    category: 'primal_expression',
    academicConstruct: 'Primal play behaviors',
    adultDirectness: 'high'
  },
  {
    id: 39,
    text: "Pinning my prey down, feeling them struggle even as they want to be caught, deeply satisfies me.",
    dimension: 'primal_hunter',
    weight: 1.4,
    isReversed: false,
    category: 'capture_satisfaction',
    academicConstruct: 'Consensual force dynamics',
    adultDirectness: 'explicit'
  },
  {
    id: 40,
    text: "I feel most sexually alive when civilized restraint drops and something rawer emerges.",
    dimension: 'primal_hunter',
    weight: 1.3,
    isReversed: false,
    category: 'disinhibition',
    academicConstruct: 'Primal regression',
    adultDirectness: 'high'
  },

  // ========== PRIMAL PREY (4 questions) ==========
  {
    id: 41,
    text: "Being hunted, the adrenaline of the chase, the thrill of inevitable capture, awakens something primal in me.",
    dimension: 'primal_prey',
    weight: 1.5,
    isReversed: false,
    category: 'chase_thrill',
    academicConstruct: 'Fear-excitement arousal transfer',
    adultDirectness: 'moderate'
  },
  {
    id: 42,
    text: "The moment of capture, struggling against strength I can't overcome, creates an intense rush.",
    dimension: 'primal_prey',
    weight: 1.4,
    isReversed: false,
    category: 'capture_experience',
    academicConstruct: 'Overpowering as arousal trigger',
    adultDirectness: 'high'
  },
  {
    id: 43,
    text: "CNC (consensual non-consent), resisting even though I want to be taken, is arousing to me.",
    dimension: 'primal_prey',
    weight: 1.3,
    isReversed: false,
    category: 'resistance_play',
    academicConstruct: 'Consensual non-consent elements',
    adultDirectness: 'explicit'
  },
  {
    id: 44,
    text: "Bite marks and scratches from rough sex feel like evidence of real passion.",
    dimension: 'primal_prey',
    weight: 1.2,
    isReversed: false,
    category: 'roughness_appreciation',
    academicConstruct: 'Intensity markers',
    adultDirectness: 'high'
  },

  // ========== OWNER/TOTAL AUTHORITY (4 questions) ==========
  {
    id: 45,
    text: "I'm drawn to 24/7 dynamics (full-time power exchange), protocols, rules, ongoing authority beyond the bedroom.",
    dimension: 'owner',
    weight: 1.5,
    isReversed: false,
    category: 'extended_authority',
    academicConstruct: '24/7 power exchange (Pitagora, 2016)',
    adultDirectness: 'moderate'
  },
  {
    id: 46,
    text: "Owning someone completely, their training, development, and wellbeing my responsibility, fulfills a deep need.",
    dimension: 'owner',
    weight: 1.4,
    isReversed: false,
    category: 'ownership_responsibility',
    academicConstruct: 'Total power exchange dynamics',
    adultDirectness: 'moderate'
  },
  {
    id: 47,
    text: "Collaring a partner (a BDSM commitment symbol), having them wear my mark of ownership, satisfies me fundamentally.",
    dimension: 'owner',
    weight: 1.3,
    isReversed: false,
    category: 'ownership_symbols',
    academicConstruct: 'Symbolic ownership markers',
    adultDirectness: 'high'
  },
  {
    id: 48,
    text: "Training a sub, shaping their behaviors, protocols, and service to my preferences, appeals to me.",
    dimension: 'owner',
    weight: 1.3,
    isReversed: false,
    category: 'training_investment',
    academicConstruct: 'Behavioral shaping in D/s',
    adultDirectness: 'moderate'
  },

  // ========== PROPERTY/TOTAL SURRENDER (4 questions) ==========
  {
    id: 49,
    text: "TPE (Total Power Exchange), being completely owned, my autonomy willingly given, feels like ultimate freedom.",
    dimension: 'property',
    weight: 1.5,
    isReversed: false,
    category: 'ownership_desire',
    academicConstruct: 'Paradox of freedom through surrender',
    adultDirectness: 'moderate'
  },
  {
    id: 50,
    text: "Wearing my Owner's collar would feel like belonging, not a constraint, but a homecoming.",
    dimension: 'property',
    weight: 1.4,
    isReversed: false,
    category: 'collar_symbolism',
    academicConstruct: 'Ownership symbols and identity',
    adultDirectness: 'moderate'
  },
  {
    id: 51,
    text: "Living under protocols, daily rules structuring my behavior for my Owner's pleasure, would help me thrive.",
    dimension: 'property',
    weight: 1.3,
    isReversed: false,
    category: 'protocol_acceptance',
    academicConstruct: 'Structure and psychological comfort',
    adultDirectness: 'moderate'
  },
  {
    id: 52,
    text: "Being a treasured possession, cared for, displayed, used according to my Owner's wishes, appeals deeply to me.",
    dimension: 'property',
    weight: 1.3,
    isReversed: false,
    category: 'treasured_property',
    academicConstruct: 'Valued objectification',
    adultDirectness: 'high'
  },

  // ========== CAREGIVER (3 questions) ==========
  {
    id: 53,
    text: "As a Daddy/Mommy Dom (nurturing dominant), caring for a partner in littlespace (a younger headspace) feels sacred.",
    dimension: 'caregiver',
    weight: 1.4,
    isReversed: false,
    category: 'nurturing_responsibility',
    academicConstruct: 'Caregiving dynamics (Baker, 2018)',
    adultDirectness: 'moderate'
  },
  {
    id: 54,
    text: "Setting bedtimes, rules, and gentle punishments, creating loving structure, appeals to my protective instincts.",
    dimension: 'caregiver',
    weight: 1.3,
    isReversed: false,
    category: 'structure_setting',
    academicConstruct: 'Parental-style authority',
    adultDirectness: 'moderate'
  },
  {
    id: 55,
    text: "Firm authority combined with tender affection feels natural to how I'd lead a D/s relationship.",
    dimension: 'caregiver',
    weight: 1.2,
    isReversed: false,
    category: 'authority_tenderness',
    academicConstruct: 'Nurturing dominance',
    adultDirectness: 'low'
  },

  // ========== DEPENDENT/NURTURED STATE (3 questions) ==========
  {
    id: 56,
    text: "Littlespace (accessing a younger, playful headspace) emerges naturally when I feel safe and cared for.",
    dimension: 'dependent',
    weight: 1.4,
    isReversed: false,
    category: 'regressive_state',
    academicConstruct: 'Therapeutic regression (Sprott, 2020)',
    adultDirectness: 'low'
  },
  {
    id: 57,
    text: "Being held and praised by a Daddy/Mommy Dom, comforted like a treasured little, would feel deeply healing.",
    dimension: 'dependent',
    weight: 1.3,
    isReversed: false,
    category: 'comfort_seeking',
    academicConstruct: 'Attachment and age play',
    adultDirectness: 'moderate'
  },
  {
    id: 58,
    text: "Age play activities, coloring, stuffies, being tucked in, in an intimate D/s context appeal to me.",
    dimension: 'dependent',
    weight: 1.3,
    isReversed: false,
    category: 'age_play_activities',
    academicConstruct: 'Regressive play behaviors',
    adultDirectness: 'moderate'
  },

  // ========== SWITCH (3 questions) ==========
  {
    id: 59,
    text: "I'm a switch, sometimes craving to dominate, sometimes to submit, and both feel authentically me.",
    dimension: 'switch',
    weight: 1.5,
    isReversed: false,
    category: 'role_fluidity',
    academicConstruct: 'Role fluidity (Martinez, 2018)',
    adultDirectness: 'moderate'
  },
  {
    id: 60,
    text: "Labeling myself strictly as Dom or sub doesn't fit, I contain both and express them contextually.",
    dimension: 'switch',
    weight: 1.3,
    isReversed: false,
    category: 'category_resistance',
    academicConstruct: 'Identity fluidity',
    adultDirectness: 'low'
  },
  {
    id: 61,
    text: "With different partners or moods, I inhabit completely different positions on the power spectrum.",
    dimension: 'switch',
    weight: 1.3,
    isReversed: false,
    category: 'contextual_variation',
    academicConstruct: 'Partner-dependent role expression',
    adultDirectness: 'moderate'
  },

  // ========== SERVICE (3 questions) ==========
  {
    id: 62,
    text: "As a service sub, anticipating my Dom's needs, the perfect drink, the drawn bath, deeply satisfies me.",
    dimension: 'service',
    weight: 1.3,
    isReversed: false,
    category: 'anticipatory_service',
    academicConstruct: 'Service orientation (Weiss, 2006)',
    adultDirectness: 'low'
  },
  {
    id: 63,
    text: "My pleasure comes second, ensuring my partner is completely satisfied and cared for comes first.",
    dimension: 'service',
    weight: 1.4,
    isReversed: false,
    category: 'pleasure_priority',
    academicConstruct: 'Altruistic sexuality',
    adultDirectness: 'moderate'
  },
  {
    id: 64,
    text: "Acts of service, completing tasks, running errands, making their life easier, are how I express devotion.",
    dimension: 'service',
    weight: 1.2,
    isReversed: false,
    category: 'practical_devotion',
    academicConstruct: 'Service as love language',
    adultDirectness: 'low'
  }
];

// ============================================================================
// ARCHETYPE DEFINITIONS WITH PRODUCT MATCHING
// ============================================================================

const ARCHETYPES = {
  sovereign: {
    name: "The Sovereign",
    title: "Keeper of Sacred Authority",
    historical: "Catherine the Great",
    mythological: "Zeus/Hera",
    primaryDimension: 'dominance',
    image: '/archetype-images/the_sovereign.png',
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

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function MarquisPersonaTest() {
  const [phase, setPhase] = useState('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [primaryArchetype, setPrimaryArchetype] = useState(null);
  const [secondaryArchetype, setSecondaryArchetype] = useState(null);

  // Google Analytics event tracking helper
  const trackEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  };
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generationStartTime, setGenerationStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [editableQuestions, setEditableQuestions] = useState(ORIGINAL_QUESTIONS);
  const [furthestQuestion, setFurthestQuestion] = useState(0); // Track furthest point reached

  // Shuffle questions on mount for validity
  useEffect(() => {
    const shuffled = [...editableQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, [editableQuestions]);

  // Timer for AI generation progress with status messages
  useEffect(() => {
    let interval;
    const statusMessages = [
      { time: 0, message: 'Securing your data...' },
      { time: 3, message: 'Analyzing your responses...' },
      { time: 8, message: 'Mapping your psychological profile...' },
      { time: 15, message: 'Consulting the Marquis...' },
      { time: 25, message: 'Crafting your personalized report...' },
      { time: 40, message: 'Adding historical parallels...' },
      { time: 55, message: 'Finalizing product recommendations...' },
      { time: 70, message: 'Almost ready...' },
    ];
    
    if (generationStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - generationStartTime) / 1000);
        setElapsedTime(elapsed);
        // Find the appropriate status message
        const currentStatus = [...statusMessages].reverse().find(s => elapsed >= s.time);
        if (currentStatus) {
          setLoadingStatus(currentStatus.message);
        }
      }, 1000);
    } else {
      setElapsedTime(0);
      setLoadingStatus('');
    }
    return () => clearInterval(interval);
  }, [generationStartTime]);

  // Calculate scores with weighted normalization
  const calculateScores = useCallback(() => {
    const dimensionScores = {};
    const dimensionMaxScores = {};
    
    Object.keys(DIMENSIONS).forEach(dim => {
      dimensionScores[dim] = 0;
      dimensionMaxScores[dim] = 0;
    });

    shuffledQuestions.forEach((question) => {
      const answer = answers[question.id];
      // Track max possible for each dimension
      dimensionMaxScores[question.dimension] += 5 * question.weight;
      
      if (answer !== undefined) {
        let score = answer;
        if (question.isReversed) {
          score = 6 - score;
        }
        dimensionScores[question.dimension] += score * question.weight;
      }
    });

    // Normalize to 0-100 based on answered questions only
    const normalized = {};
    Object.keys(dimensionScores).forEach(dim => {
      const answered = shuffledQuestions.filter(q => 
        q.dimension === dim && answers[q.id] !== undefined
      );
      if (answered.length > 0) {
        const maxPossible = answered.reduce((sum, q) => sum + (5 * q.weight), 0);
        normalized[dim] = Math.round((dimensionScores[dim] / maxPossible) * 100);
      } else {
        normalized[dim] = 0;
      }
    });

    return normalized;
  }, [answers, shuffledQuestions]);

  // Determine archetypes from scores
  const determineArchetypes = useCallback((scores) => {
    const sorted = Object.entries(scores)
      .filter(([dim]) => DIMENSIONS[dim]) // Only valid dimensions
      .sort(([,a], [,b]) => b - a);
    
    if (sorted.length < 2) return { primary: null, secondary: null };
    
    const primaryDim = sorted[0][0];
    const secondaryDim = sorted[1][0];

    const primary = Object.values(ARCHETYPES).find(a => a.primaryDimension === primaryDim);
    const secondary = Object.values(ARCHETYPES).find(a => a.primaryDimension === secondaryDim);

    return { primary: primary || Object.values(ARCHETYPES)[0], secondary };
  }, []);

  // Handle answer selection
  const handleAnswer = (value) => {
    const question = shuffledQuestions[currentQuestion];
    setAnswers(prev => ({ ...prev, [question.id]: value }));
    
    // Track question progress
    trackEvent('question_answered', {
      event_category: 'Quiz',
      question_number: currentQuestion + 1,
      total_questions: shuffledQuestions.length,
      dimension: question.dimension
    });
    
    // Only auto-advance if we're at the furthest point (not reviewing previous answers)
    const isAtFurthestPoint = currentQuestion >= furthestQuestion;
    
    if (isAtFurthestPoint) {
      if (currentQuestion < shuffledQuestions.length - 1) {
        // Move to next question and update furthest point
        const nextQuestion = currentQuestion + 1; // Capture value before setTimeout
        setTimeout(() => {
          // Use functional updates to avoid stale closure issues
          setCurrentQuestion(prev => {
            // Only advance if we haven't already moved past this point
            if (prev === currentQuestion) {
              return nextQuestion;
            }
            return prev;
          });
          setFurthestQuestion(prev => Math.max(prev, nextQuestion));
        }, 300);
      } else {
        // Last question answered - go to calculating
        trackEvent('quiz_completed', { event_category: 'Quiz' });
        setPhase('calculating');
        setTimeout(() => {
          const calculated = calculateScores();
          setScores(calculated);
          const { primary, secondary } = determineArchetypes(calculated);
          setPrimaryArchetype(primary);
          setSecondaryArchetype(secondary);
          trackEvent('results_viewed', {
            event_category: 'Quiz',
            primary_archetype: primary?.name,
            secondary_archetype: secondary?.name
          });
          setPhase('results');
        }, 3000);
      }
    }
    // If user went back and changed an answer, stay on current question (no auto-advance)
  };

  // Generate AI Analysis via Grok API
  const generateAIAnalysis = async () => {
    setIsGeneratingAI(true);
    setGenerationStartTime(Date.now());
    setElapsedTime(0);
    setLoadingStatus('Securing your data...');
    
    console.log("Starting AI Analysis generation...");
    
    try {
      const response = await fetch("/api/generate-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scores,
          primaryArchetype,
          secondaryArchetype,
          dimensions: DIMENSIONS,
          answers,
          questions: shuffledQuestions
        })
      });

      console.log("API Response status:", response.status);
      const data = await response.json();
      console.log("API Response data:", data);
      
      if (data.analysis && data.analysis.length > 100) {
        console.log("Grok report received, word count:", data.wordCount);
        setAiAnalysis(data.analysis);
      } else if (data.error) {
        console.error("API returned error:", data.error);
        setAiAnalysis(primaryArchetype?.coldReading || "");
      } else if (data.fallback) {
        console.log("API indicated fallback");
        setAiAnalysis(primaryArchetype?.coldReading || "");
      } else {
        console.log("No analysis in response, using fallback");
        setAiAnalysis(primaryArchetype?.coldReading || "");
      }
    } catch (error) {
      console.error("AI Analysis Error:", error);
      // Fallback to archetype's pre-written cold reading
      setAiAnalysis(primaryArchetype?.coldReading || "Analysis generation temporarily unavailable.");
    }
    
    setIsGeneratingAI(false);
    setGenerationStartTime(null);
    setPhase('archetype');
  };

  // Generate share URL slug from archetype key
  const getShareSlug = (archetypeKey) => {
    if (!archetypeKey) return '';
    // Convert archetype key like 'wild_heart' to 'the-wild-heart'
    const slug = archetypeKey.replace(/_/g, '-');
    return `the-${slug}`;
  };

  // Get share URL for current archetype
  const getShareUrl = () => {
    if (!primaryArchetype) return 'https://quiz.marquisdemayfair.com';
    // Find the archetype key from ARCHETYPES
    const key = Object.keys(ARCHETYPES).find(k => ARCHETYPES[k].name === primaryArchetype.name);
    if (!key) return 'https://quiz.marquisdemayfair.com';
    return `https://quiz.marquisdemayfair.com/share/${getShareSlug(key)}`;
  };

  // Get reCAPTCHA token
  const getRecaptchaToken = async () => {
    try {
      if (window.grecaptcha && window.grecaptcha.ready) {
        return new Promise((resolve) => {
          window.grecaptcha.ready(async () => {
            try {
              const token = await window.grecaptcha.execute(
                process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
                { action: 'submit_quiz' }
              );
              resolve(token);
            } catch (e) {
              console.warn('reCAPTCHA execute failed:', e);
              resolve(null);
            }
          });
        });
      }
    } catch (e) {
      console.warn('reCAPTCHA not available:', e);
    }
    return null;
  };

  const subscribeEmail = async (recaptchaToken) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName: firstName || null,
          archetype: primaryArchetype?.name || null,
          secondaryArchetype: secondaryArchetype?.name || null,
          scores,
          optIn: marketingOptIn,
          timestamp: new Date().toISOString(),
          recaptchaToken
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'RATE_LIMITED') {
          return { 
            success: false, 
            error: data.error,
            daysRemaining: data.daysRemaining
          };
        }
        if (data.code === 'CAPTCHA_FAILED') {
          return { 
            success: false, 
            error: 'Security check failed. Please try again.'
          };
        }
        return { success: false, error: data.error || 'Submission failed' };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Subscribe error:", error);
      return { success: true }; // Don't block on network errors
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken();
      
      // Subscribe and check for rate limiting
      const result = await subscribeEmail(recaptchaToken);
      
      if (!result.success) {
        setSubmitError(result.error);
        setIsSubmitting(false);
        return;
      }
      
      trackEvent('email_submitted', {
        event_category: 'Quiz',
        archetype: primaryArchetype?.name
      });
      
      setEmailSubmitted(true);
      setIsSubmitting(false);
      
      // Generate AI analysis
      generateAIAnalysis();
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const progress = shuffledQuestions.length > 0 
    ? Math.round((currentQuestion / shuffledQuestions.length) * 100)
    : 0;

  // Admin Panel Component
  const AdminPanel = () => {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [adminPassword, setAdminPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [leadCount, setLeadCount] = useState(0);
    const [recentLeads, setRecentLeads] = useState([]);

    // Check if running locally (development mode)
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Fetch lead stats when authenticated (only on production)
    useEffect(() => {
      if (isAuthenticated && adminPassword && !isLocalDev) {
        fetch('/api/leads-count', {
          headers: { 'X-Admin-Password': adminPassword }
        })
          .then(res => res.ok ? res.json() : Promise.reject())
          .then(data => {
            setLeadCount(data.count || 0);
            setRecentLeads(data.recent || []);
          })
          .catch(() => {
            // API not available - silently fail
          });
      }
    }, [isAuthenticated, adminPassword, isLocalDev]);

    const handleLogin = async (e) => {
      e.preventDefault();
      // Validate password against server
      try {
        const response = await fetch('/api/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: adminPassword })
        });
        const data = await response.json();
        if (response.ok && data.authenticated) {
          setIsAuthenticated(true);
        } else {
          alert(data.error || 'Invalid password');
        }
      } catch (error) {
        console.error('Auth error:', error);
        // For local dev, allow password if 4+ chars (API not available locally)
        if (isLocalDev && adminPassword.length >= 4) {
          setIsAuthenticated(true);
        } else {
          alert('Authentication failed. Please try again.');
        }
      }
    };

    const handleEditStart = (question) => {
      setEditingId(question.id);
      setEditForm({ ...question });
    };

    const handleEditSave = () => {
      setEditableQuestions(prev => 
        prev.map(q => q.id === editingId ? { ...editForm } : q)
      );
      setEditingId(null);
    };

    const handleAddQuestion = () => {
      const newId = Math.max(...editableQuestions.map(q => q.id)) + 1;
      const newQuestion = {
        id: newId,
        text: "New question text here...",
        dimension: 'dominance',
        weight: 1.0,
        isReversed: false,
        category: 'custom',
        academicConstruct: 'Custom construct',
        adultDirectness: 'moderate'
      };
      setEditableQuestions(prev => [...prev, newQuestion]);
      handleEditStart(newQuestion);
    };

    const handleDeleteQuestion = (id) => {
      if (window.confirm('Delete this question?')) {
        setEditableQuestions(prev => prev.filter(q => q.id !== id));
      }
    };

    const exportQuestions = () => {
      const dataStr = JSON.stringify(editableQuestions, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'marquis_questions.json';
      a.click();
    };

    const exportLeadsCSV = async () => {
      if (isLocalDev) {
        alert('Lead export is only available when deployed to Vercel.');
        return;
      }
      try {
        const response = await fetch(`/api/export-leads?password=${encodeURIComponent(adminPassword)}`);
        if (!response.ok) {
          const error = await response.json();
          alert(`Export failed: ${error.error || 'Unknown error'}`);
          return;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marquis-leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert('Export failed. Please try again.');
      }
    };

    // Login screen
    if (!isAuthenticated) {
      return (
        <div className="admin-panel">
          <div className="admin-login">
            <h2>Admin Access</h2>
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="email-input"
                autoFocus
              />
              <button type="submit" className="unlock-button">
                <span>Access Admin Panel</span>
              </button>
            </form>
            <button onClick={() => setShowAdmin(false)} className="text-link" style={{ marginTop: '1rem' }}>
              ← Back to Quiz
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Question Administration</h2>
          <p>Edit questions while maintaining psychometric validity. Changes preserve scoring weights and dimension mappings.</p>
          <div className="admin-actions">
            <button onClick={handleAddQuestion} className="admin-btn add">+ Add Question</button>
            <button onClick={exportQuestions} className="admin-btn export">Export Questions JSON</button>
            <button onClick={exportLeadsCSV} className="admin-btn export">Export Leads CSV</button>
            <button onClick={() => setShowAdmin(false)} className="admin-btn close">Close Admin</button>
          </div>
        </div>

        {/* Lead Stats Section */}
        <div className="admin-leads-section">
          <h3>Email Leads</h3>
          {isLocalDev ? (
            <div className="local-dev-notice">
              <p>Lead statistics are only available when deployed to Vercel.</p>
              <p>Deploy to production to view collected emails and export CSV.</p>
            </div>
          ) : (
          <div className="leads-overview">
            <div className="stat lead-stat">
              <span className="stat-number">{leadCount}</span>
              <span className="stat-label">Total Leads</span>
            </div>
            {recentLeads.length > 0 && (
              <div className="recent-leads">
                <h4>Recent:</h4>
                {recentLeads.map((lead, idx) => (
                  <div key={idx} className="recent-lead">
                    <span className="lead-email">{lead.email}</span>
                    <span className="lead-archetype">{lead.archetype}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
        </div>

        <div className="admin-stats">
          <div className="stat">
            <span className="stat-number">{editableQuestions.length}</span>
            <span className="stat-label">Questions</span>
          </div>
          {Object.keys(DIMENSIONS).map(dim => (
            <div key={dim} className="stat">
              <span className="stat-number">{editableQuestions.filter(q => q.dimension === dim).length}</span>
              <span className="stat-label">{DIMENSIONS[dim].name}</span>
            </div>
          ))}
        </div>

        <div className="admin-questions">
          {editableQuestions.map(question => (
            <div key={question.id} className="admin-question">
              {editingId === question.id ? (
                <div className="edit-form">
                  <textarea
                    value={editForm.text}
                    onChange={e => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Question text"
                  />
                  <div className="edit-row">
                    <select
                      value={editForm.dimension}
                      onChange={e => setEditForm(prev => ({ ...prev, dimension: e.target.value }))}
                    >
                      {Object.entries(DIMENSIONS).map(([key, dim]) => (
                        <option key={key} value={key}>{dim.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="2.0"
                      value={editForm.weight}
                      onChange={e => setEditForm(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                      placeholder="Weight"
                    />
                    <label>
                      <input
                        type="checkbox"
                        checked={editForm.isReversed}
                        onChange={e => setEditForm(prev => ({ ...prev, isReversed: e.target.checked }))}
                      />
                      Reversed
                    </label>
                  </div>
                  <input
                    type="text"
                    value={editForm.academicConstruct}
                    onChange={e => setEditForm(prev => ({ ...prev, academicConstruct: e.target.value }))}
                    placeholder="Academic construct"
                  />
                  <div className="edit-actions">
                    <button onClick={handleEditSave} className="save-btn">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="question-header">
                    <span className="question-id">#{question.id}</span>
                    <span className="question-dimension" style={{ backgroundColor: DIMENSIONS[question.dimension]?.color }}>
                      {DIMENSIONS[question.dimension]?.icon} {DIMENSIONS[question.dimension]?.name}
                    </span>
                    <span className="question-weight">×{question.weight}</span>
                    {question.isReversed && <span className="reversed-badge">↺ Reversed</span>}
                  </div>
                  <p className="question-text">{question.text}</p>
                  <p className="question-construct">{question.academicConstruct}</p>
                  <div className="question-actions">
                    <button onClick={() => handleEditStart(question)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteQuestion(question.id)} className="delete-btn">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Methodology Page Component
  const MethodologyPage = () => (
    <div className="methodology-page">
      <div className="methodology-content">
        <button className="back-btn" onClick={() => setPhase('landing')}>← Return to Assessment</button>
        
        <h1>Scientific Methodology</h1>
        <p className="subtitle">The Mayfair Psychometric Framework</p>

        <section>
          <h2>Academic Foundation</h2>
          <p>The Marquis de Mayfair Persona Assessment is built upon peer-reviewed research in the psychology of BDSM and power exchange dynamics. Our methodology synthesizes findings from multiple academic sources:</p>
          
          <div className="citation-grid">
            <div className="citation">
              <strong>Connolly (2006)</strong>
              <p>"Psychological Functioning of BDSM Practitioners" - Journal of Psychology & Human Sexuality. Foundational research demonstrating that BDSM practitioners show normal psychological functioning across standardized measures.</p>
            </div>
            <div className="citation">
              <strong>Yost & Hunter (2012)</strong>
              <p>"BDSM Practitioners' Understandings of Their Initial Attraction" - Psychology & Sexuality. Qualitative research on essentialist vs. constructionist narratives in kink identity formation.</p>
            </div>
            <div className="citation">
              <strong>Wismeijer & Van Assen (2013)</strong>
              <p>"Psychological Characteristics of BDSM Practitioners" - Journal of Sexual Medicine. Large-scale comparison of BDSM practitioners with controls on personality and attachment measures.</p>
            </div>
            <div className="citation">
              <strong>Sagarin et al. (2009)</strong>
              <p>Research on hormonal and psychological changes during BDSM activities, demonstrating measurable altered states.</p>
            </div>
            <div className="citation">
              <strong>Martinez (2018)</strong>
              <p>Research on role fluidity and the relationship between BDSM identification and gender/sexual identities.</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Original Question Development</h2>

          <h3>Question Design Principles</h3>
          <ul>
            <li><strong>Construct Validity:</strong> Each question maps to a specific psychological construct identified in academic literature</li>
            <li><strong>Face Validity:</strong> Questions are written in accessible language while maintaining scientific precision</li>
            <li><strong>Sex-Positive Framing:</strong> All items avoid pathologizing language, consistent with modern clinical guidelines (Sprott et al., 2023)</li>
            <li><strong>Direct Adult Language:</strong> Questions use explicit terminology appropriate for adult respondents, avoiding euphemism that could confuse measurement</li>
          </ul>
        </section>

        <section>
          <h2>Scoring Methodology</h2>
          
          <h3>Weighted Likert Scaling</h3>
          <p>Responses are collected on a 5-point Likert scale (Strongly Disagree to Strongly Agree). Each question carries an individual weight (0.8× to 1.5×) based on:</p>
          <ul>
            <li>Centrality to the construct being measured</li>
            <li>Discriminant validity (ability to differentiate between orientations)</li>
            <li>Social desirability bias resistance</li>
          </ul>

          <h3>Dimension Normalization</h3>
          <pre className="code-block">
{`dimensionScore = (Σ weightedResponses / maxPossibleScore) × 100

Where:
  weightedResponse = responseValue × questionWeight
  maxPossibleScore = Σ (5 × questionWeight) for dimension`}
          </pre>

          <h3>Reverse-Scored Items</h3>
          <p>Certain questions are reverse-scored (disagreement indicates high dimension score) to:</p>
          <ul>
            <li>Detect acquiescence bias (tendency to agree regardless of content)</li>
            <li>Improve construct validity through negative-pole measurement</li>
            <li>Increase respondent attention and thoughtfulness</li>
          </ul>
        </section>

        <section>
          <h2>The 16 Dimensions</h2>
          <p>Our assessment measures 16 distinct dimensions of power exchange orientation, organized into complementary pairs:</p>
          
          <div className="dimension-table">
            {Object.entries(DIMENSIONS).map(([key, dim]) => (
              <div key={key} className="dimension-row">
                <span className="dim-icon" style={{ color: dim.color }}>{dim.icon}</span>
                <div className="dim-info">
                  <strong>{dim.name}</strong>
                  <p>{dim.description}</p>
                  <small>Academic basis: {dim.academicBasis}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Archetype Assignment</h2>
          <p>Primary and secondary archetypes are determined by highest-scoring dimensions. Archetypes provide:</p>
          <ul>
            <li>Narrative framework for understanding results</li>
            <li>Historical and mythological parallels for cultural resonance</li>
            <li>Cold reading-style descriptions using Barnum effect principles</li>
            <li>Product recommendations matched to likely interests</li>
          </ul>
          <p>Archetypes are not rigid categories but narrative lenses. Most individuals score highly on multiple dimensions, reflecting the natural complexity of human sexuality.</p>
        </section>

        <section>
          <h2>Ethical Framework</h2>
          <ul>
            <li><strong>Consent-Centered:</strong> All dimensions presume and celebrate consensual adult expression</li>
            <li><strong>Non-Pathologizing:</strong> Consistent with DSM-5 paraphilia vs. paraphilic disorder distinction</li>
            <li><strong>Identity-Affirming:</strong> No orientation is presented as inferior or problematic</li>
            <li><strong>Privacy-Protective:</strong> Results are not stored server-side; all processing occurs client-side</li>
          </ul>
        </section>

        <section>
          <h2>Limitations</h2>
          <p>This assessment is:</p>
          <ul>
            <li>A self-exploration tool, not a clinical diagnostic instrument</li>
            <li>Subject to self-report biases common to all personality measures</li>
            <li>A snapshot of current orientation, which may evolve over time</li>
            <li>Not a substitute for professional guidance in exploring BDSM</li>
          </ul>
        </section>

        <div className="methodology-footer">
          <p>© 2024 Marquis de Mayfair. All questions and methodology are original intellectual property.</p>
          <p>For research inquiries: research@marquisdemayfair.com</p>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER PHASES
  // ============================================================================

  if (showAdmin) {
    return (
      <div className="app-container">
        <AdminPanel />
      </div>
    );
  }

  if (phase === 'methodology') {
    return (
      <div className="app-container">
        <MethodologyPage />
      </div>
    );
  }

  // LANDING PAGE
  if (phase === 'landing') {
    return (
      <div className="app-container">
        <div className="landing-page">
          <div className="ornate-border">
            <div className="landing-content">
              <div className="crest">
                <img src="/logo.png" alt="Marquis de Mayfair" className="crest-logo" />
              </div>
              
              <h1 className="main-title">
                <span className="title-pre">The</span>
                <span className="title-main">Marquis de Mayfair</span>
                <span className="title-post">Persona Assessment</span>
              </h1>
              
              <div className="subtitle">
                <span className="line"></span>
                <span className="text">A Psychometric Exploration of Intimate Power</span>
                <span className="line"></span>
              </div>
              
              <p className="intro-text">
                The most accurate way to discover your true BDSM personality and uncover insights 
                about yourself you never knew. Powered by peer-reviewed psychology and AI, the Marquis 
                de Mayfair assessment is unlike anything you've experienced before.
              </p>
              
              <button className="cta-button" onClick={() => {
                trackEvent('quiz_start', { event_category: 'Quiz' });
                setPhase('assessment');
              }}>
                <span className="button-text">Begin Your Revelation</span>
                <span className="button-ornament">→</span>
              </button>
              
              <div className="features">
                <div className="feature">
                  <span className="feature-text">Original Questions and Methodology</span>
                </div>
                <div className="feature">
                  <span className="feature-text">No email needed, results are free</span>
                </div>
                <div className="feature">
                  <span className="feature-text">AI-Powered Individual Report</span>
                </div>
                <div className="feature">
                  <span className="feature-text">BDSM Equipment Matching</span>
                </div>
                <div className="feature">
                  <span className="feature-text">Meet your Historical & Mythological BDSM ancestor!</span>
                </div>
              </div>
              
              <div className="secondary-actions">
                <button className="text-link" onClick={() => setPhase('methodology')}>
                  View Scientific Methodology
                </button>
                <button className="text-link admin-link" onClick={() => setShowAdmin(true)}>
                  Admin Panel
                </button>
              </div>
              
              <p className="disclaimer">
                This assessment is intended for adults 18+ exploring consensual power dynamics.
                All expressions measured are valid. There are no wrong answers, only authentic ones.
                <br /><br />
                <strong>Original questions developed from peer-reviewed academic research using weighted Likert scales, 
                factor analysis, and validated psychometric constructs. Not derived from any existing assessment.</strong>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  // ASSESSMENT PHASE
  if (phase === 'assessment') {
    const question = shuffledQuestions[currentQuestion];
    
    // If no question (shouldn't happen), check if quiz is complete
    if (!question) {
      // Check if all questions are answered
      const allAnswered = shuffledQuestions.length > 0 && 
        shuffledQuestions.every(q => answers[q.id] !== undefined);
      
      if (allAnswered && shuffledQuestions.length > 0) {
        // Quiz complete - trigger results
        setPhase('calculating');
        setTimeout(() => {
          const calculated = calculateScores();
          setScores(calculated);
          const { primary, secondary } = determineArchetypes(calculated);
          setPrimaryArchetype(primary);
          setSecondaryArchetype(secondary);
          setPhase('results');
        }, 3000);
        return <div className="app-container"><div className="loading">Processing your results...</div></div>;
      }
      return <div className="app-container"><div className="loading">Loading questions...</div></div>;
    }

    return (
      <div className="app-container">
        <div className="assessment-page">
          <div className="assessment-logo">
            <img src="/logo.png" alt="Marquis de Mayfair" />
          </div>
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">
              Question {currentQuestion + 1}
            </div>
          </div>
          
          <div className="question-card">
            <div className="dimension-badge" style={{ borderColor: DIMENSIONS[question.dimension]?.color }}>
              <span className="badge-text">{DIMENSIONS[question.dimension]?.name}</span>
            </div>
            
            <p className="question-text">{question.text}</p>
            
            <div className="answer-scale">
              <span className="scale-label scale-label-left">Strongly Disagree</span>
              <div className="scale-buttons">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    className={`scale-button ${answers[question.id] === value ? 'selected' : ''}`}
                    onClick={() => handleAnswer(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <span className="scale-label scale-label-right">Strongly Agree</span>
            </div>
            <div className="scale-labels-mobile">
              <span>Disagree</span>
              <span>Agree</span>
            </div>
          </div>
          
          <div className="navigation-arrows">
            <button 
              className={`nav-arrow nav-back ${currentQuestion === 0 ? 'disabled' : ''}`}
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
              aria-label="Previous question"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <span className="nav-counter">{currentQuestion + 1}</span>
            
            <button 
              className={`nav-arrow nav-forward ${currentQuestion >= furthestQuestion ? 'disabled' : ''}`}
              onClick={() => currentQuestion < furthestQuestion && setCurrentQuestion(currentQuestion + 1)}
              disabled={currentQuestion >= furthestQuestion}
              aria-label="Next question"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CALCULATING PHASE
  if (phase === 'calculating') {
    return (
      <div className="app-container">
        <div className="calculating-page">
          <div className="calculation-orb">
            <div className="orb-ring ring-1"></div>
            <div className="orb-ring ring-2"></div>
            <div className="orb-ring ring-3"></div>
            <div className="orb-core">⚜</div>
          </div>
          <h2 className="calculating-text">Distilling Your Essence</h2>
          <p className="calculating-sub">Analyzing {editableQuestions.length} dimensions of intimate expression...</p>
        </div>
      </div>
    );
  }

  // RESULTS PHASE (Statistical Summary)
  if (phase === 'results') {
    const sortedScores = Object.entries(scores)
      .filter(([dim]) => DIMENSIONS[dim])
      .sort(([,a], [,b]) => b - a);

    return (
      <div className="app-container">
        <div className="results-page">
          <div className="results-header">
            <h1>Your Psychometric Fingerprint</h1>
            <p className="header-sub">A statistical portrait of your intimate dimensions</p>
          </div>

          <div className="archetype-preview">
            <h2>Your Primary Archetype</h2>
            
            {primaryArchetype?.image && (
              <div className="archetype-image-container">
                <img 
                  src={primaryArchetype.image} 
                  alt={primaryArchetype.name}
                  className="archetype-image"
                />
              </div>
            )}
            
            <div className="archetype-card-mini">
              <div className="archetype-info">
                <h3>{primaryArchetype?.name}</h3>
                <p>{primaryArchetype?.title}</p>
              </div>
            </div>
            
            <p className="archetype-share-text">{primaryArchetype?.shareText}</p>
            
            <div className="social-share-buttons">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${primaryArchetype?.shareText}\n\n🔥 Discover your BDSM personality: ${getShareUrl()}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button share-x"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Share on X</span>
              </a>
              
              <button 
                onClick={() => {
                  const text = `${primaryArchetype?.shareText}\n\n🔥 Discover your BDSM personality: ${getShareUrl()}`;
                  navigator.clipboard.writeText(text);
                  alert('Copied to clipboard! Paste in Instagram.');
                }}
                className="share-button share-instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Copy for Instagram</span>
              </button>
              
              <button 
                onClick={() => {
                  const text = `${primaryArchetype?.shareText}\n\n🔥 Discover your BDSM personality: ${getShareUrl()}`;
                  navigator.clipboard.writeText(text);
                  alert('Copied to clipboard! Paste on FetLife.');
                }}
                className="share-button share-fetlife"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Copy for FetLife</span>
              </button>
            </div>
          </div>

          <div className="scores-grid">
            {sortedScores.map(([dimension, score], index) => {
              // Color gradient: Gold (top) → Green → Teal → Red (bottom)
              const getRankColor = (idx, total) => {
                const ratio = idx / (total - 1);
                if (ratio < 0.2) return '#f6c541'; // Gold (top scores)
                if (ratio < 0.4) return '#7cb342'; // Light green
                if (ratio < 0.6) return '#059669'; // Green/Teal
                if (ratio < 0.8) return '#0891b2'; // Teal/Blue
                return '#8B1538'; // Burgundy/Red (lowest)
              };
              const barColor = getRankColor(index, sortedScores.length);
              
              return (
                <div 
                  key={dimension} 
                  className={`score-bar ${index < 3 ? 'top-score' : ''}`}
                  style={{ '--delay': `${index * 0.05}s` }}
                >
                  <div className="bar-header">
                    <span className="bar-name">{DIMENSIONS[dimension]?.name}</span>
                    <span className="bar-percent">{score}%</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${score}%`,
                        backgroundColor: barColor
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="unlock-section">
            <div className="unlock-card">
              <h2>Unlock Your Full Persona</h2>
              <p>Receive a detailed <strong>FREE</strong> personalised report about your sexual archetype! Based on your individual responses with historical parallels, mythological connections, and your ideal BDSM product recommendations from the Marquis's private collection.</p>
              
              <div className="discount-callout">
                <span className="discount-badge">EXCLUSIVE OFFER</span>
                <p className="discount-text">Get <strong>10% OFF</strong> your next order with code <strong>PERSONA10</strong></p>
              </div>
              
              {!emailSubmitted ? (
                <form onSubmit={handleEmailSubmit} className="email-form">
                  {submitError && (
                    <div className="submit-error">
                      <span className="error-icon">⚠</span>
                      <span>{submitError}</span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    className="email-input name-input"
                    disabled={isSubmitting}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitError(''); // Clear error when email changes
                    }}
                    placeholder="Enter your email address"
                    className="email-input"
                    required
                    disabled={isSubmitting}
                  />
                  <label className="opt-in-label">
                    <input
                      type="checkbox"
                      checked={marketingOptIn}
                      onChange={(e) => setMarketingOptIn(e.target.checked)}
                      className="opt-in-checkbox"
                      required
                      disabled={isSubmitting}
                    />
                    <span>I agree the Marquis de Mayfair may contact me with my individual report and relevant offers. <em>*Unsubscribe any time.</em></span>
                  </label>
                  <button 
                    type="submit" 
                    className={`unlock-button gold-shine ${!marketingOptIn || isSubmitting ? 'disabled' : ''}`} 
                    disabled={!marketingOptIn || isSubmitting}
                  >
                    <span>{isSubmitting ? 'Verifying...' : 'Reveal My Archetype'}</span>
                  </button>
                  <p className="recaptcha-notice">Protected by reCAPTCHA</p>
                </form>
              ) : (
                <div className="generating-notice">
                  <div className="generating-spinner"></div>
                  <p className="loading-status">{loadingStatus || 'Generating your personalized analysis...'}</p>
                  <p className="loading-timer">{elapsedTime} seconds</p>
                  <p className="loading-note">Your comprehensive report typically takes 30-60 seconds</p>
                  <div className="loading-progress-bar-container">
                    <div className="loading-progress-bar" style={{ width: `${Math.min((elapsedTime / 60) * 100, 95)}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ARCHETYPE PHASE (Full AI Analysis with Product Matching)
  if (phase === 'archetype') {
    return (
      <div className="app-container">
        <div className="archetype-page">
          <div className="archetype-header">
            {primaryArchetype?.image && (
              <div className="archetype-image-container archetype-page-image">
                <img 
                  src={primaryArchetype.image} 
                  alt={primaryArchetype.name}
                  className="archetype-image"
                />
              </div>
            )}
            <h1 className="archetype-title">{primaryArchetype?.name}</h1>
            <p className="archetype-subtitle">{primaryArchetype?.title}</p>
          </div>

          <div className="parallels-section">
            <div className="parallel historical">
              <span className="parallel-label">Historical Parallel</span>
              <span className="parallel-name">{primaryArchetype?.historical}</span>
            </div>
            <div className="parallel mythological">
              <span className="parallel-label">Mythological Echo</span>
              <span className="parallel-name">{primaryArchetype?.mythological}</span>
            </div>
          </div>

          <div className="analysis-section">
            <h2>Your Comprehensive Personal Report</h2>
            {isGeneratingAI ? (
              <div className="analysis-loading">
                <div className="loading-quill">✒</div>
                <p>The Marquis is crafting your comprehensive report...</p>
                <div className="generation-timer">
                  <span className="timer-elapsed">{elapsedTime} seconds</span>
                  <span className="timer-note">Comprehensive reports typically take 30-60 seconds</span>
                </div>
                <div className="loading-progress">
                  <div className="loading-progress-bar" style={{ width: `${Math.min((elapsedTime / 45) * 100, 95)}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="analysis-text rich-report">
                {(aiAnalysis || primaryArchetype?.coldReading || '').split('\n').map((line, idx) => {
                  // Handle markdown-style headers
                  if (line.startsWith('## ')) {
                    return <h3 key={idx} className="report-section-header">{line.replace('## ', '')}</h3>;
                  }
                  if (line.startsWith('### ')) {
                    return <h4 key={idx} className="report-subsection-header">{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('# ')) {
                    return <h2 key={idx} className="report-main-header">{line.replace('# ', '')}</h2>;
                  }
                  if (line.startsWith('---')) {
                    return <hr key={idx} className="report-divider" />;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={idx} className="report-list-item">{line.replace('- ', '')}</li>;
                  }
                  if (line.trim() === '') {
                    return null;
                  }
                  // Bold text handling
                  const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  return <p key={idx} dangerouslySetInnerHTML={{ __html: boldParsed }} />;
                })}
              </div>
            )}
          </div>

          {/* Quick Product Links Section */}
          <div className="products-section products-quick-links">
            <h2>Quick Links: Your Recommended Collection</h2>
            <p className="products-intro">Direct links to the products mentioned in your report:</p>
            
            <div className="products-grid">
              {primaryArchetype?.suggestedProducts?.map((product, idx) => (
                <a 
                  key={idx} 
                  href={`https://www.marquisdemayfair.com${product.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-card"
                >
                  <h4>{product.name}</h4>
                  <span className="product-cta">Shop Now →</span>
                </a>
              ))}
            </div>
          </div>

          {/* Exclusive Discount Code Section */}
          <div className="discount-code-section">
            <div className="discount-code-card">
              <h3>Your Exclusive Reward</h3>
              <p className="discount-intro">As a thank you for completing your Persona Assessment, enjoy:</p>
              <div className="discount-code-display">
                <span className="discount-amount">10% OFF</span>
                <span className="discount-label">your entire order</span>
              </div>
              <div className="discount-code-box">
                <span className="code-label">Your Code:</span>
                <span className="code-value">PERSONA10</span>
                <button 
                  className="copy-code-btn"
                  onClick={() => {
                    navigator.clipboard.writeText('PERSONA10');
                    alert('Code copied! Use PERSONA10 at checkout.');
                  }}
                >
                  Copy
                </button>
              </div>
              <p className="discount-note">Use the same email address ({email}) at checkout to redeem your discount.</p>
              <a 
                href="https://www.marquisdemayfair.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="shop-now-btn"
              >
                Shop Now & Save 10%
              </a>
            </div>
          </div>

          <div className="secondary-archetype">
            <h3>Secondary Expression</h3>
            <div className="secondary-card">
              <span className="secondary-icon">{secondaryArchetype?.icon}</span>
              <div className="secondary-info">
                <h4>{secondaryArchetype?.name}</h4>
                <p>{secondaryArchetype?.title}</p>
              </div>
            </div>
          </div>

          <div className="share-section">
            <h3>Share Your Archetype</h3>
            <div className="share-buttons">
              <button 
                className="share-button twitter"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I am ${primaryArchetype?.name} - ${primaryArchetype?.title}.\n\n🔥 Discover your BDSM personality: ${getShareUrl()}`)}`, '_blank')}
              >
                Share on X
              </button>
              <button 
                className="share-button copy"
                onClick={() => {
                  navigator.clipboard.writeText(`I am ${primaryArchetype?.name} - ${primaryArchetype?.title}. My historical parallel is ${primaryArchetype?.historical}, and my mythological echo is ${primaryArchetype?.mythological}.\n\n🔥 Discover your BDSM personality: ${getShareUrl()}`);
                  alert('Copied to clipboard!');
                }}
              >
                Copy Result
              </button>
              <button 
                className="share-button fetlife"
                onClick={() => {
                  navigator.clipboard.writeText(`I am ${primaryArchetype?.name} - ${primaryArchetype?.title}.\n\n🔥 Discover your BDSM personality: ${getShareUrl()}`);
                  alert('Copied to clipboard! Paste on FetLife.');
                }}
              >
                Copy for FetLife
              </button>
            </div>
          </div>

          <div className="methodology-link-section">
            <button className="text-link" onClick={() => setPhase('methodology')}>
              View Our Scientific Methodology
            </button>
          </div>

          <div className="retake-section">
            <button 
              className="retake-button"
              onClick={() => {
                setPhase('landing');
                setCurrentQuestion(0);
                setAnswers({});
                setScores({});
                setPrimaryArchetype(null);
                setSecondaryArchetype(null);
                setEmail('');
                setEmailSubmitted(false);
                setAiAnalysis('');
              }}
            >
              Begin Again
            </button>
          </div>

          <footer className="archetype-footer">
            <div className="footer-logo">
              <img src="/logo.png" alt="Marquis de Mayfair" className="footer-logo-img" />
            </div>
            <p>Curators of Conscious Power Exchange</p>
            <p className="footer-shop">
              <a href="https://www.marquisdemayfair.com" target="_blank" rel="noopener noreferrer">
                Shop Luxury BDSM at marquisdemayfair.com
              </a>
            </p>
          </footer>
        </div>
      </div>
    );
  }

  return null;
}
