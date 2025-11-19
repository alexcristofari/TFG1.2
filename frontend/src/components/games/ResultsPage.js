// frontend/src/components/games/ResultsPage.js (v5.0 - Padrão Steam Minimalista)
import React from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';

const PageStyles = () => (
  <style>{`
    .games-results-container {
      min-height: 100vh;
      background-color: #0a0e12;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .games-results-content {
      max-width: 1400px;
      width: 100%;
    }

    .games-results-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .games-results-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #f5f5f5;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .games-profile-summary {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 4rem;
    }

    .games-profile-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #f5f5f5;
      margin-bottom: 1.5rem;
      letter-spacing: 0;
    }

    .games-profile-games {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .games-profile-game-tag {
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f5f5f5;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    .games-profile-genres-label {
      font-size: 0.9rem;
      color: #a0a0a0;
      margin-bottom: 0.75rem;
      letter-spacing: 0.3px;
    }

    .games-profile-highlights {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .games-profile-highlight {
      background: linear-gradient(135deg, rgba(74, 159, 216, 0.3), rgba(30, 53, 72, 0.2));
      border: 1px solid rgba(74, 159, 216, 0.5);
      color: #f5f5f5;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .games-recommendation-section {
      margin-bottom: 3rem;
    }

    .games-category-title {
      font-size: 1.6rem;
      font-weight: 600;
      color: #f5f5f5;
      margin-bottom: 2rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      letter-spacing: -0.01em;
    }

    .games-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .games-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .games-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }

      .games-results-title {
        font-size: 2rem;
      }

      .games-category-title {
        font-size: 1.3rem;
      }
    }

    .games-back-button {
      background: linear-gradient(135deg, #4a9fd8, #1e3548);
      border: 1px solid rgba(74, 159, 216, 0.5);
      color: #f5f5f5;
      padding: 1rem 2.5rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
      margin: 4rem auto 0;
      display: block;
      border: none;
    }

    .games-back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(74, 159, 216, 0.4);
      background: linear-gradient(135deg, #1e3548, #4a9fd8);
    }
  `}</style>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function ResultsPage({ recommendations, profile, selectedGenre, onBack }) {
  const { main, hidden_gems, genre_favorites } = recommendations || {};
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

