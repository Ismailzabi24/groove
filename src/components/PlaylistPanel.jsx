import React from 'react';
import { FaPlay, FaTimes } from 'react-icons/fa';
import '../styles/PlaylistPanel.css';

const PlaylistPanel = ({ 
  isOpen, 
  onClose, 
  songs, 
  currentSong, 
  onPlaySong,
  isPlaying 
}) => {
  return (
    <div className={`playlist-panel ${isOpen ? 'open' : ''}`}>
      <div className="playlist-header">
        <h2>Playlist</h2>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="playlist-songs">
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className={`playlist-item ${currentSong?.id === song.id ? 'active' : ''}`}
            onClick={() => onPlaySong(song)}
          >
            <div className="song-number">{index + 1}</div>
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <button className="play-button">
              {currentSong?.id === song.id && isPlaying ? <FaPlay /> : null}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPanel; 