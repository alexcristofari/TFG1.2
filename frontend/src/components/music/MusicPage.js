// frontend/src/components/music/MusicPage.js (v4.0 - Minimal Clean Design)
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import MusicCard from './MusicCard';
import MusicSelector from './MusicSelector';
import MusicResultsPage from './MusicResultsPage';

const PageStyles = () => (
  <style>{`
    .music-minimal-container {
      min-height: 100vh;
      background-color: #0a0a0a;
      color: #f5f5f5;
      padding: 4rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .music-minimal-content {
      max-width: 1200px;
      width: 100%;
    }

    .music-minimal-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .music-minimal-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: #0d7a3f;
      letter-spacing: 0;
      margin-bottom: 1rem;
      line-height: 1;
    }

    .music-minimal-subtitle {
      font-size: 0.95rem;
      font-weight: 300;
      color: #a0a0a0;
      letter-spacing: 1.5px;
      margin-top: 0.5rem;
    }

    .music-search-wrapper {
      margin: 3rem auto;
      display: flex;
      justify-content: center;
      max-width: 1000px;
    }

    .music-search-box {
      position: relative;
      width: 100%;
      max-width: 1000px;
    }

    .music-search-input {
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

    .music-search-input:focus {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: #0d7a3f;
      box-shadow: 0 0 0 3px rgba(13, 122, 63, 0.1);
      outline: none;
    }

    .music-search-input::placeholder {
      color: #a0a0a0;
    }

    .music-search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      fill: #a0a0a0;
    }

    .music-section {
      margin: 4rem auto;
      max-width: 1000px;
    }

    .music-section-label {
      font-size: 0.8rem;
      font-weight: 500;
      color: #a0a0a0;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .music-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .music-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .music-grid {
        grid-template-columns: 1fr;
      }
    }

    .music-loading-screen {
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

    .music-loading-text {
      color: #0d7a3f;
      font-weight: 300;
      font-size: 1.5rem;
      letter-spacing: 1px;
    }

    .music-pagination {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 3rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .music-page-btn {
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

    .music-page-btn:hover:not(:disabled) {
      background-color: rgba(13, 122, 63, 0.2);
      border-color: #0d7a3f;
      transform: translateY(-2px);
    }

    .music-page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .music-page-indicator {
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
    className="music-loading-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h1 className="music-loading-text">{text}</h1>
  </motion.div>
);

function MusicPage() {
  const [view, setView] = useState('discover');
  const [recommendationResults, setRecommendationResults] = useState(null);
  const [isRecommendLoading, setIsRecommendLoading] = useState(false);
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(true);
  const [iconicTracks, setIconicTracks] = useState([]);
  const [exploreTracks, setExploreTracks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const TRACKS_PER_PAGE = 6;

  // Combina iconic e explore para ter ~30-40 músicas
  const allTracks = useMemo(() => {
    const combined = [...iconicTracks, ...exploreTracks];
    // Remove duplicatas por id
    const unique = combined.filter(
      (track, index, self) => index === self.findIndex((t) => t.id === track.id)
    );
    return unique.slice(0, 40); // Limita a 40 músicas
  }, [iconicTracks, exploreTracks]);

  const totalPages = Math.ceil(allTracks.length / TRACKS_PER_PAGE);
  const currentTracks = allTracks.slice(
    currentPage * TRACKS_PER_PAGE,
    (currentPage + 1) * TRACKS_PER_PAGE
  );

  useEffect(() => {
    // Busca dados de descoberta e gêneros
    Promise.all([
      axios.get('/api/music/discover'),
      axios.get('/api/music/genres')
    ]).then(([discoverRes, genresRes]) => {
      fetchTrackDetails(discoverRes.data.iconic, setIconicTracks);  // ← CORRIGIDO
      fetchTrackDetails(discoverRes.data.explore, setExploreTracks);  // ← CORRIGIDO
      setGenres(genresRes.data || []);
      setIsDiscoverLoading(false);
    }).catch(error => {
      console.error('Erro ao buscar dados iniciais de músicas!', error);
      setIsDiscoverLoading(false);
    });
  }, []);

  const debouncedSearch = useMemo(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        axios
          .get(`/api/music/search?q=${query}`)
          .then((response) => fetchTrackDetails(response.data || [], setSearchResults))
          .catch((error) => console.error('Erro ao buscar músicas!', error));
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

  const fetchTrackDetails = (tracks, setter) => {
    if (!tracks || tracks.length === 0) {
      setter([]);
      return;
    }
    const trackIds = tracks.map(t => t.id);
    axios.post('/api/music/get-track-details', { track_ids: trackIds })
      .then(detailsRes => {
        const enrichedTracks = tracks.map(track => ({
          ...track,
          image_url: detailsRes.data[track.id]?.image_url,
          preview_url: detailsRes.data[track.id]?.preview_url,
        }));
        setter(enrichedTracks);
      });
  };

  const handleCardClick = (track) => {
    setSelectedTracks((prev) =>
      prev.find((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track]
    );
  };

  const handleGetRecommendations = () => {
    setIsRecommendLoading(true);
    const selectedIds = selectedTracks.map((t) => t.id);

    axios
      .post('/api/music/recommend', { track_ids: selectedIds, genre: selectedGenre })
      .then((response) => {
        const allRecs = Object.values(response.data.recommendations).flat();
        const trackIds = allRecs.map(t => t.id);
        
        axios.post('/api/music/get-track-details', { track_ids: trackIds })
          .then(detailsRes => {
            const enrichedRecs = { ...response.data.recommendations };
            Object.keys(enrichedRecs).forEach(category => {
              enrichedRecs[category] = enrichedRecs[category].map(track => ({
                ...track,
                image_url: detailsRes.data[track.id]?.image_url,
              }));
            });
            setRecommendationResults({ ...response.data, recommendations: enrichedRecs });
            setView('results');
            setIsRecommendLoading(false);
          });
      })
      .catch((error) => {
        console.error('Erro ao buscar recomendações de músicas:', error);
        alert('Ocorreu um erro ao gerar as recomendações.');
        setIsRecommendLoading(false);
        setView('discover');
      });
  };

  const handleReset = () => {
    setView('discover');
    setRecommendationResults(null);
    setSelectedTracks([]);
    setSearchQuery('');
    setSelectedGenre('');
    setCurrentPage(0);
  };

  const isSelected = (track) => !!selectedTracks.find((t) => t.id === track.id);
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

  if (isDiscoverLoading) return <LoadingScreen text="Carregando músicas..." />;
  if (isRecommendLoading) return <LoadingScreen text="Gerando recomendações..." />;

  if (view === 'results')
    return (
      <MusicResultsPage
        recommendations={recommendationResults.recommendations}
        profile={recommendationResults.profile}
        onBack={handleReset}
      />
    );

  return (
    <>
      <PageStyles />
      <div className="music-minimal-container">
        <div className="music-minimal-content">
          <motion.header
            className="music-minimal-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="music-minimal-title">Músicas</h1>
          </motion.header>

          <MusicSelector
            selectedTracks={selectedTracks}
            onRecommend={handleGetRecommendations}
            genres={genres}
            onGenreChange={setSelectedGenre}
          />

          <div className="music-search-wrapper">
            <div className="music-search-box">
              <svg className="music-search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="text"
                className="music-search-input"
                placeholder="buscar músicas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="music-search-input"
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
                <section className="music-section">
                  <h2 className="music-section-label">EXPLORAR</h2>
                  <div className="music-grid">
                    {currentTracks.map((track) => (
                      <MusicCard
                        key={track.id}
                        track={track}
                        onClick={() => handleCardClick(track)}
                        isSelected={isSelected(track)}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="music-pagination">
                      <button
                        className="music-page-btn"
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        data-testid="prev-page-btn"
                      >
                        ← Anterior
                      </button>
                      <div className="music-page-indicator">
                        {currentPage + 1} / {totalPages}
                      </div>
                      <button
                        className="music-page-btn"
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
                <section className="music-section">
                  <h2 className="music-section-label">RESULTADOS</h2>
                  <div className="music-grid">
                    {searchResults.map((track) => (
                      <MusicCard
                        key={track.id}
                        track={track}
                        onClick={() => handleCardClick(track)}
                        isSelected={isSelected(track)}
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

export default MusicPage;