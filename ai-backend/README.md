# PASC Region J - AI Backend

FastAPI backend for the AI Chat Assistant on pascregionj.com.
Uses OpenAI GPT-4o-mini for intelligent responses about the conference.

## Quick Start

### 1. Prerequisites

- Python 3.8+ (3.13 recommended)
- pip (Python package manager)
- OpenAI API key with available credits

### 2. Setup

```bash
# Navigate to the ai-backend folder
cd ai-backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template and configure
copy .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 3. Configure OpenAI API Key

Edit the `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-api-key-here
```

Get an API key from: https://platform.openai.com/api-keys

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# Or simply:
python main.py
```

### 5. Verify It's Working

Open your browser to: http://localhost:8001

You should see:
```json
{
  "name": "PASC Region J AI Backend",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/api/health",
    "chat": "/api/chat"
  }
}
```

### 6. Test the Endpoints

**Health Check:**
```bash
curl http://localhost:8001/api/health
```

Response:
```json
{"status": "healthy", "version": "1.0.0", "openai_configured": true}
```

**Chat:**
```bash
curl -X POST http://localhost:8001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "When is the conference?"}'
```

Response (with valid API key):
```json
{
  "response": "The PASC Region J Conference 2026 is on February 13, 2026...",
  "actions": [],
  "conversation_id": "..."
}
```

## API Documentation

FastAPI automatically generates interactive API docs:

- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

## Project Structure

```
ai-backend/
├── main.py           # FastAPI app with endpoints
├── requirements.txt  # Python dependencies
├── .env.example      # Environment variables template
├── .env              # Your local environment (git-ignored)
└── README.md         # This file
```

## Endpoints

| Method | Endpoint      | Description                    |
|--------|---------------|--------------------------------|
| GET    | /             | API info                       |
| GET    | /api/health   | Health check                   |
| POST   | /api/chat     | Chat with AI assistant         |

## CORS Configuration

The following origins are allowed:
- `http://localhost:4200` (Angular dev)
- `http://localhost:3000` (React dev)
- `https://pascregionj.com` (Production)
- `https://www.pascregionj.com` (Production with www)

## Next Steps

After verifying basic connectivity:

1. **Phase 1:** Add LangChain + ChromaDB for RAG
2. **Phase 2:** Add Whisper API for voice transcription
3. **Phase 3:** Connect to SQL Server for live data
4. **Phase 4:** Deploy to Railway.app

## Troubleshooting

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8001
kill -9 <PID>
```

**Module not found:**
```bash
pip install -r requirements.txt
```

**CORS errors:**
Make sure your Angular app is running on `http://localhost:4200`

**OpenAI API quota exceeded:**
The error "AI service has reached its usage limit" means your OpenAI API key
needs more credits. Add billing at: https://platform.openai.com/account/billing

**OpenAI authentication error:**
Verify your API key in `.env` is valid and not expired.
