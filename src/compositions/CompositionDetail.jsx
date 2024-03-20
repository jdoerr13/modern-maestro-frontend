import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

function CompositionDetail() {
  const { compositionId } = useParams();
  const [composition, setComposition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompositionDetails = async () => {
      try {
        if (compositionId) {
          const fetchedComposition = await ModernMaestroApi.getCompositionById(compositionId);
          const composerId = fetchedComposition.composer_id;
          const composer = await ModernMaestroApi.getComposerById(composerId);
          
          // Combine composition data with composer name
          const compositionWithComposer = {
            ...fetchedComposition,
            composer: composer.name
          };

          setComposition(compositionWithComposer);
        }
      } catch (error) {
        console.error("Failed to fetch composition details", error);
        navigate('/compositions'); // Redirect or handle error
      }
    };

    fetchCompositionDetails();
  }, [compositionId, navigate]);

  if (!composition) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{composition.title}</h2>
      <p>Year of Composition: {composition.year_of_composition}</p>
      <p>Description: {composition.description}</p>
      <p>Duration: {composition.duration}</p>
      <p>Instrumentation: {JSON.stringify(composition.instrumentation)}</p> {/* Assuming instrumentation is an object or array */}
      {/* Display the composer's name */}
      <p>Composed by: {composition.composer}</p>
      {composition.audio_file_path && (
  <div>
    <p>Audio file:</p>
    <audio controls src={composition.audio_file_path}>
      Your browser does not support the audio element.
    </audio>
  </div>
)}
      {/* Link back to the composer's detail page */}
      {composition.composer_id && (
        <Link to={`/composers/${composition.composer_id}`}>View Composer</Link>
      )}
    </div>
  );
}

export default CompositionDetail;
