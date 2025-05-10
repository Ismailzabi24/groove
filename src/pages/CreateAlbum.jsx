import React, { useState } from 'react';
import { songs } from '../data/mockData';
import { FaPlus, FaTrash, FaImage } from 'react-icons/fa';
import '../styles/CreateAlbum.css';

const CreateAlbum = ({ onCreateAlbum }) => {
  const [albumName, setAlbumName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const handleAddSong = (song) => {
    if (!selectedSongs.find(s => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleRemoveSong = (songId) => {
    setSelectedSongs(selectedSongs.filter(song => song.id !== songId));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (albumName.trim() && selectedSongs.length > 0) {
      onCreateAlbum({
        name: albumName,
        songs: selectedSongs,
        cover: coverPreview // Use data URL for preview or upload
      });
      // Reset form
      setAlbumName('');
      setSelectedSongs([]);
      setCover(null);
      setCoverPreview(null);
    }
  };

  return (
    <div className="create-album-container">
      <h1 className="title">Create New Album</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Album Name</label>
          <input
            className="input"
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            placeholder="Enter album name"
            required
          />
        </div>

        <div className="form-group">
          <label className="label">Album Cover</label>
          <div className="cover-upload">
            <label htmlFor="cover-input" className="cover-label">
              {coverPreview ? (
                <img src={coverPreview} alt="Album Cover Preview" className="cover-preview" />
              ) : (
                <span className="cover-placeholder"><FaImage /> Choose Cover</span>
              )}
            </label>
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCoverChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Add Songs</label>
          <div className="song-list">
            {songs.map((song) => (
              <div key={song.id} className="song-item">
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
                <button
                  type="button"
                  className="add-button"
                  onClick={() => handleAddSong(song)}
                  disabled={selectedSongs.find(s => s.id === song.id)}
                >
                  <FaPlus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedSongs.length > 0 && (
          <div className="form-group">
            <label className="label">Selected Songs</label>
            <div className="song-list">
              {selectedSongs.map((song) => (
                <div key={song.id} className="song-item">
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveSong(song.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={!albumName.trim() || selectedSongs.length === 0}
        >
          Create Album
        </button>
      </form>
    </div>
  );
};

export default CreateAlbum; 