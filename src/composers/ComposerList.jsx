import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
import ComposerTrackSearch from './ComposerTrackSearch';
import '../App.css';

function ComposerList() {
  const [composers, setComposers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddComposer, setShowAddComposer] = useState(false);
  const [showTrackSearch, setShowTrackSearch] = useState(false);

  useEffect(() => {
    const fetchComposers = async () => {
      const composers = await ModernMaestroApi.getComposers();
      composers.sort((a, b) => a.name.localeCompare(b.name));
      setComposers(composers);
    };
    fetchComposers();
  }, []);

  const filteredComposers = composers.filter(composer =>
    composer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setShowAddComposer(filteredComposers.length === 0);
  }, [filteredComposers]);

  return (
    <div >
      <div className="main-content spaced-stack">
        <h1 className="swoopIn" style={{ textAlign: 'center' }}>Composers</h1>

        <div className="button-group">
          <button className="round-zoom-button" onClick={() => setShowTrackSearch(true)}>
            Spotify API Search
          </button>
          <Link to="/composers/new" className="round-zoom-button">
            Add New Composer
          </Link>
        </div>

        <input
          type="text"
          className="search-bar"
          placeholder="Search composer list..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredComposers.length === 0 && !showTrackSearch && (
          <div className="list-box">
            <p>No composers found.</p>
            {showAddComposer && (
              <button className="button" onClick={() => setShowTrackSearch(true)}>
                Help us add more composers
              </button>
            )}
          </div>
        )}

        {showTrackSearch && <ComposerTrackSearch />}

        {filteredComposers.length > 0 && (
          <div className="list-box composer-list">
            <ul>
              {filteredComposers.map(composer => (
                <li key={composer.composer_id}>
                  <Link to={`/composers/${composer.composer_id}`}>
                    {composer.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComposerList;
