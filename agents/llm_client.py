import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from the backend directory
env_path = os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')
load_dotenv(env_path)

class LLMClient:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY")
        self.base_url = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
        self.model = os.getenv("MODEL_NAME", "gpt-4o-mini")

    def call_llm(self, prompt, system_prompt="You are a helpful AI assistant."):
        """
        Makes a call to the LLM API and returns the result.
        Returns None if any step fails to trigger agent fallback logic.
        """
        if not self.api_key or "your_real_key_here" in self.api_key:
            print("⚠️ [LLM CLIENT] Missing or placeholder API key. Using fallback.")
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Groq/OpenAI compatible payload
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt + " Return only raw JSON. No markdown blocks."},
                {"role": "user", "content": prompt}
            ],
            "response_format": { "type": "json_object" }
        }

        try:
            # 12-second timeout as per production standards
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                data=json.dumps(payload),
                timeout=12
            )
            response.raise_for_status()
            
            # Parse response
            result = response.json()
            content = result['choices'][0]['message']['content']
            return json.loads(content)

        except Exception as e:
            print(f"❌ [LLM CLIENT] API Call Failed: {str(e)}")
            return None

# Singleton instance
llm_client = LLMClient()
