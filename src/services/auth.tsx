//import { logger } from '../utils/logger';
import { API_FULL } from '../utils/urls';
import axios from 'axios';

const login = async (email:string, password:string) => {
  try {
    const response = await axios.post('usuarios/login/', {
      email,
      password,
    });
    return response?.data?.access ? response?.data : null;
  } catch (error) {
    //logger('[login]', error);
  }
  return null;
};

export { login };