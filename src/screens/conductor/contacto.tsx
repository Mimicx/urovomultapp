import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Text } from 'react-native-paper';
import { CountryPicker } from "react-native-country-codes-picker";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePersona } from '../../context/PersonaContext';
import { ConductorContactoSchema } from '../../schemas/conductorSchema';
import { colors, globalStyles } from '../../config/theme/app-theme';
import { estados } from '../../utils/estados';
import { Picker } from '@react-native-picker/picker';

const Contacto = () => {
  const dimensions = Dimensions.get('screen')
  const phoneHeight = dimensions.height;
  const navi = useNavigation();
  const { addPersona, persona } = usePersona();
  const [showPicker, setShowPicker] = useState(false);
  const [countryCode, setCountryCode] = useState('+52');

  const form = useForm<z.infer<typeof ConductorContactoSchema>>({
    resolver: zodResolver(ConductorContactoSchema),
    defaultValues: {
      calle_infractor: '',
      colonia_infractor: '',
      num_exterior_infractor: '',
      num_interior_infractor: '',
      codigo_postal_infractor: '',
      municipio_infractor: '',
      estado_infractor: '',
      numero_de_celular: '',
      email: '',
      comentarios: '',
    }
  })

  useLayoutEffect(() => {
    navi.setOptions({
      headerTitle: 'Datos del infractor',
    });
  }, [navi]);

  const openVehiculoScreen = (values: z.infer<typeof ConductorContactoSchema>) => {
    const phoneCompleto = countryCode + values.numero_de_celular;
    const valuesCountry = {
      ...values,
      numero_de_celular: phoneCompleto
    }
    const full_persona = { ...persona, ...valuesCountry };
    // console.log(full_persona)
    addPersona(full_persona);

    navi.dispatch(
      StackActions.push('Vehiculo')
    );


  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={{ marginBottom: 40 }}>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Número de celular</Text>
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={[globalStyles.input, { height: 'auto', width: '16%', marginRight: 4 }]}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 16, marginTop: 4 }}>{countryCode}</Text>
              </TouchableOpacity>
              <Controller
                control={form.control}
                name="numero_de_celular"
                render={({ field }) => (
                  <TextInput
                    placeholderTextColor={colors.placeHolderText}
                    placeholder="3111234567"
                    style={globalStyles.input}
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType='numeric'
                    underlineColor='transparent'
                    activeUnderlineColor={colors.main}
                  />
                )}
              />
            </View>

            {form.formState.errors.numero_de_celular && (
              <Text style={globalStyles.errorText}>{form.formState.errors.numero_de_celular.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Correo electrónico</Text>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="correo@ejemplo.com"
                  style={globalStyles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType='email-address'
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />

            {form.formState.errors.email && (
              <Text style={globalStyles.errorText}>{form.formState.errors.email.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Comentarios sobre el infractor</Text>
            <Controller
              control={form.control}
              name="comentarios"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="Comentarios sobre el infractor"
                  style={globalStyles.input}
                  value={field.value}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(value) => field.onChange(value.toUpperCase())}
                  secureTextEntry={Platform.OS === 'ios' ? false : true}
                  keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />

            {form.formState.errors.comentarios && (
              <Text style={globalStyles.errorText}>{form.formState.errors.comentarios.message}</Text>
            )}
          </View>


          <View style={[styles.inputSpacing]}>
            <Text style={[globalStyles.subtitle, { marginTop: 16, marginBottom: 8, fontWeight: 'bold', color: colors.main }]}>Datos opcionales del infractor</Text>
            <Text style={globalStyles.inputLabel}>Calle</Text>
            <Controller
              control={form.control}
              name="calle_infractor"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="Calle domicilio del infractor"
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
            {form.formState.errors.calle_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.calle_infractor.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Número exterior</Text>
            <Controller
              control={form.control}
              name="num_exterior_infractor"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="Número exterior domicilio del infractor"
                  style={globalStyles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />
            {form.formState.errors.num_exterior_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.num_exterior_infractor.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Número interior</Text>
            <Controller
              control={form.control}
              name="num_interior_infractor"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="Número interior si aplica..."
                  style={globalStyles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />
            {form.formState.errors.num_interior_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.num_interior_infractor.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Colonia</Text>
            <Controller
              control={form.control}
              name="colonia_infractor"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="Colonia domicilio del infractor"
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
            {form.formState.errors.colonia_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.colonia_infractor.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Código postal</Text>
            <Controller
              control={form.control}
              name="codigo_postal_infractor"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="63000"
                  style={globalStyles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType='numeric'
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />
            {form.formState.errors.codigo_postal_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.codigo_postal_infractor.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Municipio</Text>
            <Controller
              control={form.control}
              name="municipio_infractor"
              render={({ field }) => (
                <TextInput
                  placeholderTextColor={colors.placeHolderText}
                  placeholder="Municipio domicilio infractor"
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
            {form.formState.errors.municipio_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.municipio_infractor.message}</Text>
            )}
          </View>
          <View style={styles.inputSpacing}>
            <Text style={globalStyles.inputLabel}>Estado Domicilio Infractor</Text>
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
            {form.formState.errors.estado_infractor && (
              <Text style={globalStyles.errorText}>{form.formState.errors.estado_infractor.message}</Text>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity onPress={form.handleSubmit(openVehiculoScreen)} style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <CountryPicker
          lang='es'
          show={showPicker}
          inputPlaceholder='Buscar por nombre del país...'
          style={{
            modal: {
              height: phoneHeight / 2
            },
            textInput: {
              color: colors.textPrimary
            },
            dialCode: {
              color: colors.textPrimary
            },
            searchMessageText: {
              color: colors.textPrimary
            },
            countryName: {
              color: colors.textPrimary
            }
          }}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShowPicker(false);
          }}
          onBackdropPress={() => setShowPicker(false)}
        />
      </View>
    </>
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
  countryCodePicker: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Contacto;
