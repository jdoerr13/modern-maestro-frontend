import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
import { useUserContext } from '../auth/UserContext';

function CompositionDetail() {
  const { compositionId } = useParams();
  const [composition, setComposition] = useState(null);
  const navigate = useNavigate();
  const { user: currentUser } = useUserContext();

  useEffect(() => {
    const fetchCompositionDetails = async () => {
      try {
        if (!compositionId) return;

        const fetchedComposition = await ModernMaestroApi.getCompositionById(compositionId);
        if (!fetchedComposition) throw new Error('Composition not found');
        console.log("Fetched Composition:", fetchedComposition); 

        const composer = await ModernMaestroApi.getComposerById(fetchedComposition.composer_id);
        if (!composer) throw new Error('Composer not found');

        // Assuming your backend server is at 'http://localhost:3000' and it serves
        // files from the 'uploads' directory accessible via '/uploads/filename'
        const audioUrl = fetchedComposition.audio_file_path ? `http://localhost:3000/uploads/${fetchedComposition.audio_file_path.split('/').pop()}` : '';

        setComposition({ ...fetchedComposition, composer: composer.name, audioUrl });
      } catch (error) {
        console.error("Failed to fetch composition details:", error);
        navigate('/compositions'); // Navigate to compositions list on error
      }
    };

    fetchCompositionDetails();
  }, [compositionId, navigate]);

  if (!composition) {
    return <div>Loading...</div>;
  }
  function formatDuration(duration) {
    if (!duration) return 'Unknown'; // Return a default value if duration is not provided
    const [minutes, seconds] = duration.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 'Unknown'; // Return a default value if duration format is invalid
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  

  return (
    <div>
      <h2>{composition.title}</h2>
      <p>Year of Composition: {composition.year_of_composition}</p>
      <p>Description: {composition.description}</p>
      <p>Duration: {formatDuration(composition.duration)}</p>
      <p>Instrumentation: {Array.isArray(composition.instrumentation) ? composition.instrumentation.join(', ') : ''}</p>

      <p>Composed by: {composition.composer}</p>

      
      {composition.audioUrl && (
        <div>
          <p>Audio file:</p>
          <audio controls src={composition.audioUrl}>
      Your browser does not support the audio element.
    </audio>
  </div>
)}
      {/* Link back to the composer's detail page */}
      {composition.composer_id && (
        <Link to={`/composers/${composition.composer_id}`}>View Composer</Link>
      )}
    <div>
       {/* Add the Edit button here */}
       <Link
        to={`/compositions/${compositionId}/edit`}
        state={{ isEditing: true, compositionId: compositionId, composerId: composition.composer_id  }}
      >
        Edit Composition
      </Link>
     </div>
   </div>
  );
}

export default CompositionDetail;
