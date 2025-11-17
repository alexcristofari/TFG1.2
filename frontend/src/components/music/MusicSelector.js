// frontend/src/components/music/MusicSelector.js (v1.2 - Defensivo)
import React from 'react';

const SelectorStyles = () => (
  <style>{`
    .music-selector-container { border: 1px solid #282828; padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; gap: 1rem; }
    .music-selected-list { display: flex; flex-wrap: wrap; gap: 0.5rem; min-height: 24px; }
    .music-selected-item { background-color: #282828; padding: 0.5rem 1rem; border-radius: 500px; font-size: 0.9rem; color: #fff; }
    .music-recommend-btn { background-color: #1DB954; color: white; border: none; padding: 1rem 2rem; font-size: 1rem; border-radius: 500px; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; width: 100%; }
    .music-search-area { grid-column: 1 / -1; }
    .music-search-container { position: relative; }
    .music-search-input { width: 100%; background-color: #282828; border: 1px solid #3a3a3a; color: white; padding: 1rem 1rem 1rem 3rem; font-size: 1rem; border-radius: 500px; box-sizing: border-box; }
    .music-search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 1.2rem; height: 1.2rem; fill: #b3b3b3; }
    .music-form-grid { display: grid; grid-template-columns: 1fr 300px; gap: 1.5rem; align-items: start; margin-bottom: 2rem; }
    .music-submit-container { display: flex; flex-direction: column; gap: 1rem; }
    .music-genre-select { background-color: #282828; border: 1px solid #3a3a3a; color: #fff; padding: 1rem; border-radius: 500px; font-size: 1rem; width: 100%; }
  `}</style>
);

// AQUI ESTÁ A CORREÇÃO: Adicionamos `genres = []` para definir um valor padrão.
function MusicSelector({ selectedTracks, onSearchChange, onRecommend, genres = [], onGenreChange }) {
  const canRecommend = selectedTracks.length >= 3;

  return (
    <>
      <SelectorStyles />
      <div className="music-form-grid">
        <div className="music-selector-container">
          <h2>Suas Músicas</h2>
          <div className="music-selected-list">
            {selectedTracks.map(track => (
              <div key={track.id} className="music-selected-item">{track.name}</div>
            ))}
          </div>
        </div>
        <div className="music-submit-container">
          <select className="music-genre-select" onChange={e => onGenreChange(e.target.value)}>
            <option value="">-- Gênero para Explorar --</option>
            {/* O .map agora é seguro, pois 'genres' será sempre um array */}
            {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
          </select>
          <button
            className="music-recommend-btn"
            style={{ opacity: canRecommend ? 1 : 0.5 }}
            disabled={!canRecommend}
            onClick={onRecommend}
          >
            Gerar Recomendações
          </button>
        </div>
        <div className="music-search-area">
          <div className="music-search-container">
            <svg className="music-search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
            <input
              type="text"
              className="music-search-input"
              placeholder="Busque por uma música ou artista..."
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MusicSelector;
