import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Modal, Platform, Alert, Linking } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { FAB } from 'react-native-paper';
import { List, Button, Snackbar } from 'react-native-paper';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Picker } from '@react-native-picker/picker';
import { useConnection } from '../../context/ConnectionContext';
import { getAuthData, getName, getSub, getToken } from '../../utils/tokenStorage';
import Realm from 'realm';
//import { InfraccionSchema } from '../../models';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { insertNewObjects, getAllInfracciones, findInfraccionByPlaca, findInfraccionById, findEvidenciasByID, deleteAllData, updateStatus, insertLocalFundamentos, insertLocalTiposConceptos, getLocalConceptos, getFundamentos, getTipoConcepto } from '../../utils/cargoController';
const width = Dimensions.get('screen').width;


import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SearchHeader from '../../components/SearchHeader';
import { useSearch } from '../../context/SearchInfraccion';
import { removeToken } from '../../utils/tokenStorage';
import { globalStyles, colors } from '../../config/theme/app-theme';

import { API_CLOUD } from '../../utils/urls';
import { API_FULL } from '../../utils/urls';
import { usePictures } from '../../context/PicturesContext';

/// Lottie
import LottieView from "lottie-react-native";
import { usePersona } from '../../context/PersonaContext';


import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import { PermissionsAndroid } from 'react-native';
import { Agentes, Unidades } from '../../interfaces/agentes';
import { getAgente, getUnidad, saveAgente, saveUnidad } from '../../utils/agentesStorage';

// Utils...
import { CargoSelected } from '../../utils/catalogoCargos';

// Native Modules
import NetpayModule from '../../nativemodules/NetPayModule';

//axios
import axios from 'axios';


interface CargoBase {
  nombre: string,
  apellido_paterno: string,
  apellido_materno: string,
  genero: string,
  fecha_nacimiento: string,
  estado: string,
  numero_de_celular: string,
  email: string,
  licencia: string,
  marca_vehicular_estatal_nay: string,
  modelo: string,
  numero_de_identificacion_vehicular: string,
  submarca: string,
  tipo_de_vehiculo: string,
  cargos: [],
  id: string,
  status: boolean,
  id_user: string,
}


const Index = () => {
  const [cargos, setCargos] = useState<[CargoBase] | null>()
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState();
  const [personData, setPersonData] = useState<any>({});
  const [modalVisibleResponse, setModalVisibleResponse] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agentes, setAgentes] = useState<Agentes[]>([]);
  const [selectedAgente, setSelectedAgente] = useState(null);
  const [unidades, setUnidades] = useState<Unidades[]>([]);
  const [selectedUnidad, setSelectedUnidad] = useState(null);
  const [storedAgente, setStoredAgente] = useState<Agentes | null>(null);
  const [storedUnidad, setStoredUnidad] = useState<Unidades | null>(null);
  const [modalPickersVisible, setModalPickersVisible] = useState(false);

  const { cleanPersona, addPersona, persona } = usePersona();

  const { hasPermission, requestPermission } = useCameraPermission();

  const navigation = useNavigation();

  // State Context...
  const isConnected = useConnection();
  const { text, search } = useSearch();

  const { dropPictures } = usePictures();

  const checkLocationPermission = async () => {
    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (hasPermission) {
      console.log("El permiso de ubicación ya ha sido concedido.");
      return true;
    }
    return false;
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permisos de ubicación",
            message: "La aplicación necesita acceso a tu ubicación para mostrar tu posición en el mapa",
            buttonNeutral: "Pregúntame después",
            buttonNegative: "Cancelar",
            buttonPositive: "Aceptar",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Permiso de ubicación otorgado.");
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            "Permiso de ubicación denegado permanentemente",
            "Debes habilitar los permisos de ubicación manualmente en la configuración de la aplicación.",
            [{ text: "Abrir configuración", onPress: () => Linking.openSettings() }]
          );
        } else {
          Alert.alert("Permiso denegado", "El permiso de ubicación es requerido para mostrar la posición en el mapa.");
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };


  useEffect(() => {
    async function requestPermissions() {
      try {
        const cameraPermission = await requestPermission();
        if (!cameraPermission) {
          console.log("permiso denegado");
          return;
        }
        await requestStoragePermission();
      } catch (error) {
        console.error('Permission request error:', error);
      }
    }

    checkLocationPermission();
    requestLocationPermission();
    requestPermissions();
  }, [hasPermission]);

  const getAgentes = async () => {
    try {
      const token = await getToken();
      const resp = await fetch(`${API_FULL}catalogos/agentes-de-policias/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const agentesData = await resp.json();

      setAgentes(agentesData);
      // console.log(agentesData)
    } catch (error) {
      console.log('Error al obtener agentes: ', error)
    }
  }

  const fetchStoredData = async () => {
    try {
      const agente = getAgente();
      const unidad = getUnidad();

      if (agente) {
        setStoredAgente(agente);
      }
      if (unidad) {
        setStoredUnidad(unidad);
      }
    } catch (error) {
      console.error('Error al cargar agente/unidad guardados:', error);
    }
  };

  const getUnidades = async () => {
    try {
      const token = await getToken();
      const resp = await fetch(`${API_FULL}catalogos/unidades-policiacas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const unidadesData = await resp.json();

      setUnidades(unidadesData);
      // console.log(agentesData)
    } catch (error) {
      console.log('Error al obtener agentes: ', error)
    }
  }

  useEffect(() => {
    fetchStoredData();
    getAgentes();
    getUnidades();
  }, []);

  const saveAgenteUnidadHandler = async () => {
    if (selectedAgente && selectedUnidad) {
      try {
        await saveAgente(selectedAgente);
        await saveUnidad(selectedUnidad);

        const agente = getAgente();
        const unidad = getUnidad();

        if (agente) setStoredAgente(agente);
        if (unidad) setStoredUnidad(unidad);

      } catch (error) {
        console.error('Error al guardar agente/unidad:', error);
      }
    }
  };


  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permiso para acceso al almacenamiento",
          message:
            "Esta aplicación necesita acceder a tu almacenamiento para funcionar correctamente.",
          buttonNeutral: "Preguntarme Luego",
          buttonNegative: "Cancelar",
          buttonPositive: "Aceptar"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log("Ahora tienes acceso al almacenamiento");
      } else {
        console.log("Permiso de almacenamiento denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  }


  useEffect(() => {
    const fetchSub = async () => {
      const user_id: any = await getSub();
      setUserId(user_id);
    };

    fetchSub();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <SearchHeader onSearch={(word: string) => { search(word) }} />,
    });
  }, [navigation]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <FontAwesome name="user" size={20} color="#fff" />
          </MenuTrigger>
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption onSelect={signOut} text='Cerrar sesión' customStyles={optionStyles} />

            {/* Agrega más opciones según sea necesario */}
          </MenuOptions>
        </Menu>

      ),
    });
  }, [navigation]);

  const signOut = () => {
    removeToken();

    navigation.dispatch(
      StackActions.replace('Auth')
    );
  }



  const uploadData = async (data:any) => {
    console.log('data ', API_CLOUD);
    setModalVisible(false);
  
    try {
      const response = await axios.post('https://multapp.nebadon.cloud/insert', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      // Verificamos el status de la respuesta
      if (response.status === 200 && response.data.error) {
        console.log('Ese ID ya está guardado.');
        setIsSuccess(false);
        setModalVisibleResponse(true);
        setTimeout(() => setModalVisibleResponse(false), 2000);
      } else if (response.status === 201) {
        updateStatus(data.id);
        setIsSuccess(true);
        setModalVisibleResponse(true);
        

        const datax = getAllInfracciones();
        setCargos(datax);
  
        setTimeout(() => setModalVisibleResponse(false), 2000);
      }
    } catch (error:any) {
      console.error('Error uploading data:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        console.log('Request error:', error.request);
      } else {
        console.log('General error message:', error.message);
      }
  
      // Mostrar modal de error
      setIsSuccess(false);
      setModalVisibleResponse(true);
      setTimeout(() => setModalVisibleResponse(false), 2000);
    }
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

  function filtrarCargos(cargos:any) {
    return cargos.map((item:any) => {
      return {
        cargo: item.cargo,
        descripcion: item.descripcion,
        fundamento: item.fundamento,
        importe_base: item.importe_base,
        importe_total: item.importe_total,
        moneda: item.moneda
      };
    });
  }


  const printTicket = (data:any) => {


    console.log('data', data);
    let full_name = data.nombre + ' ' + data.apellido_materno + ' ' + data.apellido_paterno;  
    let cargoTotal = data.cargos.reduce((acc: number, currentValue: CargoSelected) => acc + Number(currentValue.importe_total), 0.00)
    let name_user = 'Luis Manuel';
    let dateTicket = getCurrentDateTime();
    let newcargos = filtrarCargos(data.cargos);
    console.log('cargos', newcargos);
    NetpayModule.print(
      data.folio,
      dateTicket,
      data.numero_placa,
      data.numero_de_identificacion_vehicular,
      full_name || '',
      data.numero_de_celular,
      data.email,
      data.direccion_infraccion,
      name_user,
      'privada colon 150B',//data.person_address,
      null,//data.imagen,
      newcargos || [], // Enviar un array vacio en caso de no existir datos..
      cargoTotal,
    )
      .then((result: any) => {
         console.log(result);
         navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Infracciones' }],
          }),
        );
     
      })
      .catch((error: any) => {
        console.error(error);
      });



  }


  const saveTransactionObject = () => {


  }

  const payOnline = (data:any) => {

    console.log('data', data);
    let cargoTotal = data.cargos.reduce((acc: number, currentValue: CargoSelected) => acc + Number(currentValue.importe_total), 0.00)
   if (data.folio !== null && cargoTotal > 0.00) {
      /// HACER POST CREAR INFRACCION && POST CREAR CONCEPTO
      NetpayModule.call(data.folio, cargoTotal, 0,0)
      .then((responseJson:any) => {
        const response = JSON.parse(responseJson);
        console.log('Transaction Successful:', response);
        // Save response..
      })
      .catch((error:any) => {
        console.error('Transaction Failed:', error);
        // Handle the error
      });

    }

  }


  const downloadData = async () => {
    // console.log('user_d', userId);
    if (userId !== null) {
      try {
        const response = await fetch(`${API_CLOUD}pull-data?id_user=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Manejar errores HTTP
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = await response.json();
        // console.log("response: ", responseJson);
        setCargos(responseJson);
        insertNewObjects(responseJson);

        // Call again the data..
        const data = getAllInfracciones();
        setCargos(data);

      } catch (error) {
        console.error('Error al bajar los datos:', error);
      }
    }

  }

  const getAllData = async () => {
    try {
      let result = await getFundamentos();
      let resultTipoConcepto = await getTipoConcepto();
      //console.log('resultx', result);
      insertLocalFundamentos(result);
      insertLocalTiposConceptos(resultTipoConcepto);
    } catch (error) {
      console.error('Error al obtener los fundamentos:', error);
    }
  }

  /*const getSearchConceptos = async (q:any) => {
    try {      
      let result = await getLocalConceptos(q);
      //console.log('result', result);
    } catch (error) {
      console.error('Error al obtener los fundamentos:', error);
    }
  }*/


  useEffect(() => {
      getAllData();    
  }, []);

/*useEffect(()=>{
  //insertLocalFundamentos({});
  let conceptos = getLocalConceptos({});
  console.log('conceptosx', conceptos);
},[])*/

  useEffect(() => {
     //deleteAllData()
    const data = getAllInfracciones();
    setCargos(data);
    // console.log('data ', data);
  }, []); // El arreglo vacío asegura que esto se ejecute solo una vez al montar

  useEffect(() => {
    // console.log(text)
    let data: any = findInfraccionByPlaca(`${text}`);
    if (data) setCargos(data);

  }, [text]);

  const openPersonaInformation = (id: any) => {
    // Consulta de usuario en la db atraves del id..
    let data: any = findInfraccionById(`${id}`);
    // console.log('Infraccion data ', data);
    setModalVisible(true);
    setPersonData(data[0]);

  }

  const openPersonaEvidencias = (id: any) => { // obtener las evidencias en base64
    let data: any = findEvidenciasByID(`${id}`);
    // console.log('Infraccion evidencias', data[0]);
  }

  return (
    <View style={styles.container}>
      {(!isConnected) && <View><Text style={globalStyles.errorTitle}>El dispositivo no cuenta con conexión a internet...</Text></View>}


      <ScrollView style={{ flex: 1, width: width * 0.90 }}>

        {storedAgente && storedUnidad ? (
          <View style={{}}>
            <Text style={globalStyles.subtitle}>Agente seleccionado</Text>
            <Text style={globalStyles.title}>{storedAgente.nombre_completo}</Text>
            <Text style={[globalStyles.subtitle, { marginTop: 8 }]}>Unidad seleccionada</Text>
            <Text style={globalStyles.title}>{storedUnidad.numero_de_unidad}</Text>
            <TouchableOpacity onPress={() => setStoredAgente(null)} style={[globalStyles.smallButton, { marginTop: 12 }]}>
              <Text style={globalStyles.smallButtonText}>Cambiar Agente/Unidad</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.modalTitle}>Selecciona Agente y Unidad</Text>

            <Picker
              selectedValue={selectedAgente}
              onValueChange={(value) => setSelectedAgente(value)}
            >
              <Picker.Item style={{ color: colors.textPrimary }} label="Selecciona agente" value="" />
              {agentes.map((agente) => (
                <Picker.Item label={agente.nombre_completo} value={agente} key={agente.id} style={{ color: colors.textPrimary }} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedUnidad}
              onValueChange={(value) => setSelectedUnidad(value)}
            >
              <Picker.Item label="Selecciona unidad" value="" style={{ color: colors.textPrimary }} />
              {unidades.map((unidad) => (
                <Picker.Item label={unidad.descripcion} value={unidad} key={unidad.id} style={{ color: colors.textPrimary }} />
              ))}
            </Picker>

            <TouchableOpacity onPress={saveAgenteUnidadHandler} style={[globalStyles.smallButton, { marginTop: 12 }]}>
              <Text style={globalStyles.smallButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        )}

        {(cargos && cargos.length > 0) ? (
          <List.Section title="Registros" style={{ width: '100%' }}>
            {
              cargos?.map((item, i) => {
                return (
                  <List.Accordion
                    title={`Infracción / Placa: ${item.numero_de_identificacion_vehicular}`}
                    left={props => <List.Icon {...props} icon={(item.status) ? "check-circle" : "cloud-upload"} color={(item.status) ? 'green' : '#2c3e50'} />}
                    key={i}
                  >
                    <List.Item title="Información Persona" onPress={() => { openPersonaInformation(item.id) }} />
                    <List.Item title="Archivos" onPress={() => { openPersonaEvidencias(item.id) }} />
                  </List.Accordion>
                );
              })
            }
          </List.Section>
        ) : (
          <Text style={[{ color: colors.textPrimary, marginTop: 16 }]}>No cuentas con infracciones registradas</Text>
        )}

        <Modal
          visible={modalVisibleResponse}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisibleResponse(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: '40%', width: '60%' }]}>
              {
                (isSuccess) ?
                  <LottieView
                    source={require("../../public/success.json")}
                    style={{ width: "100%", height: "100%" }}
                    autoPlay
                    loop
                  /> :
                  <LottieView
                    source={require("../../public/fail.json")}
                    style={{ width: "100%", height: "100%" }}
                    autoPlay
                    loop
                  />
              }
            </View>
          </View>
        </Modal>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Información de la infracción</Text>
              {
                  (personData.nombre !== null && personData.apellido_paterno !== null)&&
                  <Text style={{ color: colors.textPrimary }}>
                    Nombre Completo: {personData.nombre + ' ' + personData.apellido_paterno + ' ' + personData.apellido_materno}
                  </Text>
              }
              <Text style={{ color: colors.textPrimary }}>
                Folio: {personData.folio}
              </Text>

              <Button onPress={() => uploadData(personData)}>
                <Text style={{ color: colors.main }}>Subir Datos</Text>
              </Button>

              <Button onPress={() => printTicket(personData)}>
                <Text style={{ color: colors.main }}>Reimprimir Ticket</Text>
              </Button>


              <Button onPress={() => payOnline(personData)}>
                <Text style={{ color: colors.main }}>Hacer Pago</Text>
              </Button>

              <Button onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.main }}>Cerrar</Text>
              </Button>
            </View>
          </View>
        </Modal>



      </ScrollView>


      <FAB
        icon="refresh"
        color={'#FFF'}
        style={globalStyles.fabButton2}
        onPress={() => {
          downloadData()
        }}
        size='small'
      />

      <FAB
        icon="plus"
        color={'#FFF'}
        style={globalStyles.fabButton}
        disabled={!storedAgente || !storedUnidad}
        onPress={() => {
          cleanPersona();
          addPersona({
            agente_policial: storedAgente?.id ?? 0,
            unidad: storedUnidad?.id ?? 0,
          })
          dropPictures();
          navigation.dispatch(
            StackActions.push('Nueva infracción')
          );
        }}
        size='medium'
      />


      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'Cerrar',
          onPress: () => {
          },
          labelStyle: { color: colors.textError }
        }}>
        El ID ya existe!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
    width: '100%'
  },

  containerSearch: {
    width: '100%',
    marginTop: 20,
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

  searchBar: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.84,
    elevation: 3,
  },

  header: {
    width: '100%',
    height: 120,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#c3c3c3',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  profilePic: {
    width: 80, // Ajusta el tamaño según necesites
    height: 80, // Ajusta el tamaño según necesites
    borderRadius: 40, // La mitad del ancho y alto para hacerla completamente redonda
  },

  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

const optionsStyles = {
  optionsContainer: {
    // backgroundColor: 'green',
    padding: 10,
  },

  optionWrapper: {
    // backgroundColor: 'yellow',
    margin: 5,
  },
  optionTouchable: {
    // underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    //color: 'brown',
  },
};

const optionStyles = {
  optionTouchable: {
    underlayColor: '#fff',
    activeOpacity: 40,
  },
  optionWrapper: {
    // backgroundColor: 'pink',
    margin: 5,
  },
  optionText: {
    color: 'black',
  },
};

export default Index;