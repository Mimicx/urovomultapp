import { getToken } from "../utils/tokenStorage";
import { API_FULL } from "../utils/urls";
import axios from "axios";

export const getMarcasVehiculos = async (page: number = 1) => {
    const token = await getToken();
    try {
        const resp = await axios.get(`${API_FULL}recaudacion/marcas-de-vehiculos?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return resp.data;
    } catch (error) {
        console.log('Error al obtener las marcas de vehículos: ', error);
        return [];
    }
};
