from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    api_key=settings.GEMINI_API_KEY
)

def generate_answer(question, context, conversation_context=""):

    history_section = f"""
    Conversation History (for context resolution):
    {conversation_context}
    """ if conversation_context.strip() else ""

    prompt = f"""
You are an AI assistant for document question answering.

RULES:
1. Answer ONLY using the provided context.
2. If information is missing, say:
   "I could not find that information in the uploaded documents."
3. Do not hallucinate.
4. Keep answers clear and structured.

History:
{history_section}

Context:
{context}

Question:
{question}
"""

    try:

        response = client.chat.completions.create(

            model=settings.GEMINI_MODEL,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        return f"AI Error: {str(e)}"