// frontend/src/components/movies/MoviePage.js (v4.0 - Minimal Clean Design)
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';
import MovieSelector from './MovieSelector';
import MovieResultsPage from './MovieResultsPage';

const PageStyles = () => (
  <style>{`
    .movies-minimal-container {
      min-height: 100vh;
      background-color: #0a0a0a;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .movies-minimal-content {
      max-width: 1200px;
      width: 100%;
    }

    .movies-minimal-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .movies-minimal-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #E50914;
      letter-spacing: 0;
      margin-bottom: 1rem;
      line-height: 1;
    }

    .movies-minimal-subtitle {
      font-size: 0.95rem;
      font-weight: 300;
      color: #a0a0a0;
      letter-spacing: 1.5px;
      margin-top: 0.5rem;
    }

    .movies-search-wrapper {
      margin: 3rem auto;
      display: flex;
      justify-content: center;
      max-width: 1000px;
    }

    .movies-search-box {
      position: relative;
      width: 100%;
      max-width: 1000px;
    }

    .movies-search-input {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f5f5f5;
      padding: 1rem 1rem 1rem 3rem;
      font-size: 0.95rem;
      border-radius: 50px;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
    }

    .movies-search-input:focus {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: #E50914;
      box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.1);
      outline: none;
    }

    .movies-search-input::placeholder {
      color: #a0a0a0;
    }

    .movies-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      fill: #a0a0a0;
    }

    .movies-section {
      margin: 4rem auto;
      max-width: 1000px;
    }

    .movies-section-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #a0a0a0;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .movies-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .movies-grid {
        grid-template-columns: 1fr;
      }
    }

    .movies-loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0a0a0a;
      z-index: 100;
      flex-direction: column;
      gap: 1rem;
    }

    .movies-loading-text {
      color: #E50914;
      font-weight: 300;
      font-size: 1.5rem;
      letter-spacing: 1px;
    }

    .movies-pagination {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 3rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .movies-page-btn {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f5f5f5;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      cursor: pointer;
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
    }

    .movies-page-btn:hover:not(:disabled) {
      background-color: rgba(229, 9, 20, 0.2);
      border-color: #E50914;
      transform: translateY(-2px);
    }

    .movies-page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .movies-page-indicator {
      display: flex;
      align-items: center;
      color: #a0a0a0;
      font-size: 0.9rem;
      padding: 0 1rem;
    }
  `}</style>
);

const LoadingScreen = ({ text }) => (
  <motion.div
    className="movies-loading-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h1 className="movies-loading-text">{text}</h1>
  </motion.div>
);

function MoviePage() {
  const [view, setView] = useState('discover');
  const [recommendationResults, setRecommendationResults] = useState(null);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(true);
  const [popularReleases, setPopularReleases] = useState([]);
  const [criticallyAcclaimed, setCriticallyAcclaimed] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const MOVIES_PER_PAGE = 6;

  // Combina popular e acclaimed para ter ~30-40 filmes
  const allMovies = useMemo(() => {
    const combined = [...popularReleases, ...criticallyAcclaimed];
    // Remove duplicatas por id
    const unique = combined.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );
    return unique.slice(0, 40); // Limita a 40 filmes
  }, [popularReleases, criticallyAcclaimed]);

  const totalPages = Math.ceil(allMovies.length / MOVIES_PER_PAGE);
  const currentMovies = allMovies.slice(
    currentPage * MOVIES_PER_PAGE,
    (currentPage + 1) * MOVIES_PER_PAGE
  );

  const debouncedSearch = useMemo(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        axios
          .get(`/api/movies/search?q=${query}`)
          .then((response) => setSearchResults(response.data || []))
          .catch((error) => console.error('Erro ao buscar filmes!', error));
      }, 300);
    };
  }, []);

  useEffect(() => {
    // Busca dados de descoberta e gêneros
    Promise.all([
      axios.get('/api/movies/discover'),
      axios.get('/api/movies/genres')
    ]).then(([discoverRes, genresRes]) => {
      setPopularReleases(discoverRes.data.popular_releases || []);
      setCriticallyAcclaimed(discoverRes.data.critically_acclaimed || []);
      setGenres(genresRes.data || []);
      setIsDiscoverLoading(false);
    }).catch(error => {
      console.error('Erro ao buscar dados iniciais de filmes!', error);
      setIsDiscoverLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setCurrentPage(0);
    } else {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  const handleCardClick = (movie) => {
    setSelectedMovies((prev) =>
      prev.find((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  const handleGetRecommendations = () => {
    setIsRecommendLoading(true);
    const selectedIds = selectedMovies.map((m) => m.id);

    axios
      .post('/api/movies/recommend', { movie_ids: selectedIds, genre: selectedGenre })
      .then((response) => {
        const data = response.data;
        if (data && data.recommendations && data.profile) {
          setRecommendationResults(data);
          setView('results');
          setIsRecommendLoading(false);
        } else {
          console.error('Estrutura de dados da recomendação é inválida:', data);
          alert('Ocorreu um erro inesperado ao processar as recomendações.');
          setIsRecommendLoading(false);
          setView('discover');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar recomendações de filmes:', error);
        alert('Ocorreu um erro ao gerar as recomendações.');
        setIsRecommendLoading(false);
        setView('discover');
      });
  };

  const handleReset = () => {
    setView('discover');
    setRecommendationResults(null);
    setSelectedMovies([]);
    setSearchQuery('');
    setSelectedGenre('');
    setCurrentPage(0);
  };

  const isSelected = (movie) => !!selectedMovies.find((m) => m.id === movie.id);
  const showDiscoverSections = searchQuery.length < 3;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isDiscoverLoading) return <LoadingScreen text="Carregando filmes..." />;
  if (isRecommendLoading) return <LoadingScreen text="Gerando recomendações..." />;

  if (view === 'results')
    return (
      <MovieResultsPage
        recommendations={recommendationResults.recommendations}
        profile={recommendationResults.profile}
        onBack={handleReset}
      />
    );

  return (
    <>
      <PageStyles />
      <div className="movies-minimal-container">
        <div className="movies-minimal-content">
          <motion.header
            className="movies-minimal-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="movies-minimal-title">Filmes</h1>
            <p className="movies-minimal-subtitle">descubra sua próxima sessão</p>
          </motion.header>

          <MovieSelector
            selectedMovies={selectedMovies}
            onRecommend={handleGetRecommendations}
            genres={genres}
            onGenreChange={setSelectedGenre}
          />

          <div className="movies-search-wrapper">
            <div className="movies-search-box">
              <svg className="movies-search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                className="movies-search-input"
                placeholder="buscar filmes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="movies-search-input"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showDiscoverSections ? (
              <motion.div
                key="discover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <section className="movies-section">
                  <h2 className="movies-section-label">Explorar</h2>
                  <div className="movies-grid">
                    {currentMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleCardClick(movie)}
                        isSelected={isSelected(movie)}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="movies-pagination">
                      <button
                        className="movies-page-btn"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        data-testid="prev-page-btn"
                      >
                        ← Anterior
                      </button>
                      <div className="movies-page-indicator">
                        {currentPage + 1} / {totalPages}
                      </div>
                      <button
                        className="movies-page-btn"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                        data-testid="next-page-btn"
                      >
                        Próximo →
                      </button>
                    </div>
                  )}
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <section className="movies-section">
                  <h2 className="movies-section-label">Resultados</h2>
                  <div className="movies-grid">
                    {searchResults.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => handleCardClick(movie)}
                        isSelected={isSelected(movie)}
                      />
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default MoviePage;
