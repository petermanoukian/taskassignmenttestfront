import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosApi = axios.create({
  baseURL,
  withCredentials: true,
         

});

export default axiosApi;


