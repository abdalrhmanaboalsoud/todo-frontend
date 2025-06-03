import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = 'https://todo-server-9nwr.onrender.com';

// Validation functions
const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return errors;
};

const validateName = (name) => {
  const errors = [];
  if (!name || name.trim().length === 0) {
    errors.push('Name cannot be empty');
  }
  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (/[^a-zA-Z\s-']/.test(name)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
  }
  return errors;
};

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    first_name: [],
    last_name: [],
    currentPassword: [],
    newPassword: [],
    confirmPassword: [],
  });
  const [pictureErrors, setPictureErrors] = useState([]);
  const [pictureLoading, setPictureLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      }));
      setProfilePicture(user.profile_picture);
    }
  }, [user]);

  const validateField = (name, value) => {
    let fieldErrors = [];
    
    switch (name) {
      case 'first_name':
      case 'last_name':
        fieldErrors = validateName(value);
        break;
      case 'newPassword':
        if (value) {
          fieldErrors = validatePassword(value);
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.newPassword) {
          fieldErrors.push('Passwords do not match');
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));

    return fieldErrors.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate names
    const isFirstNameValid = validateField('first_name', formData.first_name);
    const isLastNameValid = validateField('last_name', formData.last_name);

    if (!isFirstNameValid || !isLastNameValid) {
      setMessage({
        type: 'error',
        text: 'Please fix the validation errors before updating your profile'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/api/profile`,
        {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    const isNewPasswordValid = validateField('newPassword', formData.newPassword);
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

    if (!isNewPasswordValid || !isConfirmPasswordValid) {
      setMessage({
        type: 'error',
        text: 'Please fix the password validation errors'
      });
      return;
    }

    if (!formData.currentPassword) {
      setErrors(prev => ({
        ...prev,
        currentPassword: ['Current password is required']
      }));
      setMessage({
        type: 'error',
        text: 'Please enter your current password'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.patch(
        `${API_URL}/api/profile/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setErrors({
        ...errors,
        currentPassword: [],
        newPassword: [],
        confirmPassword: [],
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update password'
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePicture = (file) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!file) {
      errors.push('Please select a file');
      return errors;
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPG, PNG, and GIF files are allowed');
    }

    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }

    return errors;
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    const validationErrors = validatePicture(file);
    
    setPictureErrors(validationErrors);
    if (validationErrors.length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setPictureLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Log the file details for debugging
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const response = await axios.post(
        `${API_URL}/api/profile/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          // Add timeout and max content length
          timeout: 30000, // 30 seconds
          maxContentLength: 5 * 1024 * 1024, // 5MB
        }
      );

      if (response.data && response.data.profilePicture) {
        setProfilePicture(response.data.profilePicture);
        updateUser({ ...user, profile_picture: response.data.profilePicture });
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        setPictureErrors([]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Profile picture upload error:', error);
      let errorMessage = 'Failed to update profile picture';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }

      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setPictureLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    setPictureLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.delete(
        `${API_URL}/api/profile/picture`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfilePicture(response.data.profilePicture);
      updateUser({ ...user, profile_picture: response.data.profilePicture });
      setMessage({ type: 'success', text: 'Profile picture removed successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to remove profile picture'
      });
    } finally {
      setPictureLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <img
              src={profilePicture ? `${API_URL}${profilePicture}` : '/default-profile.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            {profilePicture && !profilePicture.includes('default-profile.png') && (
              <button
                onClick={handleDeletePicture}
                disabled={pictureLoading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 disabled:opacity-50"
                title="Remove profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <label className="block">
                <span className="sr-only">Choose profile picture</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handlePictureUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50"
                  disabled={pictureLoading}
                />
              </label>
              {pictureErrors.length > 0 && (
                <div className="text-sm text-red-600">
                  {pictureErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                JPG, PNG or GIF (max. 5MB)
              </p>
              {pictureLoading && (
                <p className="text-sm text-blue-600">Updating profile picture...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleProfileUpdate}>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.first_name.length > 0 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.first_name.length > 0 && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.first_name.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.last_name.length > 0 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.last_name.length > 0 && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.last_name.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Password Update Form */}
      <div className="p-6 bg-white rounded-lg shadow">
        <form onSubmit={handlePasswordUpdate}>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                autoComplete="current-password"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currentPassword.length > 0 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.currentPassword.length > 0 && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.currentPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.newPassword.length > 0 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.newPassword.length > 0 && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.newPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword.length > 0 ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword.length > 0 && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside">
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 