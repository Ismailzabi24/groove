import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-container">
      <div className="search-input">
        <input
          type="text"
          placeholder="Search for songs, artists, or albums..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>
    </div>
  );
};

export default SearchBar; 