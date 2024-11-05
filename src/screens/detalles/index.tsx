import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
   ActivityIndicator
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { Button, FAB } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import { colors, globalStyles } from '../../config/theme/app-theme';
import { usePersona } from '../../context/PersonaContext';
import { usePictures } from '../../context/PicturesContext';
import {QpayController} from '../../nativemodules/QpayController';
import { saveCharge } from '../../utils/cargoController';
import { CargoSelected } from '../../utils/catalogoCargos';
import { getName, getSub } from '../../utils/tokenStorage';

import LottieView from "lottie-react-native";

const width = Dimensions.get('screen').width;

const Detalles = () => {
  const navi = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const { persona, addPersona } = usePersona();
  const { pictures, removePicture } = usePictures();
  const [sub, setSub] = useState();
  const [name, setName] = useState<string | null>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalReturn, setModalReturn] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<any>(null);
  const [deviceModel, setDeviceModel] = useState('');
  const [folio, setFolio] = useState('');
  const [total, setTotal] = useState<number>(0.04); // Cambiar a 0.0 en prod.
  const [tip, setTip] = useState<number>(0);
  const [msi, setMsi] = useState<number>(0);
  const [selectedCargo, setSelectedCargo] = useState<CargoSelected | null>(null);
  const [cargoModalVisible, setCargoModalVisible] = useState(false);
  //////// MODAL AMOUNT //////////
  const [showModalAmount, setShowModalAmount] = useState(false);
  const [acceptAmount, setAcceptAmount] = useState(false);

  //////// PAY UROVO /////////
  const [initMessage, setInitMessage] = useState<string | undefined>();
  const [processingMessage, setProcessingMessage] = useState<string | undefined>();
  const [processingMessageCode, setProcessingMessageCode] = useState<number | undefined>();
  const [paymentResultMessage, setPaymentResultMessage] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>(false);
  const [modalPayProgress, setModalPayProgress] = useState<boolean | null>(false);
  const [modalStatus, setModalStatus] = useState<boolean | null>(false);

  useEffect(() => {
    if (acceptAmount) {
      makePayOnline();
    }
  }, [acceptAmount])


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
    const getDeviceModel = async () => {
      const model = await DeviceInfo.getModel();
      console.log('modal ', model);
      setDeviceModel(model);
    };

    getDeviceModel();
  }, []);

  const showCargoDetails = (cargo: CargoSelected) => {
    setSelectedCargo(cargo);
    setCargoModalVisible(true);
  };

  useLayoutEffect(() => {
    navi.setOptions({
      headerTitle: 'Detalles de la infracción',
      headerRight: () => (
        <Icon
          onPress={() => {
            navi.dispatch(StackActions.push('Catalogo'));
          }}
          name="pluscircle"
          style={{ fontSize: width * 0.055, color: 'white' }}
        />
      ),
    });
  }, [navi]);

  useEffect(() => {
    const fetchName = async () => {
      const userName = await getName();
      setName(userName);
      console.log('username ', userName);
    };
    fetchName();
  }, []);

  useEffect(() => {
    const fetchSub = async () => {
      const res: any = await getSub();
      setSub(res);
    };
    fetchSub();
  }, []);

  useEffect(() => {
    console.log('persona ', persona);
  }, [persona]);



  ///////// UROVO METHODS ///////
  const printVoucher = async(result:any) => {

    try{
      const printVoucher = await QpayController.qpPrintTransaction({
        identificador: '649',
        contrasena: '03Ld2E$3f',
        numeroTransaccion: result.NumeroTransaccion,
        email:'mimicgdl12@gmail.com',
        monto:total!,
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



  const makePayOnline = async () => {

    if (folio !== null && total > 0.00) {
      setModalPayProgress(true)
      try {
        const qpRealizaTransaccionResultEvent = await QpayController.qpRealizaTransaccion({
          monto: total!,
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
          console.log('result payevent err ',  qpRealizaTransaccionResultEvent.resultado)
          return;
        }
        console.log('resultado ', qpRealizaTransaccionResultEvent.resultado);
        setSuccess(true);
        setModalPayProgress(false);
        setModalStatus(true);
        setPaymentResultMessage(qpRealizaTransaccionResultEvent.resultado.NumeroTransaccion);
        console.log('result payevent numero transaccion', qpRealizaTransaccionResultEvent.resultado.NumeroTransaccion)
        /////// Imprimir voucher //////
        printVoucher(qpRealizaTransaccionResultEvent.resultado)
        return;
      } catch (e) {
        console.log('ex = ', e);
        throw e;
      }
    
    }


  }
 



  const openCameraScreen = () => {
    navi.dispatch(StackActions.push('Camera'));
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') return date;

    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${day}-${month}`;
  };

  const handleRemovePicture = (fullPath: string) => {
    removePicture(fullPath);
    setModalVisible(false);
  };

  const renderPictures = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedPicture(item);
          setModalVisible(true);
        }}>
        <Image
          key={item.full_path}
          source={{ uri: item.full_path }}
          style={{ width: 100, height: 100, borderRadius: 2, marginRight: 8 }}
        />
      </TouchableOpacity>
    );
  };

  const convertValuesToStringRecursively = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertValuesToStringRecursively(obj[key]);
        } else {
          obj[key] = String(obj[key]);
        }
      }
    }
    return obj;
  };

  const getCurrentTimestamp = () => {
    const timestamp = Date.now();
    return timestamp;
  };

  function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }


  



  const payOnline = () => {

    let values = persona;
    let id_user: any = sub;
    values.folio = getCurrentTimestamp().toString();
    values.id_user = id_user.toString();
    addPersona(values);
    let data:any = persona;
    let converted = convertValuesToStringRecursively(data);

    const tamount = converted.cargos.reduce((acc: number, currentValue: CargoSelected) => acc + Number(currentValue.importe_total), 0.00)

    console.log('tamount', tamount);
    setTotal(tamount);
    setFolio(values.folio);
    saveCharge(converted);
    //saveCharge(data);
    ///// MODAL MOSTRAR PANTALLA //////
    setShowModalAmount(true);
  };



  function obtenerImagenVehiculo(values: any) {
    if (values && values['imagenes'] && Array.isArray(values['imagenes'])) {
      const imagenVehiculo = values['imagenes'].find(
        (imagen) => imagen['text'] === 'Vehículo'
      );
      return imagenVehiculo ? imagenVehiculo['base64'] : null;
    }
    return null;
  }

  const saveCargoWithPrint = async () => {
    let values = persona;
    let id_user: any = sub;
    values.folio = getCurrentTimestamp().toString();
    values.id_user = id_user.toString();
    addPersona(values);
    console.log(values)
    let data = persona;
    data.imagenes = pictures;
    let dateTicket = getCurrentDateTime();
    data.fecha_hora = dateTicket;
    let converted = convertValuesToStringRecursively(data);  
    let person_address = '';
    let imagen = obtenerImagenVehiculo(values);
    const cargoTotal = converted.cargos.reduce((acc: number, currentValue: CargoSelected) => acc + Number(currentValue.importe_total), 0.00)
    
    console.log('cargos prev save',converted.cargos);
    /*saveCharge({ ...converted, total: cargoTotal });

    //console.log('images', values['imagenes'][0]['base64']);
    
    NetpayModule.print(
      values.folio,
      dateTicket,
      values.numero_placa,
      values.numero_de_identificacion_vehicular,
      values.nombre_infractor,
      values.numero_de_celular,
      values.email,
      values.direccion_infraccion,
      name,
      person_address,
      imagen,
      converted.cargos || [], // Enviar un array vacio en caso de no existir datos..
      cargoTotal,
    )
      .then((result: any) => {
        // console.log(result);
        navi.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Infracciones' }],
          }),
        );
      })
      .catch((error: any) => {
        console.error(error);
      });*/

      
  };

  const saveCargo = async () => {
    let values = persona;
    let id_user: any = sub;
    values.folio = getCurrentTimestamp().toString();
    values.id_user = id_user.toString();

    let currentDate = new Date();
    let options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    let formattedDate = currentDate.toLocaleString('es-ES', options).replace(",", "") + 'hrs';

    values.fecha_hora = formattedDate;
    addPersona(values);
    let data = { ...persona, ...pictures };
    let converted = convertValuesToStringRecursively(data);

    console.log('como queda la data ', converted);
    console.log('user_id', id_user);
    saveCharge(converted);

    navi.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Infracciones' }],
      }),
    );
  };

  const makeInfraction = () => {
    if (deviceModel === 'A910' || deviceModel === 'i9000S') {
      const options = ['PROCEDER AL PAGO', 'GENERAR TICKET', 'CANCELAR'];
      const destructiveButtonIndex = 0;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (selectedIndex: any) => {
          switch (selectedIndex) {
            case 0:
              payOnline();
              break;
            case 1:
              saveCargoWithPrint();
              break;
            case destructiveButtonIndex:
              break;
            case cancelButtonIndex:
              break;
          }
        },
      );
    } else {
      const options = ['GUARDAR INFRACCION', 'CANCELAR'];
      const destructiveButtonIndex = 0;
      const cancelButtonIndex = 2;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (selectedIndex: any) => {
          switch (selectedIndex) {
            case 0:
              saveCargo();
              break;
            case destructiveButtonIndex:
              break;
            case cancelButtonIndex:
              break;
          }
        },
      );
    }
  };

  const moveFileToPublicDirectory = async (filePath: string) => {
    const newFilePath = `${RNFS.DownloadDirectoryPath}/infraccion_${getCurrentTimestamp()}.pdf`;
    try {
      await RNFS.moveFile(filePath, newFilePath);
      console.log('Archivo movido a: ', newFilePath);
      Alert.alert('Archivo PDF', `El PDF se guardó exitosamente en la carpeta de Descargas.`);
      checkIfFileExists(newFilePath)
      return newFilePath;
    } catch (error) {
      console.error('Error al mover el archivo: ', error);
      Alert.alert('Error', 'No se pudo mover el archivo PDF.');
    }
  };

  const openPDF = (filePath: string) => {
    FileViewer.open(filePath)
      .then(() => {
        console.log('Archivo abierto');
      })
      .catch((error) => {
        console.error('Error abriendo el archivo', error);
      });
  };

  const checkIfFileExists = async (filePath: string) => {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        // openPDF(filePath);
        console.log('El archivo existe:', filePath);
      } else {
        console.log('El archivo no existe:', filePath);
      }
    } catch (error) {
      console.error('Error verificando el archivo:', error);
    }
  };

  const generatePDF = async () => {
    const folio = getCurrentTimestamp().toString();

    try {
      const htmlContent = `
        <html>
        <head>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #004085;
              font-size: 22pt;
              border-bottom: 2px solid #004085;
              padding-bottom: 10px;
            }
            h2 {
              color: #004085;
              font-size: 18pt;
              margin-top: 20px;
              border-bottom: 1px solid #004085;
              padding-bottom: 5px;
            }
            p {
              font-size: 12pt;
              margin: 5px 0;
            }
            .label {
              font-weight: bold;
              color: #212529;
            }
            .section {
              margin-bottom: 20px;
              padding: 10px;
              border: 1px solid #ced4da;
              border-radius: 5px;
              background-color: #f8f9fa;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #dee2e6;
              padding: 8px;
              text-align: left;
              font-size: 11pt;
            }
            th {
              background-color: #e9ecef;
              color: #495057;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1>Reporte de Infracción - Folio: ${folio}</h1>

          <div class="section">
            <h2>Detalles de la Persona</h2>
            <p><span class="label">Nombre:</span> ${persona.nombre_infractor || 'Sin datos'} ${persona.apellido_paterno_infractor || ''} ${persona.apellido_materno_infractor || ''}</p>
            <p><span class="label">Fecha de Nacimiento:</span> ${persona.fecha_nacimiento_infractor ? formatDate(persona.fecha_nacimiento_infractor) : 'Sin datos'}</p>
            <p><span class="label">Licencia:</span> ${persona.licencia || 'Sin datos de licencia'}</p>
            <p><span class="label">Correo Electrónico:</span> ${persona.email || 'Sin datos'}</p>
            <p><span class="label">Número de Celular:</span> ${persona.numero_de_celular || 'Sin datos'}</p>
          </div>

          ${persona.nombre_propietario ? `
          <div class="section">
            <h2>Detalles del Propietario</h2>
            <p><span class="label">Nombre completo:</span> ${persona.nombre_propietario || ''} ${persona.apellido_paterno_propietario || ''} ${persona.apellido_materno_propietario || ''}</p>
          </div>
          ` : ''}

          <div class="section">
            <h2>Detalles del Vehículo</h2>
            <p><span class="label">Tipo de Servicio:</span> ${persona.tipo_servicio || 'Sin datos'}</p>
            <p><span class="label">Placa:</span> ${persona.numero_placa || 'Sin datos'}</p>
            <p><span class="label">Número de Identificación Vehicular:</span> ${persona.numero_de_identificacion_vehicular || 'Sin datos'}</p>
          </div>

          <div class="section">
            <h2>Cargos</h2>
            <table>
              <thead>
                <tr>
                  <th>Cargo</th>
                  <th>Fundamento</th>
                  <th>Importe Base</th>
                  <th>Importe Total</th>
                </tr>
              </thead>
              <tbody>
                ${persona.cargos && persona.cargos.length > 0 ?
          persona.cargos.map(cargo => `
                  <tr>
                    <td>${cargo.descripcion}</td>
                    <td>${cargo.importe_total}</td>
                  </tr>
                `).join('') : '<tr><td colspan="4">No hay cargos registrados</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Ubicación</h2>
            <p><span class="label">Dirección de la Infracción:</span> ${persona.direccion_infraccion || 'Sin datos'}</p>
          </div>

        </body>
        </html>
      `;

      let options = {
        html: htmlContent,
        fileName: `infraccion_${folio}`,
        directory: 'Documents',
      };

      let file = await RNHTMLtoPDF.convert(options);
      console.log('PDF generado en: ', file.filePath);

      if (file.filePath) {
        const newFilePath = await moveFileToPublicDirectory(file.filePath);

        Alert.alert(
          'PDF generado',
          '¿Desea enviar el PDF por correo electrónico?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Enviar',
              onPress: () => sendEmailWithPDF(newFilePath ?? ''),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error generando el PDF: ', error);
    }
  };


  const sendEmailWithPDF = async (filePath: string) => {
    const shareOptions = {
      title: 'Enviar PDF',
      message: 'Adjunto el PDF generado con los detalles de la infracción.',
      url: `file://${filePath}`,
      type: 'application/pdf',
      social: Share.Social.EMAIL,
    };

    try {
      await Share.open(shareOptions);
      console.log('Archivo enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el archivo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 20 }}>
        {persona.nombre_infractor && persona.numero_de_celular && (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <Text
                style={[
                  globalStyles.subtitle,
                  { fontWeight: 'bold', color: colors.main },
                ]}>
                Detalles de la persona
              </Text>
              <IconF5
                size={14}
                name="edit"
                onPress={() => {
                  navi.dispatch(StackActions.push('Conductor'));
                }}
                style={{ color: colors.orange, marginLeft: 8 }}
              />
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Nombre completo{' '}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="profile"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.nombre_infractor}{' '}
                  {persona.apellido_paterno_infractor}{' '}
                  {persona.apellido_materno_infractor}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Fecha de Nacimiento{' '}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="calendar"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.fecha_nacimiento_infractor
                    ? formatDate(persona.fecha_nacimiento_infractor)
                    : 'Sin datos de fecha de nacimiento'}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Licencia{' '}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="idcard"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.licencia || 'Sin datos de licencia'}
                </Text>
              </View>
            </View>

            {persona.licencia && persona.licencia.length > 0 && (
              <View style={styles.container_text}>
                <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                  Vigencia de licencia
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="calendar"
                    style={{
                      fontSize: width * 0.04,
                      color: '#34495e',
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ color: colors.textPrimary }}>
                    {persona.vigencia_licencia
                      ? formatDate(persona.vigencia_licencia)
                      : 'Sin datos de vigencia'}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>Tipo de identificación</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='idcard' style={{ fontSize: width * 0.040, color: '#34495e', marginRight: 10 }} />
                <Text style={{ color: colors.textPrimary, textTransform: 'capitalize' }}>{persona.tipo_identificacion || 'Sin datos de identificación'}</Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Número de identificación
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="idcard"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.num_identificacion || 'Sin datos de identificación'}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Género
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconF5
                  size={14}
                  name="transgender"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.genero_infractor?.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Correo electrónico
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="mail"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>{persona.email}</Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Número de celular
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="phone"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.numero_de_celular}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Calle domicilio infractor
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="phone"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.calle_infractor ||
                    'Sin datos de la calle del domicilio del infractor'}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Colonia domicilio infractor
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="phone"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.colonia_infractor ||
                    'Sin datos de la colonia del domicilio del infractor'}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Municipio domicilio infractor
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="phone"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.municipio_infractor ||
                    'Sin datos del municipio del domicilio del infractor'}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>Estado domicilio infractor</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='phone' style={{ fontSize: width * 0.040, color: '#34495e', marginRight: 10 }} />
                <Text style={{ color: colors.textPrimary, textTransform: 'capitalize' }}>{persona.estado_infractor || 'Sin datos del estado del domicilio del infractor'}</Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Comentarios sobre el infractor
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="phone"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.comentarios || 'Sin comentarios'}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Tipo de padrón
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="phone"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.tipo_padron || 'Sin datos del padrón'}
                </Text>
              </View>
            </View>
          </>
        )}

        {persona.nombre_propietario && (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 8,
              }}>
              <Text
                style={[
                  globalStyles.subtitle,
                  { fontWeight: 'bold', color: colors.main },
                ]}>
                Detalles del propietario
              </Text>
              <IconF5
                size={14}
                name="edit"
                onPress={() => {
                  navi.dispatch(StackActions.push('Propietario'));
                }}
                style={{ color: colors.orange, marginLeft: 8 }}
              />
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Nombre completo propietario
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="profile"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.nombre_propietario}{' '}
                  {persona.apellido_paterno_propietario}{' '}
                  {persona.apellido_materno_propietario}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Detalles del vehículo */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            marginTop: 16,
          }}>
          <Text
            style={[
              globalStyles.subtitle,
              { fontWeight: 'bold', color: colors.main },
            ]}>
            Detalles del vehículo
          </Text>
          <IconF5
            size={14}
            name="edit"
            onPress={() => {
              navi.dispatch(StackActions.pop());
            }}
            style={{ color: colors.orange, marginLeft: 8 }}
          />
        </View>

        <View style={styles.container_text}>
          <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
            Tipo de servicio
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="idcard"
              style={{
                fontSize: width * 0.04,
                color: '#34495e',
                marginRight: 10,
              }}
            />
            <Text style={{ color: colors.textPrimary }}>
              {persona.tipo_servicio}
            </Text>
          </View>
        </View>

        {persona.tipo_servicio === 'PUBLICO' && (
          <>
            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Número económico
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="idcard"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.num_economico}
                </Text>
              </View>
            </View>

            <View style={styles.container_text}>
              <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
                Sitio o ruta
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="idcard"
                  style={{
                    fontSize: width * 0.04,
                    color: '#34495e',
                    marginRight: 10,
                  }}
                />
                <Text style={{ color: colors.textPrimary }}>
                  {persona.sitio_ruta}
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.container_text}>
          <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>Placa </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="idcard"
              style={{
                fontSize: width * 0.04,
                color: '#34495e',
                marginRight: 10,
              }}
            />
            <Text style={{ color: colors.textPrimary }}>
              {persona.numero_placa || 'Sin datos de la placa'}
            </Text>
          </View>
        </View>

        <View style={styles.container_text}>
          <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>Número de identificación vehicular</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='idcard' style={{ fontSize: width * 0.040, color: '#34495e', marginRight: 10 }} />
            <Text style={{ color: colors.textPrimary }}>{persona.numero_de_identificacion_vehicular}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 16 }}>
          <Text style={[globalStyles.subtitle, { fontWeight: 'bold', color: colors.main }]}>Ubicación</Text>
          <IconF5 size={14} name='edit' onPress={() => {
            navi.dispatch(
              StackActions.pop()
            );
          }} style={{ color: colors.orange, marginLeft: 8 }} />
        </View>

        <View style={styles.container_text}>
          <Text style={[globalStyles.inputLabel, { marginLeft: 0 }]}>
            Dirección de la infracción
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="idcard"
              style={{
                fontSize: width * 0.04,
                color: '#34495e',
                marginRight: 10,
              }}
            />
            <Text style={{ color: colors.textPrimary }}>
              {persona.direccion_infraccion}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            marginTop: 16,
          }}>
          <Text
            style={[
              globalStyles.subtitle,
              { fontWeight: 'bold', color: colors.main },
            ]}>
            Cargos
          </Text>
          <IconF5
            size={14}
            name="edit"
            onPress={() => {
              navi.dispatch(StackActions.push('Catalogo'));
            }}
            style={{ color: colors.orange, marginLeft: 8 }}
          />
        </View>

        {/* Modal cargos */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={cargoModalVisible}
          onRequestClose={() => setCargoModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedCargo && (
                <>
                  <Text style={styles.modalTitle}>Detalles del Cargo</Text>
                  <Text style={styles.modalDetailText}> {selectedCargo.descripcion}</Text>
                  <Text style={styles.modalDetailText}> Importe: ${selectedCargo.importe_total}</Text>
                </>
              )}
              <Button onPress={() => setCargoModalVisible(false)}>
                <Text style={{ color: colors.main }}>Cerrar</Text>
              </Button>
            </View>
          </View>
        </Modal>


        {/* Modal TOTAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalAmount}
          onRequestClose={() => setShowModalAmount(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>


              <Text style={styles.modalTitle}>TOTAL</Text>
              <Text style={styles.modalDetailText}> Importe: ${total}</Text>


              <Button onPress={() => {
                setAcceptAmount(true);
                setShowModalAmount(false);
              }}>
                <Text style={{ color: colors.main }}>ACEPTAR</Text>
              </Button>
            </View>
          </View>
        </Modal>


         {/* Modal TOTAL */}
       <Modal
          animationType="slide"
          transparent={true}
          visible={modalReturn}
          onRequestClose={() => setModalReturn(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>


              <Text style={styles.modalTitle}>¿Deseas regresar al menu principal?</Text>



              <Button onPress={() => {
                setModalReturn(false);
                navi.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Infracciones' }],
                  }),
                );
        
              }}>
                <Text style={{ color: colors.main }}>Si</Text>
              </Button>

              <Button onPress={() => {
                 setModalReturn(false);
              }}>
                <Text style={{ color: colors.main }}>No</Text>
              </Button>


            </View>
          </View>
        </Modal>

        {persona.cargos !== undefined &&
          persona.cargos.map((cargo: CargoSelected, index: number) => (
            <TouchableOpacity key={index} onPress={() => showCargoDetails(cargo)}>
              <View style={styles.container_text}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconF5 size={14} name='coins' style={{ fontSize: width * 0.040, color: '#34495e', marginRight: 10 }} />
                  <Text style={{ color: colors.textPrimary }}>{cargo.descripcion}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

        <Text
          style={[
            globalStyles.subtitle,
            {
              fontWeight: 'bold',
              color: colors.main,
              marginBottom: 8,
              marginTop: 16,
            },
          ]}>
          Evidencias
        </Text>
        <Button
          mode={'text'}
          textColor={colors.orange}
          icon="camera"
          style={{ marginVertical: 5, marginTop: 15 }}
          onPress={openCameraScreen}>
          Capturar Evidencias
        </Button>
        <FlatList
          data={pictures}
          renderItem={renderPictures}
          horizontal={true}
        />

        {/*  <TouchableOpacity onPress={ } style={[globalStyles.button, { backgroundColor: colors.orange }]}>
          <Text style={globalStyles.buttonText}>Generar PDF</Text>
        </TouchableOpacity>
 */}
      </ScrollView>

      <FAB
        icon="file"
        color={colors.main}
        style={globalStyles.fabButtonSecondary}
        onPress={generatePDF}
        size="medium"
      />

   

      <TouchableOpacity onPress={makeInfraction} style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Generar infracción</Text>
      </TouchableOpacity>




      <Modal
          visible={modalPayProgress}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalPayProgress(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
                
                 <Text style={styles.title}>Procesando Pago</Text>         
                 <Text style={styles.subtitle}>Cantidadd : ${total}</Text>                
                

              <Text style={styles.subtitle}>{processingMessage ?? ''}</Text>
              <ActivityIndicator size="large" color="blue" />
            </View>
          </View>
        </Modal>

      {(success)&&
        <Modal
          visible={modalStatus}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalStatus(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
                           <LottieView
                            source={require("../../public/success.json")}
                            style={{ width: "20%", height: "20%" }}
                            autoPlay
                            loop
                          />

                          <Text>Número Transacción: {paymentResultMessage}</Text>
            </View>

          </View>
        </Modal>
        }


      {selectedPicture && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.removeButton}>
                <Icon name="close" size={20} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalText}>{selectedPicture.text}</Text>
              <Image
                source={{ uri: selectedPicture.full_path }}
                style={styles.modalImage}
              />
              <Button
                mode="contained"
                onPress={() => handleRemovePicture(selectedPicture.full_path)}
                style={[globalStyles.button, { paddingVertical: 2 }]}>
                Eliminar
              </Button>
              {/* <Button mode="contained" onPress={() => setModalVisible(false)} style={[globalStyles.button, { paddingVertical: 2 }]}>
                Cerrar
              </Button> */}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
  },
  map: {
    alignSelf: 'center',
    width: width * 0.95,
    height: 200,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginVertical: 20,
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
    borderColor: colors.gray,
  },
  title: {
    marginVertical: 2,
    fontSize: width * 0.035,
    fontWeight: 'normal',
  },
  search: {
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#d1d1d1',
  },
  textInput: {
    fontSize: width * 0.053,
    fontWeight: 'bold',
    marginVertical: 5,
    marginLeft: 0,
    color: '#590E20',
  },
  input: {
    marginBottom: 10,
    height: 70,
  },
  row: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalImage: {
    width: width - 40,
    height: 200,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalButton: {
    marginTop: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    marginBottom: 10,
  },  
  subtitle: {fontSize: 20, paddingHorizontal: 16, marginBottom: 20},
  button: {padding: 15, backgroundColor: 'red', borderRadius: 8},
  modalDetailText: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.textPrimary,
  },
});

export default Detalles;
