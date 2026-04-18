import re
from collections import Counter
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from llm_client import llm_client

# Environment Support
load_dotenv()

app = Flask(__name__)

def get_fallback_nlp(text):
    """Basic NLP fallback if LLM is unavailable."""
    sentences = re.split(r'(?<=[.!?]) +', text.strip())
    summary = " ".join(sentences[:2]) if sentences else text
    words = re.findall(r'\b\w{5,}\b', text.lower())
    top_keywords = [w for w, _ in Counter(words).most_common(5)]
    
    return {
        "summary": summary,
        "keywords": top_keywords,
        "tone": "neutral"
    }

@app.route('/analyze', methods=['POST'])
def analyze_handler():
    # Input Validation
    data = request.json or {}
    text = data.get('text', '').strip()
    
    if not text:
        return jsonify({"error": True, "message": "Text required for analysis"}), 400

    # Prompt Design
    prompt = f"Analyze this text:\n\n{text[:2000]}"
    system_prompt = (
        "Return a JSON object with 'summary' (2 sentences), "
        "'keywords' (list), and 'tone' (positive, neutral, or negative)."
    )

    try:
        # LLM Call
        ai_data = llm_client.call_llm(prompt, system_prompt)
        
        # Fallback Logic
        if not ai_data:
            print("⚠️ [ANALYZE] LLM Failed. Using rule-based fallback.")
            response_data = get_fallback_nlp(text)
        else:
            response_data = ai_data

        return jsonify({
            "error": False,
            "data": response_data
        })

    except Exception as e:
        print(f"❌ [ANALYZE] Crash: {str(e)}")
        return jsonify({"error": True, "message": "Analysis failed"}), 500

if __name__ == '__main__':
    # Running on port 5004 as per instructions
    app.run(port=5004)
