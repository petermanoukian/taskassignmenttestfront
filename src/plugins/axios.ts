// src/plugins/axios.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseURL;

export default axios;

