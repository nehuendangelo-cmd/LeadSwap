---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type-skipped', 'step-09-functional']
inputDocuments: 
  - '_bmad-output/planning-artifacts/product-brief-LeadSwap-2026-01-17.md'
  - 'chatgptui.md'
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 1
classification:
  projectType: 'saas_b2b'
  domain: 'general'
  complexity: 'medium'
  projectContext: 'greenfield'
  multiTenant: true
  innovationFocus: 'AI-first lead validation with ChatGPT Apps SDK + MCP infrastructure + Exa.ai semantic search'
  complianceNotes: 'RGPD to consider post-MVP'
  v2Integrations: 'Apollo, ZoomInfo, Salesforce, HubSpot'
---

# Product Requirements Document - LeadSwap

**Author:** Developer
**Date:** 2026-01-17

## Success Criteria

### User Success

**Marc (Founder/CEO @ Early-Stage Startup):**
- **Cost Efficiency**: Lead cost drops from €5/lead (Apollo) to €0.50-1.00/lead (LeadSwap validated)
- **Time Savings**: Manual qualification time reduced from 10 hours/week to <2 hours/week
- **Conversion Improvement**: Lead-to-opportunity rate increases from 1-2% to 8-15%
- **Revenue Impact**: Quarterly deals closed increase from 2-4 to 6-10 using validated leads
- **"Aha!" Moment**: Sees that 40-60% of pre-filtered leads would have been wasted spend + exact credit savings calculation shown

**Sarah (Growth Marketing Manager @ Scale-Up):**
- **Budget Savings**: Monthly lead spend reduced 40-60% (€50k → €20k) while maintaining pipeline
- **SDR Productivity**: SDR qualification time drops 60% (30 hours/week → 12 hours/week per rep)
- **Pipeline Quality**: MQL-to-SQL conversion rate improves from 20% to 50%+
- **Executive Confidence**: CFO approves budget increase based on proven 3x+ ROI
- **"Aha!" Moment**: Dashboard shows exact number of Apollo credits saved by pre-validation

**Claire (Lead Gen Specialist @ Agency):**
- **Client Retention**: Customer churn drops from 40% to <10% due to quality guarantee
- **Margin Expansion**: Net margin per client doubles (€2k → €4k+ monthly)
- **Premium Pricing**: Can charge €15-20/lead (vs €10 before) for "LeadSwap-Guaranteed" leads
- **Scalability**: Manages 25+ clients (vs 15 before) without hiring additional staff
- **"Aha!" Moment**: Zero client complaints about lead quality after first month

### Business Success

**3-Month Goals (MVP Traction) - CRITICAL DECISION GATE:**
- **User Acquisition**: 50-100 active paying users (founders, marketing managers, agencies)
- **Lead Validation Volume**: 500,000+ leads validated through platform
- **Proven Value Creation**: €500k+ in documented cost savings for customers
- **Product-Market Fit Signal**: 50%+ weekly retention, NPS >50
- **Revenue**: €10-20k MRR (€100-200/user/month average)
- **Decision**: If these goals are met → Invest in V2 features. If missed → Revisit core value proposition.

**12-Month Goals (Scale & Market Position):**
- **User Growth**: 500-1,000 active paying users across all segments
- **Market Penetration**: Become top 3 "lead validation" tool mentioned in B2B sales communities
- **Validation Volume**: 10M+ leads validated (network effects in ICP learning)
- **Customer Economics**: €1M+ ARR, <€50 CAC, >€2,000 LTV (40:1 ratio)
- **Strategic Positioning**: Recognized alternative to "buy then qualify" model (Apollo/ZoomInfo)

### Technical Success

**Validation Accuracy:**
- **Precision**: 85%+ (leads marked "qualified" actually convert at predicted rates)
- **Measurement**: Track conversion rates of Tier 1 vs Tier 2 vs Rejected leads across all customers

**Cost Efficiency:**
- **Cost Per Lead**: <€0.30/lead (Exa.ai + Dust AI inference combined)
- **Gross Margin**: >70% (selling at €0.50-1.00/lead with €0.30 cost)
- **Measurement**: Monitor API costs from Exa.ai and Dust per validation

**System Reliability:**
- **Uptime**: 99.5%+ availability during business hours (EU/US timezones)
- **Performance**: Lead validation completes in <10 seconds per lead for batch processing
- **Scalability**: Handle 100,000+ lead validations per day without degradation

**Data Integrity:**
- **Multi-tenant Isolation**: Zero data leakage between customer accounts (security audit quarterly)
- **Deduplication Accuracy**: 95%+ accuracy in detecting duplicate leads across uploads
- **ICP Memory**: Persist user ICP definitions and validation history for 12+ months

### Measurable Outcomes

**Week 2-4 (Early Traction):**
- 50+ signups from Product Hunt launch
- 30%+ activation rate (upload first list within 48 hours)
- 60%+ of users review "Actionable Insights" report
- First 5 paying customers at €100-200/month

**Month 1-2 (Validation Phase):**
- 20+ paying customers
- 40%+ weekly retention (users return to validate more lists)
- NPS >40 (would recommend to peers)
- 5+ testimonials citing specific ROI savings with exact euro amounts
- Zero critical bugs or AI validation failures

**Month 3 (Product-Market Fit Signal) - MVP SUCCESS CRITERIA:**
- **€10,000+ MRR** ✅
- **50%+ retention** at Month 3 cohort ✅
- 50%+ of new signups from word-of-mouth or referrals
- 3+ detailed case studies with proven ROI (€20k+ documented savings)
- Feature requests align with V2 roadmap (not random pivots)

## Product Scope

### MVP - Minimum Viable Product

**Core Features (Must-Have for Launch):**

**1. ChatGPT Conversational Interface**
- Upload CSV lead list via ChatGPT App (fields: email, name, company, title)
- Natural language queries: "Validate this list", "Show me Tier 1 leads", "Why were these rejected?"
- Conversational validation report with actionable breakdown
- Web-based ChatGPT App (no mobile app initially)
- CSV upload only (no API integrations yet)
- English language only

**2. Lead Validation Engine (Exa.ai + Dust AI Scoring)**
- Exa.ai semantic search: Verifies contact exists via web mentions
- Exa.ai company validation: Confirms company matches ICP criteria
- Dust AI orchestration: Scores each lead 0-100 based on ICP fit + contextual signals
- Output tiers: Tier 1 (80-100), Tier 2 (50-79), Rejected (0-49)
- Validation based on publicly accessible web data only
- No email deliverability verification in MVP
- No firmographic enrichment in MVP

**3. Actionable Insights on Rejections (Priority 1)**
- Pattern analysis on rejected leads (company size, title, industry, stale data)
- Actionable recommendations: "Adjust Apollo filters to exclude companies <100 employees"
- ROI impact estimation: "Applying these insights will save €2,340 on your next purchase"
- Conversational format insights display
- Pattern detection on categorical fields only
- Recommendations limited to Apollo/ZoomInfo filter adjustments

**4. Intelligent Deduplication (Priority 4)**
- Stores hash of every validated lead (email + LinkedIn URL + company domain)
- Detects duplicates from previous validations on new upload
- Shows previous status and cost savings from skipping re-validation
- Deduplication within single user account only (no cross-customer)
- Email exact match only (no fuzzy matching)
- 12-month memory window

**5. Basic ICP Definition**
- Conversational ICP collection via ChatGPT
- Captures: Industry, Company Size, Geography, Target Titles, Must-have/Must-exclude criteria
- Stores ICP in Dust memory for all future validations
- Manual ICP definition only (no auto-learning in MVP)
- Single ICP per user (no multi-ICP support)

### Growth Features (Post-MVP)

**Month 4-6:**
- iFrame Widget for Real-Time Website Qualification (deferred due to support complexity)
- Lookalike Discovery using Exa.ai findSimilar (premium tier add-on)
- Multi-language support (French, German, Spanish)

**Month 6-12:**
- Perpetual Memory & Pattern Recognition (Auto-Learning ICP)
- Email Deliverability Verification integration
- Firmographic Enrichment via Full Enrich API
- CRM Integrations (Salesforce, HubSpot auto-sync)
- API for Programmatic Access (power users, agencies)

### Vision (Future)

**12-24 Months - Become the "Quality Layer" for All B2B Lead Data:**
- "LeadSwap Score" becomes industry-standard metric
- Lead data vendors integrate LeadSwap scores into their platforms
- Real-time intent monitoring using Exa.ai temporal search
- Lead marketplace with quality guarantees
- Predictive close probability AI
- Network effects via cross-customer learning (anonymized patterns)
- Vertical expansion: Recruiters, Real Estate, Financial Services

## User Journeys

### Journey 1: Marc - Founder/CEO @ Early-Stage Startup
**"De la qualification manuelle épuisante à l'IA qui ne dort jamais"**

**Context:** Marc, 35 ans, CEO d'une startup SaaS seed-stage (10 employés). Budget leads : €2,000/mois max. Pas d'équipe SDR. Actuellement : 500 crédits Apollo → 200 leads utilisables → 2-4 opps/mois (1-2% conversion). Passe 10+ heures/semaine à qualifier manuellement sur LinkedIn.

**Current Pain:** Lundi matin - vient d'acheter 500 crédits Apollo (€2,500), a passé 4h dimanche soir à vérifier 100 leads manuellement, 60% inutilisables. 400 leads restants à vérifier + semaine CEO complète. Se sent submergé.

**Discovery:** Trouve LeadSwap sur Product Hunt : "Validate leads BEFORE you buy". Le pitch résonne : "Stop wasting €2,500 when 60% turn out garbage."

**First Use:** Upload 400 leads dans ChatGPT interface. Définit ICP conversationnellement : "SaaS companies, 200-500 employees, France/UK, VP Sales or CRO". 

Résultat 5-8 minutes plus tard :
- ✅ Tier 1: 127 leads
- ⚠️ Tier 2: 89 leads
- ❌ Rejected: 184 leads

**Insights reçus :**
- 73 leads (40%) : Companies <50 employees → "Adjust Apollo to 200+ employees"
- 56 leads (30%) : "Manager" titles → "Target VP/Director roles"
- 55 leads (30%) : Stale data → "Filter by Updated in last 90 days"
- **💰 Credit Savings: €920 (184 leads avoided)**

**"Aha!" Moment:** "J'aurais gaspillé €920 (37% de mon budget) ET LeadSwap m'apprend pourquoi mes achats Apollo sont mauvais."

**Week 2:** Achète 300 crédits Apollo avec filtres ajustés (€1,500 vs €2,500). Validation LeadSwap : 68% Tier 1/2 (vs 32% avant). Économie : €1,000 + meilleure qualité.

**Month 1 Results:**
- Temps qualification : 10h/semaine → 2h/semaine (8h récupérées)
- Lead cost : €5 → €0.75/lead
- Conversion rate : 1-2% → 9%
- Deals closed : 2 → 5 deals ce mois

**New Reality:** Intègre LeadSwap en workflow permanent. Atteint 6-10 deals/trimestre vs 2-4. Devient évangéliste, recommande à 3 founders, écrit case study volontaire.

---

### Journey 2: Sarah - Growth Marketing Manager @ Scale-Up
**"Du conflit CFO/Sales à l'héroïne du ROI"**

**Context:** Sarah, 32 ans, Growth Marketing Manager Series B (100 employés, €10M ARR). Budget : €600k/an leads. Équipe : 4 SDRs + 1 Marketing Ops. Stack : Apollo (€60k/an), Lemlist, HubSpot. Pression CFO sur ROI.

**Current Pain:** Réunion budget Q1 tendue - CFO : "€50k/mois Apollo pour 5 opps = €10k par opp. Inacceptable." VP Sales : "60% de tes MQLs sont garbage, mes SDRs perdent 30h/semaine à qualifier." Sarah coincée entre budget cuts et demandes "more quality leads".

**Discovery:** Reçoit cold outreach LeadSwap avec case study : "How [Competitor] cut lead costs 60% with AI validation". Sceptique mais curieuse face à pression CFO.

**First Use:** Upload export Apollo 8,000 leads AVANT d'acheter les crédits.

Résultat batch processing 10-15 minutes :
- ✅ Tier 1: 3,247 leads (validated + intent signals)
- ⚠️ Tier 2: 1,523 leads (validated, no immediate intent)
- ❌ Rejected: 3,230 leads

**Action:** Achète seulement 3,247 crédits Apollo au lieu de 8,000.
- Monthly savings : €23,000 (€50k → €16k spend)
- Conversion rate : 3% → 8% (pre-qualified leads)

**"Aha!" Moment:** Prépare slide pour CFO : "LeadSwap eliminated 60% garbage BEFORE I spent budget. €23k saved this month. MQL-to-SQL improved 3% → 8%."

**Month 3 Results:** CFO présentation - Triple lead ROI en 3 mois. CFO approuve 40% budget increase pour son équipe.

**New Reality:** LeadSwap devient "quality gate" avant tout achat lead ou CRM import. SDR team complaints drop to zero. Sarah promue VP Growth.

---

### Journey 3: Claire - Lead Gen Specialist @ Agency
**"De la margin squeeze au premium positioning"**

**Context:** Claire, 29 ans, Lead Gen Specialist agence B2B (15 clients). Business model : Achète leads bulk €2/lead, enrichit manuellement, revend €10-20/lead (5x margin). Pain : 40% sold leads bounce → client churn + replacements eat margin.

**Current Pain:** Client top account menace de partir : "40% of your last batch bounced or were wrong personas. I'm paying €10/lead for garbage. Find another provider or we're done." Claire passe 10h/semaine à vérifier leads LinkedIn pour maintenir réputation. Margin collapsing.

**Discovery:** Cherche "lead quality guarantee tool" sur Google. Trouve LeadSwap : "White-label quality guarantee for agencies."

**First Use:** Client demande 500 validated VP Sales SaaS contacts avec quality guarantee. Claire upload 2,000 cheap bulk leads (€2 each = €4,000 cost).

LeadSwap workflow 10-15 minutes :
- Exa.ai contextual validation
- Full Enrich only on Exa-confirmed contacts
- Result : **687 leads validated with quality guarantee**

**Pricing strategy:**
- Vend 500 best leads à €15/lead = €7,500 revenue
- LeadSwap cost : €343 (€0.50/validated lead)
- Net margin : €4,157 vs €2,000 before (2x improvement)

**Bonus :** 0% client complaints (LeadSwap quality guarantee). Client renouvelle contract + augmente volume.

**"Aha!" Moment:** "Je peux maintenant vendre 'LeadSwap-Guaranteed Leads' comme premium offering à €20/lead. Mes clients arrêtent de churner car quality is consistent."

**Month 6 Results:**
- Client churn : 40% → <10%
- Margin per client : €2k → €4k+ monthly (doubled)
- Client portfolio : 15 → 25 clients (no new hires needed)
- Premium pricing : €20/lead for "LeadSwap-Guaranteed" tier

**New Reality:** Repositionne agence comme "premium quality-guaranteed lead provider". 90% client retention vs 60% before. Claire scales to 25 clients without hiring.

---

### Journey Requirements Summary

**Capabilities revealed by these journeys:**

**From Marc's Journey:**
- Conversational ICP definition (natural language, no forms)
- CSV upload with automatic field mapping
- Real-time batch validation (5-10 min for hundreds of leads)
- Tiered scoring output (Tier 1/2/Rejected with reasoning)
- Actionable insights on rejection patterns with specific Apollo filter recommendations
- Credit savings calculator showing exact euros avoided
- Lead-by-lead validation details for manual review

**From Sarah's Journey:**
- Large batch processing (8,000+ leads in 10-15 minutes)
- Pre-purchase validation workflow (validate BEFORE buying credits)
- Intent signal detection (hiring, funding, tech migrations)
- ROI reporting for executive presentations (savings, conversion improvement)
- Integration context with Apollo exports (CSV compatibility)
- Historical comparison (current vs previous qualification rates)

**From Claire's Journey:**
- Quality guarantee mechanism for resale
- White-label positioning for agencies
- Cost optimization (Exa validation before Full Enrich enrichment)
- Batch download of validated leads with confidence scores
- Validation timestamp and guarantee certificate
- Multi-client workspace management (isolated accounts)

**Cross-Journey Requirements:**
- Multi-tenant architecture with complete data isolation
- Deduplication across uploads within same account
- ICP memory persistence across sessions
- Validation history and audit trail
- Cost tracking per validation batch
- Export validated leads as CSV with enriched data

## Functional Requirements

### User Onboarding & Authentication

- **FR1**: Users can sign up via ChatGPT Apps SDK authentication
- **FR2**: Users can define their ICP (Ideal Customer Profile) conversationally in natural language
- **FR3**: System stores user ICP criteria (industry, company size, geography, target titles, must-exclude criteria) for all future validations
- **FR4**: Users can update their ICP criteria at any time via conversational interface

### Lead Upload & Data Ingestion

- **FR5**: Users can upload CSV files containing lead lists via ChatGPT interface
- **FR6**: System automatically maps CSV fields (email, name, company, title) without manual configuration
- **FR7**: System accepts lead lists ranging from 50 to 10,000+ leads per upload
- **FR8**: Users receive confirmation when upload is successful with lead count

### Lead Validation & Scoring

- **FR9**: System validates each lead against user's defined ICP using Exa.ai semantic search
- **FR10**: System verifies contact existence via web mentions (LinkedIn, company websites, articles, conference talks)
- **FR11**: System confirms company matches ICP criteria (industry, size, recent activity signals)
- **FR12**: System scores each lead 0-100 based on ICP fit + contextual validation signals
- **FR13**: System categorizes leads into three tiers:
  - Tier 1 (80-100): High ICP match + strong context validation
  - Tier 2 (50-79): Medium ICP match or partial context validation
  - Rejected (0-49): Poor ICP match or insufficient validation
- **FR14**: System completes batch validation in <10 seconds per lead (500 leads in 5-10 minutes)

### Validation Results & Insights

- **FR15**: Users receive tiered validation results showing count and percentage for each tier
- **FR16**: Users can query results conversationally ("Show me Tier 1 leads", "Why were these rejected?")
- **FR17**: System provides lead-by-lead validation details with rejection reasoning for manual review
- **FR18**: System analyzes rejection patterns across categorical fields (company size, title, industry, staleness)
- **FR19**: System generates actionable recommendations to improve future lead purchases ("Adjust Apollo to 200+ employees")
- **FR20**: System calculates and displays exact credit savings (euros avoided by rejecting bad leads)
- **FR21**: System estimates ROI impact of applying recommendations ("Save €2,340 on next purchase")
- **FR22**: System displays historical comparison showing current vs previous qualification rates

### Deduplication & Memory

- **FR23**: System stores hash of every validated lead (email + LinkedIn URL + company domain)
- **FR24**: System detects duplicate leads from previous validations on new uploads
- **FR25**: System shows previous validation status for detected duplicates (Tier 1/2/Rejected)
- **FR26**: System displays cost savings from skipping re-validation of duplicates
- **FR27**: System retains validation history and ICP definitions for 12 months per user account

### Data Export & Download

- **FR28**: Users can download validated leads as CSV with tier scores and enriched data
- **FR29**: System includes validation timestamp in exported data
- **FR30**: Users can filter export by tier (download only Tier 1, or Tier 1+2)

### Multi-Tenant Data Isolation

- **FR31**: System maintains complete data isolation between user accounts
- **FR32**: Users can only access their own uploaded leads and validation history
- **FR33**: System prevents any data leakage or cross-contamination between customer accounts

### Conversational Interface

- **FR34**: Users interact with system entirely through natural language queries in ChatGPT interface
- **FR35**: System responds conversationally with validation results, insights, and recommendations
- **FR36**: Users can ask follow-up questions about validation results
- **FR37**: System provides contextual help when users ask "how does this work?" or similar queries

