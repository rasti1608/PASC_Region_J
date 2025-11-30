"""
PASC Region J Conference - AI Backend
FastAPI server for AI Assistant integration

Uses OpenAI GPT-5 nano for intelligent responses about the conference.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import logging
import tempfile
import json
import re
from dotenv import load_dotenv
from openai import OpenAI, RateLimitError, AuthenticationError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Load knowledge base from markdown files
def load_knowledge_base():
    """Load all markdown files from the knowledge folder and subfolders."""
    knowledge_dir = os.path.join(os.path.dirname(__file__), "knowledge")
    knowledge_content = []

    if os.path.exists(knowledge_dir):
        # Walk through all directories and subdirectories
        for root, dirs, files in os.walk(knowledge_dir):
            for filename in sorted(files):
                if filename.endswith(".md"):
                    filepath = os.path.join(root, filename)
                    # Get relative path for logging
                    rel_path = os.path.relpath(filepath, knowledge_dir)
                    try:
                        with open(filepath, "r", encoding="utf-8") as f:
                            content = f.read()
                            knowledge_content.append(f"--- {rel_path} ---\n{content}")
                            logger.info(f"Loaded knowledge file: {rel_path}")
                    except Exception as e:
                        logger.error(f"Error loading {rel_path}: {e}")
    else:
        logger.warning(f"Knowledge directory not found: {knowledge_dir}")

    return "\n\n".join(knowledge_content)

# Load knowledge at startup
KNOWLEDGE_BASE = load_knowledge_base()
logger.info(f"Knowledge base loaded: {len(KNOWLEDGE_BASE)} characters")

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    logger.warning("OPENAI_API_KEY not found in environment variables")
    client = None
else:
    client = OpenAI(api_key=openai_api_key)
    logger.info("OpenAI client initialized")

# System prompt template (knowledge base will be inserted)
SYSTEM_PROMPT_TEMPLATE = """You are the PASC Region J Conference AI Assistant. You help visitors find information about the student leadership conference.

PERSONALITY:
- Be friendly, helpful, and enthusiastic about student leadership
- Keep responses concise but informative (2-4 sentences usually)
- Use the space theme language when appropriate (stars, orbit, launch, etc.)

CRITICAL INSTRUCTIONS:
1. Answer questions FULLY using the KNOWLEDGE BASE below. Share the actual information - don't just tell users to "check a page".
2. When asked about anthem lyrics, share the full lyrics from the knowledge base - they are original content created by the site owner.
3. The conference anthem "One Orbit" can be played anytime using the floating music button (🎵) on any page.
4. Do NOT use markdown formatting (no ### headers, no ** bold, no * bullets) - respond in plain text only. For lyrics, use simple labels like [Verse 1], [Chorus] on their own lines.
5. If information is truly not in the knowledge base, say "I don't have that specific information. Please contact info@pascregionj.com for more details."

WEBSITE PAGES (for reference):
- Home (/home): Welcome and announcements
- About (/about): Organization info, mission, vision
- Registration (/register): How to register (Jan 5-23, 2026)
- Workshops (/workshops): Workshop info and applications
- Schedule (/schedule): Conference timeline
- Gallery (/gallery): Photos from past conferences
- Resources (/resources): Downloads and materials
- Contact (/contact): Contact form and email

=== KNOWLEDGE BASE ===
{knowledge_base}
=== END KNOWLEDGE BASE ===

Remember: Answer fully from the knowledge base. Share lyrics, schedules, and details directly - don't deflect to pages."""

# Build the complete system prompt with knowledge base
SYSTEM_PROMPT = SYSTEM_PROMPT_TEMPLATE.format(knowledge_base=KNOWLEDGE_BASE)

# Initialize FastAPI app
app = FastAPI(
    title="PASC Region J AI Backend",
    description="AI Assistant API for the PASC Region J Conference website",
    version="1.0.0"
)

# CORS Configuration
allowed_origins = [
    "http://localhost:4200",      # Angular dev server
    "http://localhost:3000",      # React dev server (if needed)
    "https://pascregionj.com",    # Production
    "https://www.pascregionj.com" # Production with www
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    history: Optional[List[dict]] = None


class Action(BaseModel):
    type: str
    label: str
    target: str


class ChatResponse(BaseModel):
    response: str
    actions: List[Action]
    conversation_id: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    openai_configured: bool


class TranscriptionResponse(BaseModel):
    text: str
    duration: Optional[float] = None


# Keyword-based navigation detection
# Maps keywords in AI response to navigation actions
NAVIGATION_KEYWORDS = {
    "/register": {
        "keywords": ["registration", "register", "sign up", "signup", "january 5", "january 23"],
        "label": "Go to Registration"
    },
    "/workshops": {
        "keywords": ["workshop", "presenter", "present a workshop", "workshop application"],
        "label": "View Workshops"
    },
    "/schedule": {
        "keywords": ["schedule", "timeline", "agenda", "10:30", "4:00", "rotation"],
        "label": "View Schedule"
    },
    "/gallery": {
        "keywords": ["gallery", "photos", "pictures", "images", "past conference"],
        "label": "View Gallery"
    },
    "/contact": {
        "keywords": ["contact", "email", "info@pascregionj", "reach out", "get in touch"],
        "label": "Contact Us"
    },
    "/about": {
        "keywords": ["about pasc", "mission", "vision", "history", "founded", "1932", "organization"],
        "label": "Learn More"
    },
    "/resources": {
        "keywords": ["download", "resources", "materials", "documents"],
        "label": "View Resources"
    }
}

# Special action keywords (non-navigation)
SPECIAL_ACTIONS = {
    "openMusicPlayer": {
        "keywords": ["floating music button", "music button", "🎵", "one orbit", "anthem", "listen to the song", "play the song", "play the anthem"],
        "label": "🎵 Play Anthem"
    }
}


def detect_navigation_actions(response_text: str) -> List[Action]:
    """
    Detect navigation actions based on keywords in the AI response.
    Returns a list of Action objects for relevant pages mentioned.
    """
    actions = []
    response_lower = response_text.lower()
    added_actions = set()  # Avoid duplicate actions

    # Check for special actions first (like music player)
    for action_type, config in SPECIAL_ACTIONS.items():
        for keyword in config["keywords"]:
            if keyword.lower() in response_lower and action_type not in added_actions:
                actions.append(Action(
                    type=action_type,
                    label=config["label"],
                    target=""  # No target needed for special actions
                ))
                added_actions.add(action_type)
                break

    # Check for navigation actions
    for route, config in NAVIGATION_KEYWORDS.items():
        # Check if any keyword is mentioned in the response
        for keyword in config["keywords"]:
            if keyword in response_lower and route not in added_actions:
                actions.append(Action(
                    type="navigate",
                    label=config["label"],
                    target=route
                ))
                added_actions.add(route)
                break  # Only add one action per route

    # Limit to max 2 actions to avoid clutter
    return actions[:2]


# Endpoints
@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify the API is running.
    """
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        openai_configured=client is not None
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint - uses OpenAI GPT-5 nano to generate responses.
    """
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Generate conversation ID if not provided
    conversation_id = request.conversation_id or str(uuid.uuid4())

    # Check if OpenAI client is configured
    if client is None:
        logger.error("OpenAI client not configured")
        return ChatResponse(
            response="I'm sorry, the AI service is not configured. Please check that the OPENAI_API_KEY is set in the .env file.",
            actions=[],
            conversation_id=conversation_id
        )

    try:
        # Build messages array with system prompt and history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history if provided
        if request.history:
            for msg in request.history:
                if msg.get("role") in ["user", "assistant"] and msg.get("content"):
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })

        # Add the current user message
        messages.append({"role": "user", "content": request.message})

        logger.info(f"Sending request to OpenAI with {len(messages)} messages")

        # Call OpenAI GPT-4o-mini (fast and cost-effective)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )

        # Extract the response (plain text, no JSON parsing needed)
        ai_response = completion.choices[0].message.content.strip()

        logger.info(f"Received response from OpenAI: {ai_response[:100]}...")

        # Detect navigation actions based on keywords in the response
        actions = detect_navigation_actions(ai_response)

        return ChatResponse(
            response=ai_response,
            actions=actions,
            conversation_id=conversation_id
        )

    except RateLimitError as e:
        logger.error(f"OpenAI quota exceeded: {str(e)}")
        return ChatResponse(
            response="I'm sorry, the AI service has reached its usage limit. Please contact the site administrator to add more API credits.",
            actions=[],
            conversation_id=conversation_id
        )

    except AuthenticationError as e:
        logger.error(f"OpenAI authentication failed: {str(e)}")
        return ChatResponse(
            response="I'm sorry, there's a configuration issue with the AI service. Please contact the site administrator.",
            actions=[],
            conversation_id=conversation_id
        )

    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return ChatResponse(
            response="I'm having trouble connecting to my AI brain right now. Please try again in a moment. If the problem persists, contact info@pascregionj.com for assistance.",
            actions=[],
            conversation_id=conversation_id
        )


@app.post("/api/voice", response_model=TranscriptionResponse)
async def transcribe_voice(audio: UploadFile = File(...)):
    """
    Voice transcription endpoint - uses OpenAI Whisper to transcribe audio.
    """
    # Check if OpenAI client is configured
    if client is None:
        logger.error("OpenAI client not configured for voice transcription")
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. Please check that the OPENAI_API_KEY is set."
        )

    try:
        # Read the uploaded audio file
        audio_content = await audio.read()

        if len(audio_content) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")

        # Log audio details for debugging
        content_type = audio.content_type or "unknown"
        logger.info(f"Received audio file: {audio.filename}, size: {len(audio_content)} bytes, type: {content_type}")

        # Save to a temporary file (Whisper API requires a file)
        # Use .webm extension for WebM audio format
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_file:
            temp_file.write(audio_content)
            temp_file_path = temp_file.name

        try:
            # Call OpenAI Whisper API with optimized settings
            with open(temp_file_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language="en",  # Specify English for better accuracy
                    response_format="text"
                )

            logger.info(f"Transcription successful ({len(transcription) if transcription else 0} chars): {transcription[:100] if transcription else 'empty'}...")

            return TranscriptionResponse(
                text=transcription.strip() if transcription else "",
                duration=None  # Could extract from audio if needed
            )

        finally:
            # Clean up temp file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    except RateLimitError as e:
        logger.error(f"OpenAI quota exceeded for voice: {str(e)}")
        raise HTTPException(
            status_code=429,
            detail="AI service has reached its usage limit. Please try again later."
        )

    except AuthenticationError as e:
        logger.error(f"OpenAI authentication failed for voice: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="AI service configuration error."
        )

    except Exception as e:
        logger.error(f"Voice transcription error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to transcribe audio. Please try again."
        )


@app.get("/")
async def root():
    """
    Root endpoint - provides API information.
    """
    return {
        "name": "PASC Region J AI Backend",
        "version": "1.0.0",
        "status": "running",
        "openai_configured": client is not None,
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat",
            "voice": "/api/voice"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
