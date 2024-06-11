import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
import ComposerForm from './ComposerForm';
import { NavLink } from 'react-router-dom';
import '../App.css';

function ComposerDetail() {
  const { composerId } = useParams();
  const [composer, setComposer] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Initially, not in edit mode
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComposerDetails = async () => {
      setIsLoading(true);
      try {
        if (composerId) {
          const fetchedComposer = await ModernMaestroApi.getComposerById(composerId);
          setComposer(fetchedComposer);
          const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composerId);
          setCompositions(fetchedCompositions);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch composer details or compositions", error);
        setIsLoading(false);
      }
    };
    fetchComposerDetails();
  }, [composerId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!composer && !isLoading) {
    return <div>Composer not found.</div>;
  }

  const handleAddCompositionClick = () => {
    navigate(`/composers/${composerId}/compositions/new`, { state: { composerId, composerName: composer?.name }});
  };

  return (
    <div className="main-content"> 
      {isLoading ? <div>Loading...</div> : null}
      {!composer && !isLoading ? <div>Composer not found.</div> : null}
  
      {composer && (
        <div>
          {isEditing ? (
            <ComposerForm
              composerId={composer?.composer_id}
              setIsEditing={setIsEditing}
              composerInfo={composer}
            />
          ) : (
            <div > 
                <h1 className="swoopIn">{composer.name}</h1> 
            
              <h4>Biography:</h4>
              <p>{composer.biography}</p>
              {composer.website && (
                <div>
                  <h4>Website:</h4>
                  <p><a href={composer.website} target="_blank" rel="noopener noreferrer">{composer.website}</a></p>
                </div>
              )}
              {composer.social_media_links && (
                <div>
                  <h4>Social Media Links:</h4>
                  <ul>
                    {Object.entries(composer.social_media_links).map(([platform, link]) => (
                      <li key={platform}>
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <h3>Compositions:</h3>
              <ul>
                {compositions.map(composition => (
                  <li key={composition.composition_id}>
                    <NavLink to={`/compositions/${composition.composition_id}`}>{composition.title}</NavLink>
                  </li>
                ))}
              </ul>
              <button className="button" onClick={handleAddCompositionClick}>Add Composition</button>
              <button className="button" type="button" onClick={() => setIsEditing(true)}>Edit Composer Details</button>
              <div>
              < NavLink to="/composers" className="nav-link">Back to Composer List</NavLink>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComposerDetail;
