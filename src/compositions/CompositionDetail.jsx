import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';
import { useUserContext } from '../auth/UserContext';
import '../App.css';

function CompositionDetail() {
  const { compositionId } = useParams();
  const [composition, setComposition] = useState(null);
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
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

        const audioUrl = fetchedComposition.audio_file_path ? `http://localhost:3000/uploads/${fetchedComposition.audio_file_path.split('/').pop()}` : '';
        setComposition({ ...fetchedComposition, composer: composer.name, audioUrl });
      } catch (error) {
        console.error("Failed to fetch composition details:", error);
        navigate('/compositions'); 
      }
    };

    fetchCompositionDetails();
  }, [compositionId, navigate]);

  useEffect(() => {
    if (!composition) return;

    const fetchTracks = async () => {
        try {
            const tracksByComposer = await ModernMaestroApi.fetchTracksByComposerName(composition.composer);
            console.log(tracksByComposer);

            const matchingTracks = tracksByComposer.filter(track => track.name === composition.title);
            
            setTracks(matchingTracks);
        } catch (error) {
            console.error("Failed to fetch tracks by composer:", error);
        }
    };

    fetchTracks();
}, [composition]);

  if (!composition) {
    return <div>Loading...</div>;
  }

  function formatDuration(duration) {
    if (!duration) return 'Unknown';
    const [minutes, seconds] = duration.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return 'Unknown';
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="main-content">
      <div className="top-header">
        <h2 className="swoopIn">{composition.title}</h2>
      </div>
      <div className="centered-content">
       
          <h4>Composed by: {composition.composer}</h4>
          <div className="info-block">
          <h5>Year of Composition: {composition.year_of_composition}</h5>
          <h5>Duration: {formatDuration(composition.duration)}</h5>
          <h5>Instrumentation: {Array.isArray(composition.instrumentation) ? composition.instrumentation.join(', ') : ''}</h5>
        </div>
        
        {tracks.length > 0 && (
          <div className="tracks-block">
            {tracks.map((track, index) => (
              track.preview_url && (
                <h5 key={index}>
                  <strong>Listen Here:</strong>
                  <a href={track.preview_url} target="_blank" rel="noopener noreferrer">Preview</a>
                </h5>
              )
            ))}
          </div>
        )}
        
        {composition.audioUrl && (
          <div className="audio-block">
            <p>Audio file:</p>
            <audio controls src={composition.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        
        <div >
          {composition.composer_id && (
            <Link to={`/composers/${composition.composer_id}`}>View Composer</Link>
          )}
          <div>
          <Link
            to={`/compositions/${compositionId}/edit`}
            state={{ isEditing: true, compositionId: compositionId, composerId: composition.composer_id }}
          >
            Edit Composition
           
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompositionDetail;
