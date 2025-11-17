// frontend/src/components/games/ResultsPage.js (v2.2 - Correção Final do Plural)
import React from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';

const PageStyles = () => (
  <style>{`
    /* ... (estilos existentes, sem mudanças) ... */
    .results-page-container { padding: 6rem 2rem 2rem; background-color: var(--steam-darker-blue); color: var(--steam-font-color); min-height: 100vh; }
    .results-header { text-align: center; margin-bottom: 4rem; }
    .results-title { font-size: 2.8rem; color: var(--steam-light-blue); font-weight: 300; }
    .profile-summary { background-color: rgba(0,0,0,0.2); padding: 1.5rem 2rem; border-radius: 8px; margin-bottom: 3rem; border: 1px solid var(--steam-medium-blue); }
    .profile-title { font-size: 1.5rem; margin-bottom: 1rem; color: var(--steam-font-bright); }
    .profile-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .profile-tag { background-color: var(--steam-medium-blue); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem; }
    .profile-tag.highlight { background-color: var(--steam-light-blue); color: var(--steam-darker-blue); font-weight: bold; }
    .category-title { font-size: 1.8rem; border-bottom: 1px solid var(--steam-medium-blue); padding-bottom: 0.5rem; margin: 3rem 0 1.5rem 0; font-weight: 400; }
    .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .back-button { display: block; margin: 4rem auto 0; background-color: var(--steam-light-blue); color: var(--steam-darker-blue); border: none; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
    .back-button:hover { transform: scale(1.05); box-shadow: 0 0 15px var(--steam-light-blue); }
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

function ResultsPage({ recommendations, profile, onBack }) {
  // --- AQUI ESTÁ A CORREÇÃO ---
  // Trocamos 'dominant_genres' (plural) para 'dominant_genre' (singular)
  const { main, hidden_gems, genre_favorites } = recommendations || {};
  const { games, dominant_genre, selected_genre } = profile || {};

  const renderCategory = (title, gamesList) => {
    if (!gamesList || gamesList.length === 0) return null;
    return (
      <motion.section variants={itemVariants}>
        <h2 className="category-title">{title}</h2>
        <div className="results-grid">
          {gamesList.map(game => (
            <GameCard key={game.appid} game={game} onClick={() => {}} isSelected={false} />
          ))}
        </div>
      </motion.section>
    );
  };

  return (
    <>
      <PageStyles />
      <motion.div
        className="results-page-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="results-header">
          <motion.h1 className="results-title" variants={itemVariants}>Suas Recomendações de Jogos</motion.h1>
        </header>

        {profile && (
          <motion.div className="profile-summary" variants={itemVariants}>
            <h3 className="profile-title">Seu Perfil de Jogos</h3>
            <div className="profile-tags">
              {games?.map(game => <span key={game.appid} className="profile-tag">{game.name}</span>)}
              {dominant_genre && <span className="profile-tag highlight">Gênero Principal: {dominant_genre}</span>}
              {selected_genre && <span className="profile-tag highlight">Explorando: {selected_genre}</span>}
            </div>
          </motion.div>
        )}

        {renderCategory("Recomendações Principais", main)}
        {renderCategory("Jóias Escondidas", hidden_gems)}
        {renderCategory(`Melhores de ${selected_genre}`, genre_favorites)}

        <motion.button className="back-button" onClick={onBack} variants={itemVariants}>
          Fazer Nova Recomendação
        </motion.button>
      </motion.div>
    </>
  );
}

export default ResultsPage;
