import {QpMostrarEstadoTextoEvent} from './QpMostrarEstadoTextoEvent';
import {QpInicializadoEvent} from './QpInicializadoEvent';
import {QpErrorEvent} from './QpErrorEvent';
import {QpRegresaTransaccionEvent} from './QpRegresaTransaccionEvent';

export type QpayControllerType = {
  init: (params: {
    identificador: string;
    contrasena: string;
    qpAmbiente: 'TEST' | 'PRODUCTION';
    qpMostrarEstadoTexto: (event: QpMostrarEstadoTextoEvent) => any;
  }) => Promise<QpInicializadoEvent | QpErrorEvent>;
  setQpAmbiente: (ambiente: 'TEST' | 'PRODUCTION') => Promise<void>;
  qpRealizaTransaccion: (params: {
    monto: number;
    propina: number;
    referencia: String;
    diferimiento: number;
    plan: number;
    numeroPagos: number;
    qpMostrarEstadoTexto: (event: QpMostrarEstadoTextoEvent) => any;
  }) => Promise<QpRegresaTransaccionEvent | QpErrorEvent>;
  qpRealizaTransaccionCancelacion: () => Promise<void>;
};
