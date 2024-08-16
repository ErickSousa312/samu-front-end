import axios from "axios";


const token = localStorage.getItem("token")

const api = axios.create({
    baseURL: 'http://localhost:4002',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

export default api