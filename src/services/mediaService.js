import axiosInstance from './axiosConfig';

const URL_MODULE = '/medias';

export const obtenerMedias = async () => {
    const response = await axiosInstance.get(URL_MODULE);
    return response.data;
};

export const obtenerMediaPorId = async (id) => {
    const response = await axiosInstance.get(`${URL_MODULE}/${id}`);
    return response.data;
};

export const crearMedia = async (data) => {
    const response = await axiosInstance.post(URL_MODULE, data);
    return response.data;
};

export const actualizarMedia = async (id, data) => {
    const response = await axiosInstance.put(`${URL_MODULE}/${id}`, data);
    return response.data;
};

export const eliminarMedia = async (id) => {
    const response = await axiosInstance.delete(`${URL_MODULE}/${id}`);
    return response.data;
};
