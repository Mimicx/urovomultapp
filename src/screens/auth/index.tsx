import { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Snackbar, ActivityIndicator, MD2Colors, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { API_FULL } from '../../utils/urls';
import axios from 'axios'
import { getAuthData, saveAuthData, saveToken } from '../../utils/tokenStorage';
import { colors, globalStyles, normalizeSize } from '../../config/theme/app-theme';
import { LoginSchema } from '../../schemas/loginSchema';
import { useConnection } from '../../context/ConnectionContext';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useConnection();

  const navigation = useNavigation();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'luis.magallon@repuve.com',
      password: 'sigob2020',
    }
  });

  const sendAuth = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);

    if (isConnected) {
      try {
        const response = await axios.post(`${API_FULL}usuarios/login/`, values);
        await saveAuthData(response.data.access, response.data.refresh, values.email, values.password);
        // await saveToken(response.data.access);
        navigation.dispatch(StackActions.replace('Infracciones'));
      } catch (error: any) {
        console.error('Hubo un error en la autenticación', error.response);
        setVisible(true);
      } finally {
        setIsLoading(false);
      }
    } else {

      const authData = getAuthData();

      if (authData && authData.email === values.email && authData.password === values.password) {
        console.log('Autenticación offline exitosa');
        navigation.dispatch(StackActions.replace('Infracciones'));
      } else {
        setVisible(true);
        console.error('Credenciales incorrectas en modo offline');
      }
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.container, { backgroundColor: 'white' }]}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../public/icono.webp')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>

          <View>
            <Text style={globalStyles.inputLabel}>Correo electrónico</Text>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <TextInput
                  style={globalStyles.input}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder="usuario@ejemplo.com"
                  keyboardType='ascii-capable'
                  autoCapitalize='none'
                  placeholderTextColor={colors.placeHolderText}
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />
            {form.formState.errors.email && (
              <Text style={globalStyles.errorText}>{form.formState.errors.email.message}</Text>
            )}

            <Text style={[globalStyles.inputLabel, { marginTop: normalizeSize(20) }]}>Contraseña</Text>
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <TextInput
                  style={globalStyles.input}
                  onChangeText={field.onChange}
                  value={field.value}
                  placeholder="******"
                  secureTextEntry
                  placeholderTextColor={colors.placeHolderText}
                  underlineColor='transparent'
                  activeUnderlineColor={colors.main}
                />
              )}
            />
            {form.formState.errors.password && (
              <Text style={globalStyles.errorText}>{form.formState.errors.password.message}</Text>
            )}

            <TouchableOpacity
              disabled={isLoading}
              onPress={form.handleSubmit(sendAuth)}
              style={[globalStyles.button, styles.ingresarBtn, isLoading && globalStyles.disabledButton, { marginTop: 20 }]}
            >
              {!isLoading ? (
                <Text style={globalStyles.buttonText}>Ingresar</Text>
              ) : (
                <ActivityIndicator color='#fff' />
              )}
            </TouchableOpacity>
          </View>

          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: 'Cerrar',
              onPress: () => { },
              labelStyle: { color: colors.textError }
            }}>
            Hubo un error al inciar sesión.
          </Snackbar>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },

  inicioTitle: {
    textAlign: 'left',
    marginTop: normalizeSize(20),
    marginBottom: 10,
  },

  ingresarBtn: {
    marginTop: "auto"
  }
});

export default Index;