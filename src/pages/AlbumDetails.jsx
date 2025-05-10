import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { songs as allSongs } from '../data/mockData';
import '../styles/Home.css';

const AlbumDetails = ({ albums, onPlaySong }) => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const album = albums.find(a => a.id === albumId);
  const albumSongs = album ? album.songs.map(idOrObj => {
    if (typeof idOrObj === 'object') return idOrObj;
    return allSongs.find(s => s.id === idOrObj);
  }).filter(Boolean) : [];

  if (!album) {
    return <div className="home-container"><h2>Album not found</h2></div>;
  }

  return (
    <div className="home-container">
      <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="album-details-header">
        <img src={album.cover} alt={album.name} className="album-details-cover" />
        <div>
          <h1 className="album-details-title">{album.name}</h1>
          <p className="album-details-meta">{albumSongs.length} songs</p>
        </div>
      </div>
      <div className="album-details-songs">
        {albumSongs.map((song, idx) => (
          <div key={song.id} className="song-item" onClick={() => onPlaySong(song)}>
            <div className="song-number">{idx + 1}</div>
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            <div className="song-duration">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetails; 