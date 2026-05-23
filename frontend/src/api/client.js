import axios from 'axios';

const API = axios.create({
  // Django runs on port 8000, not 5000
  baseURL: 'http://127.0.0.1:8000/api', 
  timeout: 5000,
});

export default API;