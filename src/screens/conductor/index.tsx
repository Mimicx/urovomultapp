import { useState, useRef, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, FlatList, Modal, Platform } from 'react-native';
import { Button, TextInput, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useNavigation, StackActions } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import { getToken } from '../../utils/tokenStorage';
import { useCasos } from '../../context/CasosContext';
import { usePersona } from '../../context/PersonaContext';
import { colors, globalStyles } from '../../config/theme/app-theme';
import { ConductorSchema } from '../../schemas/conductorSchema';
import { Persona } from '../../interfaces/persona';
import { estados } from '../../utils/estados';
import { generos } from '../../utils/generos';
import { formatDateLocal } from '../../utils/formatDate';

const Conductor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [curpNoEncontrada, setCurpNoEncontrada] = useState(false);
  const [encontradoToast, setEncontradoToast] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [vigenciaPicker, setVigenciaPicker] = useState(false);

  const navi = useNavigation();

  const { isSelected } = useCasos();

  const form = useForm<z.infer<typeof ConductorSchema>>({
    resolver: zodResolver(ConductorSchema),
    defaultValues: {
      licencia: '',
      tipo_identificacion: isSelected.licencia ? 'licencia' : '',
      vigencia_licencia: new Date('2020-01-01'),
      num_identificacion: '',
      nombre_infractor: '',
      documento_garantia: '',
      apellido_paterno_infractor: '',
      apellido_materno_infractor: '',
      genero_infractor: '',
      fecha_nacimiento_infractor: new Date('2000-01-01'),
      estado_licencia: '',
      estado_infractor: '',
      licenciaSeleccionada: isSelected.licencia,
    }
  })

  const { addPersona, cleanPersona, persona } = usePersona();
  const searchbar: any = useRef(null);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useLayoutEffect(() => {
    navi.setOptions({
      headerTitle: 'Datos del infractor',
    });
  }, [navi]);

  // useFocusEffect(
  //   useCallback(() => {
  //     cleanPersona();
  //   }, []));

  const searchDriver = async () => {
    // cleanPersona();

    if (search == '') return;

    const token = await getToken();
    const url = `https://apigrp.migob.mx/cuentaunicasir/ciudadanos/?q=${search}`;

    try {
      setIsLoading(true);
      const response = await axios.get(url, {
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // console.log(response.data.results);

      if (response.data.results.length > 0) {
        setSearchResults(response.data.results);
        setModalVisible(true);
      } else {
        // cleanPersona();
        setEncontradoToast(true);
      }

    } catch (error: any) {
      console.error('Hubo un error en la autenticación', error.response);
    } finally {
      setIsLoading(false);
    }
  }

  const onSelectedItem = (item: Persona) => {
    setSearch('');
    setSearchResults([]);
    setModalVisible(false);

    form.setValue('nombre_infractor', item.nombre);
    form.setValue('apellido_paterno_infractor', item.apellido_paterno);
    form.setValue('apellido_materno_infractor', item.apellido_materno);
    form.setValue('fecha_nacimiento_infractor', new Date(item.fecha_nacimiento));
    form.setValue('estado_licencia', item.direccion?.codigo_postal?.municipio?.estado?.nombre_de_AGEE.toLowerCase() ?? '')
  }

  const openVehiculoScreen = async (values: z.infer<typeof ConductorSchema>) => {
    // console.log(values)
    const { licenciaSeleccionada, ...valuesSinlicencia } = values;

    addPersona({
      ...persona,
      ...valuesSinlicencia,
    });
    navi.dispatch(
      StackActions.push('Contacto')
    )
  }

  //Lista mostrada en modal
  const renderItem = ({ item }: { item: Persona }) => (
    <TouchableOpacity onPress={() => onSelectedItem(item)}>
      <View style={styles.listItem}>
        <Text>{item.nombre} {item.apellido_paterno} {item.apellido_materno}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size='large' color={colors.textPrimary} />
        </View>
      )}
      <ScrollView style={{ marginBottom: 20 }}>
        <Text style={globalStyles.inputLabel}>Buscar conductor</Text>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <TextInput
            style={[globalStyles.input, { flex: 1 }]}
            value={search}
            onChangeText={(data: any) => setSearch(data.toUpperCase())}
            placeholder="CURP, RFC, Nombre completo..."
            placeholderTextColor={colors.placeHolderText}
            returnKeyType="search"
            clearButtonMode="while-editing"
            secureTextEntry={Platform.OS === 'ios' ? false : true}
            keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
            ref={searchbar}
            underlineColor='transparent'
            activeUnderlineColor={colors.main}
          />
          <TouchableOpacity
            onPress={() => searchDriver()}
            style={globalStyles.buttonIcon}
          >
            <FontAwesome name="search" size={24} color={colors.main} style={{ justifyContent: 'center' }} />
          </TouchableOpacity>
        </View>

        {isSelected.licencia ? (
          <>
            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Número de licencia</Text>
              <Controller
                control={form.control}
                name="licencia"
                render={({ field }) => (
                  <TextInput
                    placeholderTextColor={colors.placeHolderText}
                    placeholder="Licencia"
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

              {form.formState.errors.licencia && (
                <Text style={globalStyles.errorText}>{form.formState.errors.licencia.message}</Text>
              )}
            </View>
            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Estado Licencia</Text>
              <Controller
                control={form.control}
                name="estado_licencia"
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
              {form.formState.errors.estado_licencia && (
                <Text style={globalStyles.errorText}>{form.formState.errors.estado_licencia.message}</Text>
              )}
            </View>
            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Vigencia Licencia</Text>
              <Controller
                control={form.control}
                name="vigencia_licencia"
                render={({ field }) => (
                  <>
                    <TouchableOpacity
                      onPress={() => setVigenciaPicker(true)}
                      style={[globalStyles.input, { height: 48 }]}
                    >
                      <Text style={{ color: colors.textPrimary }}>
                        {field.value ? formatDateLocal(new Date(field.value)) : "Selecciona vigencia"}
                      </Text>
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      open={vigenciaPicker}
                      date={field.value}
                      onConfirm={(date) => {
                        setVigenciaPicker(false);
                        field.onChange(date);
                      }}
                      onCancel={() => setVigenciaPicker(false)}
                      mode="date"
                      title="Selecciona vigencia"
                      theme='dark'
                    />
                  </>
                )}
              />
              {form.formState.errors.vigencia_licencia && (
                <Text style={globalStyles.errorText}>{form.formState.errors.vigencia_licencia.message}</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Tipo de identificación</Text>
              <Controller
                control={form.control}
                name="tipo_identificacion"
                render={({ field }) => (
                  <Picker
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                    style={globalStyles.picker}
                  >
                    <Picker.Item label="Selecciona tipo de identificación" value="" />
                    <Picker.Item label="Pasaporte" value="pasaporte" />
                    <Picker.Item label="INE" value="ine" />
                  </Picker>
                )}
              />
              {form.formState.errors.tipo_identificacion && (
                <Text style={globalStyles.errorText}>{form.formState.errors.tipo_identificacion.message}</Text>
              )}
            </View>

            <View style={styles.inputSpacing}>
              <Text style={globalStyles.inputLabel}>Número de identificación</Text>
              <Controller
                control={form.control}
                name="num_identificacion"
                render={({ field }) => (
                  <TextInput
                    placeholderTextColor={colors.placeHolderText}
                    placeholder="Número de identificación"
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

              {form.formState.errors.num_identificacion && (
                <Text style={globalStyles.errorText}>{form.formState.errors.num_identificacion.message}</Text>
              )}
            </View>
          </>
        )}

        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Nombre del infractor</Text>
          <Controller
            control={form.control}
            name="nombre_infractor"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Nombre del infractor"
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

          {form.formState.errors.nombre_infractor && (
            <Text style={globalStyles.errorText}>{form.formState.errors.nombre_infractor.message}</Text>
          )}
        </View>
        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Apellido Paterno</Text>
          <Controller
            control={form.control}
            name="apellido_paterno_infractor"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Apellido Paterno"
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

          {form.formState.errors.apellido_paterno_infractor && (
            <Text style={globalStyles.errorText}>{form.formState.errors.apellido_paterno_infractor.message}</Text>
          )}
        </View>
        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Apellido Materno</Text>
          <Controller
            control={form.control}
            name="apellido_materno_infractor"
            render={({ field }) => (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                placeholder="Apellido Materno"
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

          {form.formState.errors.apellido_materno_infractor && (
            <Text style={globalStyles.errorText}>{form.formState.errors.apellido_materno_infractor.message}</Text>
          )}
        </View>

        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Documento de garantiía</Text>
          <Controller
            control={form.control}
            name="documento_garantia"
            render={({ field }) => (
              <Picker
                selectedValue={field.value}
                onValueChange={field.onChange}
                style={globalStyles.picker}
              >
                <Picker.Item label="Selecciona documento..." value="" />
                <Picker.Item label="Licencia" value="Licencia" />
                <Picker.Item label="Placa" value="Placa" />
                <Picker.Item label="Tarjeta de circulación" value="Tarjeta Circulacion" />
                <Picker.Item label="Pasaporte" value="pasaporte" />
                <Picker.Item label="INE" value="ine" />
                <Picker.Item label="Otro" value="otro" />
              </Picker>
            )}
          />
          {form.formState.errors.documento_garantia && (
            <Text style={globalStyles.errorText}>{form.formState.errors.documento_garantia.message}</Text>
          )}
        </View>

        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Género</Text>
          <Controller
            control={form.control}
            name="genero_infractor"
            render={({ field }) => (
              <Picker
                selectedValue={field.value}
                onValueChange={field.onChange}
                style={globalStyles.picker}
              >
                <Picker.Item label="Selecciona género" value="" />
                {generos.map(genero => (
                  <Picker.Item label={genero.descripcion} value={genero.descripcion} key={genero.id} />
                ))}
              </Picker>
            )}
          />
          {form.formState.errors.genero_infractor && (
            <Text style={globalStyles.errorText}>{form.formState.errors.genero_infractor.message}</Text>
          )}
        </View>

        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Fecha de nacimiento</Text>
          <Controller
            control={form.control}
            name="fecha_nacimiento_infractor"
            render={({ field }) => (
              <>
                <TouchableOpacity
                  onPress={() => setDatePickerVisible(true)}
                  style={[globalStyles.input, { height: 48 }]}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {field.value ? formatDateLocal(new Date(field.value)) : "Selecciona fecha"}
                  </Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={datePickerVisible}
                  date={field.value}
                  onConfirm={(date) => {
                    setDatePickerVisible(false);
                    field.onChange(date);
                  }}
                  onCancel={() => setDatePickerVisible(false)}
                  mode="date"
                  title="Selecciona fecha"
                  theme='dark'
                />
              </>
            )}
          />
          {form.formState.errors.fecha_nacimiento_infractor && (
            <Text style={globalStyles.errorText}>{form.formState.errors.fecha_nacimiento_infractor.message}</Text>
          )}
        </View>
        <View style={styles.inputSpacing}>
          <Text style={globalStyles.inputLabel}>Estado de nacimiento del infractor</Text>
          <Controller
            control={form.control}
            name="estado_infractor"
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
          {form.formState.errors.estado_licencia && (
            <Text style={globalStyles.errorText}>{form.formState.errors.estado_licencia.message}</Text>
          )}
        </View>
      </ScrollView >

      {/* <FAB
        icon="camera"
        color={colors.main}
        style={globalStyles.fabButtonSecondary}
        onPress={() => {
          selectWarrantyDocument()
        }}
        size='medium'
      /> */}

      <TouchableOpacity onPress={form.handleSubmit(openVehiculoScreen)} style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Continuar</Text>
      </TouchableOpacity>
      {/* <ProgressBar progress={25} /> */}
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
        ¡Ciudadano no encontrado!
      </Snackbar>

      <Snackbar
        visible={curpNoEncontrada}
        onDismiss={() => setCurpNoEncontrada(false)}
        action={{
          label: 'Aceptar',
          onPress: () => {
            setSearch('')
          },
        }}
      >
        ¡Faltan datos para generar CURP!
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
    flex: 1,
    padding: 10,
    height: '100%',
    width: '100%',
  },
  inputSpacing: {
    marginTop: 16,
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
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  generateButton: {
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.main,
    borderRadius: 5,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Conductor;
