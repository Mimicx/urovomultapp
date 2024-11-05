/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ConnectionProvider} from './context/ConnectionContext';
import {RenderProvider} from './context/SteperContext';
import {getToken, removeToken} from './utils/tokenStorage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {ModalProvider, useModal} from './context/ModalContext';
import {CasosProvider} from './context/CasosContext';
import {IndexProvider} from './context/CarouselIndex';
import {SearchProvider} from './context/SearchInfraccion';
import {CiudadanoProvider} from './context/CiudadanoContext';
import {VehiculoProvider} from './context/VehiculoContext';
import {PersonaProvider} from './context/PersonaContext';
import {PicturesProvider} from './context/PicturesContext';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

//// ICONS ///
const ellipsisIcon = <Icon name="ellipsis-h" size={20} color="#900" />;
import {Searchbar} from 'react-native-paper';

const Stack = createNativeStackNavigator();

import HomeScreen from './screens/home/index';
import AuthScreen from './screens/auth/index';
import NewInfraccionScreen from './screens/infraccion/index';
import ConductorScreen from './screens/conductor/index';
import VehiculoScreen from './screens/vehiculo/index';
import DetallesScreen from './screens/detalles/index';
import CameraScreen from './screens/camera/index';
import CatalogoScreen from './screens/catalogo/index';
import CameraConductorScreen from './screens/conductor/camera';
import ContactorConductorScreen from './screens/conductor/contacto';
import MapaScreen from './screens/mapa/index';
import PropietarioScreen from './screens/propietario/index';
import TestScreen from './screens/testing/index';
import {colors} from './config/theme/app-theme';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const {modalVisible, showModal, hideModal} = useModal();

  useEffect(() => {
    const fetchToken = async () => {
      await removeToken();
      const token: any = await getToken();

      if (token) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <ConnectionProvider>
      <ActionSheetProvider>
        <PicturesProvider>
          <PersonaProvider>
            <VehiculoProvider>
              <CiudadanoProvider>
                <SearchProvider>
                  <IndexProvider>
                    <RenderProvider>
                      <CasosProvider>
                        <ModalProvider>
                          <MenuProvider>
                            <NavigationContainer>
                              <Stack.Navigator
                                screenOptions={{
                                  headerBackTitleVisible: false,
                                  headerTintColor: '#fff',
                                  headerBackground: () => (
                                    <View
                                      style={{
                                        backgroundColor: colors.main,
                                        flex: 1,
                                      }}
                                    />
                                  ),
                                }}>
                                {!isAuth && (
                                  <Stack.Screen
                                    name="Auth"
                                    component={AuthScreen}
                                    options={({navigation}) => ({
                                      headerShown: false,
                                      headerBackground: () => (
                                        <View
                                          style={{
                                            backgroundColor: '#fff',
                                            flex: 1,
                                          }}
                                        />
                                      ),
                                    })}
                                  />
                                )}
                                  <Stack.Screen
                                  name="Test"
                                  component={TestScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />
      {/*
                                <Stack.Screen
                                  name="Detalles"
                                  component={DetallesScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />
                          
                                 <Stack.Screen name="Test" component={TestScreen} options={({ navigation }) => ({
                                  headerShown: true
                                  })} />
                                 */}

                                {/* <Stack.Screen name="Nueva Infraccion" component={NewInfraccionScreen} options={({ navigation }) => ({
                                  headerShown: true,

                                })} /> */}
                                <Stack.Screen
                                  name="Infracciones"
                                  component={HomeScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />

                                {
                                  <Stack.Screen
                                    name="Nueva infracción"
                                    component={NewInfraccionScreen}
                                    options={({navigation}) => ({
                                      headerShown: true,
                                    })}
                                  />
                                }

                                <Stack.Screen
                                  name="Conductor"
                                  component={ConductorScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />

                                <Stack.Screen
                                  name="Vehiculo"
                                  component={VehiculoScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />

                                <Stack.Screen
                                  name="Mapa"
                                  component={MapaScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />
                                {
                                <Stack.Screen
                                  name="Detalles"
                                  component={DetallesScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />}

                                <Stack.Screen
                                  name="Camera"
                                  component={CameraScreen}
                                  options={({navigation}) => ({
                                    headerShown: false,
                                  })}
                                />

                                <Stack.Screen
                                  name="Contacto"
                                  component={ContactorConductorScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />

                                <Stack.Screen
                                  name="Camera Conductor"
                                  component={CameraConductorScreen}
                                  options={({navigation}) => ({
                                    headerShown: false,
                                  })}
                                />

                                <Stack.Screen
                                  name="Catalogo"
                                  component={CatalogoScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />

                                <Stack.Screen
                                  name="Propietario"
                                  component={PropietarioScreen}
                                  options={({navigation}) => ({
                                    headerShown: true,
                                  })}
                                />
                              </Stack.Navigator>
                            </NavigationContainer>
                          </MenuProvider>
                        </ModalProvider>
                      </CasosProvider>
                    </RenderProvider>
                  </IndexProvider>
                </SearchProvider>
              </CiudadanoProvider>
            </VehiculoProvider>
          </PersonaProvider>
        </PicturesProvider>
      </ActionSheetProvider>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
});

const optionsStyles = {
  optionsContainer: {
    // backgroundColor: 'green',
    padding: 10,
  },
  optionsWrapper: {
    // backgroundColor: 'purple',
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
    color: '#fff',
  },
  optionWrapper: {
    // backgroundColor: 'pink',
    margin: 5,
  },
  optionText: {
    color: '#fff',
  },
};

export default App;
