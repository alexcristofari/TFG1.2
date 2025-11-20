import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import GameCard from './GameCard';

const PageStyles = () => (
  <style>{`
    .games-results-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .games-results-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    .games-results-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .games-results-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .games-profile-summary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .games-profile-title {
      font-size: 1.5rem;
      color: white;
      margin: 0 0 1rem 0;
      font-weight: 600;
    }

    .games-profile-genres-label {
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .games-profile-games {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .games-profile-game-tag {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .games-profile-highlights {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .games-profile-highlight {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
    }

    .games-recommendation-section {
      margin-bottom: 4rem;
    }

    .games-category-title {
      font-size: 2rem;
      color: white;
      margin: 0 0 1.5rem 0;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .games-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .games-back-button {
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

    .games-back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    @media (max-width: 768px) {
      .games-results-title {
        font-size: 2rem;
      }

      .games-category-title {
        font-size: 1.5rem;
      }

      .games-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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

function ResultsPage({ recommendations, profile, selectedGenre, onBack }) {
  const { main, genre_favorites, famous, hidden_gems } = recommendations || {};
  const { games, dominant_genre } = profile || {};

  const renderCategory = (title, gamesList) => {
    if (!gamesList || gamesList.length === 0) return null;
    return (
      <motion.section className="games-recommendation-section" variants={itemVariants}>
        <h2 className="games-category-title">{title}</h2>
        <div className="games-results-grid">
          {gamesList.map(game => (
            <GameCard
              key={game.appid}
              game={game}
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
        className="games-results-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="games-results-content">
          <motion.header className="games-results-header" variants={itemVariants}>
            <h1 className="games-results-title">Suas Recomendações de Jogos</h1>
          </motion.header>

          {profile && (
            <motion.div className="games-profile-summary" variants={itemVariants}>
              <h3 className="games-profile-title">Seu Perfil de Jogos</h3>

              {games && games.length > 0 && (
                <>
                  <p className="games-profile-genres-label">Jogos selecionados:</p>
                  <div className="games-profile-games">
                    {games.map(game => (
                      <span key={game.appid} className="games-profile-game-tag">
                        {game.name}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="games-profile-highlights">
                {dominant_genre && (
                  <span className="games-profile-highlight">
                    Gênero Dominante: {dominant_genre}
                  </span>
                )}
                {selectedGenre && (
                  <span className="games-profile-highlight">
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
          
          {renderCategory("Jogos Famosos", famous)}
          
          {renderCategory("Jóias Escondidas", hidden_gems)}

          <motion.button
            className="games-back-button"
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

export default ResultsPage;