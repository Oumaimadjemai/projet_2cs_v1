import axios from 'axios';
const baseURL='http://127.0.0.1:8000/'
const axiosInstance = axios.create({
    baseURL : baseURL,

    timeout:60000,
    headers:{
    
        Authorization:localStorage.getItem('access_token')
        ? 'JWT ' + localStorage.getItem('access_token')
        : null,
        'Content-Type':'application/json',
         Accept:'application/json'    
    },
}


);
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
});
export default axiosInstance;