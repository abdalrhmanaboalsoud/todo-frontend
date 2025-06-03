import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL query parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        console.error('No token found in URL');
        navigate('/login');
        return;
      }

      try {
        const success = await handleGoogleCallback(token);
        if (success) {
          // Get the redirect URL from state or default to home
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}

export default GoogleCallback; 