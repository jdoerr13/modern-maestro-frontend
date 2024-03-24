import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

function CompositionList() {
  const [compositions, setCompositions] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  

  useEffect(() => {
    const fetchCompositions = async () => {
      try {
        console.log("Making API Call");
        const data = await ModernMaestroApi.getCompositions();
        console.log("API Response:", data);
        setCompositions(data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching compositions:", error);
        setCompositions([]);
        setError(error.message || "An error occurred while fetching compositions");
      }
    };
    fetchCompositions();
  }, []);

  // Function to filter compositions based on search term
  const filteredCompositions = compositions.filter(composition =>
    composition.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Compositions</h2>
      <div><Link to="/select-composer">Add New Composition</Link> </div>
      <input
        type="text"
        placeholder="Search compositions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredCompositions.length === 0 ? (
        <p>No compositions found. </p>
      ) : (
        <ul>
          {/* Map over filtered compositions */}
          {filteredCompositions.map((composition) => (
            <li key={composition.composition_id}>
              <Link to={`/compositions/${composition.composition_id}`}>
                {composition.title} by {composition.Composer.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      
    </div>
    
  );
}

export default CompositionList;
