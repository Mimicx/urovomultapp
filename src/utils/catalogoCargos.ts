export interface Cargo {
  id: number;
  clave: string;
  descripcion: string;
  es_concepto_capturable: boolean;
  es_visible: boolean;
  es_concepto_repetible: boolean;
  maximo_de_concepto_repetido: number;
  es_importe_capturable: boolean;
  importe_de_moneda_fija_inicial: number;
  importe_de_moneda_minima: number;
  importe_de_moneda_maxima: number;
  fundamento_legal: number | null;
  descripcion_corta: null;
  monedas: number;
  capturable_de_fecha_inicial: boolean;
  capturable_de_fecha_final: boolean;
  capturable_de_nota_de_concepto: boolean;
  periodo_fiscal: number;
  clase_de_concepto_de_infraccion: number;
  tipo_de_cargo: number;
  grua: null;
  examen_medico: null;
  yarda: null;
}

export interface CargoSelected {
  cargoID: number;
  cargo: string;
  descripcion: string;
  importe: number;
  fundamento: string;
  importe_total: number;
  importe_base: number;
  moneda: string;
}

export const catalogoCargos = [
  {
    "id": 1,
    "clave": "123",
    "descripcion": "A) MANEJAR VEHÍCULO DE MOTOR, CON PERSONAS, MASCOTAS U OBJETOS QUE OBSTACULICEN LA CONDUCCIÓN",
    "es_concepto_capturable": true,
    "es_visible": true,
    "es_concepto_repetible": false,
    "maximo_de_concepto_repetido": 2,
    "es_importe_capturable": true,
    "importe_de_moneda_fija_inicial": 4.0,
    "importe_de_moneda_minima": 1.0,
    "importe_de_moneda_maxima": 5.0,
    "fundamento_legal": 70,
    "descripcion_corta": null,
    "monedas": 4,
    "capturable_de_fecha_inicial": false,
    "capturable_de_fecha_final": false,
    "capturable_de_nota_de_concepto": false,
    "periodo_fiscal": 9,
    "clase_de_concepto_de_infraccion": 1,
    "tipo_de_cargo": 11200,
    "grua": null,
    "examen_medico": null,
    "yarda": null
  },
  {
    "id": 2,
    "clave": "124",
    "descripcion": "B) ESTACIONARSE EN RAMPAS, O EN LUGARES RESERVADOS PARA VEHÍCULOS DE PERSONAS CON DISCAPACIDAD",
    "es_concepto_capturable": true,
    "es_visible": true,
    "es_concepto_repetible": false,
    "maximo_de_concepto_repetido": 2,
    "es_importe_capturable": true,
    "importe_de_moneda_fija_inicial": 1.0,
    "importe_de_moneda_minima": 1.0,
    "importe_de_moneda_maxima": 5.0,
    "fundamento_legal": 70,
    "descripcion_corta": null,
    "monedas": 4,
    "capturable_de_fecha_inicial": false,
    "capturable_de_fecha_final": false,
    "capturable_de_nota_de_concepto": false,
    "periodo_fiscal": 9,
    "clase_de_concepto_de_infraccion": 1,
    "tipo_de_cargo": 11198,
    "grua": null,
    "examen_medico": null,
    "yarda": null
  },
  {
    "id": 3,
    "clave": "125",
    "descripcion": "C) NO HACER ALTO EN VÍAS FÉRREAS Y ZONAS PEATONALES",
    "es_concepto_capturable": true,
    "es_visible": true,
    "es_concepto_repetible": false,
    "maximo_de_concepto_repetido": 2,
    "es_importe_capturable": true,
    "importe_de_moneda_fija_inicial": 3.0,
    "importe_de_moneda_minima": 1.0,
    "importe_de_moneda_maxima": 5.0,
    "fundamento_legal": 70,
    "descripcion_corta": null,
    "monedas": 4,
    "capturable_de_fecha_inicial": false,
    "capturable_de_fecha_final": false,
    "capturable_de_nota_de_concepto": false,
    "periodo_fiscal": 9,
    "clase_de_concepto_de_infraccion": 1,
    "tipo_de_cargo": 11204,
    "grua": null,
    "examen_medico": null,
    "yarda": null
  },
  {
    "id": 4,
    "clave": "12212D",
    "descripcion": "D) NO SEÑALAR CON ANTICIPACIÓN EL CAMBIO DE CARRIL;",
    "es_concepto_capturable": false,
    "es_visible": true,
    "es_concepto_repetible": false,
    "maximo_de_concepto_repetido": 2,
    "es_importe_capturable": false,
    "importe_de_moneda_fija_inicial": 1.0,
    "importe_de_moneda_minima": 0.0,
    "importe_de_moneda_maxima": 0.0,
    "fundamento_legal": null,
    "descripcion_corta": null,
    "monedas": 4,
    "capturable_de_fecha_inicial": false,
    "capturable_de_fecha_final": false,
    "capturable_de_nota_de_concepto": false,
    "periodo_fiscal": 9,
    "clase_de_concepto_de_infraccion": 1,
    "tipo_de_cargo": 13670,
    "grua": null,
    "examen_medico": null,
    "yarda": null
  }
]