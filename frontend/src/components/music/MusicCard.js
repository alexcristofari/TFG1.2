// frontend/src/components/music/MusicCard.js (v5.0 - Skeleton + Optimized)
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CardStyles = () => (
  <style>{`
    .music-card-minimal {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      background-color: #1a1a1a;
    }

    .music-card-minimal:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
    }

    .music-card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .music-card-minimal:hover .music-card-image {
      transform: scale(1.08);
    }

    .music-card-skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        #1a1a1a 25%,
        #2a2a2a 50%,
        #1a1a1a 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
    }

    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .music-card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to top,
        rgba(10, 10, 10, 0.95) 0%,
        rgba(10, 10, 10, 0.7) 40%,
        transparent 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .music-card-minimal:hover .music-card-overlay {
      opacity: 1;
    }

    .music-card-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #f5f5f5;
      margin: 0 0 0.2rem 0;
      letter-spacing: 0.2px;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .music-card-artist {
      font-size: 0.75rem;
      font-weight: 400;
      color: #a0a0a0;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .music-card-genre {
      position: absolute;
      top: 8px;
      left: 8px;
      background-color: rgba(10, 10, 10, 0.8);
      backdrop-filter: blur(4px);
      color: #a0a0a0;
      padding: 0.3rem 0.6rem;
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-transform: lowercase;
    }

    .music-card-score {
      position: absolute;
      top: 8px;
      right: 8px;
      background: linear-gradient(135deg, rgba(13, 122, 63, 0.95), rgba(10, 92, 48, 0.95));
      color: #ffffff;
      padding: 0.3rem 0.6rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .music-card-selected {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 3px solid #0d7a3f;
      border-radius: 8px;
      box-shadow: 0 0 20px rgba(13, 122, 63, 0.6), inset 0 0 20px rgba(13, 122, 63, 0.2);
      pointer-events: none;
    }

    .music-card-checkmark {
      position: absolute;
      top: 8px;
      left: 8px;
      background-color: #0d7a3f;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(13, 122, 63, 0.5);
      z-index: 10;
    }

    .music-card-checkmark svg {
      width: 16px;
      height: 16px;
      fill: #ffffff;
    }
  `}</style>
);

function MusicCard({ track, onClick, isSelected }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const score = track.similarity_score;

  return (
    <>
      <CardStyles />
      <motion.div
        className="music-card-minimal"
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* SKELETON ENQUANTO CARREGA */}
        {!imageLoaded && track.image_url && (
          <div className="music-card-skeleton" />
        )}

        {/* IMAGEM */}
        {track.image_url && (
          <img
            src={track.image_url}
            alt={track.name}
            className="music-card-image"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        )}

        {/* OVERLAY COM INFORMAÇÕES */}
        <div className="music-card-overlay">
          <h3 className="music-card-title">{track.name}</h3>
          <p className="music-card-artist">{track.artists}</p>
        </div>

        {/* GÊNERO (apenas se existir) */}
        {track.genres && (
          <div className="music-card-genre">{track.genres}</div>
        )}

        {/* SCORE DE SIMILARIDADE */}
        {score && (
          <div className="music-card-score">{score}%</div>
        )}

        {/* INDICADOR DE SELEÇÃO */}
        {isSelected && (
          <>
            <motion.div
              className="music-card-selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="music-card-checkmark"
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

export default MusicCard;
