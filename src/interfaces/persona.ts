export interface Persona {
    id: number;
    clave_ciudadana: string;
    foto: null;
    CURP: string;
    INE: null;
    RFC: string;
    fecha_nacimiento: Date;
    email: string;
    nombre: string;
    apellido_paterno: string;
    es_ciudadano_considerado: boolean;
    apellido_materno: string;
    email_alternativo: null;
    numero_de_celular: number;
    lada: number;
    numero_verificado: boolean;
    tipo_de_considerado: null;
    direccion: Direccion;
    estado_civil: null;
    genero: null;
    nombre_completo: string;
    estados_globales: number;
    alerta: null;
}

export interface Direccion {
    id: number;
    calle_principal: string;
    codigo_postal: CodigoPostal;
}

export interface CodigoPostal {
    id: number;
    d_codigo: number;
    municipio: Municipio;
}

export interface Municipio {
    id: number;
    nom_mun: string;
    estado: Estado;
}

export interface Estado {
    id: number;
    nombre_de_AGEE: string;
    pais: Pais;
}

export interface Pais {
    id: number;
    descripcion: string;
    estados_globales: number;
}
