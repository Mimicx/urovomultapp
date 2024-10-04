package com.olipaysdkexamplereactnativeapp.olipaysdk;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.olipaysdkexamplereactnativeapp.olipaysdk .utils.ReactUtils;

import java.util.HashMap;

import javax.annotation.Nullable;

import mx.qpay.client.QpAmbiente;
import mx.qpay.controller.QpLocale;
import mx.qpay.controller.QpayControlEventosImpl;
import mx.qpay.controller.QpayController;
import mx.qpay.controller.QpayControllerAlreadyInitializedException;
import mx.qpay.controller.QpayControllerNotInitializedException;
import mx.qpay.controller.TransactionOngoingException;

public class QpayControllerModule extends ReactContextBaseJavaModule {

    private static final boolean VGS_ENABLED = false;

    private ReactApplicationContext context;
    private String identificador;
    private String contrasena;

    QpayControllerModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @Override
    public String getName() {
        return "QpayController";
    }

    @ReactMethod
    public void init(String identificador, String contrasena, String qpAmbiente, Promise promise) {
        try {
            this.identificador = identificador;
            this.contrasena = contrasena;
            QpayController.requestPermission(getCurrentActivity());
            QpayController.init(context, identificador, contrasena, QpAmbiente.from(qpAmbiente), QpLocale.SPANISH, true, new QpayControlEventosImpl() {
                @Override
                public void qpInicializado() {
                    WritableMap map = Arguments.createMap();
                    map.putString("eventName", "qpInicializado");
                    promise.resolve(map);

                }

                @Override
                public void qpMostrarEstadoTexto(String resultado, int codigo) {
                    sendQpMostrarEstadoTextoEvent(resultado, codigo);
                }

                @Override
                public void qpError(String resultado, int codigo, boolean removeCardHint, String numeroTransaccion) {
                    resolveQpErrorEventPromise(resultado, codigo, removeCardHint, numeroTransaccion, promise);
                }

            });
        } catch (QpayControllerAlreadyInitializedException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void setQpAmbiente(String qpAmbiente, Promise promise) {
        getInstance().setQpAmbiente(QpAmbiente.from(qpAmbiente));
        promise.resolve(null);
    }

    @ReactMethod
    public void qpRealizaTransaccion(double monto, double propina, String referencia, int diferimiento, int plan, int numeroPagos, Promise promise) {
        try {
            getInstance().setQpListener(new QpayControlEventosImpl() {
                @Override
                public void qpRegresaTransaccion(HashMap<String, String> resultado) {
                    WritableMap map = Arguments.createMap();
                    map.putString("eventName", "qpRegresaTransaccion");
                    map.putMap("resultado", ReactUtils.toWritableStringMap(resultado));
                    promise.resolve(map);
                }

                @Override
                public void qpMostrarEstadoTexto(String resultado, int codigo) {
                    sendQpMostrarEstadoTextoEvent(resultado, codigo);
                }

                @Override
                public void qpError(String resultado, int codigo, boolean removeCardHint, String numeroTransaccion) {
                    resolveQpErrorEventPromise(resultado, codigo, removeCardHint, numeroTransaccion, promise);
                }

            });
            getInstance().qpRealizaTransaccion(context.getCurrentActivity(), identificador, contrasena, monto, propina, referencia, diferimiento, plan, numeroPagos);
        } catch (TransactionOngoingException e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }

    @ReactMethod
    public void qpRealizaTransaccionCancelacion(Promise promise) {
        getInstance().qpRealizaTransaccionCancelacion();
        promise.resolve(null);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    private QpayController getInstance() {
        try {
            return QpayController.getInstance();
        } catch (QpayControllerNotInitializedException e) {
            throw new RuntimeException("QpayController is not initialized");
        }
    }

    private void sendQpMostrarEstadoTextoEvent(String resultado, int codigo) {
        WritableMap map = Arguments.createMap();
        map.putString("eventName", "qpMostrarEstadoTexto");
        map.putString("resultado", resultado);
        map.putInt("codigo", codigo);
        sendEvent("qpMostrarEstadoTexto", map);
    }

    private static void resolveQpErrorEventPromise(String resultado, int codigo, boolean removeCardHint, String numeroTransaccion, Promise promise) {
        WritableMap map = Arguments.createMap();
        map.putString("eventName", "qpError");
        map.putString("resultado", resultado);
        map.putInt("codigo", codigo);
        map.putBoolean("removeCardHint", removeCardHint);
        if (numeroTransaccion != null) {
            map.putString("numeroTransaccion", numeroTransaccion);
        }
        promise.resolve(map);
    }

    private void sendEvent(String eventName, @Nullable WritableMap data) {
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }

}
