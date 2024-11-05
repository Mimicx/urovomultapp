import {NativeModules} from 'react-native';
import {QpayControllerType} from './types/QpayControllerType';
import {NativeEventEmitter} from 'react-native';

export const QpayController: QpayControllerType = {
  init: async params => {
    const eventListener = nativeEventEmitter.addListener('qpMostrarEstadoTexto', params.qpMostrarEstadoTexto);
    try {
      const result = await NativeModules.QpayController.init(params.identificador, params.contrasena, params.qpAmbiente);
      eventListener.remove();
      return result;
    } catch (e) {
      eventListener.remove();
      throw e;
    }
  },
  setQpAmbiente: async () => {
    return NativeModules.QpayController.setQpAmbiente();
  },
  qpRealizaTransaccion: async params => {
    const eventListener = nativeEventEmitter.addListener('qpMostrarEstadoTexto', params.qpMostrarEstadoTexto);
    try {
      const result = await NativeModules.QpayController.qpRealizaTransaccion(params.monto, params.propina, params.referencia, params.diferimiento, params.plan, params.numeroPagos);
      eventListener.remove();
      return result;
    } catch (e) {
      console.log(`e`, e);
      eventListener.remove();
      throw e;
    }
  },
  qpRealizaTransaccionCancelacion: async () => {
    return NativeModules.QpayController.qpRealizaTransaccionCancelacion();
  },
};

export const nativeEventEmitter = new NativeEventEmitter(NativeModules.QpayController);
