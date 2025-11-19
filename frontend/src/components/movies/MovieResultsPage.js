// frontend/src/components/movies/MovieResultsPage.js (v5.0 - Padrão Ouro Netflix)
import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

const PageStyles = () => (
  <style>{`
    .movies-results-container {
      min-height: 100vh;
      background-color: #0a0a0a;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .movies-results-content {
      max-width: 1400px;
      width: 100%;
    }

    .movies-results-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .movies-results-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #f5f5f5;
      letter-spacing: -0.02em;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .movies-profile-summary {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2rem;
      border-radius: 16px;
      margin-bottom: 4rem;
    }

    .movies-profile-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #f5f5f5;
      margin-bottom: 1.5rem;
      letter-spacing: 0;
    }

    .movies-profile-movies {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .movies-profile-movie-tag {
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f5f5f5;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    .movies-profile-genres-label {
      font-size: 0.9rem;
      color: #a0a0a0;
      margin-bottom: 0.75rem;
      letter-spacing: 0.3px;
    }

    .movies-profile-highlights {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .movies-profile-highlight {
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.3), rgba(180, 7, 16, 0.2));
      border: 1px solid rgba(229, 9, 20, 0.5);
      color: #f5f5f5;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .movies-recommendation-section {
      margin-bottom: 3rem;
    }

    .movies-category-title {
      font-size: 1.6rem;
      font-weight: 600;
      color: #f5f5f5;
      margin-bottom: 2rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      letter-spacing: -0.01em;
    }

    .movies-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .movies-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .movies-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
      }

      .movies-results-title {
        font-size: 2rem;
      }

      .movies-category-title {
        font-size: 1.3rem;
      }
    }

    .movies-back-button {
      background: linear-gradient(135deg, #E50914, #b40710);
      border: 1px solid rgba(229, 9, 20, 0.5);
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

    .movies-back-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(229, 9, 20, 0.4);
      background: linear-gradient(135deg, #b40710, #E50914);
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

function MovieResultsPage({ recommendations, profile, selectedGenre, onBack }) {
  const { main, hidden_gems, genre_favorites, blockbusters, cult_classics } = recommendations || {};
  const { movies, favorite_genre } = profile || {};

  const renderCategory = (title, moviesList) => {
    if (!moviesList || moviesList.length === 0) return null;
    return (
      <motion.section className="movies-recommendation-section" variants={itemVariants}>
        <h2 className="movies-category-title">{title}</h2>
        <div className="movies-results-grid">
          {moviesList.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
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
        className="movies-results-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="movies-results-content">
          <motion.header className="movies-results-header" variants={itemVariants}>
            <h1 className="movies-results-title">Suas Recomendações de Filmes</h1>
          </motion.header>

          {profile && (
            <motion.div className="movies-profile-summary" variants={itemVariants}>
              <h3 className="movies-profile-title">Seu Perfil de Filmes</h3>

              {movies && movies.length > 0 && (
                <>
                  <p className="movies-profile-genres-label">Filmes selecionados:</p>
                  <div className="movies-profile-movies">
                    {movies.map(movie => (
                      <span key={movie.id} className="movies-profile-movie-tag">
                        {movie.title}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="movies-profile-highlights">
                {favorite_genre && (
                  <span className="movies-profile-highlight">
                    Gênero Dominante: {favorite_genre}
                  </span>
                )}
                {selectedGenre && (
                  <span className="movies-profile-highlight">
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
          
          {renderCategory("Blockbusters", blockbusters)}
          {renderCategory("Jóias Escondidas", hidden_gems)}
          {renderCategory("Clássicos Cult", cult_classics)}

          <motion.button
            className="movies-back-button"
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

export default MovieResultsPage;
