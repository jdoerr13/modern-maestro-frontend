import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../auth/UserContext';
import ModernMaestroApi from '../api/api';

function UpdateProfileForm() {
    const navigate = useNavigate();
    const { user: contextUser } = useUserContext();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        isComposer: localStorage.getItem('isComposer') === 'true', // Initialize from local storage
    });
    const [isUpdating, setIsUpdating] = useState({
        username: false,
        email: false,
        firstName: false,
        lastName: false,
        password: false,
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // Pre-fill the form with current user data
        if (contextUser) {
            setFormData({
                username: contextUser.username || '',
                email: contextUser.email || '',
                firstName: contextUser.firstName || '',
                lastName: contextUser.lastName || '',
                password: '', // Password shouldn't be pre-filled
                isComposer: localStorage.getItem('isComposer') === 'true', // Populate from local storage
            });
        }
    }, [contextUser]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: fieldValue,
        }));
        if (type === 'checkbox') {
            localStorage.setItem('isComposer', checked); // Update local storage
        }
    };

    const handleUpdate = async (field) => {
        console.log(`Updating field: ${field} for user: ${contextUser.username}`, formData[field]);
        if (!contextUser.userId) return; // Ensure userId is available
        try {
            let updateData = {};
            // Map the field name to the appropriate key in the updateData object
            switch (field) {
                case 'isComposer':
                    updateData = { user_type: formData[field] ? 'composer' : 'normal' };
                    localStorage.setItem('isComposer', formData[field]); // Update local storage
                    break;
                // Add cases for other fields if needed
                default:
                    updateData = { [field]: formData[field] };
            }
            await ModernMaestroApi.updateUser(contextUser.username, updateData); // Use username for API path
            setIsUpdating({ ...isUpdating, [field]: false }); // Disable edit mode for this field
            // Consider re-fetching user details here to update contextUser with new data
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            setErrors(prevErrors => [...prevErrors, `Error updating ${field}: ${error.message}`]);
        }
    };

    const toggleUpdate = (field) => {
        setIsUpdating(prevIsUpdating => ({
            ...prevIsUpdating,
            [field]: !prevIsUpdating[field],
        }));
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <h2>Update Profile</h2>
            {Object.keys(isUpdating).map((field) => (
                <div key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                    {isUpdating[field] ? (
                        <>
                            {field === 'isComposer' ? ( // Check if field is isComposer
                                <input
                                    type="checkbox"
                                    name={field}
                                    checked={formData[field]} // Use checked attribute for checkbox
                                    onChange={handleChange}
                                />
                            ) : (
                                <input
                                    type={field === 'password' ? 'password' : 'text'}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            )}
                            <button type="button" onClick={() => handleUpdate(field)}>Update</button>
                            <button type="button" onClick={() => toggleUpdate(field)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <span>{formData[field]}</span>
                            <button type="button" onClick={() => toggleUpdate(field)}>Edit</button>
                        </>
                    )}
                </div>
            ))}
            {errors.length > 0 && errors.map((error, index) => <div key={index}>{error}</div>)}
        </form>
    );
}

export default UpdateProfileForm;


