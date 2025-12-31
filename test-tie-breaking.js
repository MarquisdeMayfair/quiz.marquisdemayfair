// Tie-Breaking Verification Test
// Tests if identical answers produce consistent results when dimensions are tied

import puppeteer from 'puppeteer';

// Helper function for delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Question structure - matches App.jsx
const QUESTIONS = [
  { id: 1, dimension: 'dominance', weight: 1.4, isReversed: false, text: "In my ideal scene (a BDSM encounter), I'm the one giving orders, deciding what happens and when." },
  { id: 2, dimension: 'dominance', weight: 1.5, isReversed: false, text: "A sub (submissive partner) begging 'please may I cum?', with that power entirely mine to grant or deny, is intensely arousing." },
  { id: 3, dimension: 'dominance', weight: 1.3, isReversed: false, text: "When someone offers me their submission, I feel a deep sense of responsibility for their wellbeing and growth." },
  { id: 4, dimension: 'dominance', weight: 1.4, isReversed: false, text: "Directing a partner during sex, 'on your knees,' 'hands behind your back,' 'open wider', feels completely natural." },
  { id: 5, dimension: 'dominance', weight: 1.2, isReversed: false, text: "I mentally design scenarios involving edging (bringing close to orgasm repeatedly), denial, and controlled release." },
  { id: 6, dimension: 'submission', weight: 1.4, isReversed: false, text: "Surrendering control to a Dom (dominant partner), just feeling and obeying, creates profound relief in me." },
  { id: 7, dimension: 'submission', weight: 1.5, isReversed: false, text: "Orgasm denial, being forbidden to touch or cum without permission, heightens my arousal rather than frustrating me." },
  { id: 8, dimension: 'submission', weight: 1.3, isReversed: false, text: "Kneeling at my Dom's feet, looking up with genuine deference, feels like coming home." },
  { id: 9, dimension: 'submission', weight: 1.2, isReversed: false, text: "Hearing 'good girl' or 'good boy' from the right person has the power to completely undo me." },
  { id: 10, dimension: 'submission', weight: 1.4, isReversed: false, text: "Being used as a sex toy, my desires secondary to theirs, is a fantasy that deeply arouses me." },
  { id: 11, dimension: 'sadism', weight: 1.4, isReversed: false, text: "During impact play (spanking, flogging), watching skin flush and hearing breath catch deeply satisfies me." },
  { id: 12, dimension: 'sadism', weight: 1.3, isReversed: false, text: "The sounds my partner makes when pushed to their edge, gasps, moans, whimpers, are profoundly arousing." },
  { id: 13, dimension: 'sadism', weight: 1.2, isReversed: false, text: "I'm drawn to mastering impact play, the skill of wielding a flogger, crop, or paddle with precision." },
  { id: 14, dimension: 'sadism', weight: 1.3, isReversed: false, text: "Leaving marks on a willing partner, bruises or welts visible days later, creates pride and connection." },
  { id: 15, dimension: 'sadism', weight: 1.5, isReversed: false, text: "Seeing my partner cry from intense sensation during play creates a deep bond for me." },
  { id: 16, dimension: 'masochism', weight: 1.5, isReversed: false, text: "What others call pain, I experience as a doorway to subspace (trance-like euphoria) and release." },
  { id: 17, dimension: 'masochism', weight: 1.3, isReversed: false, text: "The anticipation before impact, knowing the flogger or hand is coming, creates almost unbearable arousal." },
  { id: 18, dimension: 'masochism', weight: 1.4, isReversed: false, text: "After intense play, I experience subspace, a euphoric, floating sensation that lasts for hours." },
  { id: 19, dimension: 'masochism', weight: 1.4, isReversed: false, text: "Being spanked, flogged, or paddled during sex significantly intensifies my orgasms." },
  { id: 20, dimension: 'masochism', weight: 1.2, isReversed: false, text: "When stressed, I crave intense sensation, impact play clears my mind like nothing else." },
  { id: 21, dimension: 'rigger', weight: 1.4, isReversed: false, text: "Shibari (Japanese rope bondage) appeals to me, the geometry on skin, the tension, the artistry of each tie." },
  { id: 22, dimension: 'rigger', weight: 1.5, isReversed: false, text: "Binding a partner, watching them surrender to helplessness with each wrap of rope, is meditative and arousing." },
  { id: 23, dimension: 'rigger', weight: 1.2, isReversed: false, text: "I'd invest significant time learning bondage, rope safety, knots, circulation checks, suspension techniques." },
  { id: 24, dimension: 'rigger', weight: 1.3, isReversed: false, text: "A bound partner, helpless, available, completely dependent on me, is intoxicating." },
  { id: 25, dimension: 'rope_bottom', weight: 1.5, isReversed: false, text: "Being tied up quiets my mind. Bondage creates internal freedom through external restriction." },
  { id: 26, dimension: 'rope_bottom', weight: 1.4, isReversed: false, text: "Complete immobilization, unable to resist even if I wanted, allows me to fully surrender to sensation." },
  { id: 27, dimension: 'rope_bottom', weight: 1.3, isReversed: false, text: "Ropes progressively tightening around my body creates a sense of being held, contained, deeply safe." },
  { id: 28, dimension: 'rope_bottom', weight: 1.4, isReversed: false, text: "Suspension bondage, being lifted and floating in rope, would be a transcendent experience for me." },
  { id: 29, dimension: 'exhibitionist', weight: 1.5, isReversed: false, text: "Being watched during sex, knowing eyes are on my body and pleasure, intensifies everything." },
  { id: 30, dimension: 'exhibitionist', weight: 1.4, isReversed: false, text: "Performing at a play party (a BDSM social event), fucking or being fucked before an audience, is a fantasy." },
  { id: 31, dimension: 'exhibitionist', weight: 1.2, isReversed: false, text: "Wearing something revealing in public, feeling eyes on me, creates a pleasant arousal throughout my day." },
  { id: 32, dimension: 'exhibitionist', weight: 1.3, isReversed: false, text: "Being displayed by my Dom, posed, presented, shown off to others, would make me feel valuable and desired." },
  { id: 33, dimension: 'voyeur', weight: 1.4, isReversed: false, text: "Watching others fuck, with their consent, arouses me as much as participating might." },
  { id: 34, dimension: 'voyeur', weight: 1.2, isReversed: false, text: "I study the dynamics between partners during a scene, their negotiation, responses, connection." },
  { id: 35, dimension: 'voyeur', weight: 1.3, isReversed: false, text: "Being invited to watch a couple having sex is a real turn on to me." },
  { id: 36, dimension: 'voyeur', weight: 1.1, isReversed: false, text: "Reading erotica turns me on more than watching porn." },
  { id: 37, dimension: 'primal_hunter', weight: 1.5, isReversed: false, text: "During primal play, something ancient wakes in me: the chase, the hunt, the capture." },
  { id: 38, dimension: 'primal_hunter', weight: 1.4, isReversed: false, text: "Growling, biting, scratching, wrestling, these raw expressions feel authentically sexual to me." },
  { id: 39, dimension: 'primal_hunter', weight: 1.4, isReversed: false, text: "Pinning my prey down, feeling them struggle even as they want to be caught, deeply satisfies me." },
  { id: 40, dimension: 'primal_hunter', weight: 1.3, isReversed: false, text: "I feel most sexually alive when civilized restraint drops and something rawer emerges." },
  { id: 41, dimension: 'primal_prey', weight: 1.5, isReversed: false, text: "Being hunted, the adrenaline of the chase, the thrill of inevitable capture, awakens something primal in me." },
  { id: 42, dimension: 'primal_prey', weight: 1.4, isReversed: false, text: "The moment of capture, struggling against strength I can't overcome, creates an intense rush." },
  { id: 43, dimension: 'primal_prey', weight: 1.3, isReversed: false, text: "CNC (consensual non-consent), resisting even though I want to be taken, is arousing to me." },
  { id: 44, dimension: 'primal_prey', weight: 1.2, isReversed: false, text: "Bite marks and scratches from rough sex feel like evidence of real passion." },
  { id: 45, dimension: 'owner', weight: 1.5, isReversed: false, text: "I'm drawn to 24/7 dynamics (full-time power exchange), protocols, rules, ongoing authority beyond the bedroom." },
  { id: 46, dimension: 'owner', weight: 1.4, isReversed: false, text: "Owning someone completely, their training, development, and wellbeing my responsibility, fulfills a deep need." },
  { id: 47, dimension: 'owner', weight: 1.3, isReversed: false, text: "Collaring a partner (a BDSM commitment symbol), having them wear my mark of ownership, satisfies me fundamentally." },
  { id: 48, dimension: 'owner', weight: 1.3, isReversed: false, text: "Training a sub, shaping their behaviors, protocols, and service to my preferences, appeals to me." },
  { id: 49, dimension: 'property', weight: 1.5, isReversed: false, text: "TPE (Total Power Exchange), being completely owned, my autonomy willingly given, feels like ultimate freedom." },
  { id: 50, dimension: 'property', weight: 1.4, isReversed: false, text: "Wearing my Owner's collar would feel like belonging, not a constraint, but a homecoming." },
  { id: 51, dimension: 'property', weight: 1.3, isReversed: false, text: "Living under protocols, daily rules structuring my behavior for my Owner's pleasure, would help me thrive." },
  { id: 52, dimension: 'property', weight: 1.3, isReversed: false, text: "Being a treasured possession, cared for, displayed, used according to my Owner's wishes, appeals deeply to me." },
  { id: 53, dimension: 'caregiver', weight: 1.4, isReversed: false, text: "As a Daddy/Mommy Dom (nurturing dominant), caring for a partner in littlespace (a younger headspace) feels sacred." },
  { id: 54, dimension: 'caregiver', weight: 1.3, isReversed: false, text: "Setting bedtimes, rules, and gentle punishments, creating loving structure, appeals to my protective instincts." },
  { id: 55, dimension: 'caregiver', weight: 1.2, isReversed: false, text: "Firm authority combined with tender affection feels natural to how I'd lead a D/s relationship." },
  { id: 56, dimension: 'dependent', weight: 1.4, isReversed: false, text: "Littlespace (accessing a younger, playful headspace) emerges naturally when I feel safe and cared for." },
  { id: 57, dimension: 'dependent', weight: 1.3, isReversed: false, text: "Being held and praised by a Daddy/Mommy Dom, comforted like a treasured little, would feel deeply healing." },
  { id: 58, dimension: 'dependent', weight: 1.3, isReversed: false, text: "Age play activities, coloring, stuffies, being tucked in, in an intimate D/s context appeal to me." },
  { id: 59, dimension: 'switch', weight: 1.5, isReversed: false, text: "I'm a switch, sometimes craving to dominate, sometimes to submit, and both feel authentically me." },
  { id: 60, dimension: 'switch', weight: 1.3, isReversed: false, text: "Labeling myself strictly as Dom or sub doesn't fit, I contain both and express them contextually." },
  { id: 61, dimension: 'switch', weight: 1.3, isReversed: false, text: "With different partners or moods, I inhabit completely different positions on the power spectrum." },
  { id: 62, dimension: 'service', weight: 1.3, isReversed: false, text: "As a service sub, anticipating my Dom's needs, the perfect drink, the drawn bath, deeply satisfies me." },
  { id: 63, dimension: 'service', weight: 1.4, isReversed: false, text: "My pleasure comes second, ensuring my partner is completely satisfied and cared for comes first." },
  { id: 64, dimension: 'service', weight: 1.2, isReversed: false, text: "Acts of service, completing tasks, running errands, making their life easier, are how I express devotion." },
];

// Create answers that produce EXACTLY equal scores for primal_hunter and switch
// This requires careful calculation to ensure both dimensions score exactly the same
function generateTieBreakingAnswers() {
  const answers = {};
  
  // Initialize all answers to 1 (lowest)
  QUESTIONS.forEach(q => {
    answers[q.id] = 1;
  });
  
  // Set primal_hunter questions to 5 (maximum)
  QUESTIONS.forEach(q => {
    if (q.dimension === 'primal_hunter') {
      answers[q.id] = 5;
    }
  });
  
  // Set switch questions to 5 (maximum) 
  QUESTIONS.forEach(q => {
    if (q.dimension === 'switch') {
      answers[q.id] = 5;
    }
  });
  
  // Set all other dimensions to lower values to ensure primal_hunter and switch are tied highest
  QUESTIONS.forEach(q => {
    if (q.dimension !== 'primal_hunter' && q.dimension !== 'switch') {
      answers[q.id] = 1; // Keep low
    }
  });
  
  return answers;
}

// Run a single test with specific answers
async function runTieBreakingTest(browser, testNumber, answers) {
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Click start assessment
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startBtn = buttons.find(btn => btn.textContent.includes('Start the Assessment') || btn.textContent.includes('Start'));
      if (startBtn) startBtn.click();
    });
    await delay(500);
    
    // Track which question IDs we've already answered
    const answeredQuestionIds = new Set();
    const questionOrderMap = new Map();
    
    // Answer all 64 questions
    for (let i = 0; i < 64; i++) {
      await delay(300);
      
      // Get current question text
      const questionText = await page.evaluate(() => {
        const questionEl = document.querySelector('.question-text');
        if (questionEl) {
          return questionEl.textContent?.trim() || '';
        }
        const paragraphs = Array.from(document.querySelectorAll('p'));
        for (const p of paragraphs) {
          const text = p.textContent?.trim() || '';
          if (text.length > 50 && text.length < 500 && 
              (text.includes('I') || text.includes('my') || text.includes('feel'))) {
            return text;
          }
        }
        return '';
      });
      
      // Find matching question ID
      let questionId = null;
      
      if (questionText && questionText.length > 20) {
        const normalizedQuestionText = questionText.toLowerCase().replace(/\s+/g, ' ').trim();
        let bestMatch = null;
        let bestMatchScore = 0;
        
        for (const q of QUESTIONS) {
          if (answeredQuestionIds.has(q.id)) {
            continue;
          }
          
          const normalizedQText = q.text.toLowerCase().replace(/\s+/g, ' ').trim();
          const qWords = normalizedQText.split(' ').slice(0, 10);
          const qPhrase = qWords.join(' ');
          
          if (normalizedQuestionText.includes(qPhrase) && qPhrase.length > 30) {
            const matchScore = qPhrase.length;
            if (matchScore > bestMatchScore) {
              bestMatch = q.id;
              bestMatchScore = matchScore;
            }
          }
          
          const qStart = normalizedQText.substring(0, 60);
          if (normalizedQuestionText.includes(qStart) && qStart.length > 40) {
            const matchScore = qStart.length;
            if (matchScore > bestMatchScore) {
              bestMatch = q.id;
              bestMatchScore = matchScore;
            }
          }
        }
        
        if (bestMatch && bestMatchScore > 20) {
          questionId = bestMatch;
        }
      }
      
      if (!questionId && questionOrderMap.has(i)) {
        questionId = questionOrderMap.get(i);
      }
      
      if (!questionId) {
        // Skip if we can't match
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const answerBtn = buttons.find(btn => /^[1-5]$/.test(btn.textContent.trim()));
          if (answerBtn) answerBtn.click();
        });
        await delay(300);
        continue;
      }
      
      questionOrderMap.set(i, questionId);
      answeredQuestionIds.add(questionId);
      
      const answerValue = answers[questionId] || 1;
      
      // Click the answer button
      await page.evaluate((value) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const answerBtn = buttons.find(btn => {
          const text = btn.textContent.trim();
          return /^[1-5]$/.test(text) && parseInt(text) === value;
        });
        if (answerBtn) {
          answerBtn.click();
        } else {
          const numericBtn = buttons.find(btn => /^[1-5]$/.test(btn.textContent.trim()));
          if (numericBtn) numericBtn.click();
        }
      }, answerValue);
      
      await delay(300);
    }
    
    // Wait for results
    try {
      await page.waitForSelector('h1, h2, h3, [class*="archetype"]', { timeout: 10000 });
    } catch (e) {}
    await delay(3000);
    
    // Extract archetype result
    const result = await page.evaluate(() => {
      let primaryText = '';
      const h3s = Array.from(document.querySelectorAll('h3'));
      for (const h3 of h3s) {
        const text = h3.textContent?.trim() || '';
        if (text.startsWith('The ')) {
          primaryText = text;
          break;
        }
      }
      
      if (!primaryText) {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
        for (const h of headings) {
          const text = h.textContent?.trim() || '';
          if (text.includes('The ') && text.length < 30) {
            primaryText = text;
            break;
          }
        }
      }
      
      const nameMap = {
        'The Sovereign': 'sovereign',
        'The Devotee': 'devotee',
        'The Artisan': 'artisan',
        'The Phoenix': 'phoenix',
        'The Weaver': 'weaver',
        'The Chrysalis': 'chrysalis',
        'The Luminary': 'luminary',
        'The Oracle': 'oracle',
        'The Apex': 'apex',
        'The Wild Heart': 'wild_heart',
        'The Guardian': 'guardian',
        'The Beloved': 'beloved',
        'The Protector': 'protector',
        'The Innocent': 'innocent',
        'The Shapeshifter': 'shapeshifter',
        'The Acolyte': 'acolyte'
      };
      
      for (const [fullName, key] of Object.entries(nameMap)) {
        if (primaryText.includes(fullName) || primaryText.toLowerCase().includes(key)) {
          return key;
        }
      }
      
      return null;
    });
    
    return result;
    
  } catch (error) {
    console.error(`Test ${testNumber} error:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

// Main test runner
async function runTieBreakingTests() {
  const browser = await puppeteer.launch({ headless: true });
  
  console.log('=== Tie-Breaking Verification Test ===\n');
  console.log('Testing: Identical answers should produce identical results');
  console.log('Scenario: primal_hunter and switch both score exactly 80\n');
  
  const answers = generateTieBreakingAnswers();
  const results = [];
  
  for (let i = 1; i <= 5; i++) {
    process.stdout.write(`Running test ${i}/5... `);
    const result = await runTieBreakingTest(browser, i, answers);
    results.push(result);
    console.log(`Result: ${result || 'null'}`);
  }
  
  await browser.close();
  
  console.log('\n=== Results ===');
  results.forEach((result, idx) => {
    console.log(`Test ${idx + 1}: ${result || 'null'}`);
  });
  
  const uniqueResults = [...new Set(results)];
  const allSame = uniqueResults.length === 1 && results[0] !== null;
  
  console.log('\n=== Verification ===');
  if (allSame) {
    console.log('✅ PASS: All 5 tests produced identical results');
    console.log(`   Consistent result: ${results[0]}`);
  } else {
    console.log('❌ FAIL: Tests produced different results');
    console.log(`   Unique results: ${uniqueResults.join(', ')}`);
    console.log('   This indicates tie-breaking is NOT deterministic');
  }
  
  return allSame;
}

// Run tests
runTieBreakingTests().catch(console.error);




