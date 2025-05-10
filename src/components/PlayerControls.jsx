import React from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute,
  FaVolumeDown,
  FaRandom,
  FaRedo,
  FaHeart,
  FaRegHeart,
  FaList,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import '../styles/PlayerControls.css';

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlayerControls = ({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  volume, 
  onVolumeChange,
  isShuffle,
  onShuffle,
  isRepeat,
  onRepeat,
  isLiked,
  onLike,
  onShowPlaylist,
  currentTime,
  duration,
  onProgressChange,
  isMiniPlayer,
  onToggleMiniPlayer
}) => {
  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeMute />;
    if (volume < 50) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  return (
    <div className={`player-container ${isMiniPlayer ? 'mini' : ''}`}>
      <div className="now-playing">
        {currentSong && (
          <>
            <img src={currentSong.cover} alt={currentSong.title} style={{ width: '56px', height: '56px' }} />
            <div className="song-info">
              <div className="song-title">{currentSong.title}</div>
              <div className="artist-name">{currentSong.artist}</div>
            </div>
            <button className="like-button" onClick={onLike}>
              {isLiked ? <FaHeart className="liked" /> : <FaRegHeart />}
            </button>
          </>
        )}
      </div>

      <div className="player-center">
        <div className="controls">
          <button 
            className={`control-button ${isShuffle ? 'active' : ''}`} 
            onClick={onShuffle}
          >
            <FaRandom />
          </button>
          <button className="control-button" onClick={onPrevious}>
            <FaStepBackward />
          </button>
          <button className="control-button play-pause" onClick={onPlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="control-button" onClick={onNext}>
            <FaStepForward />
          </button>
          <button 
            className={`control-button ${isRepeat ? 'active' : ''}`} 
            onClick={onRepeat}
          >
            <FaRedo />
          </button>
        </div>
        <div className="progress-bar" onClick={onProgressChange}>
          <span className="time current">{formatTime(currentTime)}</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${duration && !isNaN(duration) && duration > 0
                  ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
                  : 0}%`
              }}
            >
              <div className="progress-thumb" />
            </div>
          </div>
          <span className="time total">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button className="playlist-button" onClick={onShowPlaylist}>
          <FaList />
        </button>
        <div className="volume-control">
          {getVolumeIcon()}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(e.target.value)}
          />
        </div>
        <button className="mini-player-toggle" onClick={onToggleMiniPlayer}>
          {isMiniPlayer ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
    </div>
  );
};

export default PlayerControls; 