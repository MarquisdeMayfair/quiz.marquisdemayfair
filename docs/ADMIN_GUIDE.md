# Question Administration Guide
## Editing Questions While Maintaining Psychometric Validity

---

## Overview

The Marquis de Mayfair Persona Assessment includes a built-in admin panel for editing questions. This guide explains how to modify questions while maintaining the integrity of the scoring algorithm and cross-question weighting.

---

## Accessing the Admin Panel

1. Launch the assessment application
2. On the landing page, click **"Admin Panel"** in the secondary actions area
3. The admin interface displays all questions with their current configuration

---

## Understanding Question Structure

Each question has these editable properties:

```javascript
{
  id: 1,                          // Unique identifier (auto-generated)
  text: "Question text...",       // The question shown to users
  dimension: 'dominance',         // Which dimension this measures
  weight: 1.4,                    // Scoring weight (0.5 to 2.0)
  isReversed: false,              // Whether to reverse-score
  category: 'power_orientation',  // Organizational category
  academicConstruct: "...",       // Academic basis (documentation)
  adultDirectness: 'high'         // Explicitness level
}
```

---

## Editing Rules for Validity

### ✅ Safe Edits (Will Not Break Scoring)

1. **Rewording for clarity**: Changing phrasing while maintaining meaning
   - Original: "I naturally picture myself directing the action"
   - Safe edit: "I instinctively imagine myself in control of what happens"

2. **Adjusting directness level**: Making questions more or less explicit
   - More explicit: "The idea of ordering my partner to their knees is arousing"
   - Less explicit: "Being obeyed by a partner feels deeply satisfying"

3. **Adding new questions**: Adding questions to strengthen a dimension's measurement

4. **Removing weak questions**: Deleting questions with low discriminant validity

5. **Adjusting weights within bounds**: Changing weights between 0.8× and 1.5×

### ⚠️ Caution Required

1. **Changing dimension assignment**: Moving a question to a different dimension
   - **Impact**: Alters dimension score distributions
   - **Recommendation**: Only do this if the question clearly fits better elsewhere

2. **Toggling reverse-scoring**: Changing `isReversed` property
   - **Impact**: Completely inverts the question's contribution
   - **When appropriate**: If you realize a question measures the opposite of what was intended

3. **Extreme weight changes**: Setting weights below 0.8× or above 1.5×
   - **Impact**: May over/under-represent certain questions
   - **Recommendation**: Keep weights in the standard range

### ❌ Changes That Will Break Scoring

1. **Removing all questions from a dimension**: Each dimension needs at least 2 questions
2. **Changing the dimension code/key**: The system relies on exact dimension names
3. **Removing the `weight` property**: All questions must have weights
4. **Duplicating question IDs**: Each ID must be unique

---

## Weight Guidelines

| Weight | When to Use | Example Scenario |
|--------|-------------|------------------|
| 0.8× | Peripheral indicator, social desirability concerns | A question that might be answered to look good |
| 1.0× | Standard indicator | Typical question with normal validity |
| 1.2× | Moderate centrality | Question that clearly measures the core construct |
| 1.3× | High face validity | Question that directly asks about the dimension |
| 1.4× | High discriminant validity | Question that differentiates this dimension well |
| 1.5× | Core/defining indicator | The most central question for this dimension |

---

## Reverse-Scoring Guide

### When to Use Reverse-Scoring

A question should be reverse-scored when **disagreeing** indicates a **high** score on the dimension.

**Example for Dominance:**
- Normal: "I enjoy being in control during intimate encounters" (Agree = high dominance)
- Reversed: "I prefer my partner to take the lead" (Agree = LOW dominance, so we reverse)

### Implementation

In the admin panel:
1. Check the "Reversed" checkbox
2. The system automatically calculates: `effectiveScore = 6 - rawScore`

---

## Adding New Questions

### Step-by-Step Process

1. Click **"+ Add Question"** in the admin panel
2. Write your question text following these guidelines:
   - First-person perspective ("I find...", "When I imagine...")
   - Present tense or conditional ("would feel")
   - Clear, unambiguous language
   - Sex-positive, non-judgmental tone

3. Select the appropriate dimension from the dropdown

4. Set the weight based on centrality (start at 1.0× if unsure)

5. Document the academic construct for reference

6. Click **"Save"**

### Maintaining Balance

Aim for 3-5 questions per dimension for reliable measurement. Check the admin stats section to see current question counts per dimension.

---

## Removing Questions

### Before Removing

1. Check if the dimension will still have at least 2 questions
2. Consider if the question provides unique measurement value
3. Verify no other question covers this specific aspect

### Process

1. Click **"Delete"** on the question row
2. Confirm the deletion
3. The question is immediately removed from the active assessment

---

## Exporting & Importing Questions

### Export

1. Click **"Export JSON"** in the admin panel
2. A file `marquis_questions.json` will download
3. This contains the complete question database with all properties

### Import (Manual)

To import a modified question set:
1. Edit the exported JSON file
2. Replace the `ORIGINAL_QUESTIONS` array in `App.jsx`
3. Rebuild the application

---

## Testing Changes

After modifying questions:

1. **Take the test yourself** with various answer patterns
2. **Verify dimension scores** make sense for your answers
3. **Check archetype assignment** matches expectations
4. **Review product recommendations** are still appropriate

---

## Quality Checklist

Before deploying changes, verify:

- [ ] All dimensions have at least 2 questions
- [ ] All questions have valid weights (0.5-2.0)
- [ ] Reverse-scored questions are correctly marked
- [ ] Question text is clear and unambiguous
- [ ] No duplicate question IDs
- [ ] Academic constructs are documented
- [ ] Build completes without errors

---

## Dimension Reference

| Dimension Key | Dimension Name | Description |
|---------------|----------------|-------------|
| `dominance` | Dominance | Control and leadership orientation |
| `submission` | Submission | Surrender and obedience orientation |
| `sadism` | Sensory Dominance | Pleasure from administering sensation |
| `masochism` | Sensory Reception | Pleasure from receiving sensation |
| `rigger` | Bondage Artistry | Restraint and rope skills |
| `rope_bottom` | Bondage Reception | Being restrained |
| `exhibitionist` | Exhibition | Being watched |
| `voyeur` | Witness | Watching others |
| `primal_hunter` | Primal Pursuit | Chase and capture (predator) |
| `primal_prey` | Primal Flight | Being chased (prey) |
| `owner` | Total Authority | 24/7 ownership (dominant) |
| `property` | Total Surrender | Being owned |
| `caregiver` | Nurturing Authority | Nurturing dominance |
| `dependent` | Nurtured State | Being cared for |
| `switch` | Role Fluidity | Moving between roles |
| `service` | Devotional Service | Service orientation |

---

## Troubleshooting

### "Dimension scores all show 0%"
- Check that questions are properly assigned to dimensions
- Verify dimension keys exactly match expected values

### "Archetype not displaying"
- Ensure at least one dimension has questions answered
- Check that archetype-to-dimension mapping is intact

### "Weights not affecting scores"
- Verify weights are numbers, not strings
- Ensure weights are positive values

### "Reversed questions calculating incorrectly"
- Confirm `isReversed` is boolean `true`, not string "true"
- Check that reverse calculation is: `6 - rawScore`

---

## Contact

For technical support with question administration:
- Email: tech@marquisdemayfair.com
- Documentation: docs.marquisdemayfair.com/persona-assessment

---

*© 2024 Marquis de Mayfair. Admin Guide v2.0*
