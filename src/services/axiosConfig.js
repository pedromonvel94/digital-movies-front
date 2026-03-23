import axios from 'axios';

// Creamos una "instancia" de Axios. 
// Esto nos permite definir una configuración global en un solo lugar 
// para no tener que repetir la URL del servidor en cada petición.
const axiosInstance = axios.create({
  // URL base apuntando al backend (Node.js) que corre en el puerto 4000
  baseURL: 'http://localhost:4000/api',

  // Establecemos que todas las comunicaciones serán enviando y recibiendo JSON
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
