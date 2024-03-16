import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

function ComposerList() {
  const [composers, setComposers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div>
      <h2>Composers</h2>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search composers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredComposers.length === 0 ? (
        <p>No composers found.</p>
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
      <Link to="/composers/new">Add New Composer</Link>
    </div>
  );
}

export default ComposerList;
