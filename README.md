# Marquis de Mayfair Persona Assessment v2.0

## Academic-Grade BDSM Psychometric Instrument

[![Version](https://img.shields.io/badge/version-2.0.0-gold.svg)]()
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)]()
[![React](https://img.shields.io/badge/React-18.2-blue.svg)]()

---

## 🎯 Overview

The Marquis de Mayfair Persona Assessment is a **luxury psychometric tool** that helps users discover their intimate archetype through academically-grounded questions. Unlike generic BDSM tests, this assessment combines:

- **64 Original Questions** - Developed from peer-reviewed research (NOT copied from BDSMtest.org)
- **16 Psychological Dimensions** - Based on Connolly, Yost & Hunter, and Wismeijer research
- **16 Unique Archetypes** - Historical and mythological parallels for each type
- **AI-Powered Analysis** - Personalized cold readings via Claude API
- **Product Matching** - Curated recommendations from marquisdemayfair.com
- **Admin Panel** - Edit questions while maintaining scoring validity
- **Methodology Page** - Full academic transparency

---

## ⚠️ Copyright Independence Statement

**This assessment contains NO content derived from, copied from, or adapted from BDSMtest.org or any other existing assessment tool.**

All 64 questions are original compositions developed using a construct-first methodology based on peer-reviewed psychological research. See `/docs/METHODOLOGY.md` for complete academic foundations.

---

## 🌟 Key Features

### For Users

| Feature | Description |
|---------|-------------|
| 64-Question Assessment | Comprehensive measurement across 16 dimensions |
| Statistical Dashboard | Visual bar chart of all dimension scores |
| Archetype Reveal | Primary and secondary archetype identification |
| AI Cold Reading | Personalized 3-paragraph psychological analysis |
| Product Recommendations | Matched luxury items for each archetype |
| Social Sharing | Twitter/X and clipboard sharing |
| Scientific Methodology | Full transparency on academic basis |

### For Administrators

| Feature | Description |
|---------|-------------|
| Question Editor | Edit text, weights, dimensions, reverse-scoring |
| Add/Remove Questions | Grow or refine the question bank |
| Export to JSON | Download complete question database |
| Dimension Statistics | See question count per dimension |
| Weight Adjustment | Fine-tune scoring impact (0.8× to 1.5×) |
| Academic Documentation | Track constructs and references |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd marquis-persona-test-v2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment

Recommended platforms:
- **Vercel** (recommended) - Free tier, automatic HTTPS
- **Netlify** - Similar capabilities
- **Cloudflare Pages** - Best global performance

For Shopify integration, deploy to subdomain: `quiz.marquisdemayfair.com`

---

## 📁 Project Structure

```
marquis-persona-test-v2/
├── src/
│   ├── App.jsx          # Complete React application (64 questions, 16 archetypes)
│   ├── index.css        # Luxury dark aesthetic styling
│   └── main.jsx         # React entry point
├── docs/
│   ├── METHODOLOGY.md   # Academic foundations & originality statement
│   ├── ADMIN_GUIDE.md   # Question editing guidelines
│   └── PRODUCT_DESIGN_BRIEF.md  # Original PDB
├── dist/                # Production build
├── index.html           # HTML entry with SEO meta
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
└── README.md            # This file
```

---

## 🧪 The 16 Dimensions

| Dimension | Code | Academic Basis |
|-----------|------|----------------|
| Dominance | DOM | Power motivation (McClelland, 1975) |
| Submission | SUB | Psychological relief (Yost & Hunter, 2012) |
| Sensory Dominance | SAD | Transformed pain (Dunkley et al., 2020) |
| Sensory Reception | MAS | Endorphin states (Sagarin et al., 2009) |
| Bondage Artistry | RIG | Flow states (Williams et al., 2016) |
| Bondage Reception | ROP | Mindfulness (Newmahr, 2010) |
| Exhibition | EXH | Display behaviors (Hébert & Weaver, 2014) |
| Witness | VOY | Observer dynamics (Connolly, 2006) |
| Primal Pursuit | HNT | Evolutionary psychology |
| Primal Flight | PRY | Fear-excitement overlap |
| Total Authority | OWN | 24/7 dynamics (Pitagora, 2016) |
| Total Surrender | PRP | Ownership attachment |
| Nurturing Authority | CG | Caregiving dynamics (Baker, 2018) |
| Nurtured State | DEP | Therapeutic regression (Sprott, 2020) |
| Role Fluidity | SWT | Switch research (Martinez, 2018) |
| Devotional Service | SRV | Service orientation (Weiss, 2006) |

---

## 🎭 The 16 Archetypes

| Archetype | Dimension | Historical | Mythological |
|-----------|-----------|------------|--------------|
| The Sovereign | Dominance | Catherine the Great | Zeus |
| The Devotee | Submission | Empress Josephine | Psyche |
| The Artisan | Sensory Dom | Discipline as art | Hephaestus |
| The Phoenix | Sensory Rec | Frida Kahlo | Prometheus |
| The Weaver | Bondage Art | Renaissance arts | Arachne |
| The Chrysalis | Bondage Rec | Botticelli's Venus | Andromeda |
| The Luminary | Exhibition | Mata Hari | Aphrodite |
| The Oracle | Witness | Anaïs Nin | Artemis |
| The Apex | Primal Hunt | The wild | Fenrir |
| The Wild Heart | Primal Prey | Atalanta | Daphne |
| The Guardian | Total Auth | Ideal protector | Hades |
| The Beloved | Total Surr | Royal consorts | Persephone |
| The Protector | Nurturing | Nurturing guide | Demeter |
| The Innocent | Nurtured | Preserved wonder | Hebe |
| The Shapeshifter | Fluid | David Bowie | Loki |
| The Acolyte | Service | Temple attendants | Hestia |

---

## 🛡️ API Security

**CRITICAL**: Never expose API keys in frontend code.

For AI analysis, use a serverless function:

```javascript
// /api/generate-analysis.js (Vercel example)
export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
```

---

## 📊 Analytics Events

Implement tracking for these key events:

```javascript
// Assessment funnel
{ event: 'assessment_started' }
{ event: 'question_answered', question_id: 1, dimension: 'dominance' }
{ event: 'assessment_completed', completion_time_seconds: 340 }

// Conversion events
{ event: 'email_captured', consent_marketing: true }
{ event: 'analysis_generated', primary_archetype: 'sovereign' }

// Engagement
{ event: 'share_clicked', platform: 'twitter' }
{ event: 'product_clicked', product_name: 'Black Label Flogger' }
{ event: 'methodology_viewed' }
```

---

## 🎨 Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--black-deep` | #0A0A0A | Primary background |
| `--gold-bright` | #D4AF37 | Primary accent |
| `--burgundy` | #8B1538 | Secondary accent |
| `--cream` | #F5F0E8 | Text color |

### Typography

| Font | Usage |
|------|-------|
| Cinzel | Display headings |
| Cormorant Garamond | Elegant body text |
| Raleway | UI elements |
| JetBrains Mono | Admin panel code |

---

## 📄 Documentation

| Document | Description |
|----------|-------------|
| `docs/METHODOLOGY.md` | Full academic foundations, references, originality statement |
| `docs/ADMIN_GUIDE.md` | How to edit questions while maintaining validity |
| `docs/PRODUCT_DESIGN_BRIEF.md` | Original product requirements |

---

## 🔧 Customization

### Adding Products

Edit the `suggestedProducts` array in each archetype:

```javascript
suggestedProducts: [
  { 
    name: "Product Name", 
    url: "/products/product-slug", 
    reason: "Why this matches the archetype" 
  }
]
```

### Modifying Archetypes

Each archetype in `ARCHETYPES` object can be customized:
- Historical/mythological parallels
- Cold reading text (Barnum statements)
- Product category mappings
- Icons and visual elements

### Adjusting Scoring

Weights can be modified in the admin panel or directly in `ORIGINAL_QUESTIONS`:
- 0.8× for peripheral indicators
- 1.0× for standard questions
- 1.5× for core/defining questions

---

## 🤝 Contributing

This is proprietary software for Marquis de Mayfair. For authorized modifications:

1. Document the academic basis for any new questions
2. Maintain the construct-first methodology
3. Test scoring validity after changes
4. Update METHODOLOGY.md as needed

---

## 📜 License

**Proprietary** - All rights reserved by Marquis de Mayfair.

The assessment methodology, question bank, archetype framework, and product matching system are protected intellectual property.

---

## 📧 Contact

- **Website**: [marquisdemayfair.com](https://www.marquisdemayfair.com)
- **Technical**: tech@marquisdemayfair.com
- **Research**: research@marquisdemayfair.com

---

*Built with ⚜️ by Marquis de Mayfair* v2.0

## 🎭 Overview

A luxury, academically-grounded psychometric assessment for exploring intimate power dynamics. Built with **100% original questions** developed from peer-reviewed research—legally and ethically independent from any existing BDSM assessment tool.

## ✨ Key Features

- **64 Original Questions** - Developed from academic constructs, not copied from any source
- **16 Dimensions** - Comprehensive measurement of power exchange orientations
- **16 Unique Archetypes** - Historical and mythological parallels
- **AI-Powered Analysis** - Personalized cold readings via Claude API
- **Product Matching** - Links results to marquisdemayfair.com products
- **Admin Panel** - Edit questions while maintaining scoring validity
- **Methodology Page** - Full transparency about academic grounding
- **Sex-Positive & Direct** - Adult language that respects users' intelligence

## 🎓 Academic Foundation

Questions developed from peer-reviewed literature including:

- **Connolly (2006)** - Psychological Functioning of BDSM Practitioners
- **Yost & Hunter (2012)** - Initial Attraction to BDSM Sexuality
- **Wismeijer & Van Assen (2013)** - Psychological Characteristics
- **Sagarin et al. (2009)** - Hormonal Changes in BDSM Activity
- **Cross & Matheson (2006)** - Understanding Sadomasochism
- **Martinez (2018)** - BDSM Role Fluidity

See `docs/PRODUCT_DESIGN_BRIEF.md` for complete methodology.

## ⚖️ Copyright Independence

**This assessment contains ZERO content from BDSMtest.org or any other existing tool.**

We use a **construct-first methodology**:
1. Identify psychological constructs from academic literature
2. Write original items that operationalize those constructs
3. Assign independent weights based on psychometric principles

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
marquis-persona-test-v2/
├── src/
│   ├── App.jsx          # Main application (64 questions, 16 archetypes, admin panel)
│   ├── index.css        # Luxury dark aesthetic styling
│   └── main.jsx         # React entry point
├── docs/
│   └── PRODUCT_DESIGN_BRIEF.md  # Full methodology documentation
├── index.html           # HTML entry with meta tags
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
└── README.md            # This file
```

## 🛠️ Admin Panel

Access via "Admin Panel" link on landing page. Features:

- **Edit Questions** - Modify text, weights, dimensions
- **Add/Remove Questions** - Expand or refine the instrument
- **Export JSON** - Backup question bank
- **Dimension Stats** - Track question distribution

### Maintaining Scoring Validity

When editing questions:
- ✅ Text changes that preserve construct measurement
- ✅ Weight adjustments within 0.5× to 2.0× range
- ✅ Adding reverse-scored items for validity
- ⚠️ Be cautious removing many questions from a dimension
- ⚠️ Changing dimension assignments requires construct review

## 🏛️ The 16 Archetypes

| Archetype | Dimension | Historical | Mythological |
|-----------|-----------|------------|--------------|
| The Sovereign | Dominance | Catherine the Great | Zeus |
| The Devotee | Submission | Empress Josephine | Psyche |
| The Artisan | Sensory Dominance | Discipline as Art | Hephaestus |
| The Phoenix | Sensory Reception | Frida Kahlo | Prometheus |
| The Weaver | Bondage Artistry | Renaissance Arts | Arachne |
| The Chrysalis | Bondage Reception | Botticelli's Venus | Andromeda |
| The Luminary | Exhibition | Mata Hari | Aphrodite |
| The Oracle | Witness | Anaïs Nin | Artemis |
| The Apex | Primal Pursuit | The Wild Hunt | Fenrir |
| The Wild Heart | Primal Flight | Atalanta | Daphne |
| The Guardian | Total Authority | Victorian Patriarch | Hades |
| The Beloved | Total Surrender | Royal Consorts | Persephone |
| The Protector | Nurturing Authority | Ideal Guide | Demeter |
| The Innocent | Nurtured State | Preserved Wonder | Hebe |
| The Shapeshifter | Role Fluidity | David Bowie | Loki |
| The Acolyte | Devotional Service | Temple Attendants | Hestia |

## 🛍️ Product Matching

Each archetype includes curated product recommendations from marquisdemayfair.com:

- Products matched to likely activities and interests
- Direct links to product pages
- Personalized reasoning for each recommendation

## 🌐 Deployment

### Recommended: Subdomain Deployment

Since marquisdemayfair.com runs on Shopify:

1. **Deploy to Vercel/Netlify/Cloudflare Pages**
   ```bash
   npm run build
   # Upload dist/ folder
   ```

2. **Configure DNS**
   ```
   CNAME quiz -> your-deployment-url
   ```

3. **Access at**
   ```
   https://quiz.marquisdemayfair.com
   ```

### API Security

For AI analysis, create a serverless function to protect your API key:

```javascript
// /api/generate-analysis.js
export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(req.body)
  });
  return res.json(await response.json());
}
```

Update the API call in App.jsx to use your function URL instead of direct API access.

## 📊 Analytics Events

Track these events for conversion optimization:

```javascript
{ event: 'assessment_started' }
{ event: 'assessment_completed', completion_time: 340 }
{ event: 'email_captured', consent_marketing: true }
{ event: 'analysis_generated', archetype: 'sovereign' }
{ event: 'share_clicked', platform: 'twitter' }
{ event: 'product_clicked', product: 'black-label-flogger' }
{ event: 'methodology_viewed' }
```

## 📜 License

Proprietary - © Marquis de Mayfair. All rights reserved.

All questions, archetypes, cold readings, and methodology are original intellectual property.

## 📞 Support

For questions about deployment or customization:
- Technical: review docs/PRODUCT_DESIGN_BRIEF.md
- Research inquiries: research@marquisdemayfair.com

A luxury, academically-grounded psychometric assessment for intimate power dynamics. This assessment features **64 completely original questions** developed from peer-reviewed research, with no content derived from BDSMtest.org or any other existing assessment.

## 🎯 Key Features

### Academic Foundation
- Questions derived from Connolly (2006), Yost & Hunter (2012), Wismeijer & Van Assen (2013)
- Weighted Likert scaling with reverse-scored validity items
- 16 psychological dimensions based on published research constructs

### Product Integration
- Dynamic product matching from marquisdemayfair.com catalog
- Archetype-specific recommendations with personalized rationales
- Direct links to shop products

### Admin Panel
- Full question editing without breaking scoring validity
- Weight adjustment per question
- Add/remove questions dynamically
- Export question bank as JSON

### AI-Powered Analysis
- Anthropic Claude API integration for personalized cold readings
- Context-aware synthesis of dimension interactions
- Historical and mythological parallel mapping

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or extract project
cd marquis-persona-test-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

Output will be in `/dist` directory.

---

## 📦 Deployment

### Recommended: Vercel

1. Push to GitHub repository
2. Connect to Vercel
3. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### DNS Configuration

Add CNAME record:
```
quiz.marquisdemayfair.com → your-vercel-url.vercel.app
```

### Environment Variables

For production AI analysis, set up a serverless function:

```javascript
// /api/generate-analysis.js (Vercel serverless)
export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
```

Set environment variable:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## 🔧 Admin Panel Usage

### Accessing Admin
Click "Admin Panel" link on landing page (bottom right).

### Editing Questions

1. **View All Questions**: Questions display with dimension badge, weight, and academic construct
2. **Edit**: Click "Edit" to modify:
   - Question text (maintain academic intent)
   - Dimension assignment
   - Weight (0.8x - 1.5x)
   - Reverse scoring flag
   - Academic construct reference
3. **Save**: Changes apply immediately to assessment

### Adding Questions

1. Click "+ Add Question"
2. Fill form with:
   - Question text (sex-positive, adult-appropriate)
   - Target dimension
   - Weight (recommend 1.0-1.3 for new questions)
   - Academic construct it measures
3. Save

### Maintaining Validity

When editing, preserve:
- **Minimum 3 questions per dimension** for reliable scoring
- **Balanced weights** (avoid one question dominating a dimension)
- **At least 1 reverse-scored item** per major dimension for validity checking
- **Consistent academic constructs** within dimensions

### Exporting Questions

Click "Export JSON" to download current question bank. Use for:
- Backup before major changes
- Version control
- Transferring to other deployments

---

## 📊 Scoring Algorithm

### Formula

```
dimensionScore = (Σ weightedResponses / maxPossibleScore) × 100

Where:
  weightedResponse = (isReversed ? (6 - answer) : answer) × weight
  maxPossibleScore = Σ (5 × weight) for all dimension questions
```

### Weights

| Weight | Use Case |
|--------|----------|
| 0.8 | Supplementary/exploratory questions |
| 1.0 | Standard questions |
| 1.2 | Core construct questions |
| 1.3 | High-discriminant items |
| 1.5 | Definitional items (1-2 per dimension max) |

### Archetype Assignment

1. Calculate all 16 dimension scores (0-100)
2. Sort dimensions by score descending
3. Primary archetype = highest scoring dimension's archetype
4. Secondary archetype = second highest

---

## 🛍️ Product Matching

Each archetype has curated product recommendations from marquisdemayfair.com:

| Archetype | Product Categories |
|-----------|-------------------|
| Sovereign | Impact, restraints, collars |
| Devotee | Collars, restraints, sensory |
| Artisan | Impact tools (floggers, whips) |
| Phoenix | Impact, sensation play |
| Weaver | Rope, restraints |
| ... | ... |

### Updating Product Links

In `App.jsx`, locate `ARCHETYPES` object. Each archetype has:

```javascript
suggestedProducts: [
  { 
    name: "Product Name", 
    url: "/products/product-handle", 
    reason: "Why this suits archetype" 
  },
  // ...
]
```

Update URLs when products change on shop.

---

## 📚 Academic Citations

This assessment is built upon:

1. **Connolly, P.H. (2006)**. Psychological functioning of bondage/domination/sado-masochism (BDSM) practitioners. *Journal of Psychology & Human Sexuality, 18*(1), 79-120.

2. **Yost, M.R., & Hunter, L.E. (2012)**. BDSM practitioners' understandings of their initial attraction to BDSM sexuality. *Psychology & Sexuality, 3*(3), 244-259.

3. **Wismeijer, A.A.J., & Van Assen, M.A.L.M. (2013)**. Psychological characteristics of BDSM practitioners. *Journal of Sexual Medicine, 10*(8), 1943-1952.

4. **Sagarin, B.J., et al. (2009)**. Hormonal changes and couple bonding in consensual sadomasochistic activity. *Archives of Sexual Behavior, 38*(2), 186-200.

5. **Martinez, K. (2018)**. BDSM role fluidity: A mixed-methods approach. *Journal of Homosexuality*.

6. **Sprott, R.A., & Benoit Hadcock, B. (2018)**. Bisexuality, pansexuality, queer identity, and kink identity. *Sexual and Relationship Therapy*.

---

## ⚖️ Legal / Copyright Statement

### Original Content Declaration

All 64 questions in this assessment are **original compositions** created by the Marquis de Mayfair research team. We have:

- ✅ Developed questions from first principles using academic construct definitions
- ✅ Avoided any verbatim copying from BDSMtest.org or similar tools
- ✅ Created unique phrasing for each psychometric item
- ✅ Built our own weighting and scoring algorithm

### What We Share With Other Tests

- Likert scale methodology (public domain psychometric practice)
- General concept of BDSM dimensions (community-established terminology)
- Weighted averaging (standard statistical method)

### What Is Unique To Us

- Specific question phrasing (all 64 questions)
- Weight values per question
- Archetype names, descriptions, and cold readings
- Product matching system
- Luxury visual design
- AI analysis integration

---

## 🔒 Privacy & Data Handling

- All scoring happens **client-side** in browser
- No answers stored server-side
- Email capture is optional and for marketing only
- AI analysis requests contain only scores, not individual answers
- GDPR-compliant consent flows recommended for EU users

---

## 📁 File Structure

```
marquis-persona-test-v2/
├── src/
│   ├── App.jsx          # Main application (64 questions, 16 archetypes)
│   ├── index.css        # Luxury dark aesthetic
│   └── main.jsx         # React entry point
├── index.html           # HTML with meta tags
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
├── docs/
│   ├── METHODOLOGY.md   # Academic framework
│   ├── QUESTIONS.md     # Complete question bank
│   └── ADMIN_GUIDE.md   # Admin panel documentation
└── README.md            # This file
```

---

## 🎨 Customization

### Colors (in index.css)

```css
:root {
  --gold-bright: #D4AF37;    /* Primary accent */
  --burgundy: #8B1538;       /* CTA buttons */
  --black-deep: #0A0A0A;     /* Background */
  --cream: #F5F0E8;          /* Text */
}
```

### Fonts

- **Display**: Cinzel (titles)
- **Elegant**: Cormorant Garamond (body, questions)
- **UI**: Raleway (buttons, labels)

### Adding Dimensions

1. Add to `DIMENSIONS` object with code, name, description, academic basis
2. Add corresponding archetype to `ARCHETYPES`
3. Create 3-5 questions for new dimension
4. Test scoring balance

---

## 📞 Support

For technical issues: dev@marquisdemayfair.com
For research inquiries: research@marquisdemayfair.com

---

© 2024 Marquis de Mayfair. All questions, archetypes, and methodology are original intellectual property.
