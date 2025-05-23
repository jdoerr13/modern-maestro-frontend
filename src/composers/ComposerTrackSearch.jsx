import React, { useState } from 'react';
import ModernMaestroApi from '../api/api';
import { useNavigate } from 'react-router-dom';
import './ComposerTrackSearch.css';


function ComposerTrackSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [composerAdded, setComposerAdded] = useState(false);
  const [composerFound, setComposerFound] = useState(false); 
  const [composerId, setComposerId] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const fetchedTracks = await ModernMaestroApi.fetchTracksByComposerName(searchTerm);
      console.log('Fetched Tracks:', fetchedTracks);

      if (fetchedTracks.length === 0) {
        setErrorMessage('No composers found. Please check your spelling.');
        setComposerFound(false); // Update state to reflect no composer found
      } else {
        setErrorMessage('');
        setTracks(fetchedTracks);
        setComposerFound(true); // Update state to reflect a composer is found
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setErrorMessage('An error occurred while fetching tracks. Please try again.');
      setComposerFound(false); // composerFound is reset in case of error
    }
  };

  const handleAddComposerToDatabase = async () => {
    try {
      const composerData = {
        name: searchTerm,
        biography: '',
        website: '',
        social_media_links: '',
      };

      const newComposer = await ModernMaestroApi.createComposer(composerData);
      console.log('New Composer Added:', newComposer);
      
      // Update the composerId state with the ID of the newly added composer
      setComposerId(newComposer.composer_id);

      setComposerAdded(true);
      setComposerFound(false); // Optionally hide the button after adding the composer
    } catch (error) {
      console.error('Error adding composer to database:', error);
      setErrorMessage('An error occurred while adding the composer to the database. Please try again.');
    }
  };

  function formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function standardizeDuration(duration) {
    // Check if duration is already in 'MM:SS' format and return if it is
    if (/^\d{1,2}:\d{2}$/.test(duration)) {
      return duration.length === 4 ? `0${duration}` : duration;
    }
  
    // duration is in seconds if not in 'MM:SS' format
    let totalSeconds = parseInt(duration, 10); // convert to integer
    if (isNaN(totalSeconds)) {
      return "00:00"; // Return a fallback value or handle error as appropriate
    }
    
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    
    return `${minutes}:${seconds}`;
  }

  const handleAddAllTracksToDatabase = async () => {
    if (!tracks.length || !composerId) {
      console.log("No tracks to add or composer ID missing.");
      return;
    }
    for (const track of tracks) {
        const compositionData = new FormData();
        compositionData.append("title", track.name);
        compositionData.append("composerId", composerId.toString());
        compositionData.append("duration", standardizeDuration(track.duration)); 
        compositionData.append("year", track.year ? track.year.toString() : '');
        compositionData.append("description", typeof track.description === 'string' ? track.description : '');


        // Log data to be sent
        console.log(`Sending data for track: ${track.name}`, {
            title: track.name,
            composerId: composerId,
            duration: track.duration,
            year: track.year,
            description: track.description
        });

        try {
            await ModernMaestroApi.createCompositionWithFile(compositionData);
            console.log("Track added successfully:", track.name);
        } catch (error) {
          console.error('API Error:', error.response ? error.response.data : error);
            if (error.response) {
                console.error('Detailed error:', error.response.data);
            }
        }
    }
    navigate(`/composers/${composerId}`);
  };

  return (
    <div className="main-content">
      <h2>Search for a Composer's Music on Spotify Here</h2>
  
      {/* Group input + button */}
      <div className="centered-input">
  <input
    type="text"
    placeholder="Confirm Composer Here..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  {!composerFound && (
    <div className="centered-button">
      <button className="button" onClick={handleSearch}>
        SEARCH
      </button>
    </div>
  )}
</div>

        
      {errorMessage && <p className="error">{errorMessage}</p>}
  
      {composerFound && !composerAdded && (
        <div className="confirmation-block">
          <h3>Success! Composer {searchTerm} found</h3>
          <button className="button" onClick={handleAddComposerToDatabase}>
            Please Add Composer to Database
          </button>
        </div>
      )}
  
      {composerAdded && (
        <div className="compositions-section">
          <h2>Compositions from {searchTerm}</h2>
          <button className="button" onClick={handleAddAllTracksToDatabase}>
            Add All Tracks to Database
          </button>
  
          {Array.isArray(tracks) &&
            tracks.map((track, index) => (
              <div key={index} className="track-card">
                <p>
                  <strong>Title:</strong> {track.name}
                </p>
                <p>
                  <strong>Duration:</strong> {standardizeDuration(track.duration)}
                </p>
                <p>
                  <strong>Year:</strong> {track.year}
                </p>
                <p>
                  <strong>Album:</strong> {track.album}
                </p>
                {track.preview_url && (
                  <p>
                    <strong>Listen Here:</strong>{" "}
                    <a
                      href={track.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Preview
                    </a>
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
  
}

export default ComposerTrackSearch;
