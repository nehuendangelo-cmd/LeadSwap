# Technical Architecture - LeadSwap MVP

**Version:** 1.0  
**Date:** 2026-01-17  
**Status:** Hackathon MVP

---

## Executive Architecture Summary

LeadSwap is built on a **MCP-native AI agent architecture** that orchestrates multiple specialized services to validate leads before purchase. The system uses **Dust AI** as the central orchestration layer, coordinating between **Exa.ai** (semantic search + intent signals), **Lightpanda MCP** (ultra-fast web validation), and **ChatGPT Apps SDK** (conversational interface).

**Key Architectural Decisions:**
- **MCP-First:** All integrations use Model Context Protocol for consistent agent communication
- **Serverless AI Orchestration:** Dust manages all agent workflows, memory, and state
- **Edge-Optimized:** Lightpanda's 10x speed advantage enables real-time batch processing
- **Conversational-Native:** No traditional UI—100% ChatGPT interface

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │          ChatGPT Interface (Web)                     │      │
│  │  - Natural language queries                          │      │
│  │  - CSV upload via file attachment                    │      │
│  │  - Conversational results display                    │      │
│  └──────────────────────────────────────────────────────┘      │
│                            ▼                                    │
│                    ChatGPT Apps SDK                             │
│                   (OAuth + File Handling)                       │
└─────────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ORCHESTRATION LAYER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │               Dust AI Agent Platform                 │      │
│  │                                                       │      │
│  │  [Workflow Engine]  [Memory Store]  [Tool Router]   │      │
│  │        │                  │               │          │      │
│  │        │                  │               │          │      │
│  │  - Lead validation  - ICP storage   - API calls     │      │
│  │    workflow         - History       - MCP routing   │      │
│  │  - Intent signal    - Dedup hash    - Error retry   │      │
│  │    detection        - User state                     │      │
│  └──────────────────────────────────────────────────────┘      │
│                            ▼                                    │
│                  Hosted on Alpic MCP Infrastructure             │
└─────────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI SERVICES LAYER                          │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │   Exa.ai API     │  │ Lightpanda MCP   │  │ Full Enrich  │ │
│  │                  │  │                  │  │  (V2 only)   │ │
│  │ • Semantic search│  │ • MCP Server     │  │              │ │
│  │ • ICP matching   │  │ • Tools:         │  │ • Firmographic│ │
│  │ • Temporal search│  │   - search       │  │   data       │ │
│  │   (intent signals)│ │   - goto         │  │ • Multi-source│ │
│  │ • findSimilar    │  │   - markdown     │  │   enrichment │ │
│  │   (V2)           │  │   - links        │  │              │ │
│  │                  │  │ • 10x faster     │  │              │ │
│  └──────────────────┘  └──────────────────┘  └──────────────┘ │
│         ▲                      ▲                                │
│         │                      │                                │
│    REST API              MCP Protocol                           │
└─────────────────────────────────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Dust Memory Store                       │      │
│  │                                                       │      │
│  │  Collections:                                        │      │
│  │  • users (ICP definitions, preferences)             │      │
│  │  • validation_jobs (batch processing state)         │      │
│  │  • leads (validated leads + scores + intent signals)│      │
│  │  • dedup_hashes (12-month memory window)            │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  Multi-tenant isolation: User ID scoped queries                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Lead Validation Flow (End-to-End)

### Step-by-Step Data Flow

```
1. USER UPLOADS CSV
   ChatGPT App → Dust Agent receives file
   ├─ Parse CSV (extract email, name, company, title)
   ├─ Validate format (check required fields)
   └─ Store in validation_job (status: pending)

2. ICP MATCHING (Parallel Processing)
   For each lead in batch:
   
   ┌─ Exa.ai Semantic Search ───────────────────────────┐
   │  Query: "{lead.name} {lead.title} {lead.company}"  │
   │  Returns: Web mentions, LinkedIn, articles         │
   │  Score: 0-60 points (ICP base score)               │
   └────────────────────────────────────────────────────┘
            ▼
   ┌─ Lightpanda MCP Web Validation ────────────────────┐
   │  Tool: goto(company_website)                       │
   │  Tool: markdown() → Extract team page              │
   │  Tool: links() → Extract social footprint          │
   │  Validates: Company exists, lead on team page      │
   │  Score: +0-20 points (validation bonus)            │
   └────────────────────────────────────────────────────┘
            ▼
   ┌─ Intent Signals Detection (Exa.ai Temporal) ───────┐
   │  Query 1: "{lead.name} talks about lead quality    │
   │            OR data quality" (last 30 days)          │
   │  Query 2: "{company} raised funding OR Series"     │
   │            (last 90 days)                           │
   │  Query 3: "{lead.name} joined {company} OR new     │
   │            role" (last 6 months)                    │
   │  Score: +0-40 points (intent boost)                │
   └────────────────────────────────────────────────────┘
            ▼
   ┌─ Deduplication Check ──────────────────────────────┐
   │  Hash: SHA256(email + linkedin_url + domain)       │
   │  Lookup: dedup_hashes collection                   │
   │  If duplicate: Skip validation, use cached result  │
   └────────────────────────────────────────────────────┘
            ▼
   ┌─ Final Scoring (Dust AI) ──────────────────────────┐
   │  Total = ICP_score + validation_bonus + intent_boost│
   │  Tier 1: 80-100 (High match + intent)              │
   │  Tier 2: 50-79  (Medium match)                     │
   │  Rejected: 0-49 (Poor match)                       │
   └────────────────────────────────────────────────────┘

3. INSIGHTS GENERATION
   Dust Agent analyzes rejected leads:
   ├─ Pattern detection (company size, titles, staleness)
   ├─ Generate recommendations ("Adjust Apollo filters...")
   ├─ Calculate credit savings (rejected_count × €5/lead)
   └─ Format conversational response

4. RESULTS DELIVERY
   ChatGPT Interface displays:
   ├─ Tier breakdown (counts + percentages)
   ├─ Intent signals ("🔥 High Intent: Posted 12 days ago")
   ├─ Actionable insights (Apollo filter recommendations)
   ├─ Credit savings (€920 saved)
   └─ Download CSV option (with scores + intent data)
```

---

## Technology Stack Detailed

### Frontend Layer

**ChatGPT Apps SDK**
- **Purpose:** Zero-UI conversational interface
- **Key Features:**
  - OAuth authentication (no custom password management)
  - File upload handling (CSV processing)
  - Natural language query parsing
  - Streaming responses for long validations
- **Why chosen:** Zero learning curve, users already know ChatGPT
- **Deployment:** Hosted by OpenAI (no frontend infrastructure needed)

---

### Orchestration Layer

**Dust AI Agent Platform**
- **Purpose:** Central orchestration, workflow management, memory
- **Key Components:**
  - **Workflow Engine:** Defines lead validation pipeline
  - **Memory Store:** Persists ICP definitions, validation history, dedup hashes
  - **Tool Router:** Routes calls to Exa.ai API and Lightpanda MCP
  - **Error Handling:** Retry logic for API failures, graceful degradation
- **Why chosen:** 
  - Built for AI agent orchestration (native MCP support)
  - Managed memory (no database to maintain)
  - Multi-tenant by design
- **Hosted on:** Alpic MCP Infrastructure

**Alpic MCP Infrastructure**
- **Purpose:** Host and scale MCP servers (Dust, Lightpanda)
- **Provides:** Network, security, scalability, uptime
- **Why chosen:** Production-grade MCP hosting (foundation layer)

---

### AI Services Layer

**Exa.ai API**
- **Endpoints Used:**
  - `POST /search` - Semantic search for ICP matching
  - `POST /search` with `start_published_date` - Temporal intent signals
- **Request Example (ICP Matching):**
  ```json
  {
    "query": "John Doe VP Sales Acme Corp SaaS",
    "num_results": 5,
    "use_autoprompt": true
  }
  ```
- **Request Example (Intent Signals):**
  ```json
  {
    "query": "John Doe talks about lead quality OR data quality problems",
    "start_published_date": "2025-12-17",
    "num_results": 3,
    "use_autoprompt": true
  }
  ```
- **Response:** Web results with URLs, snippets, published dates
- **Cost:** ~$0.10-0.15 per lead (3-4 API calls per lead)
- **Rate Limits:** 100 requests/minute (sufficient for batch processing)

**Lightpanda MCP Server**
- **MCP Tools Available:**
  - `search` - Web search for company/lead mentions
  - `goto` - Navigate to URL and load page in memory
  - `markdown` - Extract page content as markdown
  - `links` - Extract all links from page
- **Connection:** `wss://euwest.cloud.lightpanda.io/mcp/sse?token=TOKEN`
- **Usage Example (Company Validation):**
  ```javascript
  // 1. Navigate to company website
  await mcp.call_tool("goto", {
    url: "https://acme.com/team"
  })
  
  // 2. Extract team page content
  const teamPageContent = await mcp.call_tool("markdown")
  
  // 3. Check if lead name appears on team page
  const leadOnTeam = teamPageContent.includes("John Doe")
  ```
- **Performance:** 10x faster than Chrome (instant startup, low memory)
- **Cost:** ~$0.05-0.10 per lead (1-2 page loads per lead)

**Full Enrich API (V2 Only - Post-MVP)**
- **Purpose:** Firmographic enrichment (employee count, revenue, funding)
- **Not used in MVP:** Explicitly deferred to reduce complexity and cost

---

### Data Layer

**Dust Memory Store (Managed)**

**Collections:**

**1. users**
```json
{
  "user_id": "chatgpt_user_abc123",
  "icp": {
    "industry": "SaaS",
    "company_size_min": 200,
    "company_size_max": 500,
    "geographies": ["France", "UK"],
    "target_titles": ["VP Sales", "CRO", "Head of Sales"],
    "must_exclude": ["companies <50 employees", "Manager titles"]
  },
  "created_at": "2026-01-17T10:00:00Z",
  "updated_at": "2026-01-17T10:00:00Z"
}
```

**2. validation_jobs**
```json
{
  "job_id": "job_xyz789",
  "user_id": "chatgpt_user_abc123",
  "status": "completed",
  "total_leads": 500,
  "processed_leads": 500,
  "tier1_count": 127,
  "tier2_count": 89,
  "rejected_count": 184,
  "high_intent_count": 23,
  "credit_savings_euros": 920,
  "started_at": "2026-01-17T10:05:00Z",
  "completed_at": "2026-01-17T10:12:00Z",
  "csv_url": "s3://leadswap/results/job_xyz789.csv"
}
```

**3. leads**
```json
{
  "lead_id": "lead_123",
  "job_id": "job_xyz789",
  "user_id": "chatgpt_user_abc123",
  "email": "john.doe@acme.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "title": "VP Sales",
  "icp_score": 65,
  "validation_bonus": 15,
  "intent_boost": 20,
  "final_score": 100,
  "tier": "tier1",
  "intent_signals": [
    {
      "type": "pain_point_post",
      "description": "Posted about lead quality issues on LinkedIn",
      "date": "2026-01-05",
      "url": "https://linkedin.com/posts/johndoe/...",
      "boost": 20
    }
  ],
  "rejection_reasons": [],
  "validated_at": "2026-01-17T10:07:00Z"
}
```

**4. dedup_hashes**
```json
{
  "hash": "sha256_abc123...",
  "user_id": "chatgpt_user_abc123",
  "email": "john.doe@acme.com",
  "linkedin_url": "linkedin.com/in/johndoe",
  "company_domain": "acme.com",
  "last_validation": {
    "job_id": "job_xyz789",
    "tier": "tier1",
    "final_score": 100,
    "validated_at": "2026-01-17T10:07:00Z"
  },
  "created_at": "2026-01-17T10:07:00Z",
  "expires_at": "2027-01-17T10:07:00Z"
}
```

**Data Retention:**
- **Validation jobs:** 12 months
- **Leads:** 12 months
- **Dedup hashes:** 12 months (automatic expiry)
- **User ICP:** Persistent (until user deletes account)

**Multi-Tenancy:**
- All queries scoped by `user_id`
- No cross-user data access
- Dust handles isolation automatically

---

## API Contracts & Integration Specs

### Dust AI Agent Workflow (Pseudocode)

```javascript
// Main validation workflow
async function validateLeads(csvFile, userId) {
  // 1. Load user ICP
  const userICP = await dust.memory.get('users', userId)
  
  // 2. Parse CSV
  const leads = parseCSV(csvFile)
  
  // 3. Create validation job
  const job = await dust.memory.create('validation_jobs', {
    user_id: userId,
    total_leads: leads.length,
    status: 'processing'
  })
  
  // 4. Process leads in parallel (batches of 10)
  const results = await Promise.all(
    leads.map(lead => validateSingleLead(lead, userICP, userId))
  )
  
  // 5. Generate insights
  const insights = generateInsights(results, userICP)
  
  // 6. Update job status
  await dust.memory.update('validation_jobs', job.id, {
    status: 'completed',
    tier1_count: results.filter(r => r.tier === 'tier1').length,
    tier2_count: results.filter(r => r.tier === 'tier2').length,
    rejected_count: results.filter(r => r.tier === 'rejected').length,
    high_intent_count: results.filter(r => r.intent_boost > 20).length,
    credit_savings_euros: results.filter(r => r.tier === 'rejected').length * 5,
    completed_at: new Date()
  })
  
  // 7. Return conversational response
  return formatConversationalResponse(results, insights)
}

async function validateSingleLead(lead, userICP, userId) {
  // Check deduplication first
  const dedupHash = sha256(lead.email + lead.linkedin_url + lead.company_domain)
  const cachedResult = await dust.memory.get('dedup_hashes', dedupHash)
  
  if (cachedResult && cachedResult.user_id === userId) {
    return cachedResult.last_validation
  }
  
  // Run validations in parallel
  const [icpScore, validationBonus, intentBoost] = await Promise.all([
    checkICPMatch(lead, userICP),      // Exa.ai
    validateWebPresence(lead),         // Lightpanda MCP
    detectIntentSignals(lead)          // Exa.ai temporal
  ])
  
  // Calculate final score and tier
  const finalScore = icpScore + validationBonus + intentBoost
  const tier = finalScore >= 80 ? 'tier1' :
               finalScore >= 50 ? 'tier2' : 'rejected'
  
  // Store result
  const result = {
    ...lead,
    icp_score: icpScore,
    validation_bonus: validationBonus,
    intent_boost: intentBoost,
    final_score: finalScore,
    tier: tier,
    validated_at: new Date()
  }
  
  await dust.memory.create('leads', result)
  
  // Update dedup cache
  await dust.memory.upsert('dedup_hashes', dedupHash, {
    hash: dedupHash,
    user_id: userId,
    email: lead.email,
    last_validation: result,
    expires_at: addMonths(new Date(), 12)
  })
  
  return result
}

async function checkICPMatch(lead, userICP) {
  // Exa.ai semantic search for ICP matching
  const response = await exa.search({
    query: `${lead.name} ${lead.title} ${lead.company} ${userICP.industry}`,
    num_results: 5,
    use_autoprompt: true
  })
  
  // Score based on result quality (0-60 points)
  return scoreExaResults(response, userICP)
}

async function validateWebPresence(lead) {
  try {
    // Use Lightpanda MCP to validate company website
    await lightpanda.goto(`https://${lead.company_domain}/team`)
    const teamPageContent = await lightpanda.markdown()
    
    // Check if lead name appears on team page
    const leadFound = teamPageContent.toLowerCase()
      .includes(lead.name.toLowerCase())
    
    return leadFound ? 20 : 0  // Bonus points for validation
  } catch (error) {
    return 0  // Graceful degradation if site unavailable
  }
}

async function detectIntentSignals(lead) {
  const signals = []
  let intentBoost = 0
  
  // Check for recent pain point posts (last 30 days)
  const painPointPosts = await exa.search({
    query: `${lead.name} talks about lead quality OR data quality OR sales productivity problems`,
    start_published_date: subtractDays(new Date(), 30).toISOString(),
    num_results: 3,
    use_autoprompt: true
  })
  
  if (painPointPosts.results.length > 0) {
    intentBoost += 20
    signals.push({
      type: 'pain_point_post',
      description: `Posted about pain points ${getDaysAgo(painPointPosts.results[0].published_date)} days ago`,
      date: painPointPosts.results[0].published_date,
      url: painPointPosts.results[0].url,
      boost: 20
    })
  }
  
  // Check for funding announcements (last 90 days)
  const fundingNews = await exa.search({
    query: `${lead.company} raised funding OR Series A OR Series B`,
    start_published_date: subtractDays(new Date(), 90).toISOString(),
    num_results: 2,
    use_autoprompt: true
  })
  
  if (fundingNews.results.length > 0) {
    intentBoost += 15
    signals.push({
      type: 'funding',
      description: `Company raised funding ${getDaysAgo(fundingNews.results[0].published_date)} days ago`,
      date: fundingNews.results[0].published_date,
      url: fundingNews.results[0].url,
      boost: 15
    })
  }
  
  // Check for job changes (last 6 months)
  const jobChange = await exa.search({
    query: `${lead.name} joined ${lead.company} OR new role OR promoted`,
    start_published_date: subtractMonths(new Date(), 6).toISOString(),
    num_results: 2,
    use_autoprompt: true
  })
  
  if (jobChange.results.length > 0) {
    intentBoost += 10
    signals.push({
      type: 'job_change',
      description: `Changed job ${getDaysAgo(jobChange.results[0].published_date)} days ago`,
      date: jobChange.results[0].published_date,
      url: jobChange.results[0].url,
      boost: 10
    })
  }
  
  return { intentBoost, signals }
}
```

---

## Performance Optimization Strategy

### Batch Processing

**Problem:** Validating 8,000 leads sequentially = 8,000 × 10 seconds = 22 hours  
**Solution:** Parallel processing with Lightpanda's instant startup

**Implementation:**
```javascript
// Process leads in batches of 50 (parallel)
const BATCH_SIZE = 50

async function processBatch(leads) {
  return Promise.all(
    leads.map(lead => validateSingleLead(lead))
  )
}

// Process all batches
for (let i = 0; i < leads.length; i += BATCH_SIZE) {
  const batch = leads.slice(i, i + BATCH_SIZE)
  const results = await processBatch(batch)
  // Update progress in real-time
  await updateJobProgress(jobId, i + batch.length, leads.length)
}
```

**Result:** 8,000 leads in 10-15 minutes (NFR1 met)

---

### Cost Optimization

**Per-Lead Cost Breakdown:**
- Exa.ai API calls: 3-4 searches × $0.03 = **$0.09-0.12**
- Lightpanda MCP: 1-2 page loads × $0.05 = **$0.05-0.10**
- Dust orchestration: Included in Alpic hosting
- **Total: ~$0.14-0.22 per lead**

**Target: <€0.30/lead (NFR4)**  
**Status:** ✅ Met (€0.14-0.22 at current EUR/USD rates)

**Optimization strategies:**
1. **Deduplication:** Skip validation for duplicates (saves 100% cost)
2. **Caching:** Exa.ai results cached for 24h (same query = no API call)
3. **Graceful degradation:** If Lightpanda fails, proceed with Exa.ai only

---

## Security & Compliance (MVP)

### Multi-Tenant Isolation

**Enforcement:**
- All Dust memory queries scoped by `user_id`
- ChatGPT Apps SDK provides authenticated `user_id` per session
- No direct database access (Dust manages isolation)

**Testing:**
- Create 2 test users
- Upload same CSV to both
- Verify User A cannot query User B's results

---

### Data Encryption

**In Transit:**
- ChatGPT ↔ Dust: HTTPS/TLS 1.3
- Dust ↔ Exa.ai: HTTPS
- Dust ↔ Lightpanda MCP: WSS (WebSocket Secure)

**At Rest:**
- Dust Memory Store: Encrypted by default (AES-256)
- No custom encryption needed for MVP

---

### Authentication

**ChatGPT Apps SDK OAuth:**
- Users log in with ChatGPT account
- No password storage (delegated to OpenAI)
- Token-based session management

**No custom auth needed for MVP**

---

## Deployment Architecture

### Hosting

**Frontend:** None (ChatGPT hosted by OpenAI)  
**Backend Orchestration:** Dust AI hosted on Alpic MCP Infrastructure  
**AI Services:** 
- Exa.ai (SaaS API)
- Lightpanda MCP (cloud.lightpanda.io)

**Zero infrastructure to manage for MVP** ✅

---

### Environment Configuration

**Required API Keys:**
- `CHATGPT_APP_CLIENT_ID` - ChatGPT Apps SDK client ID
- `CHATGPT_APP_CLIENT_SECRET` - OAuth secret
- `EXA_API_KEY` - Exa.ai API key
- `LIGHTPANDA_TOKEN` - Lightpanda cloud access token
- `DUST_API_KEY` - Dust platform API key (if using Dust API, otherwise managed via UI)

**Stored in:** Dust platform environment variables (encrypted)

---

### Monitoring & Observability (MVP)

**Metrics to Track:**
- Lead validation throughput (leads/minute)
- API error rates (Exa.ai, Lightpanda)
- Average validation time per lead
- Cost per lead (API usage)
- User retention (weekly active users)

**Tools:**
- Dust built-in monitoring dashboard
- Exa.ai API usage dashboard
- Lightpanda MCP metrics

**No custom monitoring stack for MVP**

---

## Development Roadmap (Hackathon)

### Phase 1: Core Validation (Day 1 - 8h)
- [ ] Set up Dust AI agent workspace
- [ ] Integrate Exa.ai API (ICP matching only)
- [ ] CSV parsing and basic scoring (0-100)
- [ ] Test with 50 sample leads

### Phase 2: ChatGPT Interface (Day 1 - 4h)
- [ ] Register ChatGPT App
- [ ] Configure OAuth
- [ ] File upload handling
- [ ] Conversational response formatting

### Phase 3: Intent Signals (Day 2 - 6h)
- [ ] Exa.ai temporal search integration
- [ ] Intent boost scoring logic
- [ ] Display intent insights with emoji

### Phase 4: Lightpanda MCP (Day 2 - 4h)
- [ ] Connect to Lightpanda cloud MCP
- [ ] Implement goto + markdown tools
- [ ] Company website validation

### Phase 5: Polish & Demo (Day 2 - 4h)
- [ ] Deduplication logic
- [ ] Export CSV with scores
- [ ] Error handling & retry logic
- [ ] Demo script with real leads

**Total: 26 hours across 2 days** (hackathon feasible)

---

## Risk Mitigation

### Technical Risks

**Risk 1: Exa.ai Rate Limits**  
- **Mitigation:** Batch processing with 100ms delay between calls
- **Fallback:** Queue validation jobs if rate limit hit

**Risk 2: Lightpanda MCP Downtime**  
- **Mitigation:** Graceful degradation (proceed with Exa.ai only)
- **Impact:** Validation bonus = 0, but core validation still works

**Risk 3: ChatGPT Apps SDK Learning Curve**  
- **Mitigation:** Use official quickstart template
- **Backup Plan:** Simple webhook interface if SDK too complex

**Risk 4: Cost Overruns (>€0.30/lead)**  
- **Mitigation:** Monitor API usage in real-time
- **Circuit Breaker:** Stop validation if cost exceeds threshold

---

## Appendix: API Response Examples

### Exa.ai Search Response

```json
{
  "results": [
    {
      "title": "John Doe - VP Sales at Acme Corp | LinkedIn",
      "url": "https://linkedin.com/in/johndoe",
      "published_date": "2025-12-15",
      "author": "John Doe",
      "score": 0.92,
      "text": "VP Sales at Acme Corp. Helping SaaS companies scale their sales teams..."
    },
    {
      "title": "Acme Corp Announces VP Sales John Doe to Lead EMEA Expansion",
      "url": "https://acme.com/news/vp-sales-announcement",
      "published_date": "2025-11-20",
      "score": 0.87,
      "text": "Acme Corp today announced the appointment of John Doe as VP Sales..."
    }
  ],
  "autoprompt_string": "Find information about John Doe who is VP Sales at Acme Corp in the SaaS industry"
}
```

### Lightpanda MCP Tool Response

```json
// goto tool response
{
  "success": true,
  "url": "https://acme.com/team",
  "status_code": 200,
  "load_time_ms": 450
}

// markdown tool response
{
  "content": "# Our Team\n\n## Leadership\n\n**John Doe** - VP Sales\nJohn leads our global sales organization...\n\n**Jane Smith** - CTO\nJane oversees our engineering teams..."
}

// links tool response
{
  "links": [
    "https://linkedin.com/in/johndoe",
    "https://twitter.com/johndoe",
    "mailto:john.doe@acme.com"
  ]
}
```

---

**END OF TECHNICAL ARCHITECTURE DOCUMENT**

---

## Questions for Implementation?

This architecture is **hackathon-ready**. All components are API-based (no custom infrastructure). The critical path is:

1. Dust AI workflow setup (4h)
2. Exa.ai integration (2h)
3. ChatGPT App registration (2h)

**Total minimum viable path: 8 hours to working prototype**
