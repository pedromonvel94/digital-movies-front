import axiosInstance from './axiosConfig';

const URL_MODULE = '/directores';

export const obtenerDirectores = async () => {
    const response = await axiosInstance.get(URL_MODULE);
    return response.data;
};

export const obtenerDirectorPorId = async (id) => {
    const response = await axiosInstance.get(`${URL_MODULE}/${id}`);
    return response.data;
};

export const crearDirector = async (data) => {
    const response = await axiosInstance.post(URL_MODULE, data);
    return response.data;
};

export const actualizarDirector = async (id, data) => {
    const response = await axiosInstance.put(`${URL_MODULE}/${id}`, data);
    return response.data;
};

export const eliminarDirector = async (id) => {
    const response = await axiosInstance.delete(`${URL_MODULE}/${id}`);
    return response.data;
};
