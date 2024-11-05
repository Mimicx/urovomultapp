import axios from "axios"
import { API_FULL } from "../utils/urls";
import { getToken } from "../utils/tokenStorage"

export const getGeneros = async () => {
    const token = await getToken();

    try {
        const resp = await axios.get(`${API_FULL}usuarios/generos`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        return resp.data;
    } catch (error) {
        console.log('Error al obtener géneros: ', error);
    }
}