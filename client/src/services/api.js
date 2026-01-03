import axios from 'axios';
const apiUrl = (import.meta.env.VITE_SERVER_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// Create an instance of Axios with default configurations
const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
