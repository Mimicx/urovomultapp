// tokenStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import "core-js/stable/atob";
import { getRealmInstance } from './cargoController';
import { AUTH_SCHEMA } from '../models/authSchema';
import axios from 'axios';

interface AccessToken {
  "token_type": string;
  "exp": number;
  "jti": string;
  "sub": any;
  "name": string;
  "email": string;
  "entidad": number;
  "type": string;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null; // Añade manejo de errores según sea necesario
  }
}

// GET SUB..
export const getSub = async (): Promise<string | null> => {
  try {
    const token: string | null = await AsyncStorage.getItem('auth_token');
    if (token) {
      console.log('TOKEN RETRIEVE ', token);
      const decoded: AccessToken = parseJwt(token);
      return decoded.sub;
    }
    return null; // Retorna null si no hay token
  } catch (error) {
    // Manejar posibles errores
    console.error('Error retrieving the auth token', error);
    return null;
  }
};


// Nombre..
export const getName = async (): Promise<string | null> => {
  try {
    const token: string | null = await AsyncStorage.getItem('auth_token');
    if (token) {
      console.log('TOKEN RETRIEVE ', token);
      const decoded: AccessToken = parseJwt(token);
      return decoded.name;
    }
    return null; // Retorna null si no hay token
  } catch (error) {
    // Manejar posibles errores
    console.error('Error retrieving the auth token', error);
    return null;
  }
};

// Guardar el token en el almacenamiento
export const saveToken = async (token: string): Promise<void> => {
  // console.log('Token ', token)
  try {
    await AsyncStorage.setItem('auth_token', token);
  } catch (error) {
    // Manejar posibles errores
    console.error('Error saving the auth token', error);
  }
};

// Guardar token en almacenamiento asi como usuario y pw
export const saveAuthData = async (accessToken: string, refreshToken: string, email: string, password: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('auth_token', accessToken);
    await AsyncStorage.setItem('refresh_token', refreshToken);

    const realm = getRealmInstance();
    realm.write(() => {
      realm.create(AUTH_SCHEMA, {
        email,
        password,
        token: accessToken,
        refreshToken: refreshToken,
      }, 'modified');
    });
    console.log('Datos de autenticación guardados correctamente');
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

//Obtener la información de autenticación
export const getAuthData = () => {
  try {
    const realm = getRealmInstance();
    const authData = realm.objects(AUTH_SCHEMA)[0]; // Supón que solo tienes un registro
    return authData;
  } catch (error) {
    console.error('Error fetching auth data:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    return refreshToken;
  } catch (error) {
    console.error('Error retrieving the refresh token', error);
    return null;
  }
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      console.error('No hay refresh token disponible');
      return null;
    }

    const response = await axios.post(`https://apigrp.migob.mx/usuarios/refresh-token/`, {
      refresh: refreshToken
    });

    const newAccessToken = response.data.access;
    await saveToken(newAccessToken);
    console.log('Token actualizado correctamente');

    return newAccessToken;
  } catch (error) {
    console.error('Error al refrescar el token', error);
    return null;
  }
};

// Recuperar el token del almacenamiento
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      console.error('No hay token disponible');
      return null;
    }

    const decoded: AccessToken = parseJwt(token);
    if (!decoded || !decoded.exp) {
      console.error('No se pudo decodificar el token o falta la fecha de expiración');
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('El token ha caducado, intentando refrescar...');
      const newToken = await refreshToken();
      return newToken;
    }
    
    return token;
  } catch (error) {
    console.error('Error retrieving or refreshing the auth token', error);
    return null;
  }
};

// Eliminar el token del almacenamiento
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('auth_token');
  } catch (error) {
    // Manejar posibles errores
    console.error('Error removing the auth token', error);
  }
};
