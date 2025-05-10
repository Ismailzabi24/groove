import React from 'react';
import { FaHeart, FaPlay } from 'react-icons/fa';
import '../styles/LikedSongs.css';

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const LikedSongs = ({ songs, onPlaySong }) => {
  return (
    <div className="liked-songs-container">
      <div className="header">
        <FaHeart className="heart-icon" />
        <h1 className="title">Liked Songs</h1>
      </div>

      <div className="song-list">
        {songs.map((song, index) => (
          <div key={song.id} className="song-item" onClick={() => onPlaySong(song)}>
            <div className="song-number">{index + 1}</div>
            <button className="play-button">
              <FaPlay />
            </button>
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <div className="song-duration">{formatDuration(song.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedSongs; 