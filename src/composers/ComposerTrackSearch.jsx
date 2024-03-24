import React, { useState } from 'react';
import ModernMaestroApi from '../api/api';

function ComposerTrackSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [composerAdded, setComposerAdded] = useState(false);
  const [composerFound, setComposerFound] = useState(false); // Track if a composer is found
  const [composerId, setComposerId] = useState(null);


  const handleSearch = async () => {
    try {
      const fetchedTracks = await ModernMaestroApi.fetchTracksByComposerName(searchTerm);
      console.log('Fetched Tracks:', fetchedTracks);

      if (fetchedTracks.length === 0) {
        setErrorMessage('No tracks found. Please check your spelling.');
        setComposerFound(false); // Update state to reflect no composer found
      } else {
        setErrorMessage('');
        setTracks(fetchedTracks);
        setComposerFound(true); // Update state to reflect a composer is found
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setErrorMessage('An error occurred while fetching tracks. Please try again.');
      setComposerFound(false); // Ensure composerFound is reset in case of error
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
  
    // Assume duration is in seconds if not in 'MM:SS' format
    let totalSeconds = parseInt(duration, 10); // Safely convert to integer
    if (isNaN(totalSeconds)) {
    //   console.error("Invalid duration format or value:", duration);
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
    try {
      for (const track of tracks) {
        const formattedDuration = standardizeDuration(track.duration_ms / 1000); // Convert milliseconds to seconds first
        
        // const year = parseInt(track.year, 10); // Ensure year is treated as an integer
        // if (isNaN(year)) {
        //   console.error("Invalid year format or value for track:", track.name);
        //   continue; // Skip this track or handle error as appropriate
        // }
        const yearOfComposition = new Date(track.year).getFullYear();
        console.log(yearOfComposition)
        const compositionData = new FormData();
        compositionData.append("title", track.name);
        compositionData.append("composerId", composerId.toString());
        compositionData.append("duration", track.duration.toString());
        compositionData.append("year", parseInt(yearOfComposition)); // Ensure string format for FormData, even though it's an integer
        compositionData.append("description", track.description);
        // Other fields like instrumentation are handled elsewhere
  
        await ModernMaestroApi.createCompositionWithFile(compositionData);
      }
      console.log("All tracks added to the database successfully.");
    } catch (error) {
      console.error('Error adding tracks to the database:', error);
    }
  };
  
  


  return (
    <div>
      <p><strong>Search for a Composer's Music on Spotify Here</strong></p>
      <input
        type="text"
        placeholder="Confirm Composer Here..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {errorMessage && <p>{errorMessage}</p>}
      {composerFound && !composerAdded && (
        <button onClick={handleAddComposerToDatabase}>Add Composer to Database</button>
      )}
      {/* Display the composer's name above the track list if a composer has been added */}
      {composerAdded && (
        <>
          <h2>Compositions from {searchTerm}</h2>
          <button onClick={handleAddAllTracksToDatabase}>Add All Tracks to Database</button>
        </>
      )}
      {Array.isArray(tracks) && tracks.map((track, index) => (
        <div key={index}>
          <p><strong>Title:</strong> {track.name}</p>
          <p><strong>Duration:</strong> {track.duration}</p>
          <p><strong>Year:</strong> {track.year}</p>
          <p><strong>Album:</strong> {track.album}</p>
          {track.preview_url && (
            <p><strong>Listen Here:</strong> <a href={track.preview_url} target="_blank" rel="noopener noreferrer">Preview</a></p>
          )}
        </div>
      ))}
    </div>
  );
}


export default ComposerTrackSearch;
