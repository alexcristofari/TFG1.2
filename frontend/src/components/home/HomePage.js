// frontend/src/components/home/HomePage.js (v2.0 - "Modo Editorial")
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';

// --- ESTILOS GLOBAIS E FONTES ---
// Importa a fonte "Playfair Display" do Google Fonts.
// Define variáveis de cor para manter a consistência.
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap' );
  :root {
    --brand-black: #0D0D0D;
    --brand-white: #F5F5F5;
    --brand-games: #66c0f4;  // Azul Steam
    --brand-music: #1DB954;  // Verde Spotify
    --brand-movies: #E50914; // Vermelho Netflix
  }
`;

// --- COMPONENTES ESTILIZADOS (styled-components) ---

// O container principal que ocupa a tela inteira.
const HomeContainer = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--brand-black);
  overflow: hidden;
  position: relative;
`;

// O container para as imagens de fundo.
const BackgroundImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

// Cada imagem de fundo. Note o filtro de brilho e o desfoque para criar um efeito sutil.
const BackgroundImage = styled(motion.div)`
  position: absolute;
  top: -5%; left: -5%;
  width: 110%; height: 110%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  filter: brightness(0.4) blur(3px);
`;

// O menu central com as opções.
const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

// Cada item do menu. É aqui que a mágica da tipografia acontece.
const MenuItem = styled(motion.h1)`
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 10vw, 8rem); // Fonte responsiva
  color: var(--brand-white);
  margin: 0.2em 0;
  cursor: pointer;
  transition: color 0.4s ease;

  // Quando o mouse está sobre o item, ele ganha a cor da sua "marca".
  &:hover {
    color: ${props => `var(--brand-${props.system})`};
  }
`;

// --- O COMPONENTE PRINCIPAL ---

function HomePage({ onSelectSystem }) {
  // Estado para controlar qual item está com o mouse em cima.
  const [hoveredSystem, setHoveredSystem] = useState(null);

  // Mapeamento dos sistemas para suas imagens de fundo.
  const backgrounds = {
    games: 'https://images.alphacoders.com/133/1332327.jpeg', // Cyberpunk 2077
    music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1740', // Fones de ouvido
    movies: 'https://images.alphacoders.com/132/1328707.png', // Oppenheimer
  };

  // Variantes para a animação de fade-in/out das imagens.
  const imageVariants = {
    hidden: { opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        {/* Container para as imagens de fundo */}
        <BackgroundImageContainer>
          <AnimatePresence>
            {hoveredSystem && (
              <BackgroundImage
                key={hoveredSystem}
                src={backgrounds[hoveredSystem]}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
             )}
          </AnimatePresence>
        </BackgroundImageContainer>

        {/* Menu de opções no centro */}
        <MenuContainer>
          <MenuItem
            system="games"
            onMouseEnter={() => setHoveredSystem('games')}
            onMouseLeave={() => setHoveredSystem(null)}
            onClick={() => onSelectSystem('games')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Jogos
          </MenuItem>
          <MenuItem
            system="music"
            onMouseEnter={() => setHoveredSystem('music')}
            onMouseLeave={() => setHoveredSystem(null)}
            onClick={() => onSelectSystem('music')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Músicas
          </MenuItem>
          <MenuItem
            system="movies"
            onMouseEnter={() => setHoveredSystem('movies')}
            onMouseLeave={() => setHoveredSystem(null)}
            onClick={() => onSelectSystem('movies')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Filmes
          </MenuItem>
        </MenuContainer>
      </HomeContainer>
    </>
  );
}

export default HomePage;
