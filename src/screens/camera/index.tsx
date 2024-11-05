import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ActivityIndicator, Checkbox, Button } from 'react-native-paper';
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import { PermissionsAndroid } from 'react-native';
import { usePictures } from '../../context/PicturesContext';
import { useNavigation, StackActions } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { colors, globalStyles } from '../../config/theme/app-theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const width = Dimensions.get('screen').width;

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device: any = useCameraDevice('back');
  const refCam: any = useRef(null);
  const [photos, setPhotos] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [newPhoto, setNewPhoto] = useState<any>(null);
  const [otherText, setOtherText] = useState('');
  const navi = useNavigation();

  const { pictures, addPictures, removePicture } = usePictures();

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

    requestPermissions();
  }, [hasPermission]);

  useEffect(() => {
    setPhotos(pictures);
  }, []);

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

  const onTakePicture = async () => {
    try {
      const photo = await refCam.current.takePhoto();
      const base64Image = await RNFS.readFile(`file://${photo.path}`, 'base64');
      const obj_photo = { 'full_path': `file://${photo.path}`, 'base64': base64Image };

      setNewPhoto(obj_photo);
      setModalVisible(true);
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const saveData = async () => {
    addPictures(photos);

    navi.dispatch(
      StackActions.pop()
    )
  }

  const handleSavePhoto = () => {
    if (!newPhoto) return;

    const photoWithText = { ...newPhoto, text: selectedOption === 'Otro' ? otherText : selectedOption };
    setPhotos((prevPhotos: any) => [...prevPhotos, photoWithText]);
    setModalVisible(false);
    setSelectedOption('');
    setNewPhoto(null);
    setOtherText('');
  }


  const handleRemovePhoto = (fullPath: string) => {
    // console.log(fullPath)
    removePicture(fullPath);
    setNewPhoto(null);
    setPhotos(photos.filter((photo: any) => photo.full_path !== fullPath));
  }

  if (!hasPermission) {
    return <ActivityIndicator />
  }

  if (!device) {
    return <Text>Camera Device not Found</Text>
  }

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.photoContainer}>
        <Image source={{ uri: item.full_path }} style={styles.photo} />
        <TouchableOpacity onPress={() => handleRemovePhoto(item.full_path)} style={styles.removeButton}>
          <Icon name="close" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.overlay}>
          <Text style={styles.photoText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={refCam}
        style={StyleSheet.absoluteFill}
        device={device} isActive={true}
        photo={true}
      />
      <FlatList data={photos} style={styles.listPhotos} renderItem={renderItem} keyExtractor={item => item.full_path} horizontal={true} />
      <Pressable onPress={onTakePicture} style={styles.buttonCamera} />
      <Pressable onPress={saveData} style={styles.button_send}><Text style={styles.titleButtonSend}>GUARDAR</Text></Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Cuál opción describe mejor la fotografía?</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedOption('INE')}>
              <Checkbox
                status={selectedOption === 'INE' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption('INE')}
                color='#2196F3'
              />
              <Text style={styles.optionText}>INE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedOption('Licencia')}>
              <Checkbox
                status={selectedOption === 'Licencia' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption('Licencia')}
                color='#2196F3'
              />
              <Text style={styles.optionText}>Licencia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedOption('Vehículo')}>
              <Checkbox
                status={selectedOption === 'Vehículo' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption('Vehículo')}
                color='#2196F3'
              />
              <Text style={styles.optionText}>Vehículo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedOption('Placa')}>
              <Checkbox
                status={selectedOption === 'Placa' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption('Placa')}
                color='#2196F3'
              />
              <Text style={styles.optionText}>Placa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => setSelectedOption('Otro')}>
              <Checkbox
                status={selectedOption === 'Otro' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedOption('Otro')}
                color='#2196F3'
              />
              <Text style={styles.optionText}>Otro</Text>
            </TouchableOpacity>
            {selectedOption === 'Otro' && (
              <TextInput
                style={[globalStyles.input, { height: 40 }]}
                placeholder="Specify"
                value={otherText}
                onChangeText={setOtherText}
              />
            )}
            <Button onPress={handleSavePhoto}>
              <Text style={{ color: colors.main }}>Guardar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonCamera: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    width: 75,
    height: 75,
    backgroundColor: 'white',
    borderRadius: 75
  },
  listPhotos: {
    position: 'absolute',
    bottom: 150,
    width: width,
    height: 100,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  button_send: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 10,
    width: 75,
    height: 75,
  },
  titleButtonSend: {
    color: 'white',
    fontSize: width * 0.033,
    fontWeight: 'bold'
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
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
    paddingLeft: 10
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.textSecondary
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '80%'
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 2,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  photoText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 2,
  },
});

export default CameraScreen;
