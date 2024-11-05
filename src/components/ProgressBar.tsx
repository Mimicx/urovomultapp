import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

// Obtén el ancho total de la pantalla
const screenWidth = Dimensions.get('window').width;

const ProgressBar = ({ progress }:any) => {
  // Calcula el ancho de la barra de progreso en función del progreso proporcionado
  const width = screenWidth * (progress / 100);

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 40, // 20 de padding a cada lado
    height:5,
    backgroundColor: '#c3c3c3',
    borderRadius: 5,
    overflow: 'hidden',
    margin: 20, // Margen para separar de otros elementos en la pantalla
    position:'absolute',
    bottom:0
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#790E28', // Cambia el color según necesites
    borderRadius: 5, // Mantiene las esquinas redondeadas cuando la barra progresa
  },
});

export default ProgressBar;
