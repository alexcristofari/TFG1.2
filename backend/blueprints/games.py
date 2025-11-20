# backend/blueprints/games.py (v5.0 - Autossuficiente)
import os
import json
import random
import pickle
import traceback
from collections import defaultdict
import numpy as np
import pandas as pd
from flask import Blueprint, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity
from thefuzz import process

# --- Funções Auxiliares ---
def sanitize_for_json(data):
    if isinstance(data, (list, tuple)): return [sanitize_for_json(item) for item in data]
    if isinstance(data, dict): return {key: sanitize_for_json(value) for key, value in data.items()}
    if isinstance(data, np.ndarray): return data.tolist()
    if isinstance(data, (np.int64, np.int32, np.int16)): return int(data)
    if isinstance(data, (np.float64, np.float32)): return float(data)
    if pd.isna(data): return None
    return data

def check_genre_in_item(genres_item, target_genre):
    if genres_item is None: return False
    if not isinstance(genres_item, str): genres_item = str(genres_item)
    return target_genre in genres_item

# --- Classe GameRecommender ---
class GameRecommender:
    def __init__(self):
        self.is_ready = False
        try:
            print("Carregando cache de jogos (v5.0)...")
            base_dir = os.path.dirname(os.path.abspath(__file__))
            # Caminho relativo ao blueprint para encontrar a pasta de cache correta
            CACHE_DIR = os.path.join(base_dir, '..', 'steam', 'cache')
            
            self.df = pd.read_parquet(os.path.join(CACHE_DIR, 'games_processed_df.parquet'))
            with open(os.path.join(CACHE_DIR, 'genres_matrix.pkl'), 'rb') as f: self.genres_matrix = pickle.load(f)
            with open(os.path.join(CACHE_DIR, 'categories_matrix.pkl'), 'rb') as f: self.categories_matrix = pickle.load(f)
            with open(os.path.join(CACHE_DIR, 'description_matrix.pkl'), 'rb') as f: self.description_matrix = pickle.load(f)
            with open(os.path.join(CACHE_DIR, 'developers_matrix.pkl'), 'rb') as f: self.developers_matrix = pickle.load(f)
            with open(os.path.join(CACHE_DIR, 'games_genres.json'), 'r', encoding='utf-8') as f: self.genres = json.load(f)
            
            weights = {'genres': 4.0, 'categories': 3.0, 'description': 1.0, 'developers': 1.0}
            self.feature_matrix = (
                self.genres_matrix * weights['genres'] + self.categories_matrix * weights['categories'] +
                self.description_matrix * weights['description'] + self.developers_matrix * weights['developers']
            )
            self.df['release_year'] = pd.to_datetime(self.df['release_date'], errors='coerce').dt.year
            self.is_ready = True
            print(f">>> Sistema de jogos pronto. {len(self.df)} jogos e {len(self.genres)} gêneros carregados. <<<")
        except Exception as e:
            print(f"\n--- ERRO CRÍTICO AO CARREGAR CACHE DE JOGOS: {e} ---")
            traceback.print_exc()

    def get_df_as_records(self, df_to_convert):
        if df_to_convert is None or df_to_convert.empty: return []
        records = df_to_convert.to_dict('records')
        return sanitize_for_json(records)

    def search_games(self, query, limit=30):
        if not self.is_ready or not query: return []
        choices = self.df['name']
        results = process.extractBests(query, choices, score_cutoff=60, limit=limit)
        if not results: return []
        result_indices = [r[2] for r in results]
        return self.get_df_as_records(self.df.iloc[result_indices])

    def discover_games(self):
        if not self.is_ready: return {}, {}
        iconic_appids = [570, 730, 271590, 1091500, 292030, 1245620, 620, 413150]
        iconic_games = self.df[self.df['appid'].isin(iconic_appids)]
        explore_df = self.df[
            (self.df['quality'] > 0.92) &
            (~self.df['genres'].apply(lambda g: check_genre_in_item(g, 'Ação') or check_genre_in_item(g, 'Aventura') or check_genre_in_item(g, 'RPG') or check_genre_in_item(g, 'Estratégia')))
        ].sample(n=15, random_state=42)
        return self.get_df_as_records(iconic_games), self.get_df_as_records(explore_df)

    def get_recommendations(self, selected_game_ids, top_n_per_item=20):
        if not self.is_ready or not selected_game_ids: return pd.DataFrame()
        selected_indices = self.df.index[self.df['appid'].isin(selected_game_ids)].tolist()
        if not selected_indices: return pd.DataFrame()
        all_recs_dfs = []
        feature_matrix_array = self.feature_matrix.toarray()
        for game_index in selected_indices:
            game_vector = feature_matrix_array[game_index].reshape(1, -1)
            similarities = cosine_similarity(game_vector, feature_matrix_array).flatten()
            recs_for_item = self.df.copy()
            recs_for_item['similarity'] = similarities
            top_recs = recs_for_item.nlargest(top_n_per_item, 'similarity')
            all_recs_dfs.append(top_recs)
        if not all_recs_dfs: return pd.DataFrame()
        combined_recs_df = pd.concat(all_recs_dfs).reset_index(drop=True)
        combined_recs_df = combined_recs_df[~combined_recs_df['appid'].isin(selected_game_ids)]
        combined_recs_df = combined_recs_df.sort_values('similarity', ascending=False).drop_duplicates(subset=['appid'])
        recs_df = combined_recs_df
        recs_df['hybrid_score'] = (recs_df['similarity'] * 0.7) + (recs_df['quality'] * 0.3)
        developer_penalty_factor = 0.85
        developer_counts = defaultdict(int)
        penalized_scores = []
        final_df = recs_df.sort_values('hybrid_score', ascending=False)
        for _, row in final_df.iterrows():
            developers_list = row['developers']
            developer = developers_list[0] if isinstance(developers_list, list) and developers_list else 'N/A'
            penalty = developer_penalty_factor ** developer_counts[developer]
            penalized_scores.append(row['hybrid_score'] * penalty)
            developer_counts[developer] += 1
        final_df['penalized_score'] = penalized_scores
        final_df = final_df.sort_values('penalized_score', ascending=False).reset_index(drop=True)
        top_score_display, end_score_display = 99.0, 85.0
        if not final_df.empty and len(final_df) > 1:
            scores = final_df['penalized_score'] + 1e-9
            log_scores = np.log(scores)
            log_max, log_min_ref = log_scores.iloc[0], log_scores.iloc[min(15, len(log_scores) - 1)]
            if log_max > log_min_ref:
                log_range, display_range = log_max - log_min_ref, top_score_display - end_score_display
                relative_position = ((log_scores - log_min_ref) / log_range).clip(0, 1)
                final_df['display_score'] = (relative_position ** 0.5 * display_range) + end_score_display
            else: final_df['display_score'] = top_score_display
        elif not final_df.empty: final_df['display_score'] = top_score_display
        else: final_df['display_score'] = 0
        return final_df.sort_values('penalized_score', ascending=False)

# --- Instanciação e Rotas ---
recommender_games = GameRecommender()
games_bp = Blueprint('games_bp', __name__)

OPPOSITE_GENRES_MAP = {
    'Ação': ['Quebra-Cabeça', 'Simulação', 'Estratégia'], 'Aventura': ['Esportes', 'Corrida', 'Estratégia'],
    'RPG': ['Esportes', 'Corrida', 'Quebra-Cabeça'], 'Estratégia': ['Ação', 'Corrida', 'Esportes'],
    'Simulação': ['Ação', 'Aventura'], 'Esportes': ['RPG', 'Aventura', 'Estratégia'],
    'Corrida': ['RPG', 'Aventura', 'Estratégia'], 'Quebra-Cabeça': ['Ação', 'Esportes', 'Corrida'],
    'Indie': ['Ação', 'Esportes'], 'Casual': ['Estratégia', 'RPG']
}

@games_bp.route('/genres', methods=['GET'])
def get_genres():
    if not recommender_games.is_ready: return jsonify({"error": "Sistema de jogos não pronto"}), 503
    return jsonify(recommender_games.genres)

@games_bp.route('/search', methods=['GET'])
def search_games_api():
    if not recommender_games.is_ready: return jsonify({"error": "Sistema não pronto"}), 503
    query = request.args.get('q', '')
    results_json = recommender_games.search_games(query)
    return jsonify(results_json)

@games_bp.route('/discover', methods=['GET'])
def discover_games_api():
    if not recommender_games.is_ready: return jsonify({"error": "Sistema não pronto"}), 503
    iconic_games_json, explore_games_json = recommender_games.discover_games()
    return jsonify({"iconic_games": iconic_games_json, "explore_games": explore_games_json})

@games_bp.route('/recommend', methods=['POST'])
def recommend_games_api():
    if not recommender_games.is_ready: return jsonify({"error": "Sistema não pronto"}), 503
    
    data = request.get_json()
    if not data: return jsonify({"error": "Corpo da requisição JSON ausente"}), 400

    selected_ids = data.get('game_ids')
    selected_genre_to_explore = data.get('genre') or None
    
    if not selected_ids or not isinstance(selected_ids, list) or len(selected_ids) < 3:
        return jsonify({"error": "A lista 'game_ids' deve conter pelo menos 3 IDs"}), 400

    recs_df = recommender_games.get_recommendations(selected_ids)
    if recs_df.empty: return jsonify({"error": "Não foi possível gerar recomendações"}), 500

    profile_df = recommender_games.df[recommender_games.df['appid'].isin(selected_ids)]
    all_profile_genres_raw = [g.strip() for _, row in profile_df.iterrows() for g in str(row.get('genres', '')).split(',') if g.strip()]
    dominant_genre = pd.Series(all_profile_genres_raw).mode()
    dominant_genre = dominant_genre[0] if not dominant_genre.empty else None

    recommendations = {}
    page_used_ids = set(selected_ids)

    # 1. Recomendações Principais: 10 itens
    main_recs_df = recs_df[~recs_df['appid'].isin(page_used_ids)].head(10)
    if not main_recs_df.empty:
        recommendations["main"] = recommender_games.get_df_as_records(main_recs_df)
        page_used_ids.update(main_recs_df['appid'].tolist())

    # 2. Explorando Gênero: 5 itens (se selecionado)
    if selected_genre_to_explore:
        explore_df = recs_df[recs_df['genres'].apply(lambda g: check_genre_in_item(g, selected_genre_to_explore)) & ~recs_df['appid'].isin(page_used_ids)].head(5)
        if not explore_df.empty:
            recommendations["genre_favorites"] = recommender_games.get_df_as_records(explore_df)
            page_used_ids.update(explore_df['appid'].tolist())

    # 3. Jogos Famosos: 5 itens (alta qualidade)
    famous_df = recs_df[
        (recs_df['quality'] > 0.92) & 
        ~recs_df['appid'].isin(page_used_ids)
    ].head(5)
    if not famous_df.empty:
        recommendations["famous"] = recommender_games.get_df_as_records(famous_df)
        page_used_ids.update(famous_df['appid'].tolist())

    # 4. Jóias Escondidas: 5 itens (baixa popularidade + alta similaridade)
    hidden_gems_df = recs_df[
        (recs_df['quality'] < 0.88) &
        (recs_df['display_score'] > 75) &
        ~recs_df['appid'].isin(page_used_ids)
    ].head(5)
    if not hidden_gems_df.empty:
        recommendations["hidden_gems"] = recommender_games.get_df_as_records(hidden_gems_df)

    for category_key in recommendations:
        for rec in recommendations[category_key]:
            rec['similarity_score'] = f"{min(rec.get('display_score', 0), 99.9):.1f}"
    
    profile_data = {"games": recommender_games.get_df_as_records(profile_df), "dominant_genre": dominant_genre, "all_genres": sorted(list(set(all_profile_genres_raw)))}
    
    return jsonify({
        "recommendations": recommendations,
        "profile": profile_data,
        "selected_genre": selected_genre_to_explore
    })