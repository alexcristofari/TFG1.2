// frontend/src/App.js (v6.0 - Integração com Design Minimalista)
import React, { useState } from 'react';
import './App.css';

// Importa os componentes de página
import HomePage from './components/home/HomePage';
import GamesPage from './components/games/GamesPage';
import MusicPage from './components/music/MusicPage';
import MoviePage from './components/movies/MoviePage';

// Importa o DataProvider e o hook useData
import { DataProvider, useData } from './context/DataContext';

// Componente interno para ter acesso ao contexto
function AppContent() {
  const [activeSystem, setActiveSystem] = useState('home');
  
  // Pega o estado de loading e o status do Contexto Global
  const { isLoading, loadingStatus } = useData();

  // Estilos do botão de voltar (PRETO MINIMALISTA)
  const backButtonStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    backdropFilter: 'blur(5px)',
    color: '#e0e0e0',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '50px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(60, 60, 60, 0.9)';
    e.currentTarget.style.color = '#ffffff';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.85)';
    e.currentTarget.style.color = '#e0e0e0';
  };

  const renderBackButton = () => (
    <button
      onClick={() => setActiveSystem('home')}
      style={backButtonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      data-testid="back-button"
    >
      ‹ Voltar para Home
    </button>
  );

  // Se não estiver na home e os dados estiverem carregando, mostra tela de loading
  if (isLoading && activeSystem !== 'home') {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#121a25', color: '#c7d5e0', flexDirection: 'column'
      }}>
        <h1 style={{ color: '#66c0f4', fontWeight: 300, fontSize: '2.5rem' }}>Recomendador Multimídia</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '-1rem' }}>{loadingStatus}</p>
      </div>
    );
  }

  // Renderiza o sistema ativo
  const renderActiveSystem = () => {
    switch (activeSystem) {
      case 'games':
        return (
          <>
            {renderBackButton()}
            <GamesPage />
          </>
        );
      case 'music':
        return (
          <>
            {renderBackButton()}
            <MusicPage />
          </>
        );
      case 'movies':
        return (
          <>
            {renderBackButton()}
            <MoviePage />
          </>
        );
      case 'home':
      default:
        return <HomePage onSelectSystem={setActiveSystem} />;
    }
  };

  return (
    <div className="App">
      <main>
        {renderActiveSystem()}
      </main>
    </div>
  );
}

// Componente App principal envolve o AppContent com o Provider
function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;