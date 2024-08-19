import axios from "axios";


const token = localStorage.getItem("token")

const api = axios.create({
    baseURL: 'https://libras.helpdesk-maraba.cloud/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

export default api