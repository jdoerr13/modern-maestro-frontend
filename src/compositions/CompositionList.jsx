
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
import '../App.css';

function CompositionList() {
  const [compositions, setCompositions] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompositions = async () => {
      try {
        const data = await ModernMaestroApi.getCompositions();
        setCompositions(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching compositions:", error);
        setCompositions([]);
        setError(error.message || "An error occurred while fetching compositions");
      }
    };
    fetchCompositions();
  }, []);

  const filteredCompositions = compositions
    .filter(composition => 
      composition.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-content">
      <div className="main-header">
        <h1 className="swoopIn">Compositions</h1>
      </div>
      <div>
        <Link to="/select-composer">Add New Composition</Link>
        
        
        <input
          type="text"
          className="search-bar"
          placeholder="Search compositions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredCompositions.length === 0 ? (
        <div className="list-box">
          <p>No compositions found. Please click below to first find the composer.</p>
          <Link to="/composers" className="link-button">Search for Composers</Link>
        </div>
      ) : (
        <div className="list-box">
          <ul>
            {filteredCompositions.map(composition => (
              <li key={composition.composition_id}>
                <Link to={`/compositions/${composition.composition_id}`}>
                  {composition.title} by {composition.Composer.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CompositionList;
