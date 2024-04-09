import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ModernMaestroApi from '../api/api';


const CompositionForm = ({ onCancel }) => {
  const { state } = useLocation();
  const { compositionId } = useParams()
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
            } else if (composition.instrumentation && composition.instrumentation !== '["Not specified"]') {
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
            // audioFile doesn't need to be fetched; handle file uploads separately if allowing file change
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


  const handleChange = (event) => {
    const { name, value } = event.target;
    // Handle the input for 'year_of_composition', converting it to an integer
    if (name === 'year_of_composition') {
      const parsedValue = parseInt(value, 10) || '';
      setFormData({ ...formData, [name]: parsedValue });
    }
    // set the value for duration without parsing it to an integer
    else if (name === 'duration') {
      setFormData({ ...formData, [name]: value });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log(selectedFile); // For debugging
      setAudioFile(selectedFile); 
    }
  };

    const handleInstrumentDoubleClick = (instrument) => {
      // check if the instrument is already in the selectedInstruments array....If not, add it to the array to prevent duplicates.
      if (!selectedInstruments.includes(instrument)) {
          const updatedSelectedInstruments = [...selectedInstruments, instrument];
          setSelectedInstruments(updatedSelectedInstruments);
          
          // For formData.instrumentation, ensure it also doesn't contain duplicates.
          // Since it's possible formData.instrumentation and selectedInstruments
          // could get out of sync, it's safe to derive the updated state from
          // updatedSelectedInstruments directly.
          setFormData(formData => ({
              ...formData,
              instrumentation: updatedSelectedInstruments
          }));
      }
  };
  

  const handleInstrumentChange = (selectedOptions) => {
    // Map over selectedOptions to create an array of selected instrument names
    const selectedInstruments = Array.from(selectedOptions).map(option => option.value);
    // Exclude "Not specified" from selected instruments
    const filteredInstruments = selectedInstruments.filter(instrument => instrument !== "Not specified");
    // Use a Set to eliminate any duplicates and then spread it into an array
    const uniqueInstruments = [...new Set([...formData.instrumentation, ...filteredInstruments])];
  
    setFormData(formData => ({
      ...formData,
      instrumentation: uniqueInstruments,
    }));
  };


  // Function to remove a selected instrument
const handleRemoveInstrument = (instrumentToRemove) => {
  // Filter out the instrument to remove
  const updatedSelectedInstruments = selectedInstruments.filter(instrument => instrument !== instrumentToRemove);
  setSelectedInstruments(updatedSelectedInstruments);
  // Update formData to reflect the change
  setFormData({ ...formData, instrumentation: updatedSelectedInstruments });
};


const handleSubmit = async (event) => {
  event.preventDefault();
  // Check if duration field has been modified
  const durationToSubmit = formData.duration.trim() === '' ? originalDuration : formData.duration;
  const cleanInstrumentation = formData.instrumentation.filter(instr => instr && instr !== "Not specified");
  const totalSeconds = calculateTotalSeconds(durationToSubmit);
  // Format the duration string in the required format ("00:00" or "0:00")
  const formattedDuration = formatDuration(totalSeconds);

  const submissionFormData = new FormData();
    submissionFormData.append("title", formData.title);
    submissionFormData.append("year", formData.year_of_composition.toString());
    submissionFormData.append("description", formData.description);
    submissionFormData.append("instrumentation", JSON.stringify(cleanInstrumentation));
    submissionFormData.append("composerId", formData.composerId.toString());
    // console.log(audioFile, typeof audioFile, audioFile instanceof Blob);
    if (audioFile instanceof File) {
      submissionFormData.append('audioFile', audioFile, audioFile.name);
    }
    // Only append the duration field if it has been modified
    if (formData.duration !== originalDuration) {
      submissionFormData.append("duration", formattedDuration); 
    }

    try {
      let response;
      if (isEditing) {
        response = await ModernMaestroApi.updateCompositionWithFile(compositionId, submissionFormData);
        navigate(`/compositions/${compositionId}`);
      } else {
        response = await ModernMaestroApi.createCompositionWithFile(submissionFormData);
        console.log('API Response for new composition:', response); // 

        const newCompositionId = response.composition?.composition_id;
        if (newCompositionId) {
          navigate(`/compositions/${newCompositionId}`);
        } else {
          console.error('New composition ID was not returned by the API');
          navigate('/compositions'); 
        }
      }
    } catch (error) {
      console.error('Error saving composition:', error);
      alert(`Error saving composition: ${error?.response?.data?.error || 'Please try again.'}`);
    }
  };

// Update the render of selected instruments to include a remove option
const renderSelectedInstruments = () => (
  <ul>
    {selectedInstruments.map((instrument, index) => (
      <li key={index}>
        {instrument}
        <button type="button" onClick={() => handleRemoveInstrument(instrument)}>Remove</button>
      </li>
    ))}
  </ul>
);

  const handleCancel = () => {
    onCancel();
  };

  const handleDeleteAudioFile = () => {
    setAudioFile(null); // Removes the audio file from local state
    // If needed, add API call here to remove the file from the backend
  };

    const currentYear = new Date().getFullYear();
    const earliestYear = 1900; // Adjust based on your requirements
    const years = Array.from({length: currentYear - earliestYear + 1}, (v, k) => currentYear - k);


  return (
    <form onSubmit={handleSubmit}>
        {composerName && (
        <div>
          <h2>Adding composition for {composerName}</h2>
        </div>
      )}
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="year">Year Composed</label>
        <select
        id="year_of_composition"
        name="year_of_composition"
        value={formData.year_of_composition}
        onChange={handleChange}
        required
      >
  <option value="">Select a Year</option>
  {years.map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="duration">Duration</label>
        <input
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="MM:SS" // Guide text
          pattern="(?:[0-5]?[0-9]):[0-5][0-9]" // Updated pattern
          title="Duration in minutes and seconds (MM:SS or M:SS)"
        />
      </div>
      <div>
        <label htmlFor="instrumentation">Instrumentation</label>
        <select
          id="instrumentation"
          name="instrumentation"
          multiple
          value={formData.instrumentation} // Ensure formData.instrumentation is an array
          onChange={(e) => handleInstrumentChange(e.target.selectedOptions)}
          // required
          onDoubleClick={(e) => handleInstrumentDoubleClick(e.target.value)}
        >
          {instrumentList.map(instrument => (
            <option key={instrument} value={instrument}>{instrument}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Selected Instruments</label>
        {renderSelectedInstruments()}
        <ul>
          {selectedInstruments.map((instrument, index) => (
            <li key={index}>{instrument}</li>
          ))}
        </ul>
      </div>
      <div>
    <label htmlFor="audioFile" className="file-upload-label">Choose File</label>
  <input
    type="file"
    id="audioFile"
    name="audioFile"
    onChange={handleFileChange}
    accept="audio/*"
    // style={{ display: 'none' }} // Keep the input hidden
  />


  {isEditing && audioFile && (
    <div>
    <audio controls src={audioFile}>
      Your browser does not support the audio element.
    </audio>
    <button onClick={handleDeleteAudioFile}>Delete Audio File</button> {/* Delete button */}
  </div>
  )}
      </div>
      <button type="submit">{isEditing ? 'Update Composition' : 'Add Composition'}</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
      {errors.submit && <div>{errors.submit}</div>}
    </form>
  );
};

export default CompositionForm;
