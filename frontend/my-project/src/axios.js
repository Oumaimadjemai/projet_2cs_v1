// import axios from 'axios';
// const baseURL='http://127.0.0.1:8000/'
// const axiosInstance = axios.create({
//     baseURL : baseURL,

//     timeout:60000,
//     headers:{
    
//         Authorization:localStorage.getItem('access_token')
//         ? 'JWT ' + localStorage.getItem('access_token')
//         : null,
//         'Content-Type':'application/json',
//          Accept:'application/json'    
//     },
// }


// );
// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//         config.headers.Authorization = `JWT ${token}`;
//     }
//     return config;
// });
// export default axiosInstance;
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/'; // URL de base Django
const nodeAPI = 'http://localhost:3000/api'; // URL de votre serveur Node
 const nodeAPI5 = 'http://localhost:5005/api'; // URL de votre serveur Node5

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers:{
    
    Authorization:localStorage.getItem('access_token')
    ? 'JWT ' + localStorage.getItem('access_token')
    : null,
    'Content-Type':'application/json',
     Accept:'application/json'    
},
});

// Intercepteur pour les requêtes Django
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Si erreur 401 et pas déjà une tentative de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentative de rafraîchissement du token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${baseURL}token/refresh/`, { refresh: refreshToken });
        
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `JWT ${response.data.access}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Échec du rafraîchissement du token:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Instance spécifique pour le serveur Node
// export const nodeAxios = axios.create({
//   baseURL: nodeAPI,
//   timeout: 60000,
//   headers:{
    
//     Authorization:localStorage.getItem('access_token')
//     ? 'JWT ' + localStorage.getItem('access_token')
//     : null,
//     'Content-Type':'application/json',
//      Accept:'application/json'    
// },
// });
export const nodeAxios = axios.create({
  baseURL: nodeAPI,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
   
  },
});




nodeAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const nodeAxios2 = axios.create({
  baseURL: nodeAPI5,
  timeout: 60000,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: 'application/json'
   
  },
});
nodeAxios2.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosInstance;