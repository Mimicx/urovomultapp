'use client'

import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Text,Modal,TextInput,ActivityIndicator } from 'react-native';
import { Button, Snackbar,  } from 'react-native-paper';
import {getFundamentos, getTipoConcepto} from '../../utils/cargoController';
import {QpayController} from '../../nativemodules/QpayController';
import { globalStyles, colors } from '../../config/theme/app-theme'
import LottieView from "lottie-react-native";

const Index = () => {
  
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [initMessage, setInitMessage] = useState<string | undefined>();
  const [processingMessage, setProcessingMessage] = useState<string | undefined>();
  const [processingMessageCode, setProcessingMessageCode] = useState<number | undefined>();
  const [paymentResultMessage, setPaymentResultMessage] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>(false);
  const [modalAmount, setModalAmount] = useState<boolean | null>(false)
  const [modalMessagePay, setModalMessagePay] = useState<boolean | null>(false);
  const [modalPayDone, setModalPayDone] = useState<boolean | null>(false);
  const [modalCard, setModalCard] = useState<boolean | null>(false);
  const [modalPayProgress, setModalPayProgress] = useState<boolean | null>(false);
  const [waitingBank, setWaitingBank] = useState<boolean | null>(false);

  


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
        //setScreen(Screens.HOME_SCREEN);
      } catch (e: any) {
        console.log('e = ', e);
        if ((e.name = 'mx.qpay.controller.QpayControllerAlreadyInitializedException')) {
          setInitMessage(undefined);
          //setScreen(Screens.HOME_SCREEN);
          return;
        }
        throw e;
      }
    }

    initQpayController();
  }, []);


  useEffect(() => {

  },[])

  const printVoucher = async(result:any) => {

    try{
      const printVoucher = await QpayController.qpPrintTransaction({
        identificador: '649',
        contrasena: '03Ld2E$3f',
        numeroTransaccion: result.NumeroTransaccion,
        email:'mimicgdl12@gmail.com',
        monto:parseFloat(amount!),
        codigoAprobacion: result.CodigoAprobacion,
        referenciaBanco: result.ReferenciaBanco
      });
      console.log('print ', printVoucher);
    }
    catch(e)
    {
      console.log('e = ', e);
      throw e;
    }
  }


  const payUrovo = async () => {
    setModalAmount(false);
    console.log('amount', amount);
    setModalPayProgress(true);
    try {
      const qpRealizaTransaccionResultEvent = await QpayController.qpRealizaTransaccion({
        monto: parseFloat(amount!),
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
        //setScreen(Screens.PAYMENT_RESULT_SCREEN);
        console.log('result payevent err ',  qpRealizaTransaccionResultEvent.resultado)
        return;
      }
      console.log('resultado ', qpRealizaTransaccionResultEvent.resultado);
      setSuccess(true);
      setModalMessagePay(true);
      setModalPayProgress(false);
      setPaymentResultMessage(qpRealizaTransaccionResultEvent.resultado.NumeroTransaccion);
      console.log('result payevent numero transaccion', qpRealizaTransaccionResultEvent.resultado.NumeroTransaccion)
      //setScreen(Screens.PAYMENT_RESULT_SCREEN);
      printVoucher(qpRealizaTransaccionResultEvent.resultado)
      return;
    } catch (e) {
      console.log('ex = ', e);
      throw e;
    }

  }

  return (
    <View style={styles.container}>
            <Button onPress={()=>{setModalAmount(true)}}>Click to pay</Button>
            <Text>Numero transaccion : {paymentResultMessage}</Text>
        <Modal
          visible={modalAmount}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalAmount(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
                {
                    <TextInput
                    keyboardType='number-pad'
                    value={amount}
                    onChangeText={text => setAmount(text)}
                    placeholder='Cantidad'
                    style={{height: 50, borderColor: '#c3c3c3', width: 100, borderWidth: 1}}
                  />

                
                }
                <Button onPress={() => {
                  payUrovo()
                }}>Pagar</Button>
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalPayProgress}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalPayProgress(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
                
                 <Text style={styles.title}>Procesando Pago</Text>         
                 <Text style={styles.subtitle}>Cantidadd : ${amount}</Text>                
                

              <Text style={styles.subtitle}>{processingMessage ?? ''}</Text>
              <ActivityIndicator size="large" color="blue" />
            </View>
          </View>
        </Modal>



        {
          (success)?
                <Modal
                visible={modalMessagePay}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalMessagePay(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
                        
                        <LottieView
                          source={require("../../public/success.json")}
                          style={{ width: "100%", height: "100%" }}
                          autoPlay
                          loop
                        /> 


                    <Text style={styles.title}>{paymentResultMessage}</Text>
                    
                  </View>
                </View>

               </Modal>:


                  <Modal
                  visible={modalMessagePay}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setModalMessagePay(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
                     

                          <LottieView
                            source={require("../../public/fail.json")}
                            style={{ width: "100%", height: "100%" }}
                            autoPlay
                            loop
                          />
                   
                    </View>
                  </View>
                </Modal>
          
        }
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    marginBottom: 10,
  },
  title: {fontSize: 28, marginBottom: 20},
  subtitle: {fontSize: 20, paddingHorizontal: 16, marginBottom: 20},
  button: {padding: 15, backgroundColor: 'red', borderRadius: 8},
});

export default Index;
