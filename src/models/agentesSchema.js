export const AGENTE_SCHEMA = "AgenteSchema";
export const UNIDAD_SCHEMA = "UnidadSchema";

export const AgenteSchema = {
    name: 'Agente',
    primaryKey: 'id',
    properties: {
        id: 'int',
        clave: 'string',
        numero_de_agente: 'string',
        nombre: 'string',
        apellido_paterno: 'string',
        apellido_materno: 'string',
        nombre_completo: 'string',
        puesto: 'string',
        observaciones: 'string',
        puesto_policial: 'int',
        usuario: 'int',
        unidad_responsable: 'string?',
        credencial_expedida_por: 'string?',
        fecha_expedicion_credencial: 'date?',
        fecha_vigencia_credencial: 'date?',
    },
};

export const UnidadSchema = {
    name: 'Unidad',
    primaryKey: 'id',
    properties: {
        id: 'int',
        clave: 'string',
        numero_de_unidad: 'string',
        descripcion: 'string',
        numero_de_placa: 'string',
        numero_de_serie: 'string',
        año_del_modelo: 'int',
        marca_de_vehiculo: 'string',
        linea_de_vehiculo: 'string',
        tipo_de_vehiculo: 'string?',
        color_secundario: 'string',
        observaciones: 'string',
        color_del_vehiculo: 'int',
        linea: 'string?',
        unidad_responsable: 'int',
    },
};
