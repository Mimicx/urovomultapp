export interface VehiculoResult {
    count: number;
    next: null;
    previous: null;
    results: VehiculoType[];
}

export interface VehiculoType {
    id: number;
    numero_de_placa_vigente: string;
    clave: string;
    numero_de_identificacion_vehicular: string;
    numero_de_chasis: null;
    numero_de_motor: string;
    observaciones: null;
    modelo: number;
    tarjeta_de_circulacion: null;
    capacidad_de_carga: number;
    registro_publico_vehicular: null;
    verificacion_tecnica_vehicular: null;
    es_propietario_ciudadano: boolean;
    fecha_de_expiracion_de_la_placa: null;
    fecha_expedicion_placa: null;
    clave_de_la_secretaria_de_hacienda_y_credito_publico: null | string;
    web_service: boolean;
    aduana: null;
    nombre_de_la_aduana: null;
    numero_de_patente: null;
    numero_de_pedimento: null;
    fecha_de_pedimento: null;
    clave_del_importador: null;
    clave_del_documento_de_regularizacion: null;
    servicio: number;
    estatus_del_vehiculo: number;
    tipo_de_vehiculo: number;
    clase_del_vehiculo: number;
    direccion: null;
    contribuyente_propietario: null;
    propietario: Propietario;
    usuario_verificador: null;
    documentos_de_tramite: any[];
    es_foraneo: boolean;
    version_vehicular: null;
    tipo_de_tenencia_vehicular: null;
    color_secundario: string;
    color_del_vehiculo: null;
    descripcion_de_la_agencia: null;
    capacidad_de_pasajeros: number;
    tipo_de_combustible: number;
    numero_de_puertas: number;
    es_vehiculo_nacional: boolean;
    pais: null;
    numero_de_calcomania: null;
    clave_de_servicio_publico: string;
    importe_de_la_factura: number;
    fecha_de_la_factura: Date;
    peso_del_vehiculo: null;
    numero_de_factura: null;
    exento_de_pago_de_tenencia: boolean;
    clave_de_repuve: string;
    fecha_de_repuve: null;
    tipo_de_movimiento_repuve: string;
    cilindraje: number;
    recargo_del_anio_2016: null;
    impuesto_del_anio_2016: null;
    es_fronterizo: boolean;
    marca_vehicular_estatal_nay: string;
    ultimo_ejercicio_pagado_de_refrendo: number;
    importe_de_tenencia_actual: number;
    recargo_de_tenencia_de_recargo_actual: number;
    linea: number;
    numero_economico: null;
    numero_economico_anterior: null;
    poliza_vigente: null;
    fecha_de_vigencia_de_poliza: null;
    uso_del_vehiculo: null;
    procedente_de_wizard: boolean;
    update_recibo: boolean;
    dar_baja_placa_por_reemplacamiento: boolean;
    rfv: null;
    estatus_registro_repuve: null;
    procedencia_vehiculo: null;
    rfc_emisor_cfdi: null;
    unidad_de_recaudacion: null;
    estados_globales: number;
    alerta: null;
    historial_de_placas: HistorialDePlaca[];
}

export interface HistorialDePlaca {
    id: number;
    numero_de_placa: string;
    vigente: boolean;
    fecha_de_baja: null;
    fecha_expedicion_placa: null;
    ciudadano: number;
    vehiculo: number;
    contribuyente_propietario: null;
    motocicleta: null;
    remolque: null;
    servicio_publico: null;
    estado: null;
    cantidad_de_placas: null;
    estado_de_la_placa: number;
    razon_de_suspencion: null;
    tramite: null;
    estados_globales: number;
}

export interface Propietario {
    id: number;
    clave_ciudadana: string;
    nombre_completo: string;
    direccion: Direccion;
    email: string;
    lada: number;
    numero_de_celular: number;
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

export interface MarcaResponse {
    count: number;
    next: null;
    previous: string;
    results: MarcaVehiculo[];
}

export interface MarcaVehiculo {
    id: number;
    clave: null | string;
    nombre: string;
    estados_globales: number;
}
