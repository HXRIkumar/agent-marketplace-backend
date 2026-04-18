import re
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from llm_client import llm_client

# Environment Support
load_dotenv()

app = Flask(__name__)

def get_fallback_scoring(text):
    """Simple keyword-based fallback if LLM is unavailable."""
    skills = ["react", "node", "python", "javascript", "cloud"]
    found = [s for s in skills if s in text.lower()]
    score = 20 + (len(found) * 15)
    
    return {
        "score": min(100, score),
        "strengths": ["Clear technical mentions" if found else "Lengthy document"],
        "weaknesses": ["Missing specific modern stack keywords" if not found else "Formatting could be tighter"],
        "improvements": ["Highlight specific cloud experience", "Quantify project impact"]
    }

@app.route('/resume', methods=['POST'])
def resume_handler():
    # Input Validation
    data = request.json or {}
    text = data.get('text', '').strip()
    
    if not text:
        return jsonify({"error": True, "message": "Missing resume text"}), 400

    # LLM Construction
    prompt = f"Analyze this resume and provide a professional evaluation.\n\nTEXT:\n{text[:2000]}"
    system_prompt = (
        "You are an expert recruitment analyzer. Return a JSON object with: "
        "'score' (0-100), 'strengths' (list), 'weaknesses' (list), 'improvements' (list)."
    )

    try:
        # 3. LLM API call
        ai_data = llm_client.call_llm(prompt, system_prompt)
        
        # 4. Fallback Handling
        if not ai_data:
            print("⚠️ [RESUME] LLM Failed. Using keyword fallback.")
            response_data = get_fallback_scoring(text)
        else:
            response_data = ai_data

        return jsonify({
            "error": False,
            "data": response_data
        })

    except Exception as e:
        print(f"❌ [RESUME] Crash detected: {str(e)}")
        return jsonify({"error": True, "message": "Internal processing error"}), 500

if __name__ == '__main__':
    # Running on port 5002 as per instructions
    app.run(port=5002)
