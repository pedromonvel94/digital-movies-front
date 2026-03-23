import axiosInstance from './axiosConfig';

const URL_MODULE = '/productoras';

export const obtenerProductoras = async () => {
    const response = await axiosInstance.get(URL_MODULE);
    return response.data;
};

export const obtenerProductoraPorId = async (id) => {
    const response = await axiosInstance.get(`${URL_MODULE}/${id}`);
    return response.data;
};

export const crearProductora = async (data) => {
    const response = await axiosInstance.post(URL_MODULE, data);
    return response.data;
};

export const actualizarProductora = async (id, data) => {
    const response = await axiosInstance.put(`${URL_MODULE}/${id}`, data);
    return response.data;
};

export const eliminarProductora = async (id) => {
    const response = await axiosInstance.delete(`${URL_MODULE}/${id}`);
    return response.data;
};
