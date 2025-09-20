import axios from 'axios';

const baseURL = import.meta.env.VITE_WEB_URL || 'http://localhost:8000';

const axiosWeb = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default axiosWeb;



