// frontend/src/components/games/GamesPage.js (v3.5 - Correção Final do Erro de Constante)
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Marquee from "react-fast-marquee";

import { useData } from '../../context/DataContext'; 

import GameCard from './GameCard';
import GameSelector from './GameSelector';
import ResultsPage from './ResultsPage';

// --- COMPONENTES DE UI ---

const PageStyles = () => (
  <style>{`
    .games-page-container { padding: 2rem 0; background-color: var(--steam-darker-blue); color: var(--steam-font-color); min-height: 100vh; overflow-x: hidden; }
    .games-page-content { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
    .games-page-header { text-align: center; margin-bottom: 1rem; }
    .games-page-title { font-size: 2.8rem; color: var(--steam-light-blue); font-weight: 300; letter-spacing: 1px; }
    .games-page-subtitle { font-size: 1.1rem; color: var(--steam-font-color); font-weight: 400; margin-top: -0.5rem; }
    .games-section-title { font-size: 1.8rem; border-bottom: 1px solid var(--steam-medium-blue); padding-bottom: 0.5rem; margin: 3rem 0 1.5rem 0; font-weight: 400; }
    .games-loading { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background-color: var(--steam-darker-blue); z-index: 100; flex-direction: column; gap: 1rem; }
    .games-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .game-search-area { position: relative; margin-bottom: 3rem; }
    .game-search-input { width: 100%; background-color: rgba(0,0,0,0.2); border: 1px solid #000; color: var(--steam-font-color); padding: 1.2rem 1.2rem 1.2rem 3.5rem; font-size: 1.1rem; border-radius: 4px; box-sizing: border-box; transition: all 0.2s; }
    .game-search-input:focus { box-shadow: 0 0 10px rgba(102, 192, 244, 0.5); border-color: var(--steam-light-blue); }
    .game-search-icon { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); width: 1.5rem; height: 1.5rem; fill: var(--steam-light-blue); }
    .marquee-container { margin: 2rem 0; }
    .marquee-card { margin: 0 0.75rem; width: 300px; }
  `}</style>
);

const LoadingScreen = ({ text }) => (
  <motion.div className="games-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <h1 style={{ color: 'var(--steam-light-blue)', fontWeight: 300 }}>{text}</h1>
  </motion.div>
);

const GameCarousel = ({ games, speed = 50, direction = "left", onClick, isSelected }) => (
  <div className="marquee-container">
    <Marquee speed={speed} direction={direction} gradient={false} pauseOnHover={true}>
      {games.map(game => (
        <div key={`${game.appid}-${direction}`} className="marquee-card">
          <GameCard 
            game={game} 
            onClick={() => onClick(game)}
            isSelected={isSelected(game)} 
          />
        </div>
      ))}
    </Marquee>
  </div>
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

  const debouncedSearch = useMemo(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        axios.get(`/api/games/search?q=${query}`)
          .then(response => setSearchResults(response.data || []))
          .catch(error => console.error("Erro ao buscar jogos!", error));
      }, 300);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) setSearchResults([]);
    else debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleCardClick = (game) => {
    setSelectedGames(prev =>
      prev.find(g => g.appid === game.appid)
        ? prev.filter(g => g.appid !== game.appid)
        : [...prev, game]
    );
  };

  const handleGetRecommendations = () => {
    setIsRecommendLoading(true);
    const selectedIds = selectedGames.map(g => g.appid);
    
    axios.post('/api/games/recommend', { game_ids: selectedIds, genre: selectedGenre })
      .then(response => {
        const data = response.data;
        console.log("Resposta recebida do backend:", data);

        if (data && data.recommendations && data.profile) {
          setRecommendationResults(data);
          setView('results');
          setIsRecommendLoading(false); 
        } else {
          console.error("Estrutura de dados da recomendação é inválida:", data);
          alert("Ocorreu um erro inesperado ao processar as recomendações.");
          setIsRecommendLoading(false);
          setView('discover');
        }
      })
      .catch(error => {
        console.error("Erro ao buscar recomendações de jogos:", error);
        alert("Ocorreu um erro ao gerar as recomendações. Verifique o console do servidor Flask.");
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
  };

  const isSelected = (game) => !!selectedGames.find(g => g.appid === game.appid);
  const showDiscoverSections = searchQuery.length < 3;

  if (isGlobalLoading) return <LoadingScreen text={loadingStatus} />;
  if (isRecommendLoading) return <LoadingScreen text="Gerando recomendações..." />;
  
  if (view === 'results') return <ResultsPage recommendations={recommendationResults.recommendations} profile={recommendationResults.profile} onBack={handleReset} />;

  return (
    <>
      <PageStyles />
      <div className="games-page-container">
        <div className="games-page-content">
          <header className="games-page-header">
            <motion.h1 className="games-page-title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>Recomendador de Jogos</motion.h1>
            <motion.p className="games-page-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>Uma experiência de descoberta personalizada, inspirada na Steam.</motion.p>
          </header>

          <GameSelector
            selectedGames={selectedGames}
            onRecommend={handleGetRecommendations}
            genres={gamesData.genres}
            onGenreChange={setSelectedGenre}
          />

          <div className="game-search-area">
            <svg className="game-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
            <input type="text" className="game-search-input" placeholder="Busque por um jogo para adicionar ao seu perfil..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showDiscoverSections ? (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section>
                <div className="games-page-content"><h2 className="games-section-title">Jogos Icônicos</h2></div>
                <GameCarousel games={gamesData.iconic} speed={40} onClick={handleCardClick} isSelected={isSelected} />
              </section>
              <section>
                <div className="games-page-content"><h2 className="games-section-title">Para Explorar</h2></div>
                <GameCarousel games={gamesData.explore} speed={50} direction="right" onClick={handleCardClick} isSelected={isSelected} />
              </section>
            </motion.div>
          ) : (
            <motion.div key="search" className="games-page-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section>
                <h2 className="games-section-title">Resultados da Busca</h2>
                <div className="games-grid">
                  {searchResults.map(game => <GameCard key={game.appid} game={game} onClick={() => handleCardClick(game)} isSelected={isSelected(game)} />)}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default GamesPage;
