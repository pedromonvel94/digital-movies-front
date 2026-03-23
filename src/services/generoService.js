import axiosInstance from './axiosConfig';

// URL relativa para este módulo.
// Como axiosConfig ya tiene http://localhost:4000/api, 
// todas las peticiones aquí se le sumarán al final: http://localhost:4000/api/generos
const URL_MODULE = '/generos';

/**
 * Obtiene todos los géneros desde la base de datos.
 * Funciona haciendo un GET a http://localhost:4000/api/generos
 */
export const obtenerGeneros = async () => {
    // El método .get() le pide a Node.js la lista actual de registros.
    const response = await axiosInstance.get(URL_MODULE);
    // Devuelve los datos JSON para que los UseEffect de React los puedan mostrar.
    return response.data; 
};

/**
 * Carga la información de un Género específico (id).
 * Hace un GET a http://localhost:4000/api/generos/:id
 */
export const obtenerGeneroPorId = async (id) => {
    const response = await axiosInstance.get(`${URL_MODULE}/${id}`);
    return response.data;
};

/**
 * Envía un nuevo género para guardarse en la Base de Datos.
 * Funciona haciendo un POST recibiendo "data" (texto de los inputs del formulario).
 */
export const crearGenero = async (data) => {
    // El método .post() manda información nueva. Axios convierte 'data' a JSON automáticamente.
    const response = await axiosInstance.post(URL_MODULE, data);
    return response.data;
};

/**
 * Actualiza (Edita) un género que ya existe en MongoDB.
 * Funciona haciendo un PUT pasándole el ID y los nuevos valores.
 */
export const actualizarGenero = async (id, data) => {
    // El método .put() actualiza el registro completo.
    const response = await axiosInstance.put(`${URL_MODULE}/${id}`, data);
    return response.data;
};

/**
 * Trata de borrar un género de la Base de Datos.
 */
export const eliminarGenero = async (id) => {
    // El método .delete() hace exactamente lo que dice su nombre.
    const response = await axiosInstance.delete(`${URL_MODULE}/${id}`);
    return response.data;
};
