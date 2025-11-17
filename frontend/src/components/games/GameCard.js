// frontend/src/components/games/GameCard.js (v3.0 - Minimal Clean Design)
import React from 'react';
import { motion } from 'framer-motion';

const CardStyles = () => (
  <style>{`
    .game-card-minimal {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }

    .game-card-minimal:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .game-card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .game-card-minimal:hover .game-card-image {
      transform: scale(1.05);
    }

    .game-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to top,
        rgba(10, 10, 10, 0.95) 0%,
        rgba(10, 10, 10, 0.6) 50%,
        transparent 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .game-card-minimal:hover .game-card-overlay {
      opacity: 1;
    }

    .game-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #f5f5f5;
      margin: 0;
      letter-spacing: 0.3px;
    }

    .game-card-score {
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: rgba(10, 10, 10, 0.8);
      backdrop-filter: blur(8px);
      color: #f5f5f5;
      padding: 0.4rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .game-card-selected {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid #2a475e;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(42, 71, 94, 0.6), inset 0 0 20px rgba(42, 71, 94, 0.2);
      pointer-events: none;
    }

    .game-card-checkmark {
      position: absolute;
      top: 12px;
      left: 12px;
      background-color: #2a475e;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(42, 71, 94, 0.5);
    }

    .game-card-checkmark svg {
      width: 18px;
      height: 18px;
      fill: #f5f5f5;
    }
  `}</style>
);

function GameCard({ game, onClick, isSelected }) {
  const score = game.display_score ? `${Math.round(game.display_score)}%` : null;

  return (
    <>
      <CardStyles />
      <motion.div
        className="game-card-minimal"
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        data-testid={`game-card-${game.appid}`}
      >
        <img src={game.header_image} alt={game.name} className="game-card-image" />
        
        <div className="game-card-overlay">
          <h3 className="game-card-title">{game.name}</h3>
        </div>

        {score && <div className="game-card-score">{score}</div>}

        {isSelected && (
          <>
            <motion.div
              className="game-card-selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="game-card-checkmark"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </motion.div>
          </>
        )}
      </motion.div>
    </>
  );
}

export default GameCard;