import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, Image,NativeModules, Alert, FlatList } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { useCameraPermission, useCameraDevice, Camera, useCameraDevices } from 'react-native-vision-camera';
import { PermissionsAndroid } from 'react-native';
import { usePictures } from '../../context/PicturesContext';
import { useNavigation, StackActions } from '@react-navigation/native';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ImageEditor from '@react-native-community/image-editor';
import { usePersona } from '../../context/PersonaContext'; 


const { CameraFocusHandler } = NativeModules;

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const scanBoxWidth = width * 0.85; 
const scanBoxHeight = width * 0.55;

const CameraScreen = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const [validate, setValidate] = useState(false);
    const devices = useCameraDevices();
    const [device, setDevice] = useState(devices[0] || null); // Use the first device by default
    const [position, setPosition] = useState<string>('back');


    const refCam = useRef(null);
    const [photos, setPhotos] = useState([]);
    const navi = useNavigation();
    const { addPictures } = usePictures();
    const {addPersona} = usePersona();

    

    const [accessToken, setAccessToken] = useState('');
    const [frontImage, setFrontImage] = useState('');
    const [backImage, setBackImage] = useState('');
    const [faceImage, setFaceImage] = useState('');
    const [steper, setSteper] = useState<number>(0);
    const [verifyId, setVerifyId] = useState('');
    const [isChecked, setIsChecked] = useState('');


    const focusOnBox = () => {
        const x = width * 0.425;  // Centro del box_scan en términos de la pantalla
        const y = width * 0.325 + 200;  // Coordenada Y del centro del box_scan
        CameraFocusHandler.focusOnPoint(x, y);
    }

    
    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
            focusOnBox();
        }
    }, [hasPermission]);

    useEffect(() => {
        requestStoragePermission();
        //authSuma();
    }, []);

    useEffect(()=>{
        if (accessToken !== '')
        {
            verify()
        }
    },[accessToken])

    useEffect(()=>{
        if (verifyId !== '')
        {

            verifyStatus();
        }
    },[verifyId])
    
    useEffect(()=>{
        if (isChecked !== ''  &&  isChecked === "Checked")
        {

            getBiometricResults()
        }
        else{
            setIsChecked('');
            verifyStatus()
        }
    },[isChecked])

      useEffect(()=>{
        if (steper === 2)
        {
      
            setValidate(true)    
        }
    },[steper])
    /*useEffect(()=>{
        if (steper === 2)
        {
            onRotateCamera(1)
        }
        else if(steper === 3)
        {
                setValidate(true)
                onRotateCamera(0)
        }
        else{
            onRotateCamera(0)
        }

    },[steper])*/

    /*useEffect(() => {
        console.log('valor de validate ', validate);
        if (validate === true)
        {
            createVerification();
        }
    },[validate])*/



    async function requestStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "Permiso para Acceso al Almacenamiento",
                    message: "Esta aplicación necesita acceder a tu almacenamiento para funcionar correctamente.",
                    buttonNeutral: "Preguntarme Luego",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Ahora tienes acceso al almacenamiento");
            } else {
                console.log("Permiso de almacenamiento denegado");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const authSuma = async () => {
        console.log('vamos a validar');
        let url = 'https://veridocid.azure-api.net/api/auth/token';
        let obj = {
            grant_type: "client_credentials",
            client_id: "GsarOqxPlgCOP5if1sywsivoUSzgQvCp",
            client_secret: "rR-Cubs64iKExMf8zOBPPs03EzE9IGvTJN9_NF4wh9BQW_72uojdyE1pDgXFb9kM",
            audience: "veridocid"
        };
        try {
            const response = await axios.post(url, obj);
            console.log(response.data);
            return response.data;
        } catch (error:any) {
            console.error('Hubo un error en la autenticación de SUMA', error.response);
        }
    }

    const verify = async () => {
        let url = 'https://veridocid.azure-api.net/api/id/v3/verify';
        let obj = {
            id: "test123",
            frontImage: frontImage,
            backImage: backImage
        };
        try {
            const response = await axios.post(url, obj,{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            setVerifyId(response.data);
            return response.data;
        } catch (error:any) {
            console.error('Hubo un error en la verificacion', error.response);
        }
    }



    const verifyStatus = async () => {
        let url = 'https://veridocid.azure-api.net/api/id/v3/status';
        let obj = {uuid:verifyId };
        try {
            const response = await axios.post(url, obj,{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            setIsChecked(response.data);
            return response.data;
        } catch (error:any) {
            console.error('Hubo un error en la verificacion', error.response);
        }
    }

    const getBiometricResults = async () => {
        console.log('biometricinse', verifyId);
        let url = 'https://veridocid.azure-api.net/api/id/v3/results';
        let obj = {
            "uuid": verifyId,
            "includeImages": false,
            "includeVideo": false,
            "includeProofAdress": false
        }

        try {
            const response = await axios.post(url, obj,{
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('biometric results',response.data);
            const documentData = response.data['documentData'];
            let persona:any ={
                
                licencia:'',
                nombre:'',
                apellido_paterno:'',
                apellido_materno:'',
                genero:'',
                fecha_nacimiento:'',
                estado: '',
                curp: '',
                email:'',
                numero_de_celular:'',
                score_face_match: response.data.scoreFaceMatch

        }

            documentData.forEach((item:any)=> {

                switch(item.type) {
                  case 'Sex':
                    persona.genero = (item.value === 'M')?'MASCULINO':'FEMENINO';
                    break;
                  case 'Given Names':
                    persona.nombre = item.value;
                    break;
                  case 'Mother Surname':
                    persona.apellido_materno = item.value;
                    break;
                  case 'Father Surname':
                    persona.apellido_paterno = item.value;
                    break;
                  case 'Date of Birth':
                    persona.fecha_nacimiento = item.value;
                    break;
                  case 'Place of Birth':
                    persona.estado = item.value;
                    break;
                   case 'Personal Number':
                        persona.curp = item.value;
                    break;
                }

              });

         

            console.log('newdata ', persona);

            addPersona(persona);

            setValidate(false);
            navi.dispatch(
                StackActions.pop()
            )


            

            return response.data;


        } catch (error:any) {            
            console.error('Hubo un error en la verificacion', error.response);
            getBiometricResults();
        }
    }

    const createVerification = async () => {
        setFrontImage(photos[0]['base64']);
        setBackImage(photos[1]['base64']);        
        let response = await authSuma();
        setAccessToken(response.access_token);
        console.log('response ', response);


    }

    const onRotateCamera = async (pos:Number) => {
        const nextDevice:any = devices.find((dev) => dev.position !== device.position);
        if(pos == 0)
        {
            setPosition('back');        
        //if (nextDevice) {
          setDevice(devices[0]);
       // }
        }
        else{
            setPosition('front');        
            //if (nextDevice) {
              setDevice(devices[1]);
           // }
        }

    }

    const onTakePictureX2 = async () => {
        try {
            console.log('toma foto')
            const photo = await refCam.current.takePhoto({
                qualityPrioritization: 'speed', // Agregar esto para asegurar la captura rápida
                skipMetadata: true, // Para evitar problemas de metadatos
            });

            if (!photo || !photo.path) {
                throw new Error('No se pudo capturar la foto');
            }

            // Recortar la imagen automáticamente
            const base64Image = await RNFS.readFile(`file://${photo.path}` , 'base64');

            let obj_photo = { 'full_path': photo.path, 'base64': base64Image, 'normafile':`file://${photo.path}`  };
            
            console.log('obj', obj_photo);
            setPhotos(prevPhotos => [...prevPhotos, obj_photo]);
            setSteper(steper+1);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ha ocurrido un error al tomar la foto.');
        }
    }
    const onTakePicture = async () => {
        try {
            console.log('toma fotox2')
            const photo = await refCam.current.takePhoto({
                qualityPrioritization: 'speed', // Agregar esto para asegurar la captura rápida
                skipMetadata: true, // Para evitar problemas de metadatos
            });

            if (!photo || !photo.path) {
                throw new Error('No se pudo capturar la foto');
            }

            const imageWidth = photo.width;
            const imageHeight = photo.height;
            // Calcular las coordenadas de la región a recortar
            const scaleX = imageWidth / width;
            const scaleY = imageHeight / height;
            const cropData = {
                offset: {
                    x: (width * 0.075) * scaleX,  // Calculado como (ancho de la pantalla - ancho del box_scan) / 2
                    y: (height * 0.175) * scaleY, // Calculado como (alto de la pantalla - alto del box_scan) / 2
                },
                size: {
                    width: (width * 0.85) * scaleX,
                    height: (width * 0.55) * scaleY
                }
            };

   
            const croppedImageURI = await ImageEditor.cropImage(`file://${photo.path}`, cropData);
            console.log('URI', croppedImageURI);
            const base64Image = await RNFS.readFile(croppedImageURI.uri, 'base64');

            let obj_photo = { 'full_path': croppedImageURI, 'base64': base64Image, 'normafile':`file://${photo.path}`  };
            
            //console.log('obj', obj_photo);
            setPhotos(prevPhotos => [...prevPhotos, obj_photo]);
            setSteper(steper+1);
            
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Ha ocurrido un error al tomar la foto.');
        }
    }

    const onTakePic = async () => {
        if(position === 'back')
        {
            await onTakePicture();
        }
        else{
            await onTakePictureX2();
        }

    }

    const saveData = async () => {
        addPictures(photos);
        navi.dispatch(
            StackActions.pop()
        )
    }

    if (!hasPermission) {
        return <ActivityIndicator />
    }

    if (!device) {
        return <Text>Camera Device not Found</Text>
    }

    const tryAgain = () => {
        createVerification();
    }
    const renderItem = ({ item }:any) => {
        console.log('item', item.full_path.uri);
        let nb64 = `data:image/jpeg;base64,$${item.base64}`
        return <Image source={{ uri: nb64 }} style={{ width: 100, height: 50 }} />;
    };

    return (
        <View style={styles.container}>
            <View style={styles.container_steper}>
                <Text style={[styles.text_steper,(steper===0)?{color: 'white', fontWeight: 'bold'}:{}]}>FRONTAL</Text>
                <Text style={[styles.text_steper,(steper===1)?{color: 'white', fontWeight: 'bold'}:{}]}>TRASERA</Text>                
            </View>

            {(validate)&&<ActivityIndicator animating={true} color={MD2Colors.blue800} size='large' style={{zIndex: 40, position: 'absolute', top: 300, alignSelf: 'center'}} />}
            {(!validate)&&<Camera
                ref={refCam}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                
            />}
            {(position === 'back' && validate !== true)&&
            <View style={styles.overlayContainer}>
                <View style={styles.topOverlay} />
                <View style={styles.middleContainer}>
                    <View style={styles.sideOverlay} />
                    <View style={styles.box_scan} />
                    <View style={styles.sideOverlay} />
                </View>
                <View style={styles.bottomOverlay} />
            </View>
            }
            <FlatList  data={photos} style={styles.listPhotos}  renderItem={renderItem} keyExtractor={item => item?.path} horizontal={true}  />
            {/*<Pressable onPress={onRotateCamera} style={styles.button_rotate} ><Text style={styles.titleButtonSend}>Rotar</Text></Pressable>*/}
            {(!validate)&&<Pressable onPress={onTakePic} style={styles.buttonCamera} />   }         
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    container_steper:{
        height: 50,
        zIndex: 30,
        alignItems: 'center',
        justifyContent:  'center',
        flexDirection: 'row'
    },
    text_steper:{
        color:'#c3c3c3',
        fontSize: width * 0.030,
        marginHorizontal: 20,

    },
    buttonCamera: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 50,
        width: 75,
        height: 75,
        backgroundColor: 'white',
        borderRadius: 75,
        zIndex: 5,
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    topOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    middleContainer: {
        flexDirection: 'row',
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    box_scan: {
        width: width * 0.85,
        height: width * 0.55,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 3,
    },
    bottomOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    listPhotos:{
        position:'absolute',
        bottom:150,
        width: width,
        height: 50,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        zIndex: 30,
      },
      button_send:{
        position:'absolute', 
        alignSelf:'flex-end',
        bottom:10,
        width: 75, 
        height: 75, 
        zIndex: 30,
        
      },

      button_rotate:{
        position:'absolute', 
        alignSelf:'flex-1',
        bottom:10,
        width: 75, 
        height: 75, 
        zIndex: 30,
      },
      titleButtonSend:{
        color: 'white',
        fontSize: width * 0.033,
        fontWeight:'bold'
      },

    overlayContainerx2: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    topOverlayx2: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    middleContainerx2: {
        flexDirection: 'row',
    },
    sideOverlayx2: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    box_scanx2: {
        width: width * 0.55,
        height: width * 0.85,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: width  * 0.425,
    },
    bottomOverlayx2: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});

export default CameraScreen;
