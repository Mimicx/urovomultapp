import * as React from 'react';
import {useState} from 'react';

import {HomeScreen} from './screens/HomeScreen';
import {Screen, Screens} from './constants/Screen';
import {PaymentResultScreen} from './screens/PaymentResultScreen';
import {ProcessingScreen} from './screens/ProcessingScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screens.HOME_SCREEN);
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [processingMessage, setProcessingMessage] = useState<
    string | undefined
  >();
  const [success, setSucess] = useState<boolean | undefined>(undefined);

  return (
    <>
      {screen === Screens.HOME_SCREEN && (
        <HomeScreen
          onPressStartPayment={amount => {
            setAmount(amount);
            setProcessingMessage('Insert Card Please');
            setTimeout(() => {
              setProcessingMessage('Contacting Bank...');
            }, 1500);
            setScreen(Screens.PROCESSING_SCREEN);
          }}
        />
      )}
      {screen === Screens.PROCESSING_SCREEN && (
        <ProcessingScreen
          amount={amount!}
          processingMessage={processingMessage!}
          onProcessingDone={() => {
            setSucess(false);
            setScreen(Screens.PAYMENT_RESULT_SCREEN);
          }}
        />
      )}
      {screen === Screens.PAYMENT_RESULT_SCREEN && (
        <PaymentResultScreen
          amount={amount!}
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
