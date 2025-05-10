import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaHeart, FaPlus } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <h1 className="logo">Groove</h1>
      <Link to="/" className="nav-item">
        <FaHome /> Home
      </Link>
      <Link to="/liked-songs" className="nav-item">
        <FaHeart /> Liked Songs
      </Link>
      <Link to="/create-album" className="nav-item">
        <FaPlus /> Create Album
      </Link>
    </div>
  );
};

export default Sidebar; 