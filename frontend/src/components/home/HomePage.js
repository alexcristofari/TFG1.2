// frontend/src/components/home/HomePage.js (v3.1 - Callbacks para modais)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';

// --- ESTILOS GLOBAIS E FONTES ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  :root {
    --brand-black: #0a0a0a;
    --brand-white: #f5f5f5;
    --brand-games: #2a475e;     // Azul Steam escuro
    --brand-music: #0d7a3f;     // Verde Spotify escuro
    --brand-movies: #8b0000;    // Vermelho Netflix escuro
    --text-secondary: #a0a0a0;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

// --- COMPONENTES ESTILIZADOS ---

const HomeContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: var(--brand-black);
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Menu superior direito
const TopNav = styled.nav`
  position: fixed;
  top: 40px;
  right: 60px;
  z-index: 100;
  display: flex;
  gap: 40px;
`;

const NavLink = styled.a`
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
  letter-spacing: 0.5px;
  
  &:hover {
    color: var(--brand-white);
  }
`;

// Container central
const CentralContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// Título principal com animação
const MainTitle = styled(motion.h1)`
  font-family: 'Inter', sans-serif;
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 700;
  color: var(--brand-white);
  cursor: pointer;
  user-select: none;
  transition: color 0.6s ease;
  letter-spacing: -0.02em;
  
  ${props => props.active && `
    color: ${props.activeColor};
  `}
`;

// Subtítulo "discover"
const Subtitle = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 300;
  color: var(--text-secondary);
  margin-top: 20px;
  letter-spacing: 2px;
  text-transform: lowercase;
`;

// Indicador de scroll
const ScrollIndicator = styled(motion.div)`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 1px;
  z-index: 10;
`;

const ScrollText = styled.span`
  text-transform: lowercase;
`;

const ScrollIcon = styled(motion.div)`
  width: 1px;
  height: 30px;
  background: var(--text-secondary);
`;

// Counter (1/3)
const Counter = styled.div`
  position: fixed;
  bottom: 40px;
  right: 60px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--text-secondary);
  z-index: 10;
  letter-spacing: 1px;
`;

// --- COMPONENTE PRINCIPAL ---

function HomePage({ onSelectSystem, onOpenAbout, onOpenContact }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollTimeout = useRef(null);

  // Sistema: Músicas → Filmes → Jogos (índices 0, 1, 2)
  const systems = [
    { name: 'Músicas', key: 'music', color: 'var(--brand-music)' },
    { name: 'Filmes', key: 'movies', color: 'var(--brand-movies)' },
    { name: 'Jogos', key: 'games', color: 'var(--brand-games)' }
  ];

  // Handler de scroll com debounce
  const handleWheel = useCallback((e) => {
    if (isTransitioning) return;

    // Limpa timeout anterior
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      setIsTransitioning(true);
      
      if (e.deltaY > 0) {
        // Scroll para baixo: avança
        setCurrentIndex((prev) => (prev + 1) % 3);
      } else {
        // Scroll para cima: volta
        setCurrentIndex((prev) => (prev - 1 + 3) % 3);
      }

      // Reseta o estado de transição após 800ms
      setTimeout(() => setIsTransitioning(false), 800);
    }, 50);
  }, [isTransitioning]);

  // Adiciona listener de scroll
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleWheel]);

  // Handler de clique no título
  const handleTitleClick = () => {
    onSelectSystem(systems[currentIndex].key);
  };

  // Variantes de animação
  const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const currentSystem = systems[currentIndex];

  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        {/* Menu Superior Direito */}
        <TopNav>
          <NavLink onClick={onOpenAbout} data-testid="nav-link-similaridade">
            similaridade
          </NavLink>
          <NavLink onClick={onOpenContact} data-testid="nav-link-contato">
            contato
          </NavLink>
        </TopNav>

        {/* Conteúdo Central */}
        <CentralContent>
          <AnimatePresence mode="wait">
            <MainTitle
              key={currentIndex}
              variants={titleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
              onClick={handleTitleClick}
              active={true}
              activeColor={currentSystem.color}
              data-testid="main-title"
            >
              {currentSystem.name}
            </MainTitle>
          </AnimatePresence>
          
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            data-testid="subtitle"
          >
            explore
          </Subtitle>
        </CentralContent>

        {/* Indicador de Scroll */}
        <ScrollIndicator>
          <ScrollText>scroll</ScrollText>
          <ScrollIcon
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </ScrollIndicator>

        {/* Counter */}
        <Counter data-testid="counter">
          {currentIndex + 1} / {systems.length}
        </Counter>
      </HomeContainer>
    </>
  );
}

export default HomePage;