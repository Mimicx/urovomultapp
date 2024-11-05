import { useLayoutEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Switch, Text, TextInput } from "react-native-paper";
import { StackActions, useNavigation } from "@react-navigation/native";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { colors, globalStyles } from "../../config/theme/app-theme";
import { PropietarioSchema } from "../../schemas/propietarioSchema";
import { usePersona } from "../../context/PersonaContext";

const PropietarioScreen = () => {
    const [isPropietario, setIsPropietario] = useState(true);

    const navi = useNavigation();

    useLayoutEffect(() => {
        navi.setOptions({
            headerTitle: 'Datos del propietario',
        });
    }, [navi]);

    const { persona, addPersona } = usePersona();

    const form = useForm<z.infer<typeof PropietarioSchema>>({
        resolver: zodResolver(PropietarioSchema),
        defaultValues: {
            nombre_propietario: persona.nombre_infractor ?? '',
            apellido_paterno_propietario: persona.apellido_paterno_infractor ?? '',
            apellido_materno_propietario: persona.apellido_materno_infractor ?? '',
        }
    });

    const onSubmit = (values: z.infer<typeof PropietarioSchema>) => {
        // console.log(values);
        const fullPersona = { ...persona, ...values };
        addPersona(fullPersona);
        navi.dispatch(
            StackActions.push('Mapa')
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.switchContainer}>
                <Text style={[globalStyles.subtitle, { marginRight: 12 }]}>¿Infractor es el propietario?</Text>
                <Switch value={isPropietario} onValueChange={setIsPropietario} />
            </View>
            <ScrollView style={{ marginBottom: 20 }}>
                {!isPropietario ? (
                    <>
                        <View style={styles.inputSpacing}>
                            <Text style={globalStyles.inputLabel}>Nombre Propietario</Text>
                            <Controller
                                name="nombre_propietario"
                                control={form.control}
                                render={({ field }) => (
                                    <TextInput
                                        placeholderTextColor={colors.placeHolderText}
                                        placeholder="Nombre de propietario"
                                        style={globalStyles.input}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value.toUpperCase())}
                                        secureTextEntry={Platform.OS === 'ios' ? false : true}
                                        keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                                        underlineColor="transparent"
                                        activeUnderlineColor={colors.main}
                                    />
                                )}
                            />
                            {form.formState.errors.nombre_propietario && (
                                <Text style={globalStyles.errorText}>{form.formState.errors.nombre_propietario.message}</Text>
                            )}
                        </View>

                        <View style={styles.inputSpacing}>
                            <Text style={globalStyles.inputLabel}>Apellido Paterno Propietario</Text>
                            <Controller
                                name="apellido_paterno_propietario"
                                control={form.control}
                                render={({ field }) => (
                                    <TextInput
                                        placeholderTextColor={colors.placeHolderText}
                                        placeholder="Apellido Paterno de propietario"
                                        style={globalStyles.input}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value.toUpperCase())}
                                        secureTextEntry={Platform.OS === 'ios' ? false : true}
                                        keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                                        underlineColor="transparent"
                                        activeUnderlineColor={colors.main}
                                    />
                                )}
                            />
                            {form.formState.errors.apellido_paterno_propietario && (
                                <Text style={globalStyles.errorText}>{form.formState.errors.apellido_paterno_propietario.message}</Text>
                            )}
                        </View>

                        <View style={styles.inputSpacing}>
                            <Text style={globalStyles.inputLabel}>Apellido Materno Propietario</Text>
                            <Controller
                                name="apellido_materno_propietario"
                                control={form.control}
                                render={({ field }) => (
                                    <TextInput
                                        placeholderTextColor={colors.placeHolderText}
                                        placeholder="Apellido Materno de propietario"
                                        style={globalStyles.input}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value.toUpperCase())}
                                        secureTextEntry={Platform.OS === 'ios' ? false : true}
                                        keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
                                        underlineColor="transparent"
                                        activeUnderlineColor={colors.main}
                                    />
                                )}
                            />
                            {form.formState.errors.apellido_materno_propietario && (
                                <Text style={globalStyles.errorText}>{form.formState.errors.apellido_materno_propietario.message}</Text>
                            )}
                        </View>
                    </>
                ) : (
                    <Text>Confirme si el infractor es el propietario del vehículo.</Text>
                )}


            </ScrollView>
            <TouchableOpacity onPress={form.handleSubmit(onSubmit)} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginBottom: 100,
        height: '100%',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    switchLabel: {
        marginRight: 10,
        fontSize: 16,
    },
    inputSpacing: {
        marginTop: 16,
    },
});

export default PropietarioScreen;
