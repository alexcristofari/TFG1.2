# backend/music/app.py (v13.4 - Correção np.matrix)
import pandas as pd
import numpy as np
import pickle
from sklearn.metrics.pairwise import cosine_similarity
# --- MUDANÇA 1: Importar Blueprint e Flask ---
from flask import Flask, Blueprint, request, jsonify
import json
import os
import traceback
import requests
import base64
import time
from collections import defaultdict

# --- SEU CÓDIGO EXISTENTE (QUASE INTACTO) ---

SPOTIFY_CLIENT_ID = "6b5cdcb34b384ce795186aae26220918"
SPOTIFY_CLIENT_SECRET = "bd24ed38cfbd46b0ba1243132a1a7c38"

class SpotifyTokenManager:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        base_dir = os.path.dirname(__file__)
        CACHE_DIR = os.path.join(base_dir, 'cache')
        self.token_cache_file = os.path.join(CACHE_DIR, '.spotify_token_cache')
        self.token_info = self._load_token_from_cache()

    def _load_token_from_cache(self):
        try:
            with open(self.token_cache_file, 'r') as f: return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError): return {}

    def _save_token_to_cache(self, token_info):
        token_info['expires_at'] = time.time() + token_info['expires_in']
        os.makedirs(os.path.dirname(self.token_cache_file), exist_ok=True)
        with open(self.token_cache_file, 'w') as f: json.dump(token_info, f)
        self.token_info = token_info

    def get_token(self):
        if self.token_info and time.time() < self.token_info.get('expires_at', 0):
            return self.token_info['access_token']
        auth_url = 'https://accounts.spotify.com/api/token'
        auth_header = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        auth_data = {'grant_type': 'client_credentials'}
        try:
            res = requests.post(auth_url, headers={'Authorization': f'Basic {auth_header}'}, data=auth_data, timeout=10)
            res.raise_for_status()
            token_info = res.json()
            self._save_token_to_cache(token_info)
            return token_info['access_token']
        except requests.exceptions.RequestException as e:
            print(f"ERRO CRÍTICO: Não foi possível obter o token do Spotify. {e}")
            return None

spotify_token_manager = SpotifyTokenManager(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)

class MusicRecommender:
    def __init__(self):
        self.df_music = None; self.feature_matrix = None; self.all_genres = []
        self.is_ready = False
        try:
            print("Carregando cache de músicas (v13.3)...")
            base_dir = os.path.dirname(os.path.abspath(__file__))
            CACHE_DIR = os.path.join(base_dir, '..', 'music', 'cache')
            self.df_music = pd.read_parquet(os.path.join(CACHE_DIR, 'music_data.parquet'))
            with open(os.path.join(CACHE_DIR, 'feature_matrix.pkl'), 'rb') as f: self.feature_matrix = pickle.load(f)
            with open(os.path.join(CACHE_DIR, 'genres.json'), 'r', encoding='utf-8') as f: self.all_genres = json.load(f)
            self.is_ready = True
            print(f">>> Sistema de músicas pronto. {len(self.df_music)} faixas carregadas. <<<")
        except Exception as e:
            print(f"\n--- ERRO CRÍTICO AO CARREGAR CACHE DE MÚSICAS: {e} ---")

    def search_tracks(self, query, limit=30):
        if not self.is_ready or not query: return []
        search_series = self.df_music['name'] + " " + self.df_music['artists']
        results_df = self.df_music[search_series.str.contains(query, case=False, na=False)]
        return results_df.head(limit).to_dict('records')

    def get_recommendations(self, selected_track_ids, genre_to_explore=None, top_n_per_item=20):
        if not self.is_ready or not selected_track_ids: return pd.DataFrame()
        selected_indices = self.df_music.index[self.df_music['id'].isin(selected_track_ids)].tolist()
        if not selected_indices: return pd.DataFrame()
        
        # Converter feature_matrix para array se for matrix
        feature_matrix_array = np.asarray(self.feature_matrix)
        
        profile_vector = np.mean(feature_matrix_array[selected_indices], axis=0)
        profile_vector = np.asarray(profile_vector).reshape(1, -1)
        
        similarities = cosine_similarity(profile_vector, feature_matrix_array).flatten()
        recs_df = self.df_music.copy()
        recs_df['similarity'] = similarities
        recs_df = recs_df[~recs_df['id'].isin(selected_track_ids)]
        if genre_to_explore:
            genre_mask = recs_df['genres'].astype(str).str.contains(genre_to_explore, case=False, na=False)
            recs_df.loc[genre_mask, 'similarity'] *= 1.25
        artist_penalty_factor = 0.85
        artist_counts = defaultdict(int)
        penalized_scores = []
        final_df = recs_df.sort_values('similarity', ascending=False)
        input_artists = self.df_music.loc[selected_indices, 'artists'].unique()
        for _, row in final_df.iterrows():
            artist = row['artists']
            penalty = 1.0
            penalty *= artist_penalty_factor ** artist_counts[artist]
            if artist in input_artists: penalty *= 0.5
            penalized_scores.append(row['similarity'] * penalty)
            artist_counts[artist] += 1
        final_df['final_score'] = penalized_scores
        return final_df.sort_values('final_score', ascending=False)

    def discover_tracks(self):
        if not self.is_ready: return {}, {}
        iconic_artists = ['Arctic Monkeys', 'Billie Eilish', 'The Weeknd', 'Daft Punk', 'Queen', 'Kendrick Lamar', 'Tame Impala', 'Radiohead', 'Red Hot Chili Peppers', 'Foo Fighters']
        iconic_tracks = self.df_music[self.df_music['artists'].isin(iconic_artists)]
        iconic_tracks = iconic_tracks.loc[iconic_tracks.groupby('artists')['popularity'].idxmax()]
        explore_df = self.df_music[(self.df_music['popularity'].between(60, 80)) & (~self.df_music['genres'].str.contains('pop|dance|rock|hip hop|latin', na=False))].sample(n=15, random_state=42)
        return iconic_tracks.to_dict('records'), explore_df.to_dict('records')

# --- MUDANÇA 2: Criação do Blueprint e das Rotas ---

recommender = MusicRecommender()
music_bp = Blueprint('music_bp', __name__, url_prefix='/api/music')

@music_bp.route('/discover', methods=['GET'])
def discover():
    if not recommender.is_ready: return jsonify({"error": "Serviço de música indisponível"}), 503
    iconic, explore = recommender.discover_tracks()
    return jsonify({"iconic_tracks": iconic, "explore_tracks": explore})

@music_bp.route('/search', methods=['GET'])
def search():
    if not recommender.is_ready: return jsonify({"error": "Serviço de música indisponível"}), 503
    query = request.args.get('q', '')
    results = recommender.search_tracks(query)
    return jsonify(results)

@music_bp.route('/genres', methods=['GET'])
def get_genres():
    if not recommender.is_ready: return jsonify({"error": "Serviço de música indisponível"}), 503
    return jsonify(recommender.all_genres)

@music_bp.route('/get-track-details', methods=['POST'])
def get_track_details():
    if not recommender.is_ready: return jsonify({"error": "Serviço de música indisponível"}), 503
    data = request.get_json()
    track_ids = data.get('track_ids', [])
    if not track_ids: return jsonify({}), 200
    token = spotify_token_manager.get_token()
    if not token: return jsonify({"error": "Falha na autenticação com Spotify"}), 500
    url = f"https://api.spotify.com/v1/tracks?ids={','.join(track_ids)}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        spotify_data = response.json()
        details = {}
        for track in spotify_data.get('tracks', []):
            if track and track.get('album') and track['album']['images']:
                details[track['id']] = {"image_url": track['album']['images'][0]['url'], "preview_url": track.get('preview_url')}
        return jsonify(details)
    except Exception as e:
        print(f"Erro ao buscar detalhes no Spotify: {e}")
        return jsonify({"error": "Falha ao comunicar com a API do Spotify"}), 502

@music_bp.route('/recommend', methods=['POST'])
def recommend():
    try:
        if not recommender.is_ready: return jsonify({"error": "Serviço de música indisponível"}), 503
        data = request.get_json()
        track_ids = data.get('track_ids')
        genre = data.get('genre', None)
        if not track_ids or len(track_ids) < 3: return jsonify({"error": "São necessárias pelo menos 3 músicas."}), 400
        recs_df = recommender.get_recommendations(track_ids, genre_to_explore=genre)
        if recs_df.empty: return jsonify({"recommendations": {}, "profile": {}})
        
        used_ids = set()
        recommendations = {}
        
        # 1. Recomendações Principais: 10 itens
        main_recs = recs_df[~recs_df['id'].isin(used_ids)].head(10)
        recommendations["main"] = main_recs.to_dict('records')
        used_ids.update(main_recs['id'].tolist())
        
        # 2. Explorando Gênero: 5 itens (se selecionado)
        if genre:
            genre_recs = recs_df[
                (recs_df['genres'].astype(str).str.contains(genre, case=False, na=False)) &
                (~recs_df['id'].isin(used_ids))
            ].head(5)
            if not genre_recs.empty:
                recommendations["genre_favorites"] = genre_recs.to_dict('records')
                used_ids.update(genre_recs['id'].tolist())
        
        # 3. Músicas Populares: 5 itens (alta popularidade)
        if 'popularity' in recs_df.columns:
            popular = recs_df[
                (recs_df['popularity'] > recommender.df_music['popularity'].quantile(0.7)) &
                (~recs_df['id'].isin(used_ids))
            ].head(5)
            if not popular.empty:
                recommendations["popular"] = popular.to_dict('records')
                used_ids.update(popular['id'].tolist())
        
        # 4. Jóias Escondidas: 5 itens (baixa popularidade + alta similaridade)
        if 'popularity' in recs_df.columns and 'final_score' in recs_df.columns:
            hidden_gems = recs_df[
                (recs_df['popularity'] < recommender.df_music['popularity'].quantile(0.3)) &
                (recs_df['final_score'] > recs_df['final_score'].quantile(0.75)) &
                (~recs_df['id'].isin(used_ids))
            ].head(5)
            if not hidden_gems.empty:
                recommendations["hidden_gems"] = hidden_gems.to_dict('records')
        
        profile_df = recommender.df_music[recommender.df_music['id'].isin(track_ids)]
        favorite_genre = profile_df['genres'].str.split(', ').explode().mode()
        profile = {"tracks": profile_df[['id', 'name']].to_dict('records'), "favorite_genre": favorite_genre[0] if not favorite_genre.empty else "Variado"}
        return jsonify({"recommendations": recommendations, "profile": profile, "selected_genre": genre})
    except Exception as e:
        print(f"\n--- ERRO NA ROTA /api/music/recommend ---\n{traceback.format_exc()}\n-----------------------------------------\n")
        return jsonify({"error": "Ocorreu um erro interno no servidor."}), 500

# --- MUDANÇA 3: Inicializador para Execução Direta ---
def create_app():
    app = Flask(__name__)
    app.register_blueprint(music_bp)
    return app
app = create_app()