import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ThemeContext } from '../ThemeContext';

const API_URL = 'https://todo-server-9nwr.onrender.com';
const DEFAULT_PROFILE_PICTURE = 'https://res.cloudinary.com/dzh4puawn/image/upload/v1748993287/profile_pictures/default-profile.svg';

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

// Add server health check
const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    console.log('Server health check:', response.data);
    return true;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const { darkMode } = useContext(ThemeContext);
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

  // Add message timeout cleanup
  useEffect(() => {
    let timeoutId;
    if (message.text) {
      timeoutId = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000); // Message will stay for 5 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]);

  // Update local state when user data changes
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

  // Add server health check on component mount
  useEffect(() => {
    const verifyServer = async () => {
      const isHealthy = await checkServerHealth();
      if (!isHealthy) {
        setMessage({
          type: 'error',
          text: 'Unable to connect to server. Please try again later.'
        });
      }
    };
    verifyServer();
  }, []);

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
      const requestData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim()
      };

      console.log('Starting profile update request...', {
        url: `${API_URL}/api/profile`,
        method: 'PATCH',
        headers: {
          Authorization: token ? 'Bearer [REDACTED]' : 'missing',
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      const response = await axios.patch(
        `${API_URL}/api/profile`,
        requestData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Check if response is valid and contains the expected data
      if (response?.data && typeof response.data === 'object') {
        console.log('Profile update successful:', response.data);
        // Update both local state and context
        const updatedUser = { ...user, ...response.data };
        updateUser(updatedUser);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Profile update error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        error: error
      });

      if (error.response?.status >= 400) {
        let errorMessage = 'Failed to update profile';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.response?.status === 403) {
          errorMessage = 'You are not authorized to perform this action.';
        }

        setMessage({
          type: 'error',
          text: errorMessage
        });
      } else if (!error.response && error.message !== 'Invalid response format from server') {
        setMessage({
          type: 'error',
          text: 'Network error. Please check your connection and try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords
    const isNewPasswordValid = validateField('newPassword', formData.newPassword);
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

    if (!isNewPasswordValid || !isConfirmPasswordValid) {
      setMessage({
        type: 'error',
        text: 'Please fix the password validation errors'
      });
      setLoading(false);
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
      setLoading(false);
      return;
    }

    try {
      console.log('Starting password update request...', {
        url: `${API_URL}/api/profile/password`,
        method: 'PATCH',
        headers: {
          Authorization: token ? 'Bearer [REDACTED]' : 'missing',
          'Content-Type': 'application/json'
        }
      });

      const response = await axios.patch(
        `${API_URL}/api/profile/password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Check if response is valid
      if (response && response.data) {
        console.log('Password update successful:', response.data);
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        // Clear the form
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        // Clear any validation errors
        setErrors({
          ...errors,
          currentPassword: [],
          newPassword: [],
          confirmPassword: [],
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      // Only show error if it's a real error, not a successful update
      if (error.response?.status >= 400) {
        console.error('Password update error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        let errorMessage = 'Failed to update password';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.response?.status === 403) {
          errorMessage = 'You are not authorized to perform this action.';
        }

        setMessage({
          type: 'error',
          text: errorMessage
        });
      } else if (!error.response && error.message !== 'Invalid response format from server') {
        // Only show network error if it's not a successful update
        console.error('Network error:', error);
        setMessage({
          type: 'error',
          text: 'Network error. Please check your connection and try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePicture = (file) => {
    const errors = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!file) {
      errors.push('Please select a file');
      return errors;
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPG, PNG, GIF, or WEBP files are allowed');
    }

    if (file.size > maxSize) {
      errors.push('File size must be less than 5MB');
    }

    return errors;
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationErrors = validatePicture(file);
    setPictureErrors(validationErrors);
    if (validationErrors.length > 0) {
      return;
    }

    setPictureLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      console.log('Starting picture upload...', {
        url: `${API_URL}/api/profile/picture`,
        method: 'POST',
        file: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      });

      const response = await axios.post(
        `${API_URL}/api/profile/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout for file upload
          maxContentLength: 5 * 1024 * 1024, // 5MB max
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Upload progress:', percentCompleted + '%');
          }
        }
      );

      // Check if response is valid and contains the expected data
      if (response?.data?.profilePicture) {
        console.log('Picture upload successful:', response.data);
        // Update both local state and context
        const updatedUser = { ...user, profile_picture: response.data.profilePicture };
        updateUser(updatedUser);
        setProfilePicture(response.data.profilePicture);
        setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
        setPictureErrors([]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Picture upload error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        error: error
      });

      if (error.response?.status >= 400) {
        let errorMessage = 'Failed to update profile picture';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.response?.status === 403) {
          errorMessage = 'You are not authorized to perform this action.';
        } else if (error.response?.status === 413) {
          errorMessage = 'File is too large. Maximum size is 5MB.';
        }

        setMessage({
          type: 'error',
          text: errorMessage
        });
      } else if (!error.response && error.message !== 'Invalid response format from server') {
        setMessage({
          type: 'error',
          text: 'Network error. Please check your connection and try again.'
        });
      }
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

      // Update both local state and context
      const updatedUser = { ...user, profile_picture: response.data.profilePicture };
      updateUser(updatedUser);
      setProfilePicture(response.data.profilePicture);
      setMessage({ type: 'success', text: 'Profile picture removed successfully!' });
    } catch (error) {
      console.error('Delete picture error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to remove profile picture'
      });
    } finally {
      setPictureLoading(false);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto p-8 py-12 ${darkMode ? 'dark bg-gray-950' : 'bg-gray-100'} transition-colors duration-300 rounded-xl shadow-lg`}>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900 dark:text-gray-100">Profile Settings</h1>

      {message.text && (
        <div className={`p-4 mb-8 rounded-lg text-center font-semibold transition-opacity duration-300 ${
          message.type === 'success' ? 'bg-green-500 text-white shadow-md' : 'bg-red-500 text-white shadow-md'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className={`mb-10 p-8 rounded-2xl shadow-xl ${darkMode ? 'dark:bg-gray-800 bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Profile Picture</h2>
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="relative flex-shrink-0">
            <img
              className="w-36 h-36 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              src={profilePicture || DEFAULT_PROFILE_PICTURE}
              alt="Profile"
            />
            {profilePicture && !profilePicture.includes('default-profile.svg') && (
              <button
                onClick={handleDeletePicture}
                disabled={pictureLoading}
                className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-3 hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 shadow-lg"
                title="Remove profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="space-y-4">
              <label className="block">
                <span className="sr-only">Choose profile picture</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePictureUpload}
                  className="block w-full text-sm text-gray-500 dark:text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-100 file:text-blue-700
                    hover:file:bg-blue-200
                    dark:file:bg-blue-800 dark:file:text-blue-100 dark:hover:file:bg-blue-700
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={pictureLoading}
                />
              </label>
              {pictureErrors.length > 0 && (
                <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {pictureErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPG, PNG, GIF, or WEBP (max. 5MB)
              </p>
              {pictureLoading && (
                <p className="text-sm text-blue-600 dark:text-blue-400">Updating profile picture...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <div className={`mb-10 p-8 rounded-2xl shadow-xl ${darkMode ? 'dark:bg-gray-800 bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
        <form onSubmit={handleProfileUpdate}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 text-base transition-colors duration-200 ${errors.first_name.length > 0 ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {errors.first_name.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.first_name.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 text-base transition-colors duration-200 ${errors.last_name.length > 0 ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {errors.last_name.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
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
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Password Update Form */}
      <div className={`p-8 rounded-2xl shadow-xl ${darkMode ? 'dark:bg-gray-800 bg-gray-800' : 'bg-white'} border border-gray-200 dark:border-gray-700`}>
        <form onSubmit={handlePasswordUpdate}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Change Password</h2>
          {/* Hidden username field for accessibility */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={user?.username || user?.email || ''}
            readOnly
            className="hidden"
          />
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                autoComplete="current-password"
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 text-base transition-colors duration-200 ${errors.currentPassword.length > 0 ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {errors.currentPassword.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.currentPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 text-base transition-colors duration-200 ${errors.newPassword.length > 0 ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {errors.newPassword.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.newPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 text-base transition-colors duration-200 ${errors.confirmPassword.length > 0 ? 'border-red-500 dark:border-red-400' : ''}`}
              />
              {errors.confirmPassword.length > 0 && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
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
            className="mt-8 w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; 