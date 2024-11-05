import UUID from 'react-native-uuid';


export const RESPONSE_PAY_OBJECT_SCHEMA = "ResponsePayObject";
export const ResponsePayObjectSchema = {
  name: RESPONSE_PAY_OBJECT_SCHEMA,
  properties: {
    id: { type: 'string', default: UUID.v4() },
    affiliation: { type: 'string', optional: true },
    aid: { type: 'string', optional: true },
    amount: { type: 'string', optional: true },
    applicationLabel: { type: 'string', optional: true },
    authCode: { type: 'string', optional: true },
    bankName: { type: 'string', optional: true },
    bin: { type: 'string', optional: true },
    cardExpDate: { type: 'string', optional: true },
    cardNumber: { type: 'string', optional: true },
    cardType: { type: 'string', optional: true },
    cardTypeName: { type: 'string', optional: true },
    cityName: { type: 'string', optional: true },
    customerName: { type: 'string', optional: true },
    folioNumber: { type: 'string', optional: true },
    hasPin: { type: 'bool', optional: true },
    hexSign: { type: 'string', optional: true },
    internalNumber: { type: 'string', optional: true },
    isQps: { type: 'int', optional: true },
    isRePrint: { type: 'bool', optional: true },
    message: { type: 'string', optional: true },
    moduleCharge: { type: 'string', optional: true },
    moduleLote: { type: 'string', optional: true },
    orderId: { type: 'string', optional: true },
    preAuth: { type: 'string', optional: true },
    preStatus: { type: 'int', optional: true },
    promotion: { type: 'string', optional: true },
    rePrintDate: { type: 'string', optional: true },
    rePrintMark: { type: 'string', optional: true },
    reprintModule: { type: 'string', optional: true },
    responseCode: { type: 'string', optional: true },
    storeId: { type: 'string', optional: true },
    storeName: { type: 'string', optional: true },
    streetName: { type: 'string', optional: true },
    success: { type: 'bool', optional: true },
    tableId: { type: 'string', optional: true },
    terminalId: { type: 'string', optional: true },
    tipAmount: { type: 'string', optional: true },
    tipLessAmount: { type: 'string', optional: true },
    transDate: { type: 'string', optional: true },
    transType: { type: 'string', optional: true },
    transactionCertificate: { type: 'string', optional: true },
    transactionId: { type: 'string', optional: true }
  }
};

export const CATALOGO_SCHEMA = "Catalogo";
export const CatalogoSchema = {
  name: CATALOGO_SCHEMA,
  properties: {
    id: { type: 'string', default: UUID.v4() },
    descripcion: { type: 'string', optional: true },
    importe: {type: 'string', optional:true},
    cargo: {type:'string', optional:true},
    fundamento: {type:'string', optional:true},
    importe_total: {type: 'string', optional:true},
    importe_base: {type: 'string', optional:true},
    moneda: {type: 'string', optional:true},

  }
};

export const EVIDENCIA_SCHEMA = "Evidencia";
export const EvidenciaSchema = {
  name: EVIDENCIA_SCHEMA,
  properties: {
    full_path: { type: 'string', optional: true },
    base64: { type: 'string', optional: true }
  }
};

export const INFRACCION_SCHEMA = "Infraccion";
export const InfraccionSchema = {
  name: INFRACCION_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: UUID.v4() },
    nombre: { type: 'string', optional: true },
    apellido_paterno: { type: 'string', optional: true },
    apellido_materno: { type: 'string', optional: true },
    genero: { type: 'string', optional: true },
    fecha_nacimiento: { type: 'string', optional: true },
    estado: { type: 'string', optional: true },
    numero_de_celular: { type: 'string', optional: true },
    email: { type: 'string', optional: true },
    licencia: { type: 'string', optional: true },
    marca_vehicular_estatal_nay: { type: 'string', optional: true },
    numero_placa: {type:'string', optional:true},
    modelo: { type: 'string', optional: true },
    numero_de_identificacion_vehicular: { type: 'string', optional: true },
    submarca: { type: 'string', optional: true },
    tipo_de_vehiculo: { type: 'string', optional: true },
    cargos: { type: 'list', objectType: CATALOGO_SCHEMA },
    evidencias: { type: 'list', objectType: EVIDENCIA_SCHEMA },
    responsePayObject: {type:'list', objectType: RESPONSE_PAY_OBJECT_SCHEMA},
    cargo_total: {type: 'string', optional: true},
    folio: { type: 'string', optional: true },
    direccion_infraccion: { type: 'string', optional: true },
    fecha_hora:{type: 'string', optional:true},
    lat: { type: 'string', optional: true },
    lng: { type: 'string', optional: true },
    status: { type: 'bool', default: false, optional: true },
    id_user: {type:"string", optional:true}
  }
};
