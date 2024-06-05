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
      composers.sort((a, b) => a.name.localeCompare(b.name)); // Sort composers alphabetically by name
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
    <div className="main-content">
      <div className="main-header">
        <h1 className="swoopIn">Composers</h1>
      </div>
      <div>
        <Link to="/composers/new">Add New Composer</Link>
      </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search composers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredComposers.length === 0 ? (
        <div className="list-box">
          <p>No composers found. Please click below to search online.</p>
          {showAddComposer && !showTrackSearch && (
            <button onClick={() => setShowTrackSearch(true)}>Help us add more composers</button>
          )}
          {showTrackSearch && <ComposerTrackSearch />}
        </div>
      ) : (
        <div className="list-box">
          <ul>
            {filteredComposers.map(composer => (
              <li key={composer.composer_id}>
                <Link to={`/composers/${composer.composer_id}`}>{composer.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ComposerList;
