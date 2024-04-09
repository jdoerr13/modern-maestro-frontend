import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
import ComposerForm from './ComposerForm';
import { NavLink } from 'react-router-dom';

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
    <div>
      {/* Only render the ComposerForm if isEditing is true */}
      {isEditing && (
        <ComposerForm
          composerId={composer?.composer_id}
          setIsEditing={setIsEditing}
          composerInfo={composer}
        />
      )}

      {/* Composer's details */}
      <div style={{ display: isEditing ? 'none' : 'block' }}>
        <h2>{composer.name}</h2>
        <p>Biography: {composer.biography}</p>
        {composer.website && (
          <p>Website: <a href={composer.website} target="_blank" rel="noopener noreferrer">{composer.website}</a></p>
        )}
        {composer.social_media_links && Object.keys(composer.social_media_links).length > 0 && (
          <div>
            <p>Social Media Links:</p>
            <ul>
              {Object.entries(composer.social_media_links).map(([platform, link]) => (
                <li key={platform}>
                  <strong>{platform}:</strong> <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <h3>Compositions</h3>
        <ul>
          {compositions.map(composition => (
            <li key={composition.composition_id}>
              <NavLink to={`/compositions/${composition.composition_id}`}>{composition.title}</NavLink>
            </li>
          ))}
        </ul>
        <button onClick={handleAddCompositionClick}>Add Composition</button>
        {!isEditing && (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit Composer Details
          </button>
        )}
        <NavLink className="nav-link" to="/profile">
          Back to Profile
        </NavLink>
      </div>
    </div>
  );
}

export default ComposerDetail;
