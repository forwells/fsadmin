import axios from "axios";
import Cookies from 'js-cookie'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT,
    timeout: 15000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
    },
})

instance.interceptors.request.use(async config => {

    const token = Cookies.get('access_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => response, error => {
    return Promise.reject(error)
})

const http = instance

export default http