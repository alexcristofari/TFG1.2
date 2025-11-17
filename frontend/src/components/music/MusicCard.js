// frontend/src/components/music/MusicCard.js
import React from 'react';

const CardStyles = () => (
  <style>{`
    .music-card-container {
      background-color: #181818;
      padding: 1rem;
      border-radius: 8px;
      transition: background-color 0.2s, transform 0.2s;
      cursor: pointer;
      position: relative;
      border: 2px solid transparent;
    }
    .music-card-container:hover {
      background-color: #282828;
      transform: scale(1.03);
    }
    .music-card-container.selected {
      border-color: #1DB954;
      transform: scale(1.03);
    }
    .music-card-img-wrapper {
      position: relative;
      margin-bottom: 1rem;
    }
    .music-card-img {
      width: 100%;
      padding-bottom: 100%;
      background-color: #282828;
      border-radius: 4px;
      background-size: cover;
      background-position: center;
    }
    .music-card-title {
      font-weight: 700;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.25rem;
      color: #fff;
    }
    .music-card-subtitle {
      font-size: 0.9rem;
      color: #b3b3b3;
    }
  `}</style>
);

function MusicCard({ track, onClick, isSelected }) {
  const cardClassName = `music-card-container ${isSelected ? 'selected' : ''}`;

  return (
    <>
      <CardStyles />
      <div className={cardClassName} onClick={onClick}>
        <div className="music-card-img-wrapper">
          <div className="music-card-img" style={{ backgroundImage: `url(${track.image_url})` }}></div>
        </div>
        <div className="card-content">
          <strong className="music-card-title">{track.name}</strong>
          <span className="music-card-subtitle">{track.artists}</span>
        </div>
      </div>
    </>
  );
}

export default MusicCard;
