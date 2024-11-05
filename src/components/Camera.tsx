
import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import {useCameraPermission, useCameraDevice, Camera} from 'react-native-vision-camera';

// Obtén el ancho total de la pantalla
const screenWidth = Dimensions.get('window').width;

const CameraModule = ({ progress }:any) => {
  // Calcula el ancho de la barra de progreso en función del progreso proporcionado
    const {hasPermission, requestPermission} = useCameraPermission();
    const device:any = useCameraDevice('back');

    useEffect(() => {
        if(!hasPermission)
        {
            requestPermission();
        }
    },[hasPermission])

    //console.log('has permission', hasPermission)
    if(!hasPermission){
        return <ActivityIndicator/>
    }

    if (!device){
        return <Text>Camera Device not Found</Text>
    }

  return (
    <View style={styles.container}>
       <Camera 
       style={StyleSheet.absoluteFill}
       device={device} isActive={true} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flex:1

  },

});

export default CameraModule;