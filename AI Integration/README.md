# 🤖 AI Voice Assistant Integration

## Coming Soon to pascregionj.com

An AI-powered voice assistant that knows everything about the PASC Region J Conference and can guide users through the website using natural language.

---

## 🎯 Vision

**Replace traditional website navigation with an intelligent assistant.**

Instead of clicking through menus, users simply ask:

> *"How do I register for the conference?"*

And the AI responds with real information from the database, plus action buttons:

> **[Go to Registration]** · **[Tell me more]**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Input** | Speak naturally using your microphone |
| ⌨️ **Text Input** | Type questions if you prefer |
| 🧠 **Full Site Knowledge** | AI knows everything about the conference |
| 📊 **Live Data** | Real-time info from database (workshops, announcements) |
| 🔗 **Smart Navigation** | AI can take you directly to any page or section |
| 💬 **Conversation Memory** | Remembers context for follow-up questions |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular (existing site) |
| **AI Backend** | Python, FastAPI, LangChain |
| **LLM** | OpenAI GPT-4 |
| **Voice** | OpenAI Whisper API |
| **Vector Store** | ChromaDB |
| **Database** | SQL Server (existing) |
| **Hosting** | Railway.app (AI) + DailyRazor (site) |

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
│         Angular Frontend + AI Chat Component             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  RAILWAY.APP (Python)                    │
│     FastAPI + LangChain + Whisper + OpenAI GPT-4        │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  DAILYRAZOR (Existing)                   │
│           ColdFusion APIs + SQL Server Database          │
└─────────────────────────────────────────────────────────┘
```

---

## 💬 How It Works

**User asks a question:**
```
👤 "When is the conference?"
```

**AI retrieves real data from the database and responds:**
```
🤖 [Answers with actual conference details from the system]
    
    [View Schedule] [Register Now]
```

**Follow-up questions maintain context:**
```
👤 "What workshops are available?"
🤖 [Lists actual workshops from database]

👤 "Which ones are in the morning?"
🤖 [Filters and shows morning workshops]
```

**Navigation with user control:**
```
👤 "Take me to registration"
🤖 "I can take you to the registration page."
    
    [Go to Registration] [Tell me more first]
```

---

## 📁 Documentation

| Document | Description |
|----------|-------------|
| [AI_Assistant_BRD.md](./AI_Assistant_BRD.md) | Business Requirements - WHAT we're building |
| [AI_Assistant_Technical_Architecture.md](./AI_Assistant_Technical_Architecture.md) | Technical Architecture - HOW we're building it |
| [PASC_Project_Complete_Summary.md](./PASC_Project_Complete_Summary.md) | Full project history and context |

---

## 🚀 Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Core text chat with AI knowledge | 📋 Planned |
| **Phase 2** | Voice input (Whisper API) | 📋 Planned |
| **Phase 3** | Database integration (RAG) | 📋 Planned |
| **Phase 4** | Polish, actions, voice output | 📋 Planned |

---

## 💡 Why This Matters

This AI integration demonstrates:

- **Modern AI Development** - RAG, LangChain, OpenAI APIs
- **Voice Technology** - Whisper speech-to-text
- **Full-Stack Integration** - Frontend ↔ AI Backend ↔ Database
- **Production Deployment** - Real-world hosting and architecture

---

## 🔗 Related Links

- **Live Site:** [pascregionj.com](https://pascregionj.com)
- **Angular Version:** [pascregionj.com](https://pascregionj.com) (default)
- **ColdFusion Version:** [pascregionj.com?cf=1](https://pascregionj.com?cf=1)
- **Main Repository:** [GitHub](https://github.com/rasti1608/PASC_Region_J)

---

## 👨‍💻 Author

**Rastislav Toscak**  
Senior Software Engineer | 30 Years Experience  
Full-Stack Development | AI Integration | Legacy Modernization

---

*Last Updated: November 2025*
