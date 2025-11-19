// frontend/src/components/music/MusicCard.js (v4.0 - Com Similarity Score)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CardStyles = () => (
  <style>{`
    .music-card {
      position: relative;
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .music-card:hover {
      transform: translateY(-4px);
      border-color: rgba(13, 122, 63, 0.4);
      box-shadow: 0 8px 24px rgba(13, 122, 63, 0.2);
    }

    .music-card.selected {
      border-color: #0d7a3f;
      box-shadow: 0 0 0 2px rgba(13, 122, 63, 0.3);
      background-color: rgba(13, 122, 63, 0.08);
    }

    .music-card-image-container {
      position: relative;
      width: 100%;
      padding-top: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .music-card-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .music-card-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      background: linear-gradient(135deg, rgba(13, 122, 63, 0.2), rgba(10, 92, 48, 0.2));
    }

    /* SIMILARITY BADGE - IGUAL AO DE FILMES */
    .music-similarity-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, rgba(13, 122, 63, 0.95), rgba(10, 92, 48, 0.95));
      color: #ffffff;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 6px 12px;
      border-radius: 50px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      z-index: 10;
      letter-spacing: 0.5px;
    }

    .music-card-content {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .music-card-name {
      font-size: 1rem;
      font-weight: 600;
      color: #f5f5f5;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .music-card-artist {
      font-size: 0.85rem;
      color: #a0a0a0;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .music-card-genre {
      font-size: 0.75rem;
      color: #0d7a3f;
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      background-color: rgba(13, 122, 63, 0.1);
      border: 1px solid rgba(13, 122, 63, 0.3);
      border-radius: 50px;
      display: inline-block;
      align-self: flex-start;
      margin-top: auto;
    }

    .music-card-selected-indicator {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0d7a3f, #0a5c30);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
      font-weight: bold;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  `}</style>
);

function MusicCard({ track, onClick, isSelected }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Buscar imagem do Spotify se necessário
    const fetchImage = async () => {
      if (!track.id || imageUrl) return;

      setIsLoading(true);
      try {
        const response = await axios.post('/api/music/get-track-details', {
          track_ids: [track.id]
        });

        if (response.data && response.data[track.id]) {
          setImageUrl(response.data[track.id].image_url);
        }
      } catch (error) {
        console.error('Erro ao buscar imagem:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [track.id, imageUrl]);

  const name = track.name || track.track_name || 'Sem título';
  const artist = track.artists || track.artist_name || 'Artista desconhecido';
  const genre = track.track_genre || track.genres || '';

  return (
    <>
      <CardStyles />
      <motion.div
        className={`music-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="music-card"
      >
        <div className="music-card-image-container">
          {/* SIMILARITY BADGE - IGUAL AO DE FILMES */}
          {track.similarity_score && (
            <div className="music-similarity-badge">
              {track.similarity_score}%
            </div>
          )}

          {isSelected && (
            <div className="music-card-selected-indicator">
              ✓
            </div>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="music-card-image"
              loading="lazy"
            />
          ) : (
            <div className="music-card-placeholder">
              {isLoading ? '⏳' : '🎵'}
            </div>
          )}
        </div>

        <div className="music-card-content">
          <h3 className="music-card-name">{name}</h3>
          <p className="music-card-artist">{artist}</p>
          {genre && <span className="music-card-genre">{genre}</span>}
        </div>
      </motion.div>
    </>
  );
}

export default MusicCard;