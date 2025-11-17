// frontend/src/components/games/GameCard.js (v2.2 - Exibindo o Score)
import React from 'react';
import { motion } from 'framer-motion';

const CardStyles = () => (
  <style>{`
    .game-card-wrapper { cursor: pointer; position: relative; border-radius: 4px; overflow: hidden; }
    .game-card-image { width: 100%; display: block; transition: transform 0.3s ease; }
    .game-card-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(27, 40, 56, 0.9) 20%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; transition: background 0.3s ease; }
    .game-card-title { font-weight: 700; color: var(--steam-font-bright); transform: translateY(10px); opacity: 0; transition: all 0.3s ease; }
    .game-card-wrapper:hover .game-card-title { transform: translateY(0); opacity: 1; }
    .game-card-wrapper:hover .game-card-image { transform: scale(1.1); }
    .game-card-selection-indicator { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 3px solid var(--steam-light-blue); border-radius: 4px; box-shadow: 0 0 15px var(--steam-light-blue); background: rgba(102, 192, 244, 0.2); }
    
    /* --- ESTILOS NOVOS PARA O SCORE --- */
    .game-card-score {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: bold;
      backdrop-filter: blur(2px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  `}</style>
);

function GameCard({ game, onClick, isSelected }) {
  // Verifica se o display_score existe e o formata
  const score = game.display_score ? `${Math.round(game.display_score)}%` : null;

  return (
    <>
      <CardStyles />
      <motion.div
        className="game-card-wrapper"
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <img src={game.header_image} alt={game.name} className="game-card-image" />
        <div className="game-card-overlay">
          <h3 className="game-card-title">{game.name}</h3>
        </div>
        
        {/* --- EXIBE O SCORE SE ELE EXISTIR --- */}
        {score && <div className="game-card-score">{score}</div>}

        {isSelected && (
          <motion.div
            className="game-card-selection-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId={`selection-indicator-${game.appid}`}
          />
        )}
      </motion.div>
    </>
  );
}

export default GameCard;
