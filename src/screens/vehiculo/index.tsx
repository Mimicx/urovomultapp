import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { Button, TextInput, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useCasos } from '../../context/CasosContext';
import { getToken } from '../../utils/tokenStorage';
import { usePersona } from '../../context/PersonaContext';
import { VehiculoSchema } from '../../schemas/vehiculoSchema';
import { colors, globalStyles } from '../../config/theme/app-theme';
import { estados } from '../../utils/estados';
import { MarcaResponse, MarcaVehiculo, VehiculoType } from '../../interfaces/vehiculo';
import { tiposVehiculo } from '../../utils/tiposVehiculos';
import { API_FULL } from '../../utils/urls';
import { useConnection } from '../../context/ConnectionContext';

const Vehiculo = () => {
  const [search, setSearch] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [encontradoToast, setEncontradoToast] = useState(false);
  const [isPublico, setIsPublico] = useState(false);
  const [modalMarcasVisible, setModalMarcasVisible] = useState(false);
  const [marcas, setMarcas] = useState<MarcaVehiculo[]>([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [isLoadingMarcas, setIsLoadingMarcas] = useState(false);

  const searchbar = useRef(null);

  const { isConnected } = useConnection()

  const form = useForm<z.infer<typeof VehiculoSchema>>({
    resolver: zodResolver(VehiculoSchema),
    defaultValues: {
      tipo_padron: 'DIRECTO',
      numero_placa: '',
      tipo_placa: 2,
      numero_de_identificacion_vehicular: '',
      marca_vehicular_estatal_nay: '',
      submarca: '',
      modelo: '',
      color_secundario: '',
      tipo_de_vehiculo: 0,
      estado_placa: '',
      tipo_servicio: 'PRIVADO',
      num_economico: '',
      sitio_ruta: '',
    }
  })

  const { isSelected } = useCasos();
  const { persona, addPersona } = usePersona();

  const navi = useNavigation();

  useLayoutEffect(() => {
    navi.setOptions({
      headerTitle: 'Datos del vehículo',
    });
  }, [navi]);

  const validation = !(isSelected.placa === false || isSelected.amparo === true || isSelected.nacional === false);

  const fetchMarcasVehiculos = async () => {
    console.log("fetching")
    if (isLoadingMarcas || !nextPage && page > 1) return;
    setIsLoadingMarcas(true);

    try {
      const token = await getToken();
      const response = await axios.get<MarcaResponse>(`${API_FULL}/recaudacion/marcas-de-vehiculos?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (response.data.results) {
        setMarcas((prevMarcas) => [...prevMarcas, ...response.data.results]);
        setNextPage(response.data.next);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching marcas de vehículos:', error);
    } finally {
      setIsLoadingMarcas(false);
    }
  };

  useEffect(() => {
    fetchMarcasVehiculos();
  }, [])

  const searchVehiculo = async () => {
    setIsLoading(true);
    const token = await getToken();
    const url = `https://apigrp.migob.mx/recaudacion/vehiculos/?numero_de_placa_vigente=${search}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.results.length > 0) {
        // console.log(response.data.results);
        setSearchResults(response.data.results);
        setModalVisible(true);
        // addVehiculos(response.data.results);
      } else {
        setEncontradoToast(true);
      }
    } catch (error: any) {
      setEncontradoToast(true);
      console.error('Error', error.response);
    } finally {
      setIsLoading(false);
    }
  }

  const onSelectedItem = (item: VehiculoType) => {
    const placa = search.trim().toUpperCase();
    const addPlacaToPersona = { ...persona, numero_placa: item.numero_de_placa_vigente ?? placa };
    addPersona(addPlacaToPersona);

    setSearch('');
    setSearchResults([]);
    setModalVisible(false);

    form.setValue('numero_placa', item.numero_de_placa_vigente);
    form.setValue('numero_de_identificacion_vehicular', item.numero_de_identificacion_vehicular);
    form.setValue('marca_vehicular_estatal_nay', item.marca_vehicular_estatal_nay);
    form.setValue('modelo', item.modelo.toString());
    form.setValue('color_secundario', item.color_secundario);
    form.setValue('tipo_de_vehiculo', item.tipo_de_vehiculo);
  }

  //Lista mostrada en modal
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => onSelectedItem(item)}>
      <View style={styles.listItem}>
        <Text>Placa: {item.numero_de_placa_vigente}</Text>
        <Text>Modelo: {item.modelo}</Text>
      </View>
    </TouchableOpacity>
  );

  const onSubmit = (values: z.infer<typeof VehiculoSchema>) => {
    // console.log(values);
    const fullPersona = { ...persona, ...values };
    addPersona(fullPersona);

    if (isSelected.sitio) {
      navi.dispatch(
        StackActions.push('Propietario')
      );
    } else {
      navi.dispatch(
        StackActions.push('Mapa')
      );
    }

  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.textPrimary} />
        </View>
      )}
      <Modal
        visible={modalMarcasVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalMarcasVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una marca</Text>
            <FlatList
              data={marcas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  form.setValue('marca_vehicular_estatal_nay', item.nombre);
                  setModalMarcasVisible(false);
                }}>
                  <View style={styles.modalListItem}>
                    <Text style={styles.modalListItemText}>{item.nombre}</Text>
                  </View>
                </TouchableOpacity>
              )}
              onEndReached={fetchMarcasVehiculos}
              onEndReachedThreshold={0.1}
              ListFooterComponent={isLoadingMarcas ? <ActivityIndicator size="small" color={colors.textPrimary} /> : null}
            />
            <Button onPress={() => setModalMarcasVisible(false)}>
              <Text style={{ color: colors.main }}>Cerrar</Text>
            </Button>
          </View>
        </View>
      </Modal>


      <ScrollView style={{ marginBottom: 20 }}>
        {validation && (
          <>
            <Text style={globalStyles.inputLabel}>Buscar por placa</Text>
            <View style={{ flexDirection: 'row', alignContent: 'center' }}>
              <TextInput
                style={[globalStyles.input, { flex: 1 }]}
                value={search}
                onChangeText={(data: string) => {
                  setSearch(data.toUpperCase());
                  form.setValue('numero_placa', data.toUpperCase());
                }}
                secureTextEntry={Platform.OS === 'ios' ? false : true}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                placeholder="Número de placa..."
                placeholderTextColor={colors.placeHolderText}
                returnKeyType="search"
                clearButtonMode="while-editing"
                ref={searchbar}
                underlineColor='transparent'
                activeUnderlineColor={colors.main}
              />
              <TouchableOpacity
                onPress={() => searchVehiculo()}
                style={globalStyles.buttonIcon}
              >
                <FontAwesome name="search" size={24} color={colors.main} style={{ justifyContent: 'center' }} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {isSelected.placa && (
          <>
            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Número de placa</Text>
              <Controller
                control={form.control}
                name="numero_placa"
                render={({ field }) => (
                  <TextInput
                    placeholderTextColor={colors.placeHolderText}
                    placeholder="Número de placa..."
                    style={globalStyles.input}
                    value={field.value}
                    onChangeText={(value) => field.onChange(value.toUpperCase())}
                    secureTextEntry={Platform.OS === 'ios' ? false : true}
                    keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.main}
                  />
                )}
              />

              {form.formState.errors.numero_placa && (
                <Text style={globalStyles.errorText}>{form.formState.errors.numero_placa.message}</Text>
              )}
            </View>

            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Estado Placa</Text>
              <Controller
                control={form.control}
                name="estado_placa"
                render={({ field }) => (
                  <Picker
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                    style={globalStyles.picker}
                  >
                    <Picker.Item label="Selecciona estado" value="" />
                    {estados.map(estado => (
                      <Picker.Item label={estado.nombre_de_AGEE} value={estado.nombre_de_AGEE} key={estado.id} />
                    ))}
                  </Picker>
                )}
              />
              {form.formState.errors.estado_placa && (
                <Text style={globalStyles.errorText}>{form.formState.errors.estado_placa.message}</Text>
              )}
            </View>
          </>
        )}


        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Serie NIV</Text>
          <Controller
            control={form.control}
            name="numero_de_identificacion_vehicular"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Serie NIV"
                style={globalStyles.input}
                value={field.value}
                onChangeText={(value) => field.onChange(value.toUpperCase())}
                secureTextEntry={Platform.OS === 'ios' ? false : true}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                underlineColor='transparent'
                activeUnderlineColor={colors.main}
              />
            )}
          />

          {form.formState.errors.numero_de_identificacion_vehicular && (
            <Text style={globalStyles.errorText}>{form.formState.errors.numero_de_identificacion_vehicular.message}</Text>
          )}
        </View>

        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Marca</Text>
          <Controller
            control={form.control}
            name="marca_vehicular_estatal_nay"
            render={({ field }) => (
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <TextInput
                  style={[globalStyles.input, { flex: 1 }]}
                  value={field.value}  // Se permite la edición directa en el TextInput
                  onChangeText={field.onChange}  // Permite escribir en el TextInput
                  placeholder="Marca del vehículo"
                  placeholderTextColor={colors.placeHolderText}
                  underlineColor="transparent"
                  activeUnderlineColor={colors.main}
                />
                <TouchableOpacity
                  onPress={() => setModalMarcasVisible(true)}  // Abre el modal al presionar el icono
                  style={globalStyles.buttonIcon}
                >
                  <FontAwesome name="search" size={24} color={colors.main} style={{ justifyContent: 'center' }} />
                </TouchableOpacity>
              </View>
            )}
          />
          {form.formState.errors.marca_vehicular_estatal_nay && (
            <Text style={globalStyles.errorText}>{form.formState.errors.marca_vehicular_estatal_nay.message}</Text>
          )}
        </View>


        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Submarca</Text>
          <Controller
            control={form.control}
            name="submarca"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Submarca"
                style={globalStyles.input}
                value={field.value}
                onChangeText={(value) => field.onChange(value.toUpperCase())}
                secureTextEntry={Platform.OS === 'ios' ? false : true}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                underlineColor='transparent'
                activeUnderlineColor={colors.main}
              />
            )}
          />

          {form.formState.errors.submarca && (
            <Text style={globalStyles.errorText}>{form.formState.errors.submarca.message}</Text>
          )}
        </View>
        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Modelo</Text>
          <Controller
            control={form.control}
            name="modelo"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Modelo"
                style={globalStyles.input}
                keyboardType='numeric'
                maxLength={4}
                value={field.value}
                onChangeText={field.onChange}
                underlineColor='transparent'
                activeUnderlineColor={colors.main}
              />
            )}
          />

          {form.formState.errors.modelo && (
            <Text style={globalStyles.errorText}>{form.formState.errors.modelo.message}</Text>
          )}
        </View>
        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Color</Text>
          <Controller
            control={form.control}
            name="color_secundario"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Color"
                style={globalStyles.input}
                value={field.value}
                onChangeText={(value) => field.onChange(value.toUpperCase())}
                secureTextEntry={Platform.OS === 'ios' ? false : true}
                keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                underlineColor='transparent'
                activeUnderlineColor={colors.main}
              />
            )}
          />

          {form.formState.errors.color_secundario && (
            <Text style={globalStyles.errorText}>{form.formState.errors.color_secundario.message}</Text>
          )}
        </View>
        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Tipo de vehículo</Text>
          <Controller
            control={form.control}
            name="tipo_de_vehiculo"
            render={({ field }) => (
              <Picker
                selectedValue={field.value}
                onValueChange={field.onChange}
                style={globalStyles.picker}
              >
                <Picker.Item label="Selecciona tipo de vehículo" value="" />
                {tiposVehiculo
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map(tipo => (
                    <Picker.Item label={tipo.nombre} value={tipo.id} key={tipo.id} />
                  ))}
              </Picker>
            )}
          />

          {form.formState.errors.tipo_de_vehiculo && (
            <Text style={globalStyles.errorText}>{form.formState.errors.tipo_de_vehiculo.message}</Text>
          )}
        </View>

        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Tipo de Servicio</Text>
          <Controller
            control={form.control}
            name="tipo_servicio"
            render={({ field }) => (
              <Picker
                selectedValue={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                  setIsPublico(e === 'PUBLICO');
                }}
                style={globalStyles.picker}
              >
                <Picker.Item label="Selecciona tipo de servicio" value="" />
                <Picker.Item label="PÚBLICO" value="PUBLICO" />
                <Picker.Item label="PRIVADO" value="PRIVADO" />
              </Picker>
            )}
          />
          {form.formState.errors.tipo_servicio && (
            <Text style={globalStyles.errorText}>{form.formState.errors.tipo_servicio.message}</Text>
          )}
        </View>



        {isPublico && (
          <>
            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Número económico</Text>
              <Controller
                control={form.control}
                name="num_economico"
                render={({ field }) => (
                  <TextInput
                    placeholderTextColor={colors.placeHolderText}
                    placeholder="Número económico"
                    style={globalStyles.input}
                    value={field.value}
                    onChangeText={(value) => field.onChange(value.toUpperCase())}
                    secureTextEntry={Platform.OS === 'ios' ? false : true}
                    keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.main}
                  />
                )}
              />

              {form.formState.errors.num_economico && (
                <Text style={globalStyles.errorText}>{form.formState.errors.num_economico.message}</Text>
              )}
            </View>

            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Sitio o Ruta</Text>
              <Controller
                control={form.control}
                name="sitio_ruta"
                render={({ field }) => (
                  <TextInput
                    placeholderTextColor={colors.placeHolderText}
                    placeholder="Sitio o ruta"
                    style={globalStyles.input}
                    value={field.value}
                    onChangeText={(value) => field.onChange(value.toUpperCase())}
                    secureTextEntry={Platform.OS === 'ios' ? false : true}
                    keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                    underlineColor='transparent'
                    activeUnderlineColor={colors.main}
                  />
                )}
              />

              {form.formState.errors.sitio_ruta && (
                <Text style={globalStyles.errorText}>{form.formState.errors.sitio_ruta.message}</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity onPress={form.handleSubmit(onSubmit)} style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <Snackbar
        visible={encontradoToast}
        onDismiss={() => setEncontradoToast(false)}
        action={{
          label: 'Aceptar',
          onPress: () => {
            setSearch('')
          },
        }}
      >
        ¡Vehículo no encontrado!
      </Snackbar>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resultados de la búsqueda</Text>
            <FlatList
              data={searchResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
            <Button onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.main }}>Cerrar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 100,
    height: '100%',

  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginVertical: 20
  },
  search: {
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#d1d1d1',
    width: '70%'
  },
  inputSpacing: {
    marginTop: 16,
  },
  input: {
    marginBottom: 10,
    height: 70,
    color: '#1d1d1d'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
  },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
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
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  flatList: {
    maxHeight: 300,
    width: '100%',
  },
  modalListItem: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    width: '100%',
  },
  modalListItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
export default Vehiculo;
