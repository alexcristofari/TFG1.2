// frontend/src/components/movies/MovieCard.js (v4.0 - Minimal Clean Design)
import React from 'react';
import { motion } from 'framer-motion';

const CardStyles = () => (
  <style>{`
    .movie-card-minimal {
      background-color: rgba(255, 255, 255, 0.03);
      border: 2px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .movie-card-minimal:hover {
      transform: translateY(-4px);
      border-color: rgba(229, 9, 20, 0.3);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }

    .movie-card-minimal.selected {
      border-color: #E50914;
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.4);
      transform: translateY(-4px);
    }

    .movie-card-minimal.selected::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: #E50914;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1rem;
      z-index: 2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .movie-card-poster {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      background-color: #1a1a1a;
      display: block;
    }

    .movie-card-info {
      padding: 1rem;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .movie-card-title {
      font-size: 0.95rem;
      font-weight: 500;
      color: #f5f5f5;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
    }
  `}</style>
);

function MovieCard({ movie, onClick, isSelected }) {
  return (
    <>
      <CardStyles />
      <motion.div
        className={`movie-card-minimal ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={movie.poster_url || ''} 
          alt={movie.title} 
          className="movie-card-poster"
        />
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
        </div>
      </motion.div>
    </>
  );
}

export default MovieCard;