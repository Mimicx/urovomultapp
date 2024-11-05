import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, PermissionsAndroid, Platform, Alert, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { StackActions, useNavigation } from '@react-navigation/native';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Mapbox, { MapView, Camera, UserLocation } from "@rnmapbox/maps";
import axios from 'axios';
import * as z from "zod";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import NetInfo from '@react-native-community/netinfo';
import { usePersona } from "../../context/PersonaContext";
import { StyleSheet } from "react-native";
import { colors, globalStyles } from "../../config/theme/app-theme";

import { DomicilioSchema } from "../../schemas/domicilioSchema";
import { estados } from "../../utils/estados";

const width = Dimensions.get('screen').width;

Mapbox.setAccessToken("pk.eyJ1IjoiZmFsZWdyaWE4NiIsImEiOiJjbHkwenZiODQwc3oyMmtxMXljYzJrMHVwIn0.e3BmT0HIryGtCwFb9rXYog");
Mapbox.setTelemetryEnabled(false);

const Screen = () => {
    const { persona, addPersona } = usePersona();
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [location, setLocation] = useState({ latitude: 21.5041651, longitude: -104.8945887 });
    const [addressFetched, setAddressFetched] = useState(false);
    const navi = useNavigation();

    const form = useForm<z.infer<typeof DomicilioSchema>>({
        resolver: zodResolver(DomicilioSchema),
        defaultValues: {
            vialidad_principal_ubicacion: '',
            tipo_vialidad_ubicacion: '',
            num_exterior_ubicacion: '',
            num_interior_ubicacion: '',
            entre_primera_vialidad_ubicacion: '',
            entre_primera_tipo_ubicacion: '',
            entre_segunda_vialidad_ubicacion: '',
            entre_segunda_tipo_ubicacion: '',
            colonia_ubicacion: '',
            codigo_postal_ubicacion: '',
            municipio_ubicacion: '',
            estado_ubicacion: '',
            descripcion_ubicacion: '',
            lat_ubicacion: 21.5041651,
            lng_ubicacion: -104.8945887,
        }
    })

    useLayoutEffect(() => {
        navi.setOptions({
            headerTitle: 'Ubicación infracción',
        });
    }, [navi]);

    useEffect(() => {
        const checkInternetConnection = async () => {
            const state = await NetInfo.fetch();
            if (state.isConnected) {
                setIsConnected(true);
                requestLocationPermission();
            } else {
                setIsConnected(false);
            }
        };

        checkInternetConnection();
    }, []);

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
                        buttonPositive: "Aceptar"
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("Permiso denegado", "El permiso de ubicación es requerido para mostrar la posición en el mapa");
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getAddress = async (latitude: number, longitude: number) => {
        setIsLoading(true);
        const mapboxToken = "pk.eyJ1IjoiZmFsZWdyaWE4NiIsImEiOiJjbHkwenZiODQwc3oyMmtxMXljYzJrMHVwIn0.e3BmT0HIryGtCwFb9rXYog";
        const url_mapbox_geocode = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${mapboxToken}&limit=1`;

        try {
            const response = await axios.get(url_mapbox_geocode);
            const data = response.data.features[0].properties.context;

            if (data) {
                const num_exterior_ubicacion = data.address?.address_number;
                const calle = data.street?.name;
                const municipio_ubicacion = data.place.name ?? '';
                const cp = data.postcode?.name;
                const estado = data.region?.name;

                form.setValue('vialidad_principal_ubicacion', calle.toUpperCase());
                form.setValue('num_exterior_ubicacion', num_exterior_ubicacion ?? '');
                form.setValue('codigo_postal_ubicacion', cp);
                form.setValue('municipio_ubicacion', municipio_ubicacion.toUpperCase());
                form.setValue('estado_ubicacion', estado);

                setAddressFetched(true);
                setIsConnected(true);
            } else {
                console.error('No se encontró el domicilio');
            }
        } catch (error) {
            setIsConnected(false);
            console.error('Error obteniendo información del domicilio', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (values: z.infer<typeof DomicilioSchema>) => {
        const direccion_infraccion = `${values.tipo_vialidad_ubicacion.toUpperCase()} ${values.vialidad_principal_ubicacion.toUpperCase()}, NÚMERO EXTERIOR ${values.num_exterior_ubicacion}, ENTRE ${values.entre_primera_tipo_ubicacion} ${values.entre_primera_vialidad_ubicacion} y ${values.entre_segunda_tipo_ubicacion} ${values.entre_segunda_vialidad_ubicacion}, COLONIA ${values.colonia_ubicacion.toUpperCase()}, MUNICIPIO ${values.municipio_ubicacion.toUpperCase()}, ESTADO ${values.estado_ubicacion.toUpperCase()}, ${values.descripcion_ubicacion}`
        const formToSend = {
            direccion_infraccion,
            lat: values.lat_ubicacion.toString(),
            lng: values.lng_ubicacion.toString(),
        }

        const fullPersona = { ...persona, ...formToSend };
        // console.log(fullPersona)
        addPersona(fullPersona);
        navi.dispatch(
            StackActions.push('Catalogo')
        );
    }

    return (
        <>
            <View style={styles.container}>
                {
                    isLoading && (
                        <View style={globalStyles.loadingContainer}>
                            <ActivityIndicator size='large' color={colors.textPrimary} />
                        </View>
                    )
                }
                <ScrollView style={{ marginBottom: 20 }}>
                    {
                        isConnected && (
                            <>
                                <MapView
                                    style={styles.map}
                                    zoomEnabled={true}
                                    rotateEnabled={true}
                                    scaleBarEnabled={false}
                                    logoEnabled={false}
                                    attributionEnabled={false}
                                >
                                    <Camera
                                        followZoomLevel={16}
                                        followUserLocation
                                    />

                                    <UserLocation
                                        onUpdate={(location) => {
                                            if (!addressFetched) {
                                                const { latitude, longitude } = location.coords;
                                                form.setValue('lat_ubicacion', latitude);
                                                form.setValue('lng_ubicacion', longitude);
                                                setLocation({ latitude, longitude });
                                                getAddress(latitude, longitude);
                                            }
                                        }}
                                    />
                                </MapView>
                            </>
                        )

                    }

                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Vialidad principal</Text>
                        <Controller
                            control={form.control}
                            name="vialidad_principal_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Vialidad donde se encuentra..."
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
                        {form.formState.errors.vialidad_principal_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.vialidad_principal_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Tipo de vialidad principal</Text>
                        <Controller
                            control={form.control}
                            name="tipo_vialidad_ubicacion"
                            render={({ field }) => (
                                <Picker
                                    selectedValue={field.value}
                                    onValueChange={field.onChange}
                                    style={globalStyles.picker}
                                >
                                    <Picker.Item label="Selecciona tipo de vialidad" value="" />
                                    <Picker.Item label='CALLE' value='calle' />
                                    <Picker.Item label='AVENIDA' value='avenida' />
                                    <Picker.Item label='BOULEVARD' value='boulevard' />
                                </Picker>
                            )}
                        />
                        {form.formState.errors.tipo_vialidad_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.tipo_vialidad_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Número exterior</Text>
                        <Controller
                            control={form.control}
                            name="num_exterior_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Número exterior..."
                                    style={globalStyles.input}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    underlineColor='transparent'
                                    activeUnderlineColor={colors.main}
                                />
                            )}
                        />
                        {form.formState.errors.num_exterior_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.num_exterior_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Número Interior</Text>
                        <Controller
                            control={form.control}
                            name="num_interior_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Número interior..."
                                    style={globalStyles.input}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    underlineColor='transparent'
                                    activeUnderlineColor={colors.main}
                                />
                            )}
                        />
                        {form.formState.errors.num_interior_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.num_interior_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Entre vialidad</Text>
                        <Controller
                            control={form.control}
                            name="entre_primera_vialidad_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Entre vialidad..."
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
                        {form.formState.errors.entre_primera_vialidad_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.entre_primera_vialidad_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Tipo de vialidad</Text>
                        <Controller
                            control={form.control}
                            name="entre_primera_tipo_ubicacion"
                            render={({ field }) => (
                                <Picker
                                    selectedValue={field.value}
                                    onValueChange={field.onChange}
                                    style={globalStyles.picker}
                                >
                                    <Picker.Item label="Selecciona tipo de vialidad" value="" />
                                    <Picker.Item label='CALLE' value='calle' />
                                    <Picker.Item label='AVENIDA' value='avenida' />
                                    <Picker.Item label='BOULEVARD' value='boulevard' />
                                </Picker>
                            )}
                        />
                        {form.formState.errors.entre_primera_tipo_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.entre_primera_tipo_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Y vialidad</Text>
                        <Controller
                            control={form.control}
                            name="entre_segunda_vialidad_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Y entre vialidad..."
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
                        {form.formState.errors.entre_segunda_vialidad_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.entre_segunda_vialidad_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Tipo de vialidad</Text>
                        <Controller
                            control={form.control}
                            name="entre_segunda_tipo_ubicacion"
                            render={({ field }) => (
                                <Picker
                                    selectedValue={field.value}
                                    onValueChange={field.onChange}
                                    style={globalStyles.picker}
                                >
                                    <Picker.Item label="Selecciona tipo de vialidad" value="" />
                                    <Picker.Item label='CALLE' value='calle' />
                                    <Picker.Item label='AVENIDA' value='avenida' />
                                    <Picker.Item label='BOULEVARD' value='boulevard' />
                                </Picker>
                            )}
                        />
                        {form.formState.errors.entre_segunda_tipo_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.entre_segunda_tipo_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Descripción de la ubicación</Text>
                        <Controller
                            control={form.control}
                            name="descripcion_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Describa la ubicación..."
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
                        {form.formState.errors.descripcion_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.descripcion_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Colonia</Text>
                        <Controller
                            control={form.control}
                            name="colonia_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Colonia donde se encuentra..."
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
                        {form.formState.errors.colonia_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.colonia_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Código postal</Text>
                        <Controller
                            control={form.control}
                            name="codigo_postal_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Código postal..."
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
                        {form.formState.errors.colonia_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.colonia_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Municipio</Text>
                        <Controller
                            control={form.control}
                            name="municipio_ubicacion"
                            render={({ field }) => (
                                <TextInput
                                    placeholderTextColor={colors.placeHolderText}
                                    placeholder="Municipio donde se encuentra..."
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
                        {form.formState.errors.municipio_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.municipio_ubicacion.message}</Text>
                        )}
                    </View>
                    <View style={styles.inputSpacing}>
                        <Text style={globalStyles.inputLabel}>Estado</Text>
                        <Controller
                            control={form.control}
                            name="estado_ubicacion"
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
                        {form.formState.errors.estado_ubicacion && (
                            <Text style={globalStyles.errorText}>{form.formState.errors.estado_ubicacion.message}</Text>
                        )}
                    </View>
                </ScrollView>

                <TouchableOpacity onPress={form.handleSubmit(onSubmit)} style={globalStyles.button}>
                    <Text style={globalStyles.buttonText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        height: '100%'
    },
    map: {
        width: width * 0.95,
        height: 250
    },
    inputSpacing: {
        marginTop: 16,
    },
});

export default Screen;