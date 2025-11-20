// frontend/src/components/games/ResultsPage.js (v3.0 - Preto Minimalista + Todas Categorias)
import React from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';

const PageStyles = () => (
  <style>{`
    .results-page-container {
      min-height: 100vh;
      background-color: #0a0a0a;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .results-content {
      max-width: 1400px;
      width: 100%;
    }

    .results-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .results-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #072347ff;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .profile-summary {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 4rem;
    }

    .profile-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #f5f5f5;
      margin-bottom: 1.5rem;
      letter-spacing: 0;
    }

    .profile-games {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .profile-game-tag {
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f5f5f5;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    .profile-highlights {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .profile-highlight {
      background: linear-gradient(135deg, rgba(27, 40, 56, 0.5), rgba(40, 60, 80, 0.3));
      border: 1px solid rgba(27, 40, 56, 0.7);
      color: #f5f5f5;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .category-section {
      margin: 4rem 0;
    }

    .category-title {
      font-size: 1.6rem;
      font-weight: 600;
      color: #f5f5f5;
      margin-bottom: 2rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      letter-spacing: -0.01em;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .results-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .results-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }

      .results-title {
        font-size: 2rem;
      }

      .category-title {
        font-size: 1.3rem;
      }
    }

    .back-button {
      background: linear-gradient(135deg, #1B2838, #2C3E50);
      border: 1px solid rgba(27, 40, 56, 0.7);
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

    .back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(27, 40, 56, 0.4);
      background: linear-gradient(135deg, #2C3E50, #1B2838);
    }
  `}</style>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function ResultsPage({ recommendations, profile, onBack }) {
  // Pegando TODAS as categorias que o backend retorna
  const categories = recommendations || {};
  const { games, dominant_genre, selected_genre, all_genres } = profile || {};

  const renderCategory = (title, gamesList) => {
    if (!gamesList || gamesList.length === 0) return null;
    return (
      <motion.section className="category-section" variants={itemVariants}>
        <h2 className="category-title">{title}</h2>
        <div className="results-grid">
          {gamesList.map(game => (
            <GameCard key={game.appid} game={game} onClick={() => {}} isSelected={false} />
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <>
      <PageStyles />
      <motion.div
        className="results-page-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="results-content">
          <motion.header className="results-header" variants={itemVariants}>
            <h1 className="results-title">Suas Recomendações de Jogos</h1>
          </motion.header>

          {profile && (
            <motion.div className="profile-summary" variants={itemVariants}>
              <h3 className="profile-title">Seu Perfil de Jogos</h3>

              {games && games.length > 0 && (
                <>
                  <div className="profile-games">
                    {games.map(game => (
                      <span key={game.appid} className="profile-game-tag">
                        {game.name}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="profile-highlights">
                {dominant_genre && (
                  <span className="profile-highlight">
                    Gênero Dominante: {dominant_genre}
                  </span>
                )}
                {selected_genre && (
                  <span className="profile-highlight">
                    Explorando: {selected_genre}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Renderizar TODAS as categorias dinamicamente */}
          {Object.keys(categories).map((categoryKey) => (
            renderCategory(categoryKey, categories[categoryKey])
          ))}

          <motion.button
            className="back-button"
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
