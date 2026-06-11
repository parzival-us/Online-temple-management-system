from flask import Blueprint, request, jsonify
from google import genai
import os

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return jsonify({"reply": "I am currently offline. Please set the Gemini API Key in the backend."}), 200

    try:
        client = genai.Client(api_key=api_key)
        # Assuming the standard google-genai interface for text generation
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_message,
        )
        return jsonify({"reply": response.text}), 200
    except Exception as e:
        error_msg = str(e)
        print(f"Gemini API Error: {error_msg}", flush=True)
        if "503" in error_msg or "UNAVAILABLE" in error_msg:
            return jsonify({"reply": "I'm currently receiving too many requests due to high demand on the Google AI servers. Please try again in a few seconds!"}), 200
        return jsonify({"reply": f"Sorry, I encountered an error connecting to my knowledge base: {error_msg}"}), 500
