import { getToken } from "../utils/tokenStorage"
import { API_FULL } from "../utils/urls"
import axios from "axios"

export const getEstados = async () => {
    const token = await getToken();
    try {
        const resp = await axios.get(`${API_FULL}catalogos/estados`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        return resp.data;

    } catch (error) {
        console.log('Error al obtener los estados: ', error);
    }
}