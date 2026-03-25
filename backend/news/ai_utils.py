import google.generativeai as genai
from django.conf import settings
from django.contrib.auth import get_user_model

def call_ai(provider: str, api_key: str, model_name: str, prompt: str, ollama_model: str = 'llama3') -> str:
    """
    Router universale verso il provider AI corretto.
    Supporta: gemini, groq, ollama
    """
    if provider == 'gemini':
        genai.configure(api_key=api_key)
        # Usiamo il modello configurato o il default flash-latest
        model = genai.GenerativeModel(model_name or 'gemini-flash-latest')
        response = model.generate_content(prompt)
        return response.text

    elif provider == 'groq':
        from groq import Groq
        client = Groq(api_key=api_key)
        # Groq supporta diversi modelli, usiamo Llama 3 come default o quello passato
        response = client.chat.completions.create(
            model=model_name or 'llama3-8b-8192',
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content

    elif provider == 'ollama':
        from openai import OpenAI
        client = OpenAI(
            base_url='http://localhost:11434/v1',
            api_key='ollama',
        )
        response = client.chat.completions.create(
            model=ollama_model or 'llama3',
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content

    else:
        raise ValueError(f"Provider AI non supportato: '{provider}'")

def get_active_ai_config():
    """
    Risolve il provider e la chiave AI attiva basandosi sul profilo del superuser.
    Se non trovato, fa il fallback alla configurazione globale in settings.
    """
    User = get_user_model()
    
    # Cerchiamo il primo superuser con un profilo configurato
    for su in User.objects.filter(is_superuser=True).select_related('profilo'):
        if not hasattr(su, 'profilo'):
            continue
        p = su.profilo
        provider = p.ai_provider

        if provider == 'gemini' and p.gemini_api_key:
            # Per Gemini usiamo quello in settings se presente
            model = settings.AI_CONFIG.get('MODEL_NAME', 'gemini-flash-latest')
            return 'gemini', p.gemini_api_key, model, 'llama3'
        elif provider == 'groq' and p.groq_api_key:
            # Per Groq ignoriamo il modello Gemini di settings e usiamo il default di Groq
            return 'groq', p.groq_api_key, 'llama-3.3-70b-versatile', 'llama3'
        elif provider == 'ollama':
            return 'ollama', None, None, p.ollama_model or 'llama3'

    # Fallback globale (Gemini)
    return 'gemini', settings.AI_CONFIG.get('GEMINI_API_KEY', ''), settings.AI_CONFIG.get('MODEL_NAME', 'gemini-flash-latest'), 'llama3'
