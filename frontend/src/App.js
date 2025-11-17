// frontend/src/App.js (v5.5 - Integração com Estado Global)
import React, { useState } from 'react';
import './App.css';

// Importa os componentes de página
import HomePage from './components/home/HomePage';
import GamesPage from './components/games/GamesPage';
import MusicPage from './components/music/MusicPage';
import MoviePage from './components/movies/MoviePage';

// --- PASSO 1: Importa o DataProvider e o hook useData ---
import { DataProvider, useData } from './context/DataContext';

// --- PASSO 2: Cria um componente interno para ter acesso ao contexto ---
// O AppContent é o seu App antigo, mas agora ele pode "ler" os dados globais
function AppContent() {
  const [activeSystem, setActiveSystem] = useState('home');
  
  // Pega o estado de loading e o status do nosso Contexto Global
  const { isLoading, loadingStatus } = useData();

  // Estilos e funções do botão (seu código original, intacto)
  const backButtonStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: 'rgba(42, 71, 94, 0.8)',
    backdropFilter: 'blur(5px)',
    color: '#c7d5e0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s, color 0.2s'
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(102, 192, 244, 0.8)';
    e.currentTarget.style.color = '#fff';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(42, 71, 94, 0.8)';
    e.currentTarget.style.color = '#c7d5e0';
  };

  const renderBackButton = () => (
    <button
      onClick={() => setActiveSystem('home')}
      style={backButtonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      ‹ Voltar para Home
    </button>
  );

  // --- PASSO 3: Adiciona a tela de loading global ---
  // Se os dados globais estiverem carregando, mostra a tela de loading e nada mais.
  if (isLoading) {
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

  // Se não estiver carregando, renderiza o sistema normalmente
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

// --- PASSO 4: O componente App principal agora só envolve o AppContent com o Provider ---
// Isso garante que o AppContent e todos os seus filhos (HomePage, GamesPage, etc.)
// possam usar o hook `useData()` para acessar os dados globais.
function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
