# api-gateway/gateway.py (v3.1 - MODO DEPURACAO)
from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

GAMES_API_URL = os.getenv("GAMES_API_URL", "http://localhost:5001" )
MUSIC_API_URL = os.getenv("MUSIC_API_URL", "http://localhost:5002" )
MOVIES_API_URL = os.getenv("MOVIES_API_URL", "http://localhost:5003" )

SERVICES = {
    "games": GAMES_API_URL,
    "music": MUSIC_API_URL,
    "movies": MOVIES_API_URL,
}

@app.route('/api/<service>/<path:path>', methods=['GET', 'POST'])
def proxy_request(service, path):
    # --- MODO DEPURACAO: Imprime tudo o que chega ---
    print("\n--- INICIANDO DEPURACAO DE ROTA (GATEWAY) ---")
    print(f"[GATEWAY] Requisição recebida: {request.method} para /api/{service}/{path}")
    
    if service not in SERVICES:
        print(f"[GATEWAY] ERRO: Serviço '{service}' não existe no mapeamento.")
        return jsonify({"error": f"Serviço '{service}' não encontrado."}), 404

    service_url = f"{SERVICES[service]}/api/{service}/{path}"
    print(f"[GATEWAY] Redirecionando para: {service_url}")

    headers = {key: value for key, value in request.headers if key.lower() not in ['host', 'content-length']}
    params = {key: value for key, value in request.args.items()}
    
    print(f"[GATEWAY] Parâmetros da URL (params): {params}")
    # --- FIM DO MODO DEPURACAO ---

    try:
        if request.method == 'POST':
            resp = requests.post(service_url, json=request.get_json(), headers=headers, params=params, timeout=30)
        else: # GET
            resp = requests.get(service_url, params=params, headers=headers, timeout=30)

        print(f"[GATEWAY] Resposta recebida do microsserviço com status: {resp.status_code}")
        return (resp.content, resp.status_code, resp.headers.items())

    except requests.exceptions.ConnectionError:
        print(f"[GATEWAY] ERRO DE CONEXÃO: Não foi possível conectar a {service_url}")
        return jsonify({"error": f"Não foi possível conectar ao serviço de '{service}'. Ele está rodando?"}), 503
    except Exception as e:
        print(f"[GATEWAY] ERRO INESPERADO: {str(e)}")
        return jsonify({"error": f"Um erro inesperado ocorreu no gateway: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000)
