import random
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from llm_client import llm_client

# Environment Support
load_dotenv()

app = Flask(__name__)

def generate_market_prices(query):
    # Simulate platform prices
    base = random.randint(300, 1500) if len(query) < 10 else random.randint(40000, 120000)
    return {
        "amazon": round(base * random.uniform(0.9, 1.1)),
        "flipkart": round(base * random.uniform(0.9, 1.1)),
        "croma": round(base * random.uniform(0.9, 1.1))
    }

@app.route('/product', methods=['POST'])
def product_handler():
    # Input Validation
    data = request.json or {}
    query = data.get('query', '').strip()
    
    if not query:
        return jsonify({"error": True, "message": "Product query required"}), 400

    # Simulate logic
    prices = generate_market_prices(query)
    
    # Prompt Design
    prompt = f"Product: {query}. Prices found: Amazon: {prices['amazon']}, Flipkart: {prices['flipkart']}, Croma: {prices['croma']}."
    system_prompt = (
        "Decide the best shopping platform and explain reasoning concisely. "
        "Return JSON with 'best' (platform name) and 'analysis' (1 sentence reasoning)."
    )

    try:
        # LLM Call
        ai_data = llm_client.call_llm(prompt, system_prompt)
        
        # Fallback Logic
        if not ai_data:
            print("⚠️ [PRODUCT] LLM Failed. Using lowest price fallback.")
            best_platform = min(prices, key=prices.get)
            analysis = f"Based on raw pricing, {best_platform.capitalize()} offers the lowest price today."
            response_data = {"best": best_platform, "analysis": analysis}
        else:
            response_data = ai_data

        return jsonify({
            "error": False,
            "data": {
                "prices": prices,
                **response_data
            }
        })

    except Exception as e:
        print(f"❌ [PRODUCT] Crash: {str(e)}")
        return jsonify({"error": True, "message": "Service error"}), 500

if __name__ == '__main__':
    # Running on port 5003 as per instructions
    app.run(port=5003)
