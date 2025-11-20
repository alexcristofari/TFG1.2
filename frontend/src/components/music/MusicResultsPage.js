import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import MusicCard from './MusicCard';

const PageStyles = () => (
  <style>{`
    .music-results-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .music-results-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .music-results-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .music-results-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .music-profile-summary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .music-profile-title {
      font-size: 1.5rem;
      color: white;
      margin: 0 0 1rem 0;
      font-weight: 600;
    }

    .music-profile-tracks-label {
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .music-profile-tracks {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .music-profile-track-tag {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .music-profile-highlights {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .music-profile-highlight {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
    }

    .music-recommendation-section {
      margin-bottom: 4rem;
    }

    .music-category-title {
      font-size: 2rem;
      color: white;
      margin: 0 0 1.5rem 0;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .music-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .music-back-button {
      display: block;
      margin: 3rem auto 0;
      padding: 1rem 3rem;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .music-back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    @media (max-width: 768px) {
      .music-results-title {
        font-size: 2rem;
      }

      .music-category-title {
        font-size: 1.5rem;
      }

      .music-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
    }
  `}</style>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

function MusicResultsPage({ recommendations, profile, selectedGenre, onBack }) {
  const { main, genre_favorites, popular, hidden_gems } = recommendations || {};
  const { tracks, dominant_genre, genres_found } = profile || {};

  const renderCategory = (title, tracksList) => {
    if (!tracksList || tracksList.length === 0) return null;
    return (
      <motion.section className="music-recommendation-section" variants={itemVariants}>
        <h2 className="music-category-title">{title}</h2>
        <div className="music-results-grid">
          {tracksList.map(track => (
            <MusicCard
              key={track.id}
              track={track}
              onClick={() => {}}
              isSelected={false}
            />
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <>
      <PageStyles />
      <motion.div
        className="music-results-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="music-results-content">
          <motion.header className="music-results-header" variants={itemVariants}>
            <h1 className="music-results-title">Suas Recomendações de Músicas</h1>
          </motion.header>

          {profile && (
            <motion.div className="music-profile-summary" variants={itemVariants}>
              <h3 className="music-profile-title">Seu Perfil Musical</h3>

              {tracks && tracks.length > 0 && (
                <>
                  <p className="music-profile-tracks-label">Músicas selecionadas:</p>
                  <div className="music-profile-tracks">
                    {tracks.map(track => (
                      <span key={track.id} className="music-profile-track-tag">
                        {track.name}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="music-profile-highlights">
                {dominant_genre && (
                  <span className="music-profile-highlight">
                    Gênero Dominante: {dominant_genre}
                  </span>
                )}
                {selectedGenre && (
                  <span className="music-profile-highlight">
                    Explorando: {selectedGenre}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {renderCategory("Recomendações Principais", main)}
          
          {selectedGenre && genre_favorites && genre_favorites.length > 0 && 
            renderCategory(`Explorando ${selectedGenre}`, genre_favorites)
          }
          
          {renderCategory("Músicas Populares", popular)}
          
          {renderCategory("Jóias Escondidas", hidden_gems)}

          <motion.button
            className="music-back-button"
            onClick={onBack}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="back-to-discover-btn"
          >
            Fazer Nova Recomendação
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

export default MusicResultsPage;