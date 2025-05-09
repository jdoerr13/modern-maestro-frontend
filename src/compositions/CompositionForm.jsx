import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

const CompositionForm = ({ onCancel }) => {
  const { state } = useLocation();
  const { compositionId } = useParams();
  const { composerId, composerName, isEditing } = state || {};
  const [audioFile, setAudioFile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    year_of_composition: '',
    description: '',
    duration: '',
    instrumentation: [],
    composerId: composerId,
    audioFile: null,
  });
  const [errors, setErrors] = useState({});
  const [instrumentList, setInstrumentList] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [originalDuration, setOriginalDuration] = useState('');
  const [spotifyTracks, setSpotifyTracks] = useState([]);

  useEffect(() => {
    const fetchCompositionDetails = async () => {
      if (compositionId) {
        try {
          const composition = await ModernMaestroApi.getCompositionById(compositionId);
          const audioUrl = composition.audio_file_path ? `http://localhost:3000/uploads/${composition.audio_file_path.split('/').pop()}` : '';

          let formattedDuration = '';
          if (composition.duration) {
            const durationArray = composition.duration.split(':');
            formattedDuration = `${durationArray[0]}:${durationArray[1]}`;
          }
          let fetchedInstrumentation = [];
          if (Array.isArray(composition.instrumentation)) {
            fetchedInstrumentation = composition.instrumentation;
          } else if (composition.instrumentation && composition.instrumentation !== '"Not specified"') {
            fetchedInstrumentation = JSON.parse(composition.instrumentation);
          }
          setOriginalDuration(formattedDuration);
          setFormData({
            title: composition.title,
            year_of_composition: composition.year_of_composition?.toString() || '',
            description: composition.description,
            duration: formattedDuration,
            instrumentation: fetchedInstrumentation,
            composerId: composition.composer_id,
          });
          setAudioFile(audioUrl);
          setSelectedInstruments(fetchedInstrumentation);
        } catch (error) {
          console.error("Failed to fetch composition details:", error);
          navigate('/compositions');
        }
      }
    };
    fetchCompositionDetails();
  }, [compositionId, navigate]);

  useEffect(() => {
    const fetchInstrumentList = async () => {
      try {
        const instruments = await ModernMaestroApi.getInstruments();
        setInstrumentList(instruments);
      } catch (error) {
        console.error('Failed to fetch instruments:', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          instruments: 'Failed to load instruments list.'
        }));
      }
    };
    fetchInstrumentList();
  }, []);

  const fetchSpotifyTracks = async () => {
    try {
      const fetchedTracks = await ModernMaestroApi.fetchTracksByComposerName(composerName);
      setSpotifyTracks(fetchedTracks);
    } catch (error) {
      console.error('Error fetching Spotify tracks:', error);
    }
  };

  const handleAddSpotifyTracks = async () => {
    if (!spotifyTracks.length || !composerId) return;
    for (const track of spotifyTracks) {
      const form = new FormData();
      form.append('title', track.name);
      form.append('composerId', composerId);
      form.append('duration', standardizeDuration(track.duration));
      form.append('year', track.year?.toString() || '');
      form.append('description', typeof track.description === 'string' ? track.description : '');
      try {
        await ModernMaestroApi.createCompositionWithFile(form);
      } catch (err) {
        console.error('Error uploading Spotify track:', err);
      }
    }
    navigate(`/composers/${composerId}`);
  };

  function calculateTotalSeconds(duration) {
    if (!duration) return 0;
    const [minutes, seconds] = duration.split(':').map(Number);
    return (isNaN(minutes) || isNaN(seconds)) ? 0 : (minutes * 60) + seconds;
  }

  function formatDuration(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function standardizeDuration(duration) {
    if (/^\d{1,2}:\d{2}$/.test(duration)) return duration.length === 4 ? `0${duration}` : duration;
    const totalSeconds = parseInt(duration, 10);
    if (isNaN(totalSeconds)) return "00:00";
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'year_of_composition') {
      const parsedValue = parseInt(value, 10) || '';
      setFormData({ ...formData, [name]: parsedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setAudioFile(selectedFile);
    }
  };

  const handleInstrumentDoubleClick = (instrument) => {
    if (!selectedInstruments.includes(instrument)) {
      const updated = [...selectedInstruments, instrument];
      setSelectedInstruments(updated);
      setFormData(form => ({
        ...form,
        instrumentation: updated
      }));
    }
  };

  const handleInstrumentChange = (selectedOptions) => {
    const selected = Array.from(selectedOptions).map(option => option.value);
    const filtered = selected.filter(i => i !== "Not specified");
    const unique = [...new Set([...formData.instrumentation, ...filtered])];
    setFormData(form => ({ ...form, instrumentation: unique }));
  };

  const handleRemoveInstrument = (instrToRemove) => {
    const updated = selectedInstruments.filter(i => i !== instrToRemove);
    setSelectedInstruments(updated);
    setFormData({ ...formData, instrumentation: updated });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const durationToSubmit = formData.duration.trim() === '' ? originalDuration : formData.duration;
    const cleanInstrumentation = formData.instrumentation.filter(i => i && i !== "Not specified");
    const totalSeconds = calculateTotalSeconds(durationToSubmit);
    const formatted = formatDuration(totalSeconds);

    const submissionFormData = new FormData();
    submissionFormData.append("title", formData.title);
    submissionFormData.append("year", formData.year_of_composition.toString());
    submissionFormData.append("description", formData.description);
    submissionFormData.append("instrumentation", JSON.stringify(cleanInstrumentation));
    submissionFormData.append("composerId", formData.composerId.toString());
    if (audioFile instanceof File) {
      submissionFormData.append('audioFile', audioFile, audioFile.name);
    }
    if (formData.duration !== originalDuration) {
      submissionFormData.append("duration", formatted);
    }

    try {
      let response;
      if (isEditing) {
        response = await ModernMaestroApi.updateCompositionWithFile(compositionId, submissionFormData);
        navigate(`/compositions/${compositionId}`);
      } else {
        response = await ModernMaestroApi.createCompositionWithFile(submissionFormData);
        const newId = response.composition?.composition_id;
        if (newId) {
          navigate(`/compositions/${newId}`);
        } else {
          navigate('/compositions');
        }
      }
    } catch (error) {
      console.error('Error saving composition:', error);
      alert(`Error saving composition: ${error?.response?.data?.error || 'Please try again.'}`);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDeleteAudioFile = () => {
    setAudioFile(null);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (v, k) => currentYear - k);

  return (
    <form className="main-content spaced-stack" onSubmit={handleSubmit}>
      {composerName && (
        <h2 className="swoopIn" style={{ textAlign: 'center' }}>
          Add New Composition for {composerName}
        </h2>
      )}

      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input id="title" name="title" value={formData.title} onChange={handleChange} required className="form-control" />
      </div>

      <div className="form-group">
        <label htmlFor="year_of_composition">Year Composed:</label>
        <select id="year_of_composition" name="year_of_composition" value={formData.year_of_composition} onChange={handleChange} required className="form-control">
          <option value="">Select a Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (MM:SS):</label>
        <input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="MM:SS" pattern="(?:[0-5]?[0-9]):[0-5][0-9]" title="Format MM:SS or M:SS" className="form-control" />
      </div>

      <div className="form-group">
        <label htmlFor="instrumentation">Instrumentation:</label>
        <select id="instrumentation" name="instrumentation" multiple value={formData.instrumentation} onChange={(e) => handleInstrumentChange(e.target.selectedOptions)} onDoubleClick={(e) => handleInstrumentDoubleClick(e.target.value)} className="form-control">
          {instrumentList.map((instrument) => (
            <option key={instrument} value={instrument}>{instrument}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Selected Instruments:</label>
        <ul>
          {selectedInstruments.map((instrument, index) => (
            <li key={index}>
              {instrument}
              <button type="button" className="button" style={{ marginLeft: '0.5rem' }} onClick={() => handleRemoveInstrument(instrument)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-group">
        <label htmlFor="audioFile">Audio File:</label>
        <input type="file" id="audioFile" name="audioFile" onChange={handleFileChange} accept="audio/*" className="form-control" />
        {isEditing && audioFile && (
          <div style={{ marginTop: '1rem' }}>
            <audio controls src={audioFile} style={{ width: '100%' }} />
            <button type="button" onClick={handleDeleteAudioFile} className="button" style={{ marginTop: '0.5rem' }}>
              Delete Audio File
            </button>
          </div>
        )}
      </div>

      <div className="form-group" style={{ textAlign: 'center' }}>
        <button className="button" type="submit">{isEditing ? 'Update Composition' : 'Add Composition'}</button>
        &nbsp;
        <button className="button" type="button" onClick={handleCancel}>Cancel</button>
        {!isEditing && (
          <div style={{ marginTop: '2rem' }}>
            <button type="button" className="button" onClick={fetchSpotifyTracks}>Search Spotify for {composerName}'s Tracks</button>
          </div>
        )}
        {spotifyTracks.length > 0 && (
  <div className="spotify-track-list">
    <h3>Tracks Found on Spotify:</h3>
    <ul>
      {spotifyTracks.map((track, index) => (
        <li key={index}>
          <strong>{track.name}</strong> – {track.album} ({track.year}) — {track.duration}
        </li>
      ))}
    </ul>
  </div>
)}
        {spotifyTracks.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <button type="button" className="button" onClick={handleAddSpotifyTracks}>Add New Tracks to Database</button>
          </div>
        )}
      </div>

      {errors.submit && <div className="error">{errors.submit}</div>}
    </form>
  );
};

export default CompositionForm;
