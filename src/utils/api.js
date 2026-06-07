// API Configuration for different environments
const getApiUrl = () => {
  // Check for production environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();

// Helper function for API calls with error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper for authenticated API calls
export const authenticatedApiCall = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiCall(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
