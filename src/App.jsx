import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import PlayerControls from './components/PlayerControls';
import PlaylistPanel from './components/PlaylistPanel';
import UserProfile from './components/UserProfile';
import Login from './pages/Login';
import Home from './pages/Home';
import LikedSongs from './pages/LikedSongs';
import CreateAlbum from './pages/CreateAlbum';
import Profile from './pages/Profile';
import AlbumDetails from './pages/AlbumDetails';
import { songs, albums } from './data/mockData';
import { loadAlbums, addAlbum, updateAlbum, deleteAlbum } from './utils/storage';
import './styles/global.css';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #121212;
  color: white;
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 90px;
`;

const App = () => {
  const [user, setUser] = useState(null);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [customAlbums, setCustomAlbums] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const audioRef = useRef(new Audio());
  const progressInterval = useRef(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Load custom albums and liked songs from local storage on mount
  useEffect(() => {
    const savedAlbums = loadAlbums();
    setCustomAlbums(savedAlbums);
    
    const savedLikedSongs = localStorage.getItem('liked_songs');
    if (savedLikedSongs) {
      setLikedSongs(JSON.parse(savedLikedSongs));
    }

    const savedRecentlyPlayed = localStorage.getItem('recently_played');
    if (savedRecentlyPlayed) {
      setRecentlyPlayed(JSON.parse(savedRecentlyPlayed));
    }
  }, []);

  // Save liked songs and recently played to local storage when they change
  useEffect(() => {
    localStorage.setItem('liked_songs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('recently_played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // Update isLiked state when current song changes
  useEffect(() => {
    setIsLiked(likedSongs.includes(currentSong.id));
  }, [currentSong, likedSongs]);

  // Helper to generate taste-based albums
  const generateTasteAlbums = (songs, likedSongs, recentlyPlayed) => {
    // Top artist album
    const artistCounts = {};
    likedSongs.forEach(songId => {
      const song = songs.find(s => s.id === songId);
      if (song) {
        artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
      }
    });
    const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topArtistSongs = songs.filter(s => s.artist === topArtist);
    // Recently played album
    const recentSongs = songs.filter(s => recentlyPlayed.includes(s.id));
    // Liked songs album
    const liked = songs.filter(s => likedSongs.includes(s.id));
    return [
      topArtist && topArtistSongs.length > 0 && {
        id: 'taste1',
        name: `Best of ${topArtist}`,
        cover: topArtistSongs[0]?.cover,
        songs: topArtistSongs.map(s => s.id),
        createdAt: new Date().toISOString()
      },
      liked.length > 0 && {
        id: 'taste2',
        name: 'Your Favorites',
        cover: liked[0]?.cover,
        songs: liked.map(s => s.id),
        createdAt: new Date().toISOString()
      },
      recentSongs.length > 0 && {
        id: 'taste3',
        name: 'Recently Played',
        cover: recentSongs[0]?.cover,
        songs: recentSongs.map(s => s.id),
        createdAt: new Date().toISOString()
      }
    ].filter(Boolean);
  };

  // Replace getSortedAlbums with dynamic albums
  const getDynamicAlbums = () => {
    const tasteAlbums = generateTasteAlbums(songs, likedSongs, recentlyPlayed);
    // Optionally merge with customAlbums
    return [...tasteAlbums, ...customAlbums];
  };

  useEffect(() => {
    if (currentSong) {
      audioRef.current.src = currentSong.audioUrl;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSong]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'KeyM':
          setVolume(volume === 0 ? 50 : 0);
          break;
        case 'KeyR':
          handleRepeat();
          break;
        case 'KeyS':
          handleShuffle();
          break;
        case 'KeyL':
          handleLike();
          break;
        case 'KeyP':
          setShowPlaylist(!showPlaylist);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, showPlaylist]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    let nextIndex;
    
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }
    
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleLike = () => {
    setLikedSongs(prev => {
      if (prev.includes(currentSong.id)) {
        return prev.filter(id => id !== currentSong.id);
      } else {
        return [...prev, currentSong.id];
      }
    });
  };

  const handleShowPlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMiniPlayer = () => {
    setIsMiniPlayer(!isMiniPlayer);
  };

  const handleCreateAlbum = (albumData) => {
    const newAlbum = {
      id: Date.now().toString(),
      name: albumData.name,
      songs: albumData.songs,
      cover: albumData.songs[0]?.cover || 'default-album-cover.jpg',
      createdAt: new Date().toISOString(),
      totalDuration: albumData.songs.reduce((total, song) => total + song.duration, 0),
      playCount: 0
    };
    const updatedAlbums = addAlbum(newAlbum);
    setCustomAlbums(updatedAlbums);
  };

  const handleUpdateAlbum = (updatedAlbum) => {
    const updatedAlbums = updateAlbum(updatedAlbum);
    setCustomAlbums(updatedAlbums);
  };

  const handleDeleteAlbum = (albumId) => {
    const updatedAlbums = deleteAlbum(albumId);
    setCustomAlbums(updatedAlbums);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <div className="header">
            <SearchBar />
            <UserProfile user={user} onLogout={handleLogout} />
      </div>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  onPlaySong={handlePlaySong} 
                  customAlbums={getDynamicAlbums()}
                  onUpdateAlbum={handleUpdateAlbum}
                  onDeleteAlbum={handleDeleteAlbum}
                  sortOption={sortOption}
                  onSortChange={handleSortChange}
                  songs={songs}
                  likedSongs={likedSongs}
                  recentlyPlayed={recentlyPlayed}
                />
              } 
            />
            <Route 
              path="/album/:albumId" 
              element={<AlbumDetails albums={getDynamicAlbums()} onPlaySong={handlePlaySong} />} 
            />
            <Route 
              path="/liked" 
              element={
                <LikedSongs 
                  songs={songs.filter(song => likedSongs.includes(song.id))}
                  onPlaySong={handlePlaySong}
                />
              } 
            />
            <Route 
              path="/create-album" 
              element={
                <CreateAlbum 
                  onCreateAlbum={handleCreateAlbum}
                  existingAlbums={customAlbums}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={<Profile user={user} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainContent>
        <PlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isShuffle={isShuffle}
          onShuffle={handleShuffle}
          isRepeat={isRepeat}
          onRepeat={handleRepeat}
          isLiked={isLiked}
          onLike={handleLike}
          onShowPlaylist={handleShowPlaylist}
          currentTime={currentTime}
          duration={duration}
          onProgressChange={handleProgressChange}
          isMiniPlayer={isMiniPlayer}
          onToggleMiniPlayer={toggleMiniPlayer}
        />
        <PlaylistPanel
          isOpen={showPlaylist}
          onClose={() => setShowPlaylist(false)}
          songs={songs}
          currentSong={currentSong}
          onPlaySong={handlePlaySong}
          isPlaying={isPlaying}
        />
      </AppContainer>
    </Router>
  );
};

export default App;
