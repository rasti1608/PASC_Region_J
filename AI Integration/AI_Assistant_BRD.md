# Business Requirements Document
## PASC Region J Conference Website - AI Voice Assistant

**Document Version:** 1.0  
**Date:** November 28, 2025  
**Project:** pascregionj.com AI Integration  
**Author:** Rastislav Toscak  

---

## 1. Executive Summary

### 1.1 Purpose
Add an AI-powered voice assistant to the PASC Region J Conference website that allows visitors to ask questions and navigate the site using natural language (voice or text). The assistant will have complete knowledge of the conference, website content, and database, providing a modern, sophisticated user experience.

### 1.2 Vision
Replace traditional website navigation with an intelligent assistant that understands any question about the conference and can guide users to the information they need. Users can speak or type naturally instead of clicking through menus.

### 1.3 Success Criteria
- Users can ask any question about the conference and receive accurate answers
- AI can navigate users to any page or section on the site
- Voice input works reliably using Whisper API
- Response time under 3 seconds for most queries
- Works on desktop and mobile devices
- "Wow factor" - visitors are impressed by the modern experience

---

## 2. Scope

### 2.1 In Scope
- AI assistant floating button on website
- Voice input (Whisper API) and text input
- Text responses with optional voice output
- Knowledge of all site content and database
- Navigation actions (redirect, open accordion, scroll)
- Session-based conversation memory
- Slide-out chat panel UI

### 2.2 Out of Scope (Future Phases)
- Persistent conversation history (database storage)
- User authentication/personalization
- Form filling assistance
- Multi-language support
- Analytics dashboard for AI interactions
- Integration with registration system

---

## 3. User Requirements

### 3.1 Target Users
- **Students** - Researching conference, looking for workshop info
- **Parents/Guardians** - Finding registration info, costs, logistics
- **Teachers/Advisors** - Registering groups, finding resources
- **Conference Organizers** - Testing and demoing the feature
- **General Visitors** - Anyone exploring the site

### 3.2 User Stories

**US-01:** As a student, I want to ask "What workshops are available?" and get a list of workshops so I can decide which to attend.

**US-02:** As a parent, I want to ask "How much does registration cost and when is the deadline?" and get the answer immediately without searching through pages.

**US-03:** As a visitor, I want to say "Take me to registration" and have the AI offer to navigate me there so I can sign up quickly.

**US-04:** As a user, I want to ask follow-up questions like "Which ones are in the morning?" and have the AI remember we were talking about workshops.

**US-05:** As a mobile user, I want to tap a mic button and speak my question instead of typing on a small keyboard.

**US-06:** As a visitor, I want the AI to show me options before redirecting me so I stay in control of navigation.

---

## 4. Functional Requirements

### 4.1 User Interface

#### 4.1.1 Floating Button
- **Position:** Fixed, bottom-right corner of screen
- **Icon:** Microphone or AI assistant icon
- **Behavior:** Always visible while scrolling
- **Mobile:** Responsive, appropriately sized for touch
- **Note:** Music player moves to bottom-left corner

#### 4.1.2 Chat Panel (Slide-out)
- **Trigger:** Click/tap floating button
- **Position:** Slides in from right edge of screen
- **Width:** ~350px desktop, ~85% mobile
- **Height:** ~500px desktop, ~70vh mobile
- **Components:**
  - Header with title and close button
  - Chat message area (scrollable)
  - Input area with text field, mic button, send button
  - Optional: Voice output toggle

#### 4.1.3 Chat Messages
- **User messages:** Right-aligned, distinct color
- **AI messages:** Left-aligned, with AI avatar/icon
- **Action buttons:** Inline clickable options (e.g., "[Go to Registration]")
- **Typing indicator:** Show when AI is processing

### 4.2 Input Methods

#### 4.2.1 Voice Input
- **Technology:** OpenAI Whisper API
- **Activation:** Click/hold mic button
- **Feedback:** Visual indicator when listening (pulsing icon, waveform)
- **Transcription:** Display transcribed text before sending
- **Cost:** ~$0.006 per minute (acceptable)

#### 4.2.2 Text Input
- **Field:** Standard text input with placeholder "Ask me anything..."
- **Submit:** Enter key or Send button
- **Mobile:** Standard keyboard input

### 4.3 AI Response Behavior

#### 4.3.1 Response Types
The AI determines response type based on user intent:

**Informational Questions:**
```
User: "When is the conference?"
AI: "The PASC Region J Conference is February 13, 2026 at Neshaminy High School. 
     Registration opens at 8:00 AM."
```

**Navigation Requests:**
```
User: "Show me the workshops"
AI: "Here are your options:
     👉 [View Workshop List]
     👉 [Tell me more about specific workshops]"
```

**Action Commands:**
```
User: "Go to registration"
AI: "I can take you to the registration page.
     👉 [Go to Registration]
     👉 [First, tell me about registration]"
```

#### 4.3.2 Response Format
- Always show text response in chat
- Provide clickable action buttons when relevant
- Never auto-redirect without user confirmation
- Keep responses concise but complete

#### 4.3.3 Voice Output (Optional)
- Toggle in chat panel header
- Default: OFF (text only)
- Technology: Browser speechSynthesis API (free) or OpenAI TTS
- Reads AI responses aloud when enabled

### 4.4 AI Knowledge Base

#### 4.4.1 Static Knowledge (Embedded)
Feed AI with complete knowledge of:

**Conference Information:**
- Event name: PASC Region J Conference 2026
- Theme: "Lead Beyond Limits"
- Date: February 13, 2026
- Location: Neshaminy High School
- Registration deadline, cost, requirements
- Schedule overview
- Parking and logistics information
- What to bring, dress code
- Contact information

**Website Structure:**
- All pages and their purposes
- Navigation paths
- Accordion sections and their contents
- Form locations
- Resource downloads available

**Documentation:**
- Business Requirements Document
- README and project documentation
- FAQ content

**External Information:**
- PASC (Pennsylvania Association of Student Councils) overview
- Other region conferences (links)
- State conference information

#### 4.4.2 Dynamic Knowledge (Database Queries)
AI can query live data from:

| Table | Information |
|-------|-------------|
| announcements | Current announcements, dates, featured status |
| workshops | Workshop names, times, rooms, descriptions |
| gallery | Photo information |
| documents | Available downloads, resources |
| forms | Registration forms, deadlines |
| contact | Contact submissions (if relevant) |

#### 4.4.3 Knowledge Priority
1. Database (live, most current)
2. Static embedded knowledge
3. External PASC information
4. General AI knowledge (with disclaimer)

### 4.5 Actions

#### 4.5.1 Navigation Actions
| Action | Trigger Examples | Behavior |
|--------|------------------|----------|
| Navigate to page | "Go to About", "Show workshops" | Offer link, redirect on click |
| Open accordion | "Show registration form" | Navigate + open specific accordion |
| Scroll to section | "Show announcements" | Scroll to section on current page |
| External link | "PASC state website" | Offer external link with warning |
| Download file | "Download schedule" | Provide download link |

#### 4.5.2 Action Response Format
Always present actions as clickable options:
```
AI: "I can help you with registration. What would you like?
     👉 [Go to Registration Page]
     👉 [Tell me about costs and deadlines]
     👉 [Download registration form]"
```

#### 4.5.3 Action Execution
When user clicks action button:
1. If navigation: Close panel (optional) → Navigate → Open accordion if needed
2. If download: Trigger file download
3. If external: Open in new tab with confirmation
4. Show confirmation in chat: "Taking you to Registration..."

### 4.6 Conversation Memory

#### 4.6.1 Session Memory
- Remember all messages within current session
- Maintain context for follow-up questions
- Clear when browser tab closes or user manually resets

#### 4.6.2 Context Understanding
```
Turn 1:
  User: "What workshops are available?"
  AI: Lists 15 workshops

Turn 2:
  User: "Which ones are about leadership?"
  AI: [Understands "ones" = workshops from Turn 1]
  AI: "Three workshops focus on leadership: Leadership Skills (10 AM), 
       Team Building (1:30 PM), and Public Speaking (3 PM)"

Turn 3:
  User: "Tell me more about the first one"
  AI: [Understands "first one" = Leadership Skills]
  AI: "Leadership Skills workshop is at 10:00 AM in Room 205..."
```

#### 4.6.3 Memory Limits
- Store last 20 message pairs (user + AI)
- Summarize older context if conversation is long
- Display "Start new conversation" option

### 4.7 Fallback Behavior

#### 4.7.1 Unknown Information
```
AI: "I'm not sure about that specific information. You might find the answer 
     on the Resources page, or you can contact the organizers at 
     info@pascregionj.com"
```

#### 4.7.2 Unclear Questions
```
AI: "I want to make sure I understand. Are you asking about:
     👉 [Workshop schedule]
     👉 [Registration process]
     👉 [Something else]"
```

#### 4.7.3 Off-Topic Questions
```
AI: "I'm specialized in helping with the PASC Region J Conference. 
     I can answer questions about registration, workshops, schedules, 
     and other conference-related topics. What would you like to know?"
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Voice transcription: < 2 seconds
- AI response generation: < 3 seconds
- Total response time: < 5 seconds
- Panel animation: Smooth 300ms transition

### 5.2 Reliability
- Graceful handling of API failures
- Fallback message if AI unavailable
- Offline indicator if network issues

### 5.3 Accessibility
- Keyboard navigation support
- Screen reader compatible
- Sufficient color contrast
- Focus indicators

### 5.4 Security
- No sensitive data collection
- API keys secured server-side
- Input sanitization
- Rate limiting to prevent abuse

### 5.5 Browser Support
- Chrome (desktop/mobile)
- Safari (desktop/mobile)
- Firefox (desktop)
- Edge (desktop)
- Note: Voice input requires browser support for MediaRecorder API

### 5.6 Mobile Responsiveness
- Touch-friendly buttons (min 44px)
- Appropriate panel sizing
- Keyboard doesn't obscure input
- Works in portrait and landscape

---

## 6. User Interface Mockups

### 6.1 Desktop View - Panel Closed
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🚀 PASC Region J Conference 2026                                    [♪ 🔊] │
│  Home    About    Workshops    Resources    Gallery    Contact              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                                                                             │
│                         (Website Content)                                   │
│                                                                             │
│                                                                             │
│                                                                     [🤖💬]  │
│                                                                        ↑    │
│                                                              AI Button      │
│                                                              (floating)     │
└─────────────────────────────────────────────────────────────────────────────┘

[♪ 🔊] = Music player (LEFT)
[🤖💬] = AI Assistant button (RIGHT)
```

### 6.2 Desktop View - Panel Open
```
┌────────────────────────────────────────────────────────┬────────────────────┐
│  🚀 PASC Region J Conference 2026               [♪ 🔊] │ 🤖 AI Assistant [X]│
│  Home    About    Workshops    Resources    Gallery    │                    │
├────────────────────────────────────────────────────────┤ Hi! I'm your PASC │
│                                                        │ conference guide.  │
│                                                        │ Ask me anything!   │
│                                                        │                    │
│           (Website Content - slightly narrower)        │────────────────────│
│                                                        │                    │
│                                                        │ 👤 When is the     │
│                                                        │    conference?     │
│                                                        │                    │
│                                                        │ 🤖 The PASC Region │
│                                                        │ J Conference is    │
│                                                        │ February 13, 2026  │
│                                                        │ at Neshaminy High. │
│                                                        │                    │
│                                                        │ 👉 [View Schedule] │
│                                                        │ 👉 [Register Now]  │
│                                                        │                    │
│                                                        │────────────────────│
│                                                        │ [Ask anything...🎤]│
└────────────────────────────────────────────────────────┴────────────────────┘
```

### 6.3 Mobile View - Panel Open
```
┌─────────────────────────┐
│ 🤖 AI Assistant     [X] │
├─────────────────────────┤
│                         │
│ Hi! Ask me anything     │
│ about the conference!   │
│                         │
│─────────────────────────│
│                         │
│ 👤 What workshops are   │
│    available?           │
│                         │
│ 🤖 We have 15 workshops │
│ including:              │
│ • Leadership Skills     │
│ • Team Building         │
│ • Public Speaking       │
│ ...and more!            │
│                         │
│ 👉 [View All Workshops] │
│ 👉 [Filter by Topic]    │
│                         │
│─────────────────────────│
│ [Type here...] [🎤] [➤] │
└─────────────────────────┘
```

### 6.4 Voice Input Active State
```
┌─────────────────────────┐
│ 🤖 AI Assistant     [X] │
├─────────────────────────┤
│                         │
│  (previous messages)    │
│                         │
│─────────────────────────│
│                         │
│    🎤 Listening...      │
│    ◉ ◉ ◉ ◉ ◉ ◉         │
│    (waveform animation) │
│                         │
│  "Where do I regist..." │
│  (live transcription)   │
│                         │
│─────────────────────────│
│ [         ] [🔴] [   ]  │
│              ↑          │
│         Recording       │
└─────────────────────────┘
```

---

## 7. Technical Considerations

### 7.1 Technology Stack (To Be Determined)

**Frontend:**
- Angular (current site framework)
- Component for chat panel
- Service for AI communication

**Backend Options:**
- Option A: Python (FastAPI/Flask) - Most AI tools/documentation
- Option B: ColdFusion - Already deployed, familiar
- Option C: Node.js - JavaScript everywhere
- **Decision needed after hosting check**

**AI/ML Services:**
- OpenAI GPT-4 API - Main AI brain
- OpenAI Whisper API - Voice transcription
- LangChain (if Python) - RAG framework
- Vector database (Pinecone/ChromaDB) - Document storage

### 7.2 Hosting Considerations
- Check if DailyRazor supports Python
- If not, consider Railway.app or Vercel for AI backend
- API endpoint accessible from frontend

### 7.3 Cost Estimates (Monthly)
| Service | Estimated Usage | Cost |
|---------|-----------------|------|
| OpenAI GPT-4 | ~1000 conversations | $10-20 |
| Whisper API | ~100 minutes | $0.60 |
| Vector DB | Free tier | $0 |
| Hosting (if separate) | Basic tier | $0-5 |
| **Total** | | **$10-25/month** |

---

## 8. Implementation Phases

### Phase 1: Core Text Chat (MVP)
- Floating button and slide-out panel
- Text input only (no voice yet)
- AI responds from embedded knowledge
- Basic navigation actions
- Session memory

**Deliverables:**
- Chat UI component
- AI backend endpoint
- Knowledge base setup
- Basic action handlers

### Phase 2: Voice Input
- Whisper API integration
- Mic button with recording UI
- Live transcription display
- Error handling for mic permissions

**Deliverables:**
- Voice recording component
- Whisper API integration
- Audio processing

### Phase 3: Database Integration (RAG)
- Connect AI to live database
- Real-time workshop/announcement queries
- LangChain RAG setup
- Vector embeddings for documents

**Deliverables:**
- Database query layer
- RAG pipeline
- Document embeddings

### Phase 4: Polish & Enhancement
- Voice output option
- UI refinements
- Performance optimization
- Mobile testing
- Error handling improvements

**Deliverables:**
- TTS integration
- Polished UI
- Comprehensive testing

---

## 9. Open Questions

### 9.1 Technical
1. Does DailyRazor hosting support Python?
2. If not, what's the preferred backend deployment?
3. Which vector database to use (Pinecone, ChromaDB, etc.)?

### 9.2 Business
1. Budget approval for ~$20/month API costs?
2. Who maintains the knowledge base long-term?
3. Should conversation logs be stored for improvement?

### 9.3 UX
1. Should panel close after navigation action?
2. Welcome message content?
3. AI personality/tone (formal, friendly, casual)?

---

## 10. Acceptance Criteria

### 10.1 Functional
- [ ] User can open/close chat panel
- [ ] User can type questions and receive answers
- [ ] User can use voice input (with permission)
- [ ] AI answers questions about conference accurately
- [ ] AI provides navigation options
- [ ] Navigation actions work correctly
- [ ] Conversation context is maintained
- [ ] Fallback messages display for unknown queries

### 10.2 Non-Functional
- [ ] Response time under 5 seconds
- [ ] Works on Chrome, Safari, Firefox, Edge
- [ ] Mobile responsive
- [ ] No JavaScript errors in console
- [ ] Accessible via keyboard

### 10.3 User Experience
- [ ] "Wow factor" - users are impressed
- [ ] Intuitive without instructions
- [ ] Feels like talking to a knowledgeable assistant
- [ ] Smooth animations and transitions

---

## 11. Appendix

### A. Sample Conversations

**Scenario 1: Basic Information**
```
User: Hi
AI: Hello! Welcome to the PASC Region J Conference 2026. I can help you with 
    registration, workshop information, schedules, and more. What would you 
    like to know?

User: When is the conference?
AI: The conference is February 13, 2026 at Neshaminy High School. Registration 
    opens at 8:00 AM and the conference runs until 3:00 PM.
    
    👉 [View Full Schedule]
    👉 [How do I register?]
```

**Scenario 2: Navigation Request**
```
User: I want to register
AI: Great! Registration is $25 per student. The deadline is January 15, 2026.
    
    👉 [Go to Registration Form]
    👉 [Tell me more about what's included]
    👉 [Download registration packet]

User: [clicks "Go to Registration Form"]
AI: Taking you to the registration form now...
[Panel optionally closes, page navigates to Resources, Registration accordion opens]
```

**Scenario 3: Follow-up Questions**
```
User: What workshops do you have?
AI: We have 15 workshops across different topics including:
    • Leadership & Personal Development
    • Communication Skills
    • Team Building
    • Community Service
    
    👉 [See full workshop list]
    👉 [Filter by topic]

User: Which ones are in the morning?
AI: Morning workshops (before lunch):
    • 10:00 AM - Leadership Skills (Room 205)
    • 10:00 AM - Public Speaking (Auditorium)
    • 11:15 AM - Team Building (Gym)
    
    👉 [View detailed descriptions]
    👉 [See afternoon workshops]

User: Tell me about the leadership one
AI: "Leadership Skills" workshop:
    • Time: 10:00 AM - 11:00 AM
    • Location: Room 205
    • Description: Learn practical leadership techniques you can apply 
      in your student council and daily life...
    
    👉 [Add to my schedule]
    👉 [See other leadership workshops]
```

**Scenario 4: Unknown/Off-Topic**
```
User: What's the weather going to be like?
AI: I don't have weather forecast information, but February in Pennsylvania 
    can be cold! I'd recommend checking weather.com closer to the conference 
    date. Is there anything else about the conference I can help with?
    
    👉 [What should I bring?]
    👉 [Parking information]
```

### B. Glossary
- **RAG:** Retrieval Augmented Generation - AI technique that retrieves relevant data before generating responses
- **Whisper API:** OpenAI's speech-to-text service
- **LangChain:** Framework for connecting AI to data sources
- **Vector Database:** Database optimized for storing and searching text embeddings

---

**Document Status:** Draft  
**Next Steps:** Technical architecture document after hosting verification

---

*End of Business Requirements Document*
