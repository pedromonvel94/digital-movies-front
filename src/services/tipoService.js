import axiosInstance from './axiosConfig';

const URL_MODULE = '/tipos';

export const obtenerTipos = async () => {
    const response = await axiosInstance.get(URL_MODULE);
    return response.data;
};

export const obtenerTipoPorId = async (id) => {
    const response = await axiosInstance.get(`${URL_MODULE}/${id}`);
    return response.data;
};

export const crearTipo = async (data) => {
    const response = await axiosInstance.post(URL_MODULE, data);
    return response.data;
};

export const actualizarTipo = async (id, data) => {
    const response = await axiosInstance.put(`${URL_MODULE}/${id}`, data);
    return response.data;
};

export const eliminarTipo = async (id) => {
    const response = await axiosInstance.delete(`${URL_MODULE}/${id}`);
    return response.data;
};
