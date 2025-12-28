// Quiz Test Automation Script
// This script will be used to track test results
// Actual browser automation will be done through MCP browser tools

// Question structure for calculating expected results
const QUESTIONS = [
  { id: 1, dimension: 'dominance', weight: 1.4, isReversed: false },
  { id: 2, dimension: 'dominance', weight: 1.5, isReversed: false },
  { id: 3, dimension: 'dominance', weight: 1.3, isReversed: false },
  { id: 4, dimension: 'dominance', weight: 1.4, isReversed: false },
  { id: 5, dimension: 'dominance', weight: 1.2, isReversed: false },
  { id: 6, dimension: 'submission', weight: 1.4, isReversed: false },
  { id: 7, dimension: 'submission', weight: 1.5, isReversed: false },
  { id: 8, dimension: 'submission', weight: 1.3, isReversed: false },
  { id: 9, dimension: 'submission', weight: 1.2, isReversed: false },
  { id: 10, dimension: 'submission', weight: 1.4, isReversed: false },
  { id: 11, dimension: 'sadism', weight: 1.4, isReversed: false },
  { id: 12, dimension: 'sadism', weight: 1.3, isReversed: false },
  { id: 13, dimension: 'sadism', weight: 1.2, isReversed: false },
  { id: 14, dimension: 'sadism', weight: 1.3, isReversed: false },
  { id: 15, dimension: 'sadism', weight: 1.5, isReversed: false },
  { id: 16, dimension: 'masochism', weight: 1.5, isReversed: false },
  { id: 17, dimension: 'masochism', weight: 1.3, isReversed: false },
  { id: 18, dimension: 'masochism', weight: 1.4, isReversed: false },
  { id: 19, dimension: 'masochism', weight: 1.4, isReversed: false },
  { id: 20, dimension: 'masochism', weight: 1.2, isReversed: false },
  { id: 21, dimension: 'rigger', weight: 1.4, isReversed: false },
  { id: 22, dimension: 'rigger', weight: 1.5, isReversed: false },
  { id: 23, dimension: 'rigger', weight: 1.2, isReversed: false },
  { id: 24, dimension: 'rigger', weight: 1.3, isReversed: false },
  { id: 25, dimension: 'rope_bottom', weight: 1.5, isReversed: false },
  { id: 26, dimension: 'rope_bottom', weight: 1.4, isReversed: false },
  { id: 27, dimension: 'rope_bottom', weight: 1.3, isReversed: false },
  { id: 28, dimension: 'rope_bottom', weight: 1.4, isReversed: false },
  { id: 29, dimension: 'exhibitionist', weight: 1.5, isReversed: false },
  { id: 30, dimension: 'exhibitionist', weight: 1.4, isReversed: false },
  { id: 31, dimension: 'exhibitionist', weight: 1.2, isReversed: false },
  { id: 32, dimension: 'exhibitionist', weight: 1.3, isReversed: false },
  { id: 33, dimension: 'voyeur', weight: 1.4, isReversed: false },
  { id: 34, dimension: 'voyeur', weight: 1.2, isReversed: false },
  { id: 35, dimension: 'voyeur', weight: 1.3, isReversed: false },
  { id: 36, dimension: 'voyeur', weight: 1.1, isReversed: false },
  { id: 37, dimension: 'primal_hunter', weight: 1.5, isReversed: false },
  { id: 38, dimension: 'primal_hunter', weight: 1.4, isReversed: false },
  { id: 39, dimension: 'primal_hunter', weight: 1.4, isReversed: false },
  { id: 40, dimension: 'primal_hunter', weight: 1.3, isReversed: false },
  { id: 41, dimension: 'primal_prey', weight: 1.5, isReversed: false },
  { id: 42, dimension: 'primal_prey', weight: 1.4, isReversed: false },
  { id: 43, dimension: 'primal_prey', weight: 1.3, isReversed: false },
  { id: 44, dimension: 'primal_prey', weight: 1.2, isReversed: false },
  { id: 45, dimension: 'owner', weight: 1.5, isReversed: false },
  { id: 46, dimension: 'owner', weight: 1.4, isReversed: false },
  { id: 47, dimension: 'owner', weight: 1.3, isReversed: false },
  { id: 48, dimension: 'owner', weight: 1.3, isReversed: false },
  { id: 49, dimension: 'property', weight: 1.5, isReversed: false },
  { id: 50, dimension: 'property', weight: 1.4, isReversed: false },
  { id: 51, dimension: 'property', weight: 1.3, isReversed: false },
  { id: 52, dimension: 'property', weight: 1.3, isReversed: false },
  { id: 53, dimension: 'caregiver', weight: 1.4, isReversed: false },
  { id: 54, dimension: 'caregiver', weight: 1.3, isReversed: false },
  { id: 55, dimension: 'caregiver', weight: 1.2, isReversed: false },
  { id: 56, dimension: 'dependent', weight: 1.4, isReversed: false },
  { id: 57, dimension: 'dependent', weight: 1.3, isReversed: false },
  { id: 58, dimension: 'dependent', weight: 1.3, isReversed: false },
  { id: 59, dimension: 'switch', weight: 1.5, isReversed: false },
  { id: 60, dimension: 'switch', weight: 1.3, isReversed: false },
  { id: 61, dimension: 'switch', weight: 1.3, isReversed: false },
  { id: 62, dimension: 'service', weight: 1.3, isReversed: false },
  { id: 63, dimension: 'service', weight: 1.4, isReversed: false },
  { id: 64, dimension: 'service', weight: 1.2, isReversed: false },
];

const ARCHETYPE_MAPPING = {
  dominance: 'sovereign',
  submission: 'devotee',
  sadism: 'artisan',
  masochism: 'phoenix',
  rigger: 'weaver',
  rope_bottom: 'chrysalis',
  exhibitionist: 'luminary',
  voyeur: 'oracle',
  primal_hunter: 'apex',
  primal_prey: 'wild_heart',
  owner: 'guardian',
  property: 'beloved',
  caregiver: 'protector',
  dependent: 'innocent',
  switch: 'shapeshifter',
  service: 'acolyte',
};

function calculateExpectedScores(answers) {
  const dimensionScores = {};
  const dimensionMaxScores = {};
  
  const dimensions = [...new Set(QUESTIONS.map(q => q.dimension))];
  dimensions.forEach(dim => {
    dimensionScores[dim] = 0;
    dimensionMaxScores[dim] = 0;
  });

  QUESTIONS.forEach((question) => {
    const answer = answers[question.id];
    dimensionMaxScores[question.dimension] += 5 * question.weight;
    
    if (answer !== undefined) {
      let score = answer;
      if (question.isReversed) {
        score = 6 - score;
      }
      dimensionScores[question.dimension] += score * question.weight;
    }
  });

  const normalized = {};
  dimensions.forEach(dim => {
    const answered = QUESTIONS.filter(q => 
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
}

function determineExpectedArchetypes(scores) {
  const sorted = Object.entries(scores)
    .sort(([,a], [,b]) => b - a);
  
  if (sorted.length < 2) return { primary: null, secondary: null };
  
  const primaryDim = sorted[0][0];
  const secondaryDim = sorted[1][0];

  return {
    primary: ARCHETYPE_MAPPING[primaryDim] || null,
    secondary: ARCHETYPE_MAPPING[secondaryDim] || null,
    primaryDim,
    secondaryDim
  };
}

// Export for use in test tracking
export { QUESTIONS, ARCHETYPE_MAPPING, calculateExpectedScores, determineExpectedArchetypes };


