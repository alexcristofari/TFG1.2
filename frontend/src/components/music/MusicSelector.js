// frontend/src/components/music/MusicSelector.js (v3.0 - Minimal Clean Design)
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SelectorStyles = () => (
  <style>{`
    .music-selector-minimal {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      margin: 2rem 0 4rem 0;
    }

    .music-selector-chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      min-height: 3rem;
      align-items: center;
    }

    .music-chip {
      background-color: rgba(13, 122, 63, 0.2);
      border: 1px solid rgba(13, 122, 63, 0.5);
      color: #f5f5f5;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 400;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
    }

    .music-chip:hover {
      background-color: rgba(13, 122, 63, 0.3);
      border-color: #0d7a3f;
    }

    .music-selector-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
    }

    .music-genre-select {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f5f5f5;
      padding: 0.85rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 200px;
    }

    .music-genre-select:hover {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .music-genre-select:focus {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: #0d7a3f;
      box-shadow: 0 0 0 3px rgba(13, 122, 63, 0.1);
      outline: none;
    }

    .music-genre-select option {
      background-color: #1a1a1a;
      color: #f5f5f5;
    }

    .music-recommend-btn-minimal {
      background: linear-gradient(135deg, #0d7a3f, #0a5c30);
      border: 1px solid rgba(13, 122, 63, 0.5);
      color: #f5f5f5;
      padding: 0.85rem 2.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }

    .music-recommend-btn-minimal:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(13, 122, 63, 0.3);
      background: linear-gradient(135deg, #0a5c30, #0d7a3f);
    }

    .music-recommend-btn-minimal:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: none;
    }

    .music-selector-hint {
      font-size: 0.8rem;
      color: #a0a0a0;
      text-align: center;
      letter-spacing: 0.5px;
    }
  `}</style>
);

function MusicSelector({ selectedTracks, onRecommend, genres = [], onGenreChange }) {
  const canRecommend = selectedTracks.length >= 3;
  const remaining = Math.max(0, 3 - selectedTracks.length);

  return (
    <>
      <SelectorStyles />
      <motion.div
        className="music-selector-minimal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="music-selector-chips">
          <AnimatePresence>
            {selectedTracks.length === 0 ? (
              <motion.p
                className="music-selector-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                selecione músicas clicando nas capas abaixo
              </motion.p>
            ) : (
              selectedTracks.map((track) => (
                <motion.div
                  key={track.id}
                  className="music-chip"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  {track.name}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="music-selector-controls">
          <select
            className="music-genre-select"
            onChange={(e) => onGenreChange(e.target.value)}
            data-testid="genre-select"
          >
            <option value="">gênero preferido (opcional)</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <button
            className="music-recommend-btn-minimal"
            disabled={!canRecommend}
            onClick={onRecommend}
            data-testid="recommend-btn"
          >
            {canRecommend
              ? 'gerar recomendações'
              : `selecione mais ${remaining} ${remaining === 1 ? 'música' : 'músicas'}`}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default MusicSelector;