// frontend/src/components/movies/MovieSelector.js (v1.1 - Correção de Estilos)
import React from 'react';

const SelectorStyles = () => (
  <style>{`
    .movie-selector-container {
      border: 1px solid #333;
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .movie-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      min-height: 24px;
    }
    .movie-selected-item {
      background-color: #333;
      padding: 0.5rem 1rem;
      border-radius: 500px;
      font-size: 0.9rem;
      color: #fff;
    }
    .movie-recommend-btn {
      background-color: #E50914;
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.2s;
      width: 100%;
    }
    .movie-search-area { grid-column: 1 / -1; }
    .movie-search-container { position: relative; }
    .movie-search-input {
      width: 100%;
      background-color: #1a1a1a;
      border: 1px solid #333;
      color: white;
      padding: 1rem 1rem 1rem 3rem;
      font-size: 1rem;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .movie-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      fill: #b3b3b3;
    }
    .movie-form-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
      align-items: start;
      margin-bottom: 2rem;
    }
    .movie-submit-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .movie-genre-select {
      background-color: #1a1a1a;
      border: 1px solid #333;
      color: #fff;
      padding: 1rem;
      border-radius: 4px;
      font-size: 1rem;
      width: 100%;
    }
  `}</style>
);

function MovieSelector({ selectedMovies, onSearchChange, onRecommend, genres, onGenreChange }) {
  const canRecommend = selectedMovies.length >= 3;

  return (
    <>
      <SelectorStyles />
      {/* A CORREÇÃO ESTÁ EM REMOVER TODOS OS style={styles.algumaCoisa} DAS TAGS ABAIXO */}
      <div className="movie-form-grid">
        <div className="movie-selector-container">
          <h2>Seu Perfil de Filmes</h2>
          <div className="movie-selected-list">
            {selectedMovies.map(movie => (
              <div key={movie.id} className="movie-selected-item">{movie.title}</div>
            ))}
          </div>
        </div>
        <div className="movie-submit-container">
          <select className="movie-genre-select" onChange={e => onGenreChange(e.target.value)}>
            <option value="">-- Gênero para Explorar --</option>
            {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button
            className="movie-recommend-btn"
            style={{ opacity: canRecommend ? 1 : 0.5 }}
            disabled={!canRecommend}
            onClick={onRecommend}
          >
            Gerar Recomendações
          </button>
        </div>
        <div className="movie-search-area">
          <div className="movie-search-container">
            <svg className="movie-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
            <input
              type="text"
              className="movie-search-input"
              placeholder="Busque por um filme para adicionar ao seu perfil..."
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieSelector;
