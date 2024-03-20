import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import ModernMaestroApi from '../api/api';
import ComposerForm from './ComposerForm';
import { useUserContext } from '../auth/UserContext';

function ComposerDetail() {
  const { composerId } = useParams();
  const [composer, setComposer] = useState(null);
  const [compositions, setCompositions] = useState([]);
  const [isEditing, setIsEditing] = useState(!composerId);
  const navigate = useNavigate(); 
  const { user: currentUser } = useUserContext();
  console.log(currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComposerDetails = async () => {
      setIsLoading(true);
      try {
        if (composerId) {
          const fetchedComposer = await ModernMaestroApi.getComposerById(composerId);
          setComposer(fetchedComposer);
          setIsLoading(false);
          console.log("Fetched Composer:", fetchedComposer);
          const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composerId);
          setCompositions(fetchedCompositions);
        }
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

  if (!composer) {
    return <div>Composer not found.</div>;
  }

  const handleAddCompositionClick = () => {
    if (composerId) {
      navigate(`/composers/${composerId}/compositions/new`, { state: { composerId, composerName: composer.name }});
    } else {
      console.error("No composer ID found.");
    }
  };
  console.log("currentUser.user_id:", currentUser.user_id);
  console.log("composer.user_id:", composer.user_id);
  return (
    <div>
      {isEditing ? (
        <ComposerForm composerId={composerId} setIsEditing={setIsEditing} />
      ) : (
        composer && (
          <>
            <h2>{composer.name}</h2>
            <p>Biography: {composer.biography}</p>
            {composer.website && <p>Website: <a href={composer.website} target="_blank" rel="noopener noreferrer">{composer.website}</a></p>}

            {composer.social_media_links && Object.keys(composer.social_media_links).length > 0 && (
              <>
                <p>Social Media Links:</p>
                <ul>
                  {Object.entries(composer.social_media_links).map(([platform, link]) => (
                   <li key={platform}>
          <strong>{platform}:</strong> <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </li>
                  ))}
                </ul>
              </>
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
            
            {(currentUser.user_id === composer.user_id || currentUser.role === 'admin') && (
              <button type="button" onClick={() => navigate(`/composers/${composerId}/edit`)}>Edit Composer Details</button>
           )} 
          </>
        )
      )}
    </div>
  );
}

export default ComposerDetail;
