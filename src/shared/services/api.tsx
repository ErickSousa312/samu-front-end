import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
  });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status >= 200 && status < 600) {
      return Promise.resolve(error.response);
    }
  }
  return Promise.reject(error);
});

export default api