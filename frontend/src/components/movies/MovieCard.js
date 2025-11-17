// frontend/src/components/movies/MovieCard.js (v1.2 - Código Limpo)
import React from 'react';

// A constante 'CardStyles' foi completamente removida deste arquivo.

function MovieCard({ movie, onClick, isSelected }) {
  const cardClassName = `movie-card-container ${isSelected ? 'selected' : ''}`;

  return (
    <div className={cardClassName} onClick={onClick}>
      <img src={movie.poster_url || ''} alt={movie.title} className="movie-card-image" />
      <div className="movie-card-info">
        <strong className="movie-card-title">{movie.title}</strong>
      </div>
    </div>
  );
}

export default MovieCard;
