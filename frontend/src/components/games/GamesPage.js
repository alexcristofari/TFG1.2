// frontend/src/components/games/GamesPage.js (v4.0 - Minimal Clean Design)
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import GameCard from './GameCard';
import GameSelector from './GameSelector';
import ResultsPage from './ResultsPage';

const PageStyles = () => (
  <style>{`
    .games-minimal-container {
      min-height: 100vh;
      background-color: #0a0a0a;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .games-minimal-content {
      max-width: 1200px;
      width: 100%;
    }

    .games-minimal-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .games-minimal-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #2a475e;
      letter-spacing: 0;
      margin-bottom: 1rem;
      line-height: 1;
    }

    .games-minimal-subtitle {
      font-size: 0.95rem;
      font-weight: 300;
      color: #a0a0a0;
      letter-spacing: 1.5px;
      margin-top: 0.5rem;
    }

    .games-search-wrapper {
      margin: 3rem auto;
      display: flex;
      justify-content: center;
      max-width: 1000px;
    }

    .games-search-box {
      position: relative;
      width: 100%;
      max-width: 1000px;
    }

    .games-search-input {
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

    .games-search-input:focus {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: #2a475e;
      box-shadow: 0 0 0 3px rgba(42, 71, 94, 0.1);
    }

    .games-search-input::placeholder {
      color: #a0a0a0;
    }

    .games-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      fill: #a0a0a0;
    }

    .games-section {
      margin: 4rem auto;
      max-width: 1000px;
    }

    .games-section-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #a0a0a0;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .games-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .games-grid {
        grid-template-columns: 1fr;
      }
    }

    .games-loading-screen {
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

    .games-loading-text {
      color: #2a475e;
      font-weight: 300;
      font-size: 1.5rem;
      letter-spacing: 1px;
    }

    .games-pagination {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 3rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .games-page-btn {
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

    .games-page-btn:hover:not(:disabled) {
      background-color: rgba(42, 71, 94, 0.2);
      border-color: #2a475e;
      transform: translateY(-2px);
    }

    .games-page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .games-page-indicator {
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
    className="games-loading-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h1 className="games-loading-text">{text}</h1>
  </motion.div>
);

function GamesPage() {
  const { gamesData, isLoading: isGlobalLoading, loadingStatus } = useData();
  const [view, setView] = useState('discover');
  const [recommendationResults, setRecommendationResults] = useState(null);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const GAMES_PER_PAGE = 6;

  // Combina iconic e explore para ter ~40 jogos
  const allGames = useMemo(() => {
    const combined = [...gamesData.iconic, ...gamesData.explore];
    // Remove duplicatas por appid
    const unique = combined.filter(
      (game, index, self) => index === self.findIndex((g) => g.appid === game.appid)
    );
    return unique.slice(0, 40); // Limita a 40 jogos
  }, [gamesData]);

  const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE);
  const currentGames = allGames.slice(
    currentPage * GAMES_PER_PAGE,
    (currentPage + 1) * GAMES_PER_PAGE
  );

  const debouncedSearch = useMemo(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        axios
          .get(`/api/games/search?q=${query}`)
          .then((response) => setSearchResults(response.data || []))
          .catch((error) => console.error('Erro ao buscar jogos!', error));
      }, 300);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setCurrentPage(0);
    } else {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  const handleCardClick = (game) => {
    setSelectedGames((prev) =>
      prev.find((g) => g.appid === game.appid)
        ? prev.filter((g) => g.appid !== game.appid)
        : [...prev, game]
    );
  };

  const handleGetRecommendations = () => {
    setIsRecommendLoading(true);
    const selectedIds = selectedGames.map((g) => g.appid);

    axios
      .post('/api/games/recommend', { game_ids: selectedIds, genre: selectedGenre })
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
        console.error('Erro ao buscar recomendações de jogos:', error);
        alert('Ocorreu um erro ao gerar as recomendações.');
        setIsRecommendLoading(false);
        setView('discover');
      });
  };

  const handleReset = () => {
    setView('discover');
    setRecommendationResults(null);
    setSelectedGames([]);
    setSearchQuery('');
    setSelectedGenre('');
    setCurrentPage(0);
  };

  const isSelected = (game) => !!selectedGames.find((g) => g.appid === game.appid);
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

  if (isGlobalLoading) return <LoadingScreen text={loadingStatus} />;
  if (isRecommendLoading) return <LoadingScreen text="Gerando recomendações..." />;

  if (view === 'results')
    return (
      <ResultsPage
        recommendations={recommendationResults.recommendations}
        profile={recommendationResults.profile}
        onBack={handleReset}
      />
    );

  return (
    <>
      <PageStyles />
      <div className="games-minimal-container">
        <div className="games-minimal-content">
          <motion.header
            className="games-minimal-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="games-minimal-title">Jogos</h1>
            <p className="games-minimal-subtitle">descubra sua próxima aventura</p>
          </motion.header>

          <GameSelector
            selectedGames={selectedGames}
            onRecommend={handleGetRecommendations}
            genres={gamesData.genres}
            onGenreChange={setSelectedGenre}
          />

          <div className="games-search-wrapper">
            <div className="games-search-box">
              <svg className="games-search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                className="games-search-input"
                placeholder="buscar jogos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="games-search-input"
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
                <section className="games-section">
                  <h2 className="games-section-label">Explorar</h2>
                  <div className="games-grid">
                    {currentGames.map((game) => (
                      <GameCard
                        key={game.appid}
                        game={game}
                        onClick={() => handleCardClick(game)}
                        isSelected={isSelected(game)}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="games-pagination">
                      <button
                        className="games-page-btn"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        data-testid="prev-page-btn"
                      >
                        ← Anterior
                      </button>
                      <div className="games-page-indicator">
                        {currentPage + 1} / {totalPages}
                      </div>
                      <button
                        className="games-page-btn"
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
                <section className="games-section">
                  <h2 className="games-section-label">Resultados</h2>
                  <div className="games-grid">
                    {searchResults.map((game) => (
                      <GameCard
                        key={game.appid}
                        game={game}
                        onClick={() => handleCardClick(game)}
                        isSelected={isSelected(game)}
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

export default GamesPage;