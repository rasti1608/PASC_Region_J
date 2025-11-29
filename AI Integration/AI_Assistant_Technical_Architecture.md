# Technical Architecture Document
## PASC Region J Conference Website - AI Voice Assistant

**Document Version:** 1.0  
**Date:** November 28, 2025  
**Project:** pascregionj.com AI Integration  
**Author:** Rastislav Toscak  
**Related Document:** AI_Assistant_BRD.md  

---

## 1. Executive Summary

This document defines the technical architecture for implementing an AI-powered voice assistant on the PASC Region J Conference website.

### 1.1 Hosting Analysis Result

**DailyRazor Python Support:**
- ✅ Supports Python 2.6, 2.7, 3.2
- ❌ Python 3.2 is outdated (2011)
- ❌ Modern AI libraries require Python 3.8+

**Recommendation: Hybrid Architecture**

| Component | Location | Reason |
|-----------|----------|--------|
| Frontend (Chat UI) | DailyRazor | Existing Angular deployment |
| AI Backend | Railway.app | Modern Python 3.11+ required |
| Database | DailyRazor | Existing SQL Server |
| Vector Store | Railway.app | Bundled with AI backend |

### 1.2 Cost Summary

| Service | Monthly Cost |
|---------|--------------|
| Railway.app (Free Tier) | $0 |
| OpenAI GPT-5 nano (~1000 conversations) | $1-2 |
| Whisper API (~100 min voice) | $0.60 |
| **Total** | **$2-3/month** |

---

## 2. System Architecture

### 2.1 High-Level Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                               │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    ANGULAR FRONTEND                            │  │
│  │     ┌──────────────┐    ┌──────────────┐    ┌─────────────┐    │  │
│  │     │   Website    │    │   AI Chat    │    │    Voice    │    │  │
│  │     │  Components  │    │  Component   │    │  Recorder   │    │  │
│  │     └──────────────┘    └──────┬───────┘    └──────┬──────┘    │  │
│  │                                │                    │          │  │
│  │                         ┌──────┴────────────────────┘          │  │
│  │                         │                                      │  │
│  │                    ┌────┴─────┐                                │  │
│  │                    │ AI Svc   │                                │  │
│  │                    └────┬─────┘                                │  │
│  └─────────────────────────┼──────────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    RAILWAY.APP (Python Backend)                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      FASTAPI SERVER                           │  │
│  │                                                               │  │
│  │   ┌────────────┐   ┌────────────┐   ┌────────────────────┐    │  │
│  │   │ /api/chat  │   │ /api/voice │   │   LangChain RAG    │    │  │
│  │   └─────┬──────┘   └─────┬──────┘   └──────────┬─────────┘    │  │
│  │         │                │                     │              │  │
│  │         │          ┌─────┴─────┐              │               │  │
│  │         │          │ Whisper   │              │               │  │
│  │         │          │   API     │              │               │  │
│  │         │          └───────────┘              │               │  │
│  │         │                                     │               │  │
│  │         └─────────────────┬───────────────────┘               │  │
│  │                           │                                   │  │
│  │              ┌────────────┼────────────┐                      │  │
│  │              ▼            ▼            ▼                      │  │
│  │        ┌──────────┐ ┌──────────┐ ┌──────────┐                 │  │
│  │        │ ChromaDB │ │ OpenAI   │ │ SQL Srvr │                 │  │
│  │        │ (vectors)│ │ GPT-5    │ │ (remote) │                 │  │
│  │        └──────────┘ └──────────┘ └────┬─────┘                 │  │
│  └───────────────────────────────────────┼───────────────────────┘  │
└──────────────────────────────────────────┼──────────────────────────┘
                                           │ SQL Connection
                                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DAILYRAZOR (Existing)                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   SQL SERVER DATABASE                         │  │
│  │   announcements │ workshops │ gallery │ documents │ forms     │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

**Text Input Flow:**
```
User types → Angular → POST /api/chat → LangChain RAG → GPT-5 nano → Response
```

**Voice Input Flow:**
```
User speaks → MediaRecorder → POST /api/voice → Whisper → Text → Same as above
```

---

## 3. Technology Stack

### 3.1 Frontend (Angular)

| Component | Technology |
|-----------|------------|
| Framework | Angular 17+ |
| Chat UI | Custom Component |
| Voice Recording | MediaRecorder API |
| HTTP | Angular HttpClient |
| Styling | SCSS |

### 3.2 Backend (Python)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Python 3.11+ | Language |
| Framework | FastAPI | REST API |
| AI Orchestration | LangChain | RAG Pipeline |
| Vector Store | ChromaDB | Document Search |
| LLM | OpenAI GPT-5 nano | AI Responses |
| Transcription | OpenAI Whisper | Voice-to-Text |
| DB Driver | pyodbc | SQL Server |

### 3.3 External Services

| Service | Provider | Cost |
|---------|----------|------|
| LLM | OpenAI GPT-5 nano | ~$0.001/conversation |
| Transcription | Whisper API | $0.006/minute |
| Hosting | Railway.app | Free tier |

---

## 4. API Specification

### 4.1 POST /api/chat

**Request:**
```json
{
  "message": "When is the conference?",
  "conversation_id": "uuid-123",
  "history": [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "response": "The PASC Region J Conference is February 13, 2026 at Neshaminy High School.",
  "actions": [
    {
      "type": "navigate",
      "label": "View Schedule",
      "target": "/about#schedule"
    }
  ],
  "conversation_id": "uuid-123"
}
```

### 4.2 POST /api/voice

**Request:**
- Content-Type: multipart/form-data
- audio: WAV/WebM blob
- conversation_id: string

**Response:**
```json
{
  "transcription": "When is the conference?",
  "response": "The conference is February 13, 2026...",
  "actions": [...],
  "conversation_id": "uuid-123"
}
```

### 4.3 Action Types

| Type | Description | Example Target |
|------|-------------|----------------|
| navigate | Go to page | "/resources" |
| accordion | Open section | "registration-accordion" |
| download | Get file | "/files/schedule.pdf" |
| external | New tab link | "https://pasc.org" |
| scroll | Scroll to element | "#workshops" |

---

## 5. Knowledge Base

### 5.1 Static Knowledge (ChromaDB)

Documents to embed at deployment:

| Document | Content |
|----------|---------|
| conference_info.md | Date, location, theme, cost |
| site_structure.md | Pages, sections, navigation |
| faq.md | Common Q&A |
| registration_info.md | How to register |
| pasc_overview.md | PASC organization info |

### 5.2 Dynamic Knowledge (SQL Server)

Real-time queries:

```sql
-- Live announcements
SELECT title, content, created_at FROM announcements WHERE active=1

-- Workshops
SELECT name, description, time, room FROM workshops

-- Documents
SELECT title, file_url, category FROM documents
```

### 5.3 RAG Pipeline

```
1. User Question
       ↓
2. Intent Classification
   (INFORMATION / NAVIGATION / DATABASE / GENERAL)
       ↓
3. Retrieval
   - Static: Search ChromaDB vectors
   - Database: Query SQL Server
       ↓
4. Augmentation
   - System prompt + Context + History + Question
       ↓
5. Generation (GPT-5 nano)
       ↓
6. Action Detection
       ↓
7. Response with Actions
```

---

## 6. Frontend Components

### 6.1 File Structure

```
src/app/
├── components/
│   └── ai-assistant/
│       ├── ai-assistant.component.ts
│       ├── ai-assistant.component.html
│       ├── ai-assistant.component.scss
│       ├── chat-panel/
│       ├── chat-message/
│       ├── voice-recorder/
│       └── action-button/
├── services/
│   ├── ai.service.ts
│   └── voice.service.ts
└── models/
    ├── chat-message.model.ts
    └── action.model.ts
```

### 6.2 UI Layout

**Panel Closed:**
```
┌────────────────────────────────────────────────────────┐
│  PASC Region J Conference                       [♪ 🔊] │
│  Home   About   Workshops   Resources                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│              (Website Content)                         │
│                                                        │
│                                                [🤖💬]  │  ← Floating button
└────────────────────────────────────────────────────────┘
```

**Panel Open:**
```
┌────────────────────────────────────────┬───────────────┐
│  PASC Region J Conference       [♪ 🔊] │ 🤖 Assistant X│
│  Home   About   Workshops              │               │
├────────────────────────────────────────┤ Hi! Ask me    │
│                                        │ anything!     │
│         (Website Content)              │               │
│                                        │ 👤 When is it?│
│                                        │               │
│                                        │ 🤖 Feb 13,    │
│                                        │    2026...    │
│                                        │               │
│                                        │ [View Schedule]│
│                                        │               │
│                                        │───────────────│
│                                        │ [____] 🎤 ➤  │
└────────────────────────────────────────┴───────────────┘
```

---

## 7. Backend Structure

### 7.1 Project Structure

```
ai-backend/
├── main.py                 # FastAPI entry
├── requirements.txt        # Dependencies
├── railway.json           # Railway config
├── .env.example           # Environment template
│
├── api/
│   └── routes/
│       ├── chat.py        # /api/chat
│       ├── voice.py       # /api/voice
│       └── health.py      # /api/health
│
├── services/
│   ├── ai_service.py      # LangChain RAG
│   ├── whisper_service.py # Voice transcription
│   └── database_service.py # SQL queries
│
├── knowledge/
│   ├── embeddings.py      # ChromaDB setup
│   └── documents/         # Static .md files
│
└── models/
    ├── request_models.py  # Pydantic models
    └── response_models.py
```

### 7.2 Requirements.txt

```
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
langchain==0.0.340
openai==1.3.5
chromadb==0.4.18
pyodbc==5.0.1
python-dotenv==1.0.0
pydantic==2.5.2
```

### 7.3 Environment Variables

```env
# .env
OPENAI_API_KEY=sk-...
DATABASE_SERVER=your-server.dailyrazor.com
DATABASE_NAME=PASC_RegionJ
DATABASE_USER=readonly_user
DATABASE_PASSWORD=secure_password
ALLOWED_ORIGINS=https://pascregionj.com,http://localhost:4200
```

---

## 8. Implementation Phases

### Phase 1: Core Text Chat (Week 1-2)

**Deliverables:**
- [ ] Angular chat component (floating button + panel)
- [ ] FastAPI backend with /api/chat endpoint
- [ ] ChromaDB with static documents
- [ ] Basic RAG pipeline
- [ ] Session memory (in-memory)

**Success Criteria:**
- User can type question
- AI responds with relevant information
- Actions displayed as buttons

### Phase 2: Voice Input (Week 3)

**Deliverables:**
- [ ] Voice recording component
- [ ] /api/voice endpoint
- [ ] Whisper API integration
- [ ] Recording UI (pulsing, transcription preview)

**Success Criteria:**
- User can speak question
- Accurate transcription
- Same flow as text input

### Phase 3: Database Integration (Week 4)

**Deliverables:**
- [ ] SQL Server connection from Railway
- [ ] LangChain SQL Agent
- [ ] Real-time workshop/announcement queries
- [ ] Hybrid retrieval (vectors + database)

**Success Criteria:**
- "What workshops are available?" returns live data
- "Latest announcements" returns current content

### Phase 4: Polish & Actions (Week 5-6)

**Deliverables:**
- [ ] Action execution (navigate, accordion, download)
- [ ] Voice output option (browser TTS)
- [ ] Error handling improvements
- [ ] Mobile optimization
- [ ] Performance tuning

**Success Criteria:**
- All action types working
- < 5 second response time
- Mobile-friendly UI

---

## 9. Security Considerations

### 9.1 API Security

- CORS restricted to pascregionj.com
- HTTPS only
- Rate limiting (100 requests/minute)
- Input sanitization

### 9.2 Database Security

- Read-only database user
- No sensitive data exposed
- Connection string in environment variables

### 9.3 API Keys

- Stored in Railway environment variables
- Never exposed to frontend
- Rotated periodically

---

## 10. Monitoring & Logging

### 10.1 Railway.app Built-in

- Request logs
- Error tracking
- Resource usage
- Deployment history

### 10.2 Custom Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log each request
logger.info(f"Chat request: {message[:50]}...")
logger.info(f"Response generated in {duration}s")
logger.error(f"OpenAI error: {error}")
```

### 10.3 Health Check

```
GET /api/health

{
  "status": "healthy",
  "database": "connected",
  "openai": "connected",
  "uptime": "3d 14h 22m"
}
```

---

## 11. Deployment Guide

### 11.1 Railway.app Setup

1. Create Railway account (https://railway.app)
2. Connect GitHub repository
3. Add environment variables
4. Deploy from main branch
5. Note the generated URL (e.g., ai-backend-xxx.railway.app)

### 11.2 Angular Configuration

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  aiApiUrl: 'https://ai-backend-xxx.railway.app/api'
};
```

### 11.3 CORS Configuration

```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pascregionj.com",
        "http://localhost:4200"  # Development
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 12. Testing Plan

### 12.1 Unit Tests

- AI service response generation
- Intent classification
- Action detection
- Voice transcription

### 12.2 Integration Tests

- Full chat flow
- Voice to response flow
- Database queries
- Action execution

### 12.3 Manual Test Cases

| Test | Expected Result |
|------|-----------------|
| "When is the conference?" | Date + location + schedule action |
| "Show me workshops" | Workshop list + navigate action |
| "How do I register?" | Registration info + form action |
| Voice: "Hello" | Transcription + greeting response |
| Unknown question | Fallback message + suggestions |

---

## 13. Rollback Plan

### 13.1 If AI Backend Fails

1. Railway.app: Rollback to previous deployment
2. Angular: Hide AI button via feature flag
3. Website continues to function normally

### 13.2 Feature Flag

```typescript
// In Angular
export const FEATURE_FLAGS = {
  AI_ASSISTANT_ENABLED: true  // Set to false to disable
};
```

---

## 14. Future Enhancements

### 14.1 Short Term (3-6 months)

- Analytics dashboard (popular questions)
- Voice output (AI speaks responses)
- Multi-language support
- Feedback collection

### 14.2 Long Term (6-12 months)

- Registration assistance
- Calendar integration
- Email notifications
- Mobile app integration

---

## 15. Open Questions

### 15.1 To Verify

1. [ ] SQL Server external connection from Railway?
2. [ ] DailyRazor firewall rules for Railway IPs?
3. [ ] SSL certificate for API subdomain?

### 15.2 To Decide

1. [ ] AI personality/tone (formal vs casual)?
2. [ ] Welcome message content?
3. [ ] Should panel close after navigation?

---

## 16. Appendix

### A. Sample System Prompt

```
You are the PASC Region J Conference AI Assistant. You help visitors find information about the student leadership conference.

PERSONALITY:
- Friendly and helpful
- Enthusiastic about student leadership
- Concise but complete answers

CAPABILITIES:
- Answer questions about the conference
- Help users navigate the website
- Provide workshop and registration information

CONSTRAINTS:
- Only answer questions about the PASC conference
- If unsure, suggest contacting info@pascregionj.com
- Always be encouraging to students

CONTEXT:
{retrieved_context}

CONVERSATION HISTORY:
{history}
```

### B. Sample FAQ Entries

```markdown
## When is the conference?
February 13, 2026 at Neshaminy High School

## How much does registration cost?
$25 per student

## What is the registration deadline?
January 15, 2026

## What should I bring?
- Student ID
- Lunch money (or packed lunch)
- Notebook and pen
- School spirit!
```

### C. Site Structure Reference

```markdown
## Pages

### Home (/)
- Announcements section
- Featured content
- Quick links

### About (/about)
- Conference information
- Theme explanation
- Schedule overview

### Workshops (/workshops)
- Workshop list
- Categories
- Descriptions

### Resources (/resources)
- Registration form (accordion)
- Volunteer form (accordion)
- Downloads

### Gallery (/gallery)
- Photo gallery
- Past conferences

### Contact (/contact)
- Contact form
- Email addresses
```

---

**Document Status:** Complete  
**Next Steps:** Begin Phase 1 implementation after React conversion

---

*End of Technical Architecture Document*
