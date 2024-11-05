import { getRealmInstance } from './cargoController';

export const saveAgente = async (agente: any) => {
    try {
        const realm = getRealmInstance();
        realm.write(() => {
            const existingAgente = realm.objects('Agente')[0];
            if (existingAgente) {
                existingAgente.clave = agente.clave;
                existingAgente.numero_de_agente = agente.numero_de_agente;
                existingAgente.nombre = agente.nombre;
                existingAgente.apellido_paterno = agente.apellido_paterno;
                existingAgente.apellido_materno = agente.apellido_materno;
                existingAgente.nombre_completo = agente.nombre_completo;
                existingAgente.puesto = agente.puesto;
                existingAgente.observaciones = agente.observaciones;
                existingAgente.puesto_policial = agente.puesto_policial;
                existingAgente.usuario = agente.usuario;
                existingAgente.unidad_responsable = agente.unidad_responsable;
                existingAgente.credencial_expedida_por = agente.credencial_expedida_por;
                existingAgente.fecha_expedicion_credencial = agente.fecha_expedicion_credencial;
                existingAgente.fecha_vigencia_credencial = agente.fecha_vigencia_credencial;
            } else {
                realm.create('Agente', agente);
            }
        });
        console.log('Agente guardado correctamente');
    } catch (error) {
        console.error('Error guardando agente:', error);
    }
};

export const getAgente = () => {
    try {
        const realm = getRealmInstance();
        const agente = realm.objects('Agente')[0];
        return agente ? agente : null;
    } catch (error) {
        console.error('Error obteniendo agente:', error);
        return null;
    }
};

export const saveUnidad = async (unidad: any) => {
    try {
        const realm = getRealmInstance();
        realm.write(() => {
            const existingUnidad = realm.objects('Unidad')[0];
            if (existingUnidad) {
                existingUnidad.clave = unidad.clave;
                existingUnidad.numero_de_unidad = unidad.numero_de_unidad;
                existingUnidad.descripcion = unidad.descripcion;
                existingUnidad.numero_de_placa = unidad.numero_de_placa;
                existingUnidad.numero_de_serie = unidad.numero_de_serie;
                existingUnidad.año_del_modelo = unidad.año_del_modelo;
                existingUnidad.marca_de_vehiculo = unidad.marca_de_vehiculo;
                existingUnidad.linea_de_vehiculo = unidad.linea_de_vehiculo;
                existingUnidad.tipo_de_vehiculo = unidad.tipo_de_vehiculo;
                existingUnidad.color_secundario = unidad.color_secundario;
                existingUnidad.observaciones = unidad.observaciones;
                existingUnidad.color_del_vehiculo = unidad.color_del_vehiculo;
                existingUnidad.linea = unidad.linea;
                existingUnidad.unidad_responsable = unidad.unidad_responsable;
            } else {
                realm.create('Unidad', unidad);
            }
        });
        console.log('Unidad guardada correctamente');
    } catch (error) {
        console.error('Error guardando unidad:', error);
    }
};

export const getUnidad = () => {
    try {
        const realm = getRealmInstance();
        const unidad = realm.objects('Unidad')[0];
        return unidad ? unidad : null;
    } catch (error) {
        console.error('Error obteniendo unidad:', error);
        return null;
    }
};
