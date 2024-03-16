import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

const CompositionForm = ({ onCancel }) => {
  const { state } = useLocation();
  const { composerId } = state;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    year_of_composition: '',
    description: '',
    duration: '',
    instrumentation: [],
    composerId: composerId,
  });

  const [errors, setErrors] = useState({});
  const [instrumentList, setInstrumentList] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);

  useEffect(() => {
    if (!composerId) {
      navigate('/');
    }
  }, [composerId, navigate]);

  useEffect(() => {
    const fetchInstrumentList = async () => {
      try {
        const instruments = await ModernMaestroApi.getInstruments();
        setInstrumentList(instruments);
      } catch (error) {
        console.error('Failed to fetch instruments:', error);
      }
    };

    fetchInstrumentList();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    // Handle the input for 'year_of_composition', converting it to an integer
    if (name === 'year_of_composition') {
      const parsedValue = parseInt(value, 10) || '';
      setFormData({ ...formData, [name]: parsedValue });
    }
    // Directly set the value for 'duration' without parsing it to an integer
    else if (name === 'duration') {
      // Ensure the input matches the expected format (if necessary) here
      // Or simply assign the value directly
      setFormData({ ...formData, [name]: value });
    }
    // Handle other fields normally
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInstrumentDoubleClick = (instrument) => {
    setSelectedInstruments([...selectedInstruments, instrument]);
    const updatedInstrumentation = [...formData.instrumentation, instrument];
    setFormData({ ...formData, instrumentation: updatedInstrumentation });
  };

  const handleInstrumentChange = (selectedOptions) => {
    const selectedInstruments = Array.from(selectedOptions).map((option) => option.value);
    setFormData({ ...formData, instrumentation: selectedInstruments });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Remove duplicate instruments before submitting
    const uniqueInstruments = [...new Set(formData.instrumentation)];
  
    // Convert MM:SS duration to total seconds for backend compatibility
    let totalSeconds = 0;
    if (formData.duration.includes(':')) {
      const [minutes, seconds] = formData.duration.split(':').map(Number);
      totalSeconds = minutes * 60 + seconds;
    } else {
      totalSeconds = parseInt(formData.duration, 10) || 0; // Fallback if not in MM:SS format
    }
  
    // Prepare the submission payload with the adjusted duration
    const submissionPayload = {
      title: formData.title,
      year: formData.year_of_composition, // Adjust according to your backend expectations
      description: formData.description,
      duration: totalSeconds, // Use the converted duration
      instrumentation: uniqueInstruments,
      composerId: parseInt(composerId), // Ensure composerId is included and correctly formatted
    };
  
    try {
      await ModernMaestroApi.createComposition(submissionPayload);
      alert('Composition added successfully!');
      navigate(`/composers/${composerId}`); // Navigate back to composer detail page or a success page
    } catch (error) {
      console.error('Error creating composition:', error.message);
      // Adjust error handling to provide more specific feedback if possible
      alert(`Error creating composition: ${error.response?.data?.error || 'Please try again.'}`);
    }
  };
  
  

  const handleCancel = () => {
    onCancel();
  };

  const currentYear = new Date().getFullYear();
const earliestYear = 1900; // Adjust based on your requirements
const years = Array.from({length: currentYear - earliestYear + 1}, (v, k) => currentYear - k);


  return (
    <form onSubmit={handleSubmit}>
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
          pattern="[0-5][0-9]:[0-5][0-9]" // Simple pattern to match the MM:SS format
          title="Duration in minutes and seconds (MM:SS)"
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
          required
          onDoubleClick={(e) => handleInstrumentDoubleClick(e.target.value)}
        >
          {instrumentList.map(instrument => (
            <option key={instrument} value={instrument}>{instrument}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Selected Instruments</label>
        <ul>
          {selectedInstruments.map((instrument, index) => (
            <li key={index}>{instrument}</li>
          ))}
        </ul>
      </div>
      <button type="submit">Add Composition</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
      {errors.submit && <div>{errors.submit}</div>}
    </form>
  );
};

export default CompositionForm;
