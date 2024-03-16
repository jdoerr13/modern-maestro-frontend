import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import ModernMaestroApi from '../api/api';
import ComposerForm from './ComposerForm';

function ComposerDetail() {
  const { composerId } = useParams();
  const [composer, setComposer] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [isEditing, setIsEditing] = useState(!composerId);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchComposerDetails = async () => {
      try {
        if (composerId) {
          const fetchedComposer = await ModernMaestroApi.getComposerById(composerId);
          setComposer(fetchedComposer);
          const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composerId);
          setCompositions(fetchedCompositions);
        }
      } catch (error) {
        console.error("Failed to fetch composer details or compositions", error);
      }
    };

    fetchComposerDetails();
  }, [composerId]);

  const handleAddCompositionClick = () => {
    if (composerId) {
      navigate(`/composers/${composerId}/compositions/new`, { state: { composerId, composerName: composer.name }});
    } else {
      console.error("No composer ID found.");
    }
  };

  return (
    <div>
      {isEditing ? (
        <ComposerForm composerId={composerId} setIsEditing={setIsEditing} />
      ) : (
        composer && (
          <>
            <h2>{composer.name}</h2>
            <p>Biography: {composer.biography}</p>
            {composer.website && (
              <p>Website: <a href={composer.website} target="_blank" rel="noopener noreferrer">{composer.website}</a></p>
            )}
            {composer.social_media_links && (
              <p>
                Social Media Links: 
                {Object.entries(composer.social_media_links).map(([platform, link]) => (
                  <a key={platform} href={link} target="_blank" rel="noopener noreferrer">{platform}</a>
                ))}
              </p>
            )}
            <h3>Compositions</h3>
            <ul>
              {compositions.map(composition => (
                <li key={composition.composition_id}>
                  <Link to={`/compositions/${composition.composition_id}`}>{composition.title}</Link>
                </li>
              ))}
            </ul>
            <button onClick={handleAddCompositionClick}>Add Composition</button>
          </>
        )
      )}
    </div>
  );
}

export default ComposerDetail;
