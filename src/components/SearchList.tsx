import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, FlatList, Text, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useCiudadano } from '../context/CiudadanoContext';
import { useVehiculo } from '../context/VehiculoContext';
import { colors } from '../config/theme/app-theme';

let width = Dimensions.get('screen').width;

export interface SearchListProps {
  ciudadano: boolean;
  vehiculo: boolean;
  selectItem: (values: any) => void;

}



const SearchList = ({ ciudadano = false, vehiculo = false, selectItem }: SearchListProps) => {

  const { ciudadanos } = useCiudadano();
  const { vehiculos } = useVehiculo();

  const renderItem = (data: any) => {
    if (ciudadano == true && vehiculo == false) {
      return (
        <TouchableOpacity style={styles.item} onPress={() => { selectItem(data.item) }}>
          <View style={styles.sub_item}>
            <Text style={styles.title_item}>{data.item.nombre_completo}</Text>
            <Text style={styles.subtitle_item}>{data.item.CURP}</Text>
          </View>
          <View style={styles.line} />
        </TouchableOpacity>

      )
    }
    else if (ciudadano == false && vehiculo == true) {
      return (
        <TouchableOpacity style={styles.item} onPress={() => { selectItem(data.item) }}>
          <View style={styles.sub_item}>
            <Text style={styles.title_item}>VIN - {data.item.numero_de_identificacion_vehicular}</Text>
            <Text style={styles.subtitle_item}>Número de Placa Vigente - {data.item.numero_de_placa_vigente}</Text>

          </View>
          <View style={styles.line} />
        </TouchableOpacity>

      )
    }
    else {
      return (<></>)
    }

  }


  if (ciudadano == true && vehiculo == false) {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={ciudadanos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          nestedScrollEnabled
        />
      </SafeAreaView>
    );
  }
  else if (vehiculo == true && ciudadano == false) {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={vehiculos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          nestedScrollEnabled
        />
      </SafeAreaView>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    width: '99%',
    paddingHorizontal: 10,
    borderBottomColor: '#c3c3c3',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  list: {
    maxHeight: 250,

  },
  item: {
    width: '100%',
    height: 50,
    padding: 10,
    flexDirection: 'column',
    marginVertical: 10
  },

  sub_item: {
    flexDirection: 'column',
  },

  title_item: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  subtitle_item: {
    fontSize: width * 0.028,
    fontWeight: 'normal',
    marginVertical: 5,
    color: colors.textSecondary
  },

  line: {
    height: 0.40,
    width: width * 0.80,
    backgroundColor: '#c3c3c3',
    marginTop: 10
  }

});

export default SearchList;
