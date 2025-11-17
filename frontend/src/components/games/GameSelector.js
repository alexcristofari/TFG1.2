// frontend/src/components/games/GameSelector.js (v2.0 - "Sênior de 20 Anos" Edition)
import React from 'react';
import { motion } from 'framer-motion';

const SelectorStyles = () => (
  <style>{`
    .game-selector-area {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 3rem;
      border: 1px solid var(--steam-medium-blue);
    }
    .game-selector-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 1.5rem;
      align-items: end;
    }
    .game-profile-box {
      background-color: var(--steam-darker-blue);
      border-radius: 4px;
      padding: 1rem;
      min-height: 100px;
      border: 1px solid #000;
    }
    .game-profile-box h2 {
      margin: 0 0 1rem 0;
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--steam-light-blue);
    }
    .game-selected-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .game-selected-item {
      background-color: var(--steam-medium-blue);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
      color: var(--steam-font-color);
    }
    .game-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .game-genre-select, .game-recommend-btn {
      width: 280px;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #000;
      font-size: 1rem;
      font-family: inherit;
      text-align: center;
    }
    .game-genre-select {
      background-color: var(--steam-medium-blue);
      color: var(--steam-font-color);
    }
    .game-recommend-btn {
      background: linear-gradient(to right, #74c8f8, #55b1db);
      color: var(--steam-font-bright);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .game-recommend-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 192, 244, 0.4);
    }
    .game-recommend-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}</style>
);

function GameSelector({ selectedGames, onRecommend, genres = [], onGenreChange }) {
  const canRecommend = selectedGames.length >= 3;

  return (
    <>
      <SelectorStyles />
      <motion.div
        className="game-selector-area"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="game-selector-grid">
          <div className="game-profile-box">
            <h2>Seu Perfil de Jogos</h2>
            <div className="game-selected-list">
              {selectedGames.map(game => (
                <motion.div
                  key={game.appid}
                  className="game-selected-item"
                  layout // Anima a posição quando outros itens são adicionados/removidos
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  {game.name}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="game-controls">
            <select className="game-genre-select" onChange={e => onGenreChange(e.target.value)}>
              <option value="">-- Gênero para Explorar --</option>
              {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
            </select>
            <button
              className="game-recommend-btn"
              disabled={!canRecommend}
              onClick={onRecommend}
            >
              {canRecommend ? 'Gerar Recomendações' : `Selecione mais ${3 - selectedGames.length}`}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default GameSelector;
