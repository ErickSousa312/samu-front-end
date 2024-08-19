import axios from "axios";


const token = localStorage.getItem("token")

const api = axios.create({
    baseURL: 'https://5170-170-233-149-18.ngrok-free.app/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

export default api