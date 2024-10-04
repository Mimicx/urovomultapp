import * as React from 'react';
import {useState} from 'react';

import {HomeScreen} from './screens/HomeScreen';
import {Screen, Screens} from './constants/Screen';
import {PaymentResultScreen} from './screens/PaymentResultScreen';
import {ProcessingScreen} from './screens/ProcessingScreen';
import {useEffect} from 'react';
import {QpayController} from './module/QpayController';
import {InitPosScreen} from './screens/InitPosScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screens.INIT_POS_SCREEN);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [initMessage, setInitMessage] = useState<string | undefined>();
  const [processingMessage, setProcessingMessage] = useState<string | undefined>();
  const [processingMessageCode, setProcessingMessageCode] = useState<number | undefined>();
  const [paymentResultMessage, setPaymentResultMessage] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    async function initQpayController() {
      try {
        const initResultEvent = await QpayController.init({
          identificador: '649',
          contrasena: '03Ld2E$3f',
          qpAmbiente: 'TEST',
          qpMostrarEstadoTexto: event => {
            setInitMessage(event.resultado);
          },
        });
        console.log('initResultEvent = ', initResultEvent);
        setInitMessage(undefined);
        setScreen(Screens.HOME_SCREEN);
      } catch (e: any) {
        console.log('e = ', e);
        if ((e.name = 'mx.qpay.controller.QpayControllerAlreadyInitializedException')) {
          setInitMessage(undefined);
          setScreen(Screens.HOME_SCREEN);
          return;
        }
        throw e;
      }
    }

    initQpayController();
  }, []);

  return (
    <>
      {screen === Screens.INIT_POS_SCREEN && <InitPosScreen initMessage={initMessage} />}
      {screen === Screens.HOME_SCREEN && (
        <HomeScreen
          onPressStartPayment={async amount => {
            setAmount(amount);

            setScreen(Screens.PROCESSING_SCREEN);
            try {
              const qpRealizaTransaccionResultEvent = await QpayController.qpRealizaTransaccion({
                monto: parseFloat(amount),
                propina: 0,
                referencia: 'TEST',
                diferimiento: 0,
                plan: 0,
                numeroPagos: 0,
                qpMostrarEstadoTexto: event => {
                  setProcessingMessage(event.resultado);
                  setProcessingMessageCode(event.codigo);
                },
              });

              if (qpRealizaTransaccionResultEvent.eventName === 'qpError') {
                setSuccess(false);
                setPaymentResultMessage(qpRealizaTransaccionResultEvent.resultado);
                setScreen(Screens.PAYMENT_RESULT_SCREEN);
                return;
              }

              setSuccess(true);
              setPaymentResultMessage(qpRealizaTransaccionResultEvent.resultado.NumeroTransaccion);
              setScreen(Screens.PAYMENT_RESULT_SCREEN);
              return;
            } catch (e) {
              console.log('e = ', e);
              throw e;
            }
          }}
        />
      )}
      {screen === Screens.PROCESSING_SCREEN && (
        <ProcessingScreen
          amount={amount!}
          processingMessage={processingMessage}
          processingMessageCode={processingMessageCode}
          onPressCancel={async () => {
            await QpayController.qpRealizaTransaccionCancelacion();
          }}
        />
      )}
      {screen === Screens.PAYMENT_RESULT_SCREEN && (
        <PaymentResultScreen
          amount={amount!}
          paymentResultMessage={paymentResultMessage!}
          success={success!}
          onPressConfirm={() => {
            setAmount(undefined);
            setScreen(Screens.HOME_SCREEN);
          }}
        />
      )}
    </>
  );
};

export default App;
