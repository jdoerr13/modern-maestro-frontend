import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

function ComposerSelection() {
    const [composers, setComposers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchComposers = async () => {
        try {
          const data = await ModernMaestroApi.getComposers();
          console.log(data);
          setComposers(data);
        } catch (error) {
          console.error("Error fetching composers:", error);
        }
      };
  
      fetchComposers();
    }, []);
  
    const filteredComposers = composers.filter(composer =>
      composer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleComposerSelect = (composerId, composerName) => {
      if (composerId) {
        navigate(`/composers/${composerId}/compositions/new`, {
          state: {
            composerId,
            composerName
          }
        });
      } else {
        console.error("Composer ID is undefined.");
      }
    };
    

    return (
      <div>
        <h2>Select a Composer to Add a New Composition</h2>
        <input
          type="text"
          placeholder="Search composers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredComposers.length === 0 ? (
          <p>If no composers found, please add a new composer first.</p>
        ) : (
          <ul>
         {filteredComposers.map(composer => (
            <li key={composer.composer_id}> 
              <button onClick={() => handleComposerSelect(composer.composer_id, composer.name)}>
                {composer.name}
              </button>
            </li>
          ))}
          </ul>
        )}
        <button onClick={() => navigate('/composers/new')}>Add New Composer</button>
      </div>
    );
}

export default ComposerSelection;
