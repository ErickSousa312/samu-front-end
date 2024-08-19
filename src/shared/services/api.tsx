import axios from "axios";


const token = localStorage.getItem("token")

const api = axios.create({
    baseURL: 'https://api-logistic-1.onrender.com/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

export default api