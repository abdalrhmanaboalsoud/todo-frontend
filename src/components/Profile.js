import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';
import axios from 'axios';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put(
        `${API_URL}/api/profile`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
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
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.put(
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
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        `${API_URL}/api/profile/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setProfilePicture(response.data.profilePicture);
      updateUser({ ...user, profile_picture: response.data.profilePicture });
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update profile picture'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    setLoading(true);
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
      setLoading(false);
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
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profilePicture ? `${API_URL}${profilePicture}` : '/default-profile.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            {profilePicture && !profilePicture.includes('default-profile.png') && (
              <button
                onClick={handleDeletePicture}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <div>
            <label className="block">
              <span className="sr-only">Choose profile picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                disabled={loading}
              />
            </label>
            <p className="mt-1 text-sm text-gray-500">
              JPG, PNG or GIF (max. 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <form onSubmit={handleProfileUpdate} className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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

      {/* Password Update Form */}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
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
  );
};

export default Profile; 