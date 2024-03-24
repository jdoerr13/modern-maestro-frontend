import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
// Import the new component at the top of your file
import ComposerTrackSearch from './ComposerTrackSearch';

function ComposerList() {
  const [composers, setComposers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddComposer, setShowAddComposer] = useState(false);
  const [showTrackSearch, setShowTrackSearch] = useState(false);

  useEffect(() => {
    const fetchComposers = async () => {
      const composers = await ModernMaestroApi.getComposers();
      setComposers(composers);
    };
    fetchComposers();
  }, []);

  // Function to filter composers based on search term
  const filteredComposers = composers.filter(composer =>
    composer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Show add composer button if no composers found
    useEffect(() => {
      setShowAddComposer(filteredComposers.length === 0);
    }, [filteredComposers]);

  return (
    <div>
      <h2>Composers</h2>
      {/* Search input field */}
      <div><Link to="/composers/new">Add New Composer</Link></div>
      <input
        type="text"
        placeholder="Search composers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
       {filteredComposers.length === 0 ? (
        <div>
          <p>No composers found. Please click below to search online.</p>
          {showAddComposer && !showTrackSearch && ( // Check if track search is not shown
            <button onClick={() => setShowTrackSearch(true)}>Help us add more composers</button>
          )}
          {showTrackSearch && <ComposerTrackSearch />}
        </div>
      ) : (
        <ul>
          {/* Map over filtered composers */}
          {filteredComposers.map(composer => (
            <li key={composer.composer_id}>
              <Link to={`/composers/${composer.composer_id}`}>{composer.name}</Link>
            </li>
          ))}
        </ul>
      )}
    
    </div>
  );
}

export default ComposerList;
