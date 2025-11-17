// frontend/src/components/music/MusicPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MusicCard from './MusicCard';
import MusicSelector from './MusicSelector';
// import MusicResultsPage from './MusicResultsPage'; // Importaremos depois

const PageStyles = () => (
  <style>{`
    .music-page-container {
      padding: 2rem;
      background-color: #121212;
      color: white;
      min-height: 100vh;
    }
    .music-page-header { text-align: center; margin-bottom: 2rem; }
    .music-page-title { font-size: 2.5rem; color: #1DB954; }
    .music-section-title { font-size: 1.8rem; border-bottom: 1px solid #282828; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    .music-loading { text-align: center; font-size: 1.5rem; color: #b3b3b3; padding-top: 5rem; }
    .music-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
  `}</style>
);

function MusicPage() {
  const [iconicTracks, setIconicTracks] = useState([]);
  const [exploreTracks, setExploreTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Efeito para buscar os dados de descoberta (discover)
  useEffect(() => {
    axios.get('/api/music/discover')
      .then(response => {
        // Precisamos buscar os detalhes (imagens) separadamente
        fetchTrackDetails(response.data.iconic_tracks, setIconicTracks);
        fetchTrackDetails(response.data.explore_tracks, setExploreTracks);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de descoberta de músicas!", error);
        setIsLoading(false);
      });
  }, []);

  // Efeito para buscar resultados de pesquisa
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      axios.get(`/api/music/search?q=${searchQuery}`)
        .then(response => {
          fetchTrackDetails(response.data, setSearchResults);
        })
        .catch(error => console.error("Erro ao buscar músicas!", error));
    }, 300); // Debounce para não fazer requisições a cada letra digitada
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Função para buscar imagens e URLs de prévia
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
    setSelectedTracks(prev =>
      prev.find(t => t.id === track.id)
        ? prev.filter(t => t.id !== track.id)
        : [...prev, track]
    );
  };

  const handleGetRecommendations = () => {
    // Lógica para gerar recomendações virá aqui
    alert("Gerando recomendações para: " + selectedTracks.map(t => t.name).join(', '));
  };

  const isSelected = (track) => !!selectedTracks.find(t => t.id === track.id);
  const showDiscoverSections = searchQuery.length < 3;

  if (isLoading) {
    return <div className="music-loading">Carregando músicas...</div>;
  }

  return (
    <>
      <PageStyles />
      <div className="music-page-container">
        <header className="music-page-header">
          <h1 className="music-page-title">Recomendador de Músicas</h1>
          <p>Escolha 3 ou mais músicas que você gosta.</p>
        </header>

        <MusicSelector
          selectedTracks={selectedTracks}
          onSearchChange={setSearchQuery}
          onRecommend={handleGetRecommendations}
        />

        {showDiscoverSections ? (
          <>
            <section>
              <h2 className="music-section-title">Ícones Globais</h2>
              <div className="music-grid">
                {iconicTracks.map(track => (
                  <MusicCard key={track.id} track={track} onClick={() => handleCardClick(track)} isSelected={isSelected(track)} />
                ))}
              </div>
            </section>
            <section style={{ marginTop: '2rem' }}>
              <h2 className="music-section-title">Para Explorar</h2>
              <div className="music-grid">
                {exploreTracks.map(track => (
                  <MusicCard key={track.id} track={track} onClick={() => handleCardClick(track)} isSelected={isSelected(track)} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <section>
            <h2 className="music-section-title">Resultados da Busca</h2>
            <div className="music-grid">
              {searchResults.map(track => (
                <MusicCard key={track.id} track={track} onClick={() => handleCardClick(track)} isSelected={isSelected(track)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default MusicPage;
