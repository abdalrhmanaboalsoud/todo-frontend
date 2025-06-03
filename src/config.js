// API URL configuration with fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://todo-server-9nwr.onrender.com';

// Export both names for backward compatibility
export { API_URL };
export const REACT_APP_API_URL = API_URL;

// You can add other configuration variables here as needed
// export const OTHER_CONFIG = process.env.OTHER_CONFIG || 'default_value'; 