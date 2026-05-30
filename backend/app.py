from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from groq import Groq
import os
import json
import urllib.parse
import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

cors_origins_env = os.getenv("CORS_ORIGINS", "").strip()
cors_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
# If not set, allow all origins for local dev convenience.
# For production, set CORS_ORIGINS to your Vercel domain(s).
CORS(app, resources={r"/api/*": {"origins": cors_origins or "*"}})

limiter = Limiter(
    get_remote_address,
    app=app,
    storage_uri=os.getenv("RATE_LIMIT_STORAGE_URI", "memory://"),
)

# Configure Groq AI
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def is_url(text):
    try:
        parsed = urllib.parse.urlparse(text.strip())
        return all([parsed.scheme, parsed.netloc])
    except Exception:
        return False


def scrape_url(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            return f"Error: Webpage returned status code {response.status_code}"

        soup = BeautifulSoup(response.text, "html.parser")
        
        # Clean up unwanted HTML elements
        for element in soup(["script", "style", "nav", "footer", "header", "aside"]):
            element.extract()

        raw_text = soup.get_text(separator=" ")
        lines = (line.strip() for line in raw_text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        clean_text = "\n".join(chunk for chunk in chunks if chunk)

        return clean_text[:4000]
    except Exception as e:
        return f"Error: Failed to scrape webpage. {str(e)}"


def extract_entities_for_search(text, content_type):
    try:
        if content_type == "news":
            prompt = (
                "You are an information extraction assistant. Extract the main claim/headline topic and the news source/website (if mentioned) from the text below.\n"
                "Respond ONLY with a single line formatted exactly as:\n"
                "Topic: <main claim or topic> | Source: <publisher website or name>\n"
                f"Do not add any explanation or other text.\n\nText: {text[:1200]}"
            )
        else:
            prompt = (
                "You are an information extraction assistant. Extract the name of the hiring company and the email/domain mentioned in the text below.\n"
                "Respond ONLY with a single line formatted exactly as:\n"
                "Company: <company name> | Domain: <website or email domain>\n"
                f"Do not add any explanation or other text.\n\nText: {text[:1200]}"
            )

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=100
        )
        output = response.choices[0].message.content.strip()

        details = {}
        if "|" in output:
            parts = output.split("|")
            for part in parts:
                if ":" in part:
                    k, v = part.split(":", 1)
                    details[k.strip().lower()] = v.strip()
        return details
    except Exception:
        return {}


def perform_live_search(details, content_type):
    try:
        if content_type == "news":
            topic = details.get("topic", "")
            source = details.get("source", "")
            if not topic or topic.lower() == "none" or topic.lower() == "unknown":
                return "No specific news claims found to fact check."

            query = f"{topic} fact check"
            if source:
                query += f" {source}"
        else:
            company = details.get("company", "")
            domain = details.get("domain", "")
            if not company or company.lower() == "none" or company.lower() == "unknown":
                return "No company name detected in job post."

            query = f"{company} careers reviews"
            if domain:
                query += f" {domain}"

        # Query DuckDuckGo Instant Answer API
        url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(query)}&format=json&no_html=1"
        res = requests.get(url, timeout=5).json()

        abstract = res.get("AbstractText", "")
        related = []
        for topic_item in res.get("RelatedTopics", []):
            if "Text" in topic_item:
                related.append(topic_item["Text"])
            elif "Topics" in topic_item:
                for subtopic in topic_item["Topics"]:
                    if "Text" in subtopic:
                        related.append(subtopic["Text"])

        summary_parts = []
        if abstract:
            summary_parts.append(f"Abstract: {abstract}")
        if related:
            summary_parts.append(f"Related search topics: " + " | ".join(related[:3]))

        if not summary_parts:
            # Fallback search for company name directly
            if content_type == "job" and company:
                fallback_url = f"https://api.duckduckgo.com/?q={urllib.parse.quote(company)}&format=json&no_html=1"
                fb_res = requests.get(fallback_url, timeout=5).json()
                fb_abstract = fb_res.get("AbstractText", "")
                
                fb_related = []
                for topic_item in fb_res.get("RelatedTopics", []):
                    if "Text" in topic_item:
                        fb_related.append(topic_item["Text"])
                    elif "Topics" in topic_item:
                        for subtopic in topic_item["Topics"]:
                            if "Text" in subtopic:
                                fb_related.append(subtopic["Text"])
                                
                if fb_abstract:
                    return f"Found search records for company '{company}': {fb_abstract}"
                elif fb_related:
                    return f"Found search records for company '{company}': {fb_related[0]}"
            return f"No verified web records found for search query: '{query}'"

        return "\n".join(summary_parts)
    except Exception as e:
        return f"Could not perform live web search check: {str(e)}"


def extract_text_from_image(image_data):
    try:
        if not image_data.startswith("data:image/"):
            image_data = f"data:image/jpeg;base64,{image_data}"

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract and transcribe all readable text from this image. Do not add any conversational text or comments, only return the raw transcribed text."},
                        {"type": "image_url", "image_url": {"url": image_data}}
                    ]
                }
            ],
            temperature=0.0,
            max_tokens=1024
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return ""


def analyze_image(image_data, content_type, search_context=""):
    if not image_data.startswith("data:image/"):
        image_data = f"data:image/jpeg;base64,{image_data}"

    if content_type == "news":
        prompt = """You are an expert fake news detection AI. Analyze the text and context present in the provided screenshot image.
Identify if it contains a news headline, article, or social media post, and analyze its credibility.
"""
        if search_context:
            prompt += f"\nLive Web Search Context for claims/publisher:\n{search_context}\nUse this live web search context to verify the credibility of the claims or news source.\n"

        prompt += """
Respond ONLY with a valid JSON object (no markdown, no code blocks, just pure JSON):
{
  "trust_score": <integer 0-100>,
  "verdict": "<SAFE | SUSPICIOUS | FAKE>",
  "red_flags": [{"flag": "<red flag indicator>", "snippet": "<exact matching phrase or sentence from the transcribed text>"}],
  "positives": ["<what looks credible 1>"],
  "explanation": "<2-3 sentence human friendly explanation of the image content and credibility>",
  "tip": "<one practical safety tip for the user>",
  "category": "<Politics | Health | Finance | Technology | General>",
  "confidence_breakdown": {
    "language_quality": <integer 0-100 how professional and grammatically correct the language is>,
    "source_credibility": <integer 0-100 how credible the source or publisher appears>,
    "emotional_manipulation": <integer 0-100 how much emotional or sensational language is used, higher means MORE manipulation detected>,
    "factual_accuracy": <integer 0-100 how factually accurate the claims appear>,
    "consistency": <integer 0-100 how internally consistent and logical the content is>
  }
}

Trust Score Guide:
- 80-100: Likely credible
- 50-79: Needs verification
- 0-49: Likely fake or misleading"""
    else:
        prompt = """You are an expert job scam detection AI. Analyze the text and context present in the provided job posting screenshot.
Identify if it is a job advertisement, message, or email offer, and check for scam indicators.
"""
        if search_context:
            prompt += f"\nLive Web Search Context for company/domain:\n{search_context}\nUse this live web search context to verify if the hiring company is real, registered, and legitimate.\n"

        prompt += """
Respond ONLY with a valid JSON object (no markdown, no code blocks, just pure JSON):
{
  "trust_score": <integer 0-100>,
  "verdict": "<SAFE | SUSPICIOUS | SCAM>",
  "red_flags": [{"flag": "<red flag indicator>", "snippet": "<exact matching phrase or sentence from the transcribed text>"}],
  "positives": ["<what looks legitimate 1>"],
  "explanation": "<2-3 sentence human friendly explanation of the image content and legitimacy>",
  "tip": "<one practical safety tip for job seekers>",
  "category": "<IT | Finance | Marketing | Healthcare | Other>",
  "confidence_breakdown": {
    "language_quality": <integer 0-100 how professional and grammatically correct the language is>,
    "source_credibility": <integer 0-100 how credible the hiring company appears>,
    "emotional_manipulation": <integer 0-100 how much pressure tactics or urgency is used, higher means MORE manipulation detected>,
    "factual_accuracy": <integer 0-100 how realistic the job details salary and requirements are>,
    "consistency": <integer 0-100 how internally consistent and logical the job posting is>
  }
}

Trust Score Guide:
- 80-100: Likely legitimate job
- 50-79: Verify before applying
- 0-49: Very likely a scam
Common scam patterns: upfront payment, unrealistic salary, vague description, no company info, personal info requested early."""

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_data,
                        },
                    },
                ],
            }
        ],
        temperature=0.3,
        max_tokens=1024,
    )

    raw = response.choices[0].message.content
    if not raw:
        raise Exception("AI returned empty response")
    raw = raw.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    result = json.loads(raw)
    return result


def analyze_content(text, content_type, search_context=""):
    if content_type == "news":
        prompt = f"""You are an expert fake news detection AI. Analyze the following news article or headline carefully.

Content: {text}"""

        if search_context:
            prompt += f"\n\nLive Web Search Context for claims/publisher:\n{search_context}\nUse this live web search context to verify the credibility of the claims or news source."

        prompt += """\n\nRespond ONLY with a valid JSON object (no markdown, no code blocks, just pure JSON):
{{
  "trust_score": <integer 0-100>,
  "verdict": "<SAFE | SUSPICIOUS | FAKE>",
  "red_flags": [{{"flag": "<red flag indicator>", "snippet": "<exact matching phrase or sentence from the text>"}}],
  "positives": ["<what looks credible 1>"],
  "explanation": "<2-3 sentence human friendly explanation>",
  "tip": "<one practical safety tip for the user>",
  "category": "<Politics | Health | Finance | Technology | General>",
  "confidence_breakdown": {{
    "language_quality": <integer 0-100 how professional and grammatically correct the language is>,
    "source_credibility": <integer 0-100 how credible the source or publisher appears>,
    "emotional_manipulation": <integer 0-100 how much emotional or sensational language is used, higher means MORE manipulation detected>,
    "factual_accuracy": <integer 0-100 how factually accurate the claims appear>,
    "consistency": <integer 0-100 how internally consistent and logical the content is>
  }}
}}

Trust Score Guide:
- 80-100: Likely credible
- 50-79: Needs verification
- 0-49: Likely fake or misleading"""
    else:
        prompt = f"""You are an expert job scam detection AI. Analyze the following job posting carefully.

Content: {text}"""

        if search_context:
            prompt += f"\n\nLive Web Search Context for company/domain:\n{search_context}\nUse this live web search context to verify if the hiring company is real, registered, and legitimate."

        prompt += """\n\nRespond ONLY with a valid JSON object (no markdown, no code blocks, just pure JSON):
{{
  "trust_score": <integer 0-100>,
  "verdict": "<SAFE | SUSPICIOUS | SCAM>",
  "red_flags": [{{"flag": "<red flag indicator>", "snippet": "<exact matching phrase or sentence from the text>"}}],
  "positives": ["<what looks legitimate 1>"],
  "explanation": "<2-3 sentence human friendly explanation>",
  "tip": "<one practical safety tip for job seekers>",
  "category": "<IT | Finance | Marketing | Healthcare | Other>",
  "confidence_breakdown": {{
    "language_quality": <integer 0-100 how professional and grammatically correct the language is>,
    "source_credibility": <integer 0-100 how credible the hiring company appears>,
    "emotional_manipulation": <integer 0-100 how much pressure tactics or urgency is used, higher means MORE manipulation detected>,
    "factual_accuracy": <integer 0-100 how realistic the job details salary and requirements are>,
    "consistency": <integer 0-100 how internally consistent and logical the job posting is>
  }}
}}

Trust Score Guide:
- 80-100: Likely legitimate job
- 50-79: Verify before applying
- 0-49: Very likely a scam
Common scam patterns: upfront payment, unrealistic salary, vague description, no company info, personal info requested early."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert scam and fake news detection AI. Always respond with valid JSON only, no extra text."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=1024,
    )

    raw = response.choices[0].message.content
    if not raw:
        raise Exception("AI returned empty response")
    raw = raw.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    result = json.loads(raw)
    return result


@app.route("/api/analyze", methods=["POST"])
@limiter.limit(os.getenv("RATE_LIMIT_ANALYZE", "10 per minute"))
def analyze():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request payload"}), 400

        text = (data.get("text") or "").strip()
        image_data = (data.get("image") or "").strip()
        content_type = data.get("type") or "news"  # "news" or "job"

        if not GROQ_API_KEY or not client:
            return jsonify({"error": "API key not configured. Please add GROQ_API_KEY to .env file"}), 500

        search_context = ""
        search_summary = ""

        # Handle image input
        if image_data:
            transcribed_text = extract_text_from_image(image_data)
            if transcribed_text:
                search_details = extract_entities_for_search(transcribed_text, content_type)
                if search_details:
                    search_context = perform_live_search(search_details, content_type)
                    if content_type == "job":
                        search_summary = f"Company: {search_details.get('company', 'Unknown')} | Domain: {search_details.get('domain', 'Unknown')}"
                    else:
                        search_summary = f"Claim Topic: {search_details.get('topic', 'Unknown')}"

            result = analyze_image(image_data, content_type, search_context)
            return jsonify({
                "success": True,
                "result": result,
                "source": "image",
                "analyzed_text": transcribed_text,
                "transcribed_text": transcribed_text,
                "search_summary": search_summary,
                "search_results": search_context
            })

        # Handle text/URL input
        if not text:
            return jsonify({"error": "Please provide text, a URL, or upload a screenshot to analyze."}), 400

        scraped = False
        display_text = text
        if is_url(text):
            scraped_text = scrape_url(text)
            if scraped_text.startswith("Error:"):
                return jsonify({"error": scraped_text}), 400
            display_text = scraped_text
            scraped = True

        if len(display_text) < 20:
            return jsonify({"error": "Content is too short to analyze. Please provide longer text."}), 400

        # Perform live web search check
        search_details = extract_entities_for_search(display_text, content_type)
        if search_details:
            search_context = perform_live_search(search_details, content_type)
            if content_type == "job":
                search_summary = f"Company: {search_details.get('company', 'Unknown')} | Domain: {search_details.get('domain', 'Unknown')}"
            else:
                search_summary = f"Claim Topic: {search_details.get('topic', 'Unknown')}"

        result = analyze_content(display_text, content_type, search_context)
        return jsonify({
            "success": True,
            "result": result,
            "source": "url" if scraped else "text",
            "analyzed_text": display_text,
            "search_summary": search_summary,
            "search_results": search_context
        })

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid response. Please try again."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def fetch_live_threats():
    threats = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    
    # 1. Fetch live scams from FTC Consumer Blog RSS
    try:
        res = requests.get("https://www.consumer.ftc.gov/blog/gd-rss.xml", headers=headers, timeout=5)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            items = root.findall(".//item")
            for idx, item in enumerate(items[:2]):
                title_el = item.find("title")
                desc_el = item.find("description")
                title = title_el.text.strip() if title_el is not None else "Scam Alert"
                desc_html = desc_el.text if desc_el is not None else ""
                
                # Clean html tags from description
                clean_desc = BeautifulSoup(desc_html, "html.parser").get_text().strip()
                clean_desc = " ".join(clean_desc.split())
                
                # Make sample text
                sample_text = f"SCAM WARNING:\nTitle: {title}\nSummary: {clean_desc[:400]}"
                
                threats.append({
                    "id": f"scam-{idx}",
                    "type": "job",  # maps to scam detector mode
                    "severity": "CRITICAL" if any(x in title.lower() for x in ["scam", "fraud", "phish", "steal", "fake", "hack", "compromise"]) else "WARNING",
                    "title": title,
                    "description": clean_desc[:200] + "..." if len(clean_desc) > 200 else clean_desc,
                    "sample_text": sample_text,
                    "timestamp": "Live FTC Alert"
                })
    except Exception as e:
        print(f"Error fetching FTC alerts: {e}")

    # 2. Fetch live fake news from FactCheck.org RSS
    try:
        res = requests.get("https://www.factcheck.org/feed/", headers=headers, timeout=5)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            items = root.findall(".//item")
            for idx, item in enumerate(items[:2]):
                title_el = item.find("title")
                desc_el = item.find("description")
                title = title_el.text.strip() if title_el is not None else "News Hoax Alert"
                desc_html = desc_el.text if desc_el is not None else ""
                
                # Clean HTML tags
                clean_desc = BeautifulSoup(desc_html, "html.parser").get_text().strip()
                clean_desc = " ".join(clean_desc.split())
                
                # Make sample text
                sample_text = f"NEWS CLAIM FOR FACT-CHECK:\nClaim: {title}\nContext: {clean_desc[:400]}"
                
                threats.append({
                    "id": f"news-{idx}",
                    "type": "news",  # maps to news detector mode
                    "severity": "CRITICAL" if any(x in title.lower() for x in ["vaccine", "covid", "trump", "biden", "election", "hoax", "viral"]) else "INFO",
                    "title": title,
                    "description": clean_desc[:200] + "..." if len(clean_desc) > 200 else clean_desc,
                    "sample_text": sample_text,
                    "timestamp": "Live FactCheck"
                })
    except Exception as e:
        print(f"Error fetching FactCheck.org alerts: {e}")

    # 3. Fetch live Hindi fake news from Vishvas News RSS
    try:
        res = requests.get("https://www.vishvasnews.com/feed/", headers=headers, timeout=5)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            items = root.findall(".//item")
            for idx, item in enumerate(items[:2]):
                title_el = item.find("title")
                desc_el = item.find("description")
                title = title_el.text.strip() if title_el is not None else "Hindi News Alert"
                desc_html = desc_el.text if desc_el is not None else ""
                
                # Clean HTML tags
                clean_desc = BeautifulSoup(desc_html, "html.parser").get_text().strip()
                clean_desc = " ".join(clean_desc.split())
                
                # Make sample text
                sample_text = f"NEWS CLAIM IN HINDI FOR FACT-CHECK:\nदावा: {title}\nसंदर्भ: {clean_desc[:400]}"
                
                threats.append({
                    "id": f"hindi-{idx}",
                    "type": "news",  # maps to news detector mode
                    "severity": "CRITICAL" if any(x in title.lower() or x in clean_desc.lower() for x in ["डीपफेक", "deepfake", "हत्या", "फायरिंग", "वायरल", "धोखा", "फर्जी"]) else "WARNING",
                    "title": title,
                    "description": clean_desc[:200] + "..." if len(clean_desc) > 200 else clean_desc,
                    "sample_text": sample_text,
                    "timestamp": "Live Vishvas News"
                })
    except Exception as e:
        print(f"Error fetching Vishvas News alerts: {e}")

    # Fallback to static threats if live fetch fails completely
    if not threats:
        return [
            {
                "id": "static-1",
                "type": "job",
                "severity": "CRITICAL",
                "title": "WhatsApp Daily Wage Job Offer Scam",
                "description": "Scammers impersonating HR agencies are sending WhatsApp/Telegram messages offering ₹5,000–₹10,000 per day for liking YouTube videos.",
                "sample_text": "Greetings! I am an HR recruiter from Global Media Ltd. We have remote part-time positions. Earn ₹5000-10000 daily by simply watching and liking YouTube videos.",
                "timestamp": "Local Feed"
            },
            {
                "id": "static-2",
                "type": "news",
                "severity": "CRITICAL",
                "title": "Viral Banking Holiday Deepfake Alert",
                "description": "A deepfake video of a news anchor claiming the central bank will suspend all online transactions and ATM withdrawals over the coming week is viral.",
                "sample_text": "URGENT NEWS: The central bank has announced a snap banking freeze. Starting Monday, all online transfers, UPI payments, and ATM services will be disabled for 7 days.",
                "timestamp": "Local Feed"
            }
        ]
        
    return threats


@app.route("/api/threats", methods=["GET"])
def get_threats():
    live_threats = fetch_live_threats()
    return jsonify({
        "success": True,
        "threats": live_threats
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "running",
        "api_configured": bool(GROQ_API_KEY),
        "message": "TruthGuard API is live! Powered by Groq + Llama 3.3, Llama 4 Vision and DDG Live Search"
    })


@app.route("/api/chat", methods=["POST"])
@limiter.limit(os.getenv("RATE_LIMIT_CHAT", "15 per minute"))
def chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request payload"}), 400

        message = (data.get("message") or "").strip()
        context = data.get("context") or {}

        if not message:
            return jsonify({"error": "Message is required"}), 400

        if not GROQ_API_KEY or not client:
            return jsonify({"error": "API key not configured"}), 500

        original_text = context.get("original_text", "")
        result = context.get("result", {})

        system_prompt = f"""You are TruthGuard AI Assistant, an expert in detecting fake news and job scams.
You have just completed an analysis with these results:
- Verdict: {result.get('verdict', 'Unknown')}
- Trust Score: {result.get('trust_score', 'N/A')}/100
- Explanation: {result.get('explanation', '')}
- Red Flags: {json.dumps(result.get('red_flags', []))}
- Category: {result.get('category', 'Unknown')}
- Original content analyzed: {original_text[:800]}

Answer the user's follow-up question helpfully and concisely. Be specific to their analyzed content.
If they ask what to do, give practical, actionable safety advice.
Keep responses under 150 words. Be friendly but professional."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.4,
            max_tokens=300,
        )

        reply = response.choices[0].message.content.strip()
        return jsonify({"success": True, "reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
