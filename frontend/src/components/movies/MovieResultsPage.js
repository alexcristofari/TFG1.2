// frontend/src/components/movies/MovieResultsPage.js
import React from 'react';

const ResultStyles = () => (
  <style>{`
    .movie-results-container { padding: 2rem; background-color: #000; color: white; min-height: 100vh; }
    .movie-results-header { text-align: center; margin-bottom: 3rem; }
    .movie-results-title { font-size: 2.2rem; color: #E50914; }
    .movie-results-section-title { font-size: 1.8rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    .movie-results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1.5rem; }
    .movie-profile-section { border: 1px solid #333; margin-bottom: 3rem; padding: 1.5rem; border-radius: 8px; }
    .movie-profile-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
    .movie-profile-title { font-size: 1.2rem; border-bottom: none; margin: 0; }
    .movie-profile-badges { display: flex; gap: 1rem; }
    .movie-profile-badge { padding: 0.6rem 1.2rem; border-radius: 500px; font-weight: 700; font-size: 0.9rem; background-color: #E50914; }
    .movie-profile-list { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .movie-profile-item { background-color: #333; padding: 0.5rem 1rem; border-radius: 500px; font-size: 0.9rem; }
    .movie-back-button { display: inline-block; margin: 2rem auto; padding: 1rem 2rem; background-color: #E50914; color: #fff; text-decoration: none; border-radius: 500px; font-weight: 700; cursor: pointer; border: none; }

    /* Estilos para o Card de Resultado de Filme */
    .movie-result-card-link { text-decoration: none; color: inherit; display: block; }
    .movie-result-card-container { background-color: #1a1a1a; border-radius: 4px; transition: all 0.2s; position: relative; }
    .movie-result-card-container:hover { transform: scale(1.05); background-color: #282828; }
    .movie-result-card-image { width: 100%; padding-bottom: 150%; background-size: cover; background-position: center; background-color: #333; border-radius: 4px 4px 0 0; }
    .movie-result-card-info { padding: 1rem; }
    .movie-result-card-title { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .movie-result-card-details { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #b3b3b3; margin-top: 0.5rem; }
    .movie-result-card-score { position: absolute; top: 8px; right: 8px; background-color: rgba(0, 0, 0, 0.7); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem; font-weight: 700; z-index: 2; }
  `}</style>
);

const MovieResultCard = ({ movie }) => (
  <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" className="movie-result-card-link">
    <div className="movie-result-card-container">
      <div className="movie-result-card-score">{movie.similarity_score}%</div>
      <div className="movie-result-card-image" style={{ backgroundImage: `url(${movie.poster_url} )` }}></div>
      <div className="movie-result-card-info">
        <strong className="movie-result-card-title">{movie.title}</strong>
        <div className="movie-result-card-details">
          <span>{(movie.release_date || '').split('-')[0]}</span>
          {movie.vote_average > 0 && <span>⭐ {movie.vote_average.toFixed(1)}</span>}
        </div>
      </div>
    </div>
  </a>
);

function MovieResultsPage({ recommendations, profile, selectedGenre, onBack }) {
  const categoryTitles = {
    main: "Recomendações Principais",
    genre_favorites: `Melhores de ${selectedGenre}`,
    blockbusters: "Blockbusters Populares",
    cult_classics: "Clássicos Cult",
    hidden_gems: "Jóias Escondidas"
  };

  const categoryOrder = ["main", "genre_favorites", "blockbusters", "cult_classics", "hidden_gems"];

  return (
    <>
      <ResultStyles />
      <div className="movie-results-container">
        <header className="movie-results-header">
          <h1 className="movie-results-title">Suas Recomendações de Filmes</h1>
        </header>

        {profile && profile.movies && (
          <section className="movie-profile-section">
            <div className="movie-profile-header">
              <h2 className="movie-profile-title">Seu Perfil de Filmes</h2>
              <div className="movie-profile-badges">
                {profile.favorite_genre && <div className="movie-profile-badge">Gênero Dominante: {profile.favorite_genre}</div>}
                {selectedGenre && <div className="movie-profile-badge">Explorando: {selectedGenre}</div>}
              </div>
            </div>
            <div className="movie-profile-list">
              {profile.movies.map(movie => (
                <div key={movie.id} className="movie-profile-item">{movie.title}</div>
              ))}
            </div>
          </section>
        )}

        {categoryOrder.map(categoryKey => (
          recommendations[categoryKey] && recommendations[categoryKey].length > 0 && (
            <section key={categoryKey} style={{ marginBottom: '3rem' }}>
              <h2 className="movie-results-section-title">{categoryTitles[categoryKey]}</h2>
              <div className="movie-results-grid">
                {recommendations[categoryKey].map(rec => (
                  <MovieResultCard key={rec.id} movie={rec} />
                ))}
              </div>
            </section>
          )
        ))}

        <div style={{ textAlign: 'center' }}>
          <button onClick={onBack} className="movie-back-button">Fazer Nova Recomendação</button>
        </div>
      </div>
    </>
  );
}

export default MovieResultsPage;
