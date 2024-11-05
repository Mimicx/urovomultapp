export interface Agentes {
    id: number;
    clave: string;
    numero_de_agente: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombre_completo: string;
    puesto: string;
    observaciones: string;
    puesto_policial: number;
    usuario: number;
    unidad_responsable: null;
    credencial_expedida_por: null | string;
    fecha_expedicion_credencial: null;
    fecha_vigencia_credencial: null;
}

export interface Unidades {
    id: number;
    clave: string;
    numero_de_unidad: string;
    descripcion: string;
    numero_de_placa: string;
    numero_de_serie: string;
    año_del_modelo: number;
    marca_de_vehiculo: string;
    linea_de_vehiculo: string;
    tipo_de_vehiculo: null;
    color_secundario: string;
    observaciones: string;
    color_del_vehiculo: number;
    linea: null;
    unidad_responsable: number;
}
