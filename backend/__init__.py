# backend/__init__.py (v5.0 - O Coração da API)
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    """
    Fábrica de aplicação: cria e configura a instância do Flask.
    """
    app = Flask(__name__)
    CORS(app) # Habilita CORS para toda a aplicação

    # Importa e registra os blueprints AQUI, dentro da função.
    # Isso evita problemas de importação circular.
    from .blueprints.games import games_bp
    from .blueprints.music import music_bp
    from .blueprints.movies import movies_bp

    app.register_blueprint(games_bp, url_prefix='/api/games')
    app.register_blueprint(music_bp, url_prefix='/api/music')
    app.register_blueprint(movies_bp, url_prefix='/api/movies')

    # Uma rota simples para verificar se a API está no ar.
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "API is running!"})

    print(">>> Aplicação Flask criada e pronta para rodar. <<<")
    return app
