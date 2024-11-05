import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Pressable, Alert, ScrollView, Image } from 'react-native';
import { List, MD3Colors } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useNavigation, StackActions } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import { useModal } from '../../context/ModalContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useCasos } from '../../context/CasosContext';
import { useRenderContext } from '../../context/SteperContext';
import { useCarouselIndex } from '../../context/CarouselIndex';
import ProgressBar from '../../components/ProgressBar';

//import Carousel from "react-native-reanimated-carousel";
import { Carousel } from 'react-native-basic-carousel'
import { colors, globalStyles, normalizeSize } from '../../config/theme/app-theme';

const width = Dimensions.get('screen').width;

const Index = ({ navigation }: any) => {


  const { isSelected, changeData, offData, changeStatus } = useCasos();
  const { data, updateData } = useRenderContext();


  //// My data List..
  const [documentList, setDocumentList] = useState([
    { id: 0, name: 'sitio', selected: false, block: false },
    { id: 1, name: 'licencia', selected: false, block: false },
    { id: 2, name: 'placa', selected: false, block: false },
    { id: 3, name: 'nacional', selected: false, block: false },
    { id: 4, name: 'amparo', selected: false, block: false },
  ]);


  const [nextButton, setNextButton] = useState(false);

  const { carouselIndex, addIndex, dropIndex, resetIndex } = useCarouselIndex();
  //const [data, setData] = useState<any>([{'id':1,'text': 'En sitio'}, {'id': 2, 'text':'Licencia'}, {'id': 3, 'text':'Placa'}, {'id': 5, 'text':'Nacional'}, {'id': 6, 'text':'Amparo'}])
  const navi = useNavigation();
  const { modalVisible, showModal, hideModal } = useModal();
  //const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef: any = useRef(null);
  const [loaded, setLoaded] = useState(true)

  useEffect(() => {
    resetIndex();
    offData('amparo');
    offData('sitio');
    offData('nacional');
    offData('placa');
    offData('licencia');
    // console.log('se reseto', carouselIndex);
  }, [])

  const images: any = {
    sitio: require('../../public/driver.png'),
    licencia: require('../../public/licencia.png'),
    placa: require('../../public/placa.png'),
    nacional: require('../../public/nacional.png'),
    amparo: require('../../public/amparo.png'),
  };

  const words: any = {
    sitio: '¿Infractor en el Sitio?',
    licencia: '¿Cuenta con licencia?',
    placa: '¿Cuenta con placa?',
    nacional: '¿Vehículo nacional?',
    amparo: '¿Vehículo con amparo?',
  }

  //const [data, setData] = useState<any>(buildDataArray);
  const [canGenerateReport, setCanGenerateReport] = useState(false);


  useEffect(() => {
    let list = documentList;

    const hasUnselected = list.some(item => item.selected);

    // Si hay al menos uno en false, cambiar el estado de setNextButton a true
    if (hasUnselected) {
      setNextButton(true);
    } else {
      setNextButton(false);
    }

    setDocumentList(list);


  }, [documentList]);





  const createTicket = () => {
    // Update Cases context..
    documentList.forEach((item: any, i: any) => {
      changeStatus(item.name, item.selected);
    })

    const isSitio = documentList.find(item => item.name === 'sitio')?.selected;

    if (isSitio) {
      navi.dispatch(
        StackActions.push('Conductor')
      );
    } else {
      navi.dispatch(
        StackActions.push('Vehiculo')
      );
    }
  }


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <FontAwesome name="question-circle" size={24} color="white" />
          </MenuTrigger>
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption onSelect={showModal} text='Codificación de casos' customStyles={optionStyles} />

            {/* Agrega más opciones según sea necesario */}
          </MenuOptions>
        </Menu>

      ),
    });
  }, [navigation, showModal]);





  const changeInfraction = (item: any) => {
    let list = documentList;

    const updateItemById = (array: any, id: any, newData: any) => {
      return array.map((item: any) => {
        if (item.id === id) {
          return { ...item, ...newData };
        }
        return item;
      });
    };

    // Ejemplo de uso
    const updatedData = updateItemById(list, item.id, { selected: !item.selected });
    setDocumentList(updatedData);
  }

  if (loaded) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <Text style={[globalStyles.title, styles.configuraTitle]}>Configura tu infracción</Text>
          <View style={{ alignItems: 'flex-start', width: width, flexDirection: 'row', paddingHorizontal: 10 }}>
            <List.Section>
              {documentList.map((item, i) => (
                <List.Item
                  key={i}
                  style={{ flexDirection: 'row', marginBottom: 4, }}
                  titleStyle={{ fontWeight: 'bold', fontSize: normalizeSize(16) }}
                  title={words[item.name].toUpperCase()}
                  left={() => <Image source={images[item.name]} style={{ width: normalizeSize(50), height: normalizeSize(50) }} />}
                  right={() => (
                    <View style={styles.rightContainer}>
                      <Checkbox
                        disabled={item.block}
                        status={item.selected ? "checked" : 'unchecked'}
                        onPress={() => { changeInfraction(item) }}
                        color={colors.main}
                      />
                    </View>
                  )}
                />
              ))}
            </List.Section>
          </View>

          <TouchableOpacity disabled={!nextButton} onPress={() => createTicket()} style={[globalStyles.button, styles.nextButton, !nextButton && globalStyles.disabledButton]}>
            <Text style={globalStyles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );

  }
  else {
    return (
      <></>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightContainer: {
    justifyContent: 'center',
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'purple'
  },
  label: {
    margin: 8,
    fontSize: width * 0.035,
    fontWeight: 'normal'
  },
  buttonGenerate: {
    backgroundColor: '#790E28',
    padding: 15,
    width: width * 0.45,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 15,
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  configuraTitle: {
    marginTop: 20,
  },
  nextButton: {
    marginVertical: 10,
  },

  //// MODAL ////

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: width,
  },
  modalView: {
    width: width * 0.95,
    height: '60%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,


  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#790E28',

  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  modalText: {
    flex: 1,
    textAlign: 'left',
  },
  modalTitle: {
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
});

const optionsStyles = {
  optionsContainer: {
    // backgroundColor: 'green',
    padding: 10,
  },

  optionWrapper: {
    backgroundColor: 'yellow',
    margin: 5,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'brown',
  },
};

const optionStyles = {
  optionTouchable: {
    underlayColor: '#ffffff',
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
