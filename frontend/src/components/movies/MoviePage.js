// frontend/src/components/movies/MoviePage.js (v1.2 - CORREÇÃO FINAL)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import MovieSelector from './MovieSelector';
import MovieResultsPage from './MovieResultsPage';

const PageStyles = () => (
  <style>{`
    .movie-page-container { padding: 2rem; background-color: #000; color: white; min-height: 100vh; }
    .movie-page-header { text-align: center; margin-bottom: 2rem; }
    .movie-page-title { font-size: 2.5rem; color: #E50914; }
    .movie-section-title { font-size: 1.8rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    .movie-loading { text-align: center; font-size: 1.5rem; color: #b3b3b3; padding-top: 5rem; }
    .movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1.5rem; }
    
    /* ESTILOS DO MOVIECARD MOVIDOS PARA CÁ */
    .movie-card-container { background-color: #1a1a1a; border-radius: 4px; overflow: hidden; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; display: flex; flex-direction: column; height: 100%; }
    .movie-card-container:hover { transform: scale(1.05); }
    .movie-card-container.selected { border-color: #E50914; transform: scale(1.05); }
    .movie-card-image { width: 100%; display: block; aspect-ratio: 2/3; object-fit: cover; background-color: #333; }
    .movie-card-info { padding: 1rem; }
    .movie-card-title { font-size: 1rem; font-weight: 700; color: #fff; }
  `}</style>
);

function MoviePage() {
  const [recommendationResults, setRecommendationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(true);

  const [popularReleases, setPopularReleases] = useState([]);
  const [criticallyAcclaimed, setCriticallyAcclaimed] = useState([]);
  const [genres, setGenres] = useState([]);
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/movies/discover'),
      axios.get('/api/movies/genres')
    ]).then(([discoverRes, genresRes]) => {
      setPopularReleases(discoverRes.data.popular_releases || []);
      setCriticallyAcclaimed(discoverRes.data.critically_acclaimed || []);
      setGenres(genresRes.data || []);
      setIsDiscoverLoading(false);
    }).catch(error => {
      console.error("Erro ao buscar dados iniciais de filmes!", error);
      setIsDiscoverLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      axios.get(`/api/movies/search?q=${searchQuery}`)
        .then(response => setSearchResults(response.data || []))
        .catch(error => console.error("Erro ao buscar filmes!", error));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCardClick = (movie) => {
    setSelectedMovies(prev =>
      prev.find(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const handleGetRecommendations = () => {
    const selectedIds = selectedMovies.map(m => m.id);
    setIsLoading(true);
    setRecommendationResults(null);
    axios.post('/api/movies/recommend', { movie_ids: selectedIds, genre: selectedGenre })
      .then(response => {
        setRecommendationResults(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar recomendações de filmes:", error);
        alert("Ocorreu um erro ao gerar as recomendações. Tente novamente.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReset = () => {
    setRecommendationResults(null);
    setSelectedMovies([]);
    setSearchQuery('');
    setSelectedGenre('');
  };

  const isSelected = (movie) => !!selectedMovies.find(m => m.id === movie.id);
  const showDiscoverSections = searchQuery.length < 3;

  if (isLoading) {
    return <div className="movie-loading" style={{ paddingTop: '20%' }}>Gerando recomendações...</div>;
  }

  if (recommendationResults) {
    return <MovieResultsPage recommendations={recommendationResults.recommendations} profile={recommendationResults.profile} selectedGenre={recommendationResults.selected_genre} onBack={handleReset} />;
  }

  if (isDiscoverLoading) {
    return <div className="movie-loading">Carregando filmes...</div>;
  }

  return (
    <>
      <PageStyles />
      <div className="movie-page-container">
        <header className="movie-page-header">
          <h1 className="movie-page-title">Recomendador de Filmes</h1>
          <p>Escolha 3 ou mais filmes que você gosta.</p>
        </header>

        <MovieSelector
          selectedMovies={selectedMovies}
          onSearchChange={setSearchQuery}
          onRecommend={handleGetRecommendations}
          genres={genres}
          onGenreChange={setSelectedGenre}
        />

        {showDiscoverSections ? (
          <>
            <section>
              <h2 className="movie-section-title">Lançamentos Populares</h2>
              <div className="movie-grid">
                {popularReleases.map(movie => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => handleCardClick(movie)} isSelected={isSelected(movie)} />
                ))}
              </div>
            </section>
            <section style={{ marginTop: '2rem' }}>
              <h2 className="movie-section-title">Aclamados pela Crítica</h2>
              <div className="movie-grid">
                {criticallyAcclaimed.map(movie => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => handleCardClick(movie)} isSelected={isSelected(movie)} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <section>
            <h2 className="movie-section-title">Resultados da Busca</h2>
            <div className="movie-grid">
              {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={() => handleCardClick(movie)} isSelected={isSelected(movie)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default MoviePage;
