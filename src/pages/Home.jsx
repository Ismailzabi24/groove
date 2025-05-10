import React from 'react';
import { FaPlay, FaEllipsisH, FaSort, FaEdit, FaTrash, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = ({ 
  onPlaySong, 
  customAlbums = [], 
  songs = [], 
  onUpdateAlbum, 
  onDeleteAlbum, 
  sortOption, 
  onSortChange,
  likedSongs = [],
  searchQuery = '',
  searchResults = []
}) => {
  const navigate = useNavigate();
  const handlePlayAlbum = (album) => {
    if (album.songs.length > 0) {
      onPlaySong(album.songs[0]);
    }
  };

  const handleEditAlbum = (album) => {
    // TODO: Implement edit functionality
    console.log('Edit album:', album);
  };

  const handleDeleteAlbum = (albumId) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      onDeleteAlbum(albumId);
    }
  };

  // Get recommended songs (songs that are not in liked songs)
  const recommendedSongs = songs.filter(song => !likedSongs.includes(song.id));

  return (
    <div className="home-container">
      {searchQuery.trim() ? (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Search Results</h2>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid">
              {searchResults.map((song) => (
                <div key={song.id} className="card" onClick={() => onPlaySong(song)}>
                  <div className="card-image">
                    <img src={song.cover} alt={song.title} />
                    <div className="card-overlay">
                      <button className="play-button">
                        <FaPlay />
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{song.title}</h3>
                    <p className="card-subtitle">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="not-found-message">No songs found for "{searchQuery}"</div>
          )}
        </div>
      ) : (
        <>
          {likedSongs.length > 0 && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">
                  <FaHeart className="section-icon" /> Liked Songs
                </h2>
              </div>
              <div className="grid">
                {songs
                  .filter(song => likedSongs.includes(song.id))
                  .map((song) => (
                    <div key={song.id} className="card" onClick={() => onPlaySong(song)}>
                      <div className="card-image">
                        <img src={song.cover} alt={song.title} />
                        <div className="card-overlay">
                          <button className="play-button">
                            <FaPlay />
                          </button>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-title">{song.title}</h3>
                        <p className="card-subtitle">{song.artist}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {recommendedSongs.length > 0 && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Recommended for You</h2>
              </div>
              <div className="grid">
                {recommendedSongs.map((song) => (
                  <div key={song.id} className="card" onClick={() => onPlaySong(song)}>
                    <div className="card-image">
                      <img src={song.cover} alt={song.title} />
                      <div className="card-overlay">
                        <button className="play-button">
                          <FaPlay />
                        </button>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{song.title}</h3>
                      <p className="card-subtitle">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customAlbums.length > 0 && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Your Albums</h2>
                <div className="sort-container">
                  <FaSort className="sort-icon" />
                  <select 
                    className="sort-select"
                    value={sortOption}
                    onChange={(e) => onSortChange(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name</option>
                    <option value="songs">Most Songs</option>
                  </select>
                </div>
              </div>
              <div className="grid">
                {customAlbums.map((album) => (
                  <div className="card" key={album.id} onClick={() => navigate(`/album/${album.id}`)}>
                    <div className="card-image">
                      <img src={album.cover} alt={album.name} />
                      <div className="card-overlay">
                        <button 
                          className="play-button"
                          onClick={e => { e.stopPropagation(); handlePlayAlbum(album); }}
                        >
                          <FaPlay />
                        </button>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{album.name}</h3>
                      <p className="card-subtitle">
                        {album.songs.length} songs • {Math.floor(album.totalDuration / 60)} min
                      </p>
                      <div className="card-actions">
                        <button 
                          className="action-button edit"
                          onClick={e => { e.stopPropagation(); handleEditAlbum(album); }}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={e => { e.stopPropagation(); handleDeleteAlbum(album.id); }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home; 