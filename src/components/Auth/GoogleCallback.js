import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleCallback } = useAuth();
  const hasHandledCallback = useRef(false);

  const processCallback = useCallback(async (token) => {
    try {
      const success = await handleGoogleCallback(token);
      if (success) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      navigate('/login');
    }
  }, [handleGoogleCallback, navigate, location.state?.from?.pathname]);

  useEffect(() => {
    // Skip if we've already handled the callback
    if (hasHandledCallback.current) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      console.error('No token found in URL');
      navigate('/login');
      return;
    }

    // Mark that we're handling the callback
    hasHandledCallback.current = true;
    processCallback(token);
  }, [location.search, navigate, processCallback]);

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