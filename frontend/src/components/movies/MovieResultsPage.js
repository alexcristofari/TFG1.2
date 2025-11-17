// frontend/src/components/movies/MovieResultsPage.js (v4.0 - Minimal Clean Design)
import React from 'react';
import { motion } from 'framer-motion';

const PageStyles = () => (
  <style>{`
    .movie-results-container {
      min-height: 100vh;
      background-color: #0a0a0a;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .movie-results-content {
      max-width: 1200px;
      width: 100%;
    }

    .movie-results-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .movie-results-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #E50914;
      letter-spacing: 0;
      margin-bottom: 1rem;
      line-height: 1;
    }

    .movie-profile-summary {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .movie-profile-title {
      font-size: 1.2rem;
      font-weight: 500;
      color: #f5f5f5;
      margin-bottom: 1.5rem;
      letter-spacing: 0.5px;
    }

    .movie-profile-movies {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .movie-profile-movie-tag {
      background-color: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f5f5f5;
      padding: 0.5rem 1.25rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    .movie-profile-genres-label {
      font-size: 0.85rem;
      color: #a0a0a0;
      margin-bottom: 0.75rem;
      letter-spacing: 0.5px;
    }

    .movie-profile-genres {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .movie-profile-genre-tag {
      background-color: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f5f5f5;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 400;
    }

    .movie-profile-highlights {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .movie-profile-highlight {
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.3), rgba(180, 7, 16, 0.2));
      border: 1px solid rgba(229, 9, 20, 0.5);
      color: #f5f5f5;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .movie-category-section {
      margin: 4rem 0;
    }

    .movie-category-title {
      font-size: 1.5rem;
      font-weight: 500;
      color: #f5f5f5;
      margin-bottom: 2rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      letter-spacing: 0.3px;
    }

    .movie-results-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .movie-results-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .movie-results-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .movie-results-grid {
        grid-template-columns: 1fr;
      }
    }

    .movie-result-card {
      background-color: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .movie-result-card:hover {
      transform: translateY(-4px);
      border-color: rgba(229, 9, 20, 0.5);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }

    .movie-result-poster {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      background-color: #1a1a1a;
    }

    .movie-result-info {
      padding: 1rem;
    }

    .movie-result-title {
      font-size: 0.95rem;
      font-weight: 500;
      color: #f5f5f5;
      margin-bottom: 0.5rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .movie-result-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: #a0a0a0;
    }

    .movie-result-score {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: rgba(229, 9, 20, 0.9);
      color: #fff;
      padding: 0.4rem 0.8rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 2;
      letter-spacing: 0.5px;
    }

    .movie-back-button {
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
    }

    .movie-back-button:hover {
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

const MovieResultCard = ({ movie }) => (
  <a 
    href={`https://www.themoviedb.org/movie/${movie.id}`} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="movie-result-card"
  >
    {movie.similarity_score && (
      <div className="movie-result-score">{movie.similarity_score}%</div>
    )}
    <img 
      src={movie.poster_url} 
      alt={movie.title} 
      className="movie-result-poster"
    />
    <div className="movie-result-info">
      <div className="movie-result-title">{movie.title}</div>
      <div className="movie-result-details">
        <span>{(movie.release_date || '').split('-')[0]}</span>
        {movie.vote_average > 0 && <span>⭐ {movie.vote_average.toFixed(1)}</span>}
      </div>
    </div>
  </a>
);

function MovieResultsPage({ recommendations, profile, onBack }) {
  const { main, hidden_gems, genre_favorites, blockbusters, cult_classics } = recommendations || {};
  const { movies, favorite_genre, selected_genre, genres_found } = profile || {};

  const renderCategory = (title, moviesList) => {
    if (!moviesList || moviesList.length === 0) return null;
    return (
      <motion.section className="movie-category-section" variants={itemVariants}>
        <h2 className="movie-category-title">{title}</h2>
        <div className="movie-results-grid">
          {moviesList.map(movie => (
            <MovieResultCard key={movie.id} movie={movie} />
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <>
      <PageStyles />
      <motion.div
        className="movie-results-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="movie-results-content">
          <motion.header className="movie-results-header" variants={itemVariants}>
            <h1 className="movie-results-title">Suas Recomendações de Filmes</h1>
          </motion.header>

          {profile && (
            <motion.div className="movie-profile-summary" variants={itemVariants}>
              <h3 className="movie-profile-title">Seu Perfil de Filmes</h3>
              
              <p className="movie-profile-genres-label">Filmes selecionados:</p>
              <div className="movie-profile-movies">
                {movies?.map(movie => (
                  <span key={movie.id} className="movie-profile-movie-tag">
                    {movie.title}
                  </span>
                ))}
              </div>

              {genres_found && genres_found.length > 0 && (
                <>
                  <p className="movie-profile-genres-label">Gêneros encontrados na sua seleção:</p>
                  <div className="movie-profile-genres">
                    {genres_found.map((genre, idx) => (
                      <span key={idx} className="movie-profile-genre-tag">{genre}</span>
                    ))}
                  </div>
                </>
              )}

              <div className="movie-profile-highlights">
                {favorite_genre && (
                  <span className="movie-profile-highlight">
                    Gênero Dominante: {favorite_genre}
                  </span>
                )}
                {selected_genre && (
                  <span className="movie-profile-highlight">
                    Explorando: {selected_genre}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {renderCategory("Recomendações Principais", main)}
          {renderCategory("Jóias Escondidas", hidden_gems)}
          {selected_genre && renderCategory(`Melhores de ${selected_genre}`, genre_favorites)}
          {renderCategory("Blockbusters Populares", blockbusters)}
          {renderCategory("Clássicos Cult", cult_classics)}

          <motion.button 
            className="movie-back-button" 
            onClick={onBack} 
            variants={itemVariants}
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
