from google import genai
from django.conf import settings
from django.contrib.auth import get_user_model

def get_gemini_client(api_key: str):
    """Ritorna un'istanza del client Google GenAI."""
    return genai.Client(api_key=api_key)

def call_ai(provider: str, api_key: str, model_name: str, prompt: str, ollama_model: str = 'llama3') -> str:
    """
    Router universale verso il provider AI corretto.
    Supporta: gemini (nuovo SDK), groq, ollama
    """
    if provider == 'gemini':
        client = get_gemini_client(api_key)
        # Usiamo il modello configurato o il default 2.0-flash
        model = model_name or 'gemini-2.0-flash'
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        return response.text

    elif provider == 'groq':
        from groq import Groq
        client = Groq(api_key=api_key)
        # Groq supporta diversi modelli, usiamo Llama 3 come default o quello passato
        response = client.chat.completions.create(
            model=model_name or 'llama-3.3-70b-versatile',
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
            # Per Gemini usiamo quello in settings se presente (nuovo default 2.0-flash)
            model = settings.AI_CONFIG.get('MODEL_NAME', 'gemini-2.0-flash')
            return 'gemini', p.gemini_api_key, model, 'llama3'
        elif provider == 'groq' and p.groq_api_key:
            return 'groq', p.groq_api_key, 'llama-3.3-70b-versatile', 'llama3'
        elif provider == 'ollama':
            return 'ollama', None, None, p.ollama_model or 'llama3'

    # Fallback globale (Gemini)
    return 'gemini', settings.AI_CONFIG.get('GEMINI_API_KEY', ''), settings.AI_CONFIG.get('MODEL_NAME', 'gemini-2.0-flash'), 'llama3'

def get_embedding_standard(text: str) -> list:
    """
    Genera un vettore embedding usando il provider attivo (Gemini o Ollama).
    Utilizza il nuovo SDK google-genai per Gemini.
    """
    provider, api_key, _, _ = get_active_ai_config()
    
    if provider == 'gemini':
        if not api_key: return None
        try:
            client = get_gemini_client(api_key)
            result = client.models.embed_content(
                model="models/gemini-embedding-001",
                contents=text,
                config={
                    'task_type': 'RETRIEVAL_DOCUMENT',
                    'title': 'NewsFlow Search'
                }
            )
            # Il nuovo SDK ritorna embeddings come lista di oggetti se multiple, 
            # o singolo se contents è stringa
            return result.embeddings[0].values if isinstance(result.embeddings, list) else result.embeddings.values
        except Exception as e:
            print(f"Errore embedding Gemini (New SDK): {e}")
            return None
            
    elif provider == 'ollama':
        return get_ollama_embedding(text, model="nomic-embed-text")
        
    return None

def get_ollama_embedding(text: str, model: str = "nomic-embed-text") -> list:
    """
    Genera un vettore embedding usando l'API locale di Ollama.
    """
    import requests
    try:
        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": model, "prompt": text},
            timeout=10
        )
        response.raise_for_status()
        return response.json().get("embedding")
    except Exception as e:
        print(f"Errore embedding Ollama: {e}")
        return None
