import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../auth/UserContext';
import ModernMaestroApi from '../api/api';

function UpdateProfileForm() {
    const navigate = useNavigate();
    const { user: contextUser, setUser: setContextUser } = useUserContext();
    const [updateField, setUpdateField] = useState(null); // Track which field is being updated
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        user_type: '',
        firstName: '',
        lastName: '',
        password: '',
              // Add composer-related fields to formData
              composerName: '',
              biography: '',
              website: '',
              social_media_links: {},
    });
    const [errors, setErrors] = useState([]);

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfileAndData = async () => {
            try {
                if (contextUser && contextUser.username) {
                    const fetchedUser = await ModernMaestroApi.getUserByUsername(contextUser.username);
                    setFormData({
                        username: fetchedUser.username || '',
                        email: fetchedUser.email || '',
                        user_type: fetchedUser.user_type || '', // Assuming user_type is directly accessible
                        firstName: fetchedUser.firstName || '',
                        lastName: fetchedUser.lastName || '',
                        password: '', // Keep password field empty for security reasons
                    });
                }
            } catch (error) {
                console.error("Could not fetch user profile", error.message);
            }
        };

        fetchUserProfileAndData();
    }, [contextUser]); // Dependency on contextUser to refetch if it changes

    const startUpdate = (field) => {
        setUpdateField(field);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!updateField) return;

        const updateData = { [updateField]: formData[updateField] };
        if (updateField === 'password') {
            // Prepare password data differently if needed
        }

        try {
            const updatedUser = await ModernMaestroApi.updateUser(user.username, updateData);
            setUser(updatedUser); // Ensure the context is updated correctly
            setUpdateField(null); // Reset the field being updated
            alert(`Updated ${updateField} successfully.`);
        } catch (error) {
            console.error(`Error updating ${updateField}:`, error);
            setErrors(prevErrors => [...prevErrors, `Error updating ${updateField}`]);
        }
    };

    return (
        <div>
            {/* Iterate over user fields except for preferences */}
            {['username', 'email', 'user_type', 'firstName', 'lastName'].map(field => (
                <div key={field}>
                    {updateField === field ? (
                        <>
                            <input
                                name={field}
                                type={field === 'password' ? 'password' : 'text'}
                                value={formData[field]}
                                onChange={handleChange}
                            />
                            <button onClick={handleUpdate}>Submit</button>
                        </>
                    ) : (
                        <>
                            <span>{`${field}: ${formData[field]}`}</span>
                            <button onClick={() => startUpdate(field)}>Update {field}</button>
                        </>
                    )}
                </div>
            ))}
            {/* Handle password update separately */}
            {updateField === 'password' ? (
                <>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="New password"
                    />
                    <button onClick={handleUpdate}>Submit</button>
                </>
            ) : (
                <button onClick={() => startUpdate('password')}>Update Password</button>
            )}
            {errors.length > 0 && <div>{errors.join(', ')}</div>}
        </div>
    );
    
}

export default UpdateProfileForm;
