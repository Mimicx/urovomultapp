import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, StackActions } from '@react-navigation/native';
import { usePersona } from '../../context/PersonaContext';
import { globalStyles, colors } from '../../config/theme/app-theme';
import { catalogoCargos, Cargo } from '../../utils/catalogoCargos';
import { fundamentos } from '../../utils/catalogoFundamentos';
import { Button } from 'react-native-paper';

const UMA_VALUE = 108;

const CatalogoScreen = () => {
  const [selectedCargos, setSelectedCargos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [importe, setImporte] = useState('');
  const [currentCargo, setCurrentCargo] = useState<Cargo | null>(null);

  const { persona, addPersona } = usePersona();
  const navi = useNavigation();

  useLayoutEffect(() => {
    navi.setOptions({
      headerTitle: 'Cargos',
    });
  }, [navi]);

  useEffect(() => {
    if (persona.cargos) {
      setSelectedCargos(persona.cargos);
    }
  }, [persona]);

  const openModalForImporte = (cargo: Cargo) => {
    setCurrentCargo(cargo);
    setModalVisible(true);
  };

  const handleAgregarCargo = () => {
    if (!importe || isNaN(Number(importe))) {
      Alert.alert('Error', 'Debes ingresar un importe válido.');
      return;
    }

    const importeNumber = parseFloat(importe);
    if (importeNumber < currentCargo!.importe_de_moneda_minima || importeNumber > currentCargo!.importe_de_moneda_maxima) {
      Alert.alert('Error', `El importe debe estar entre ${currentCargo!.importe_de_moneda_minima} y ${currentCargo!.importe_de_moneda_maxima}`);
      return;
    }

    const findFundamento = fundamentos.find(fundamento => fundamento.id === currentCargo?.fundamento_legal)?.denominacion;

    const cargoObj = {
      cargo: currentCargo!.id,
      descripcion: currentCargo!.descripcion,
      fundamento: findFundamento,
      importe_total: importeNumber * UMA_VALUE,
      importe_base: currentCargo?.importe_de_moneda_fija_inicial ?? 1 * UMA_VALUE,
      moneda: 'UMA'
    };

    setSelectedCargos((prevSelected) => [...prevSelected, cargoObj]);
    setModalVisible(false);
    setImporte('');
  };

  const removeCargo = (id: number) => {
    setSelectedCargos((prevSelected) => prevSelected.filter(cargo => cargo.cargo !== id));
  };

  const confirmSelection = () => {
    let obj_catalogo = { 'cargos': selectedCargos };
    let full_persona = { ...persona, ...obj_catalogo };
    addPersona(full_persona);
    navi.dispatch(StackActions.push('Detalles'));
  };

  // Función para buscar en cargos y fundamentos
  const filterCargosBySearchText = (searchText: string) => {
    const lowercasedSearchText = searchText.toLowerCase();

    return catalogoCargos.filter((cargo) => {
      const cargoDescripcionMatches = cargo.descripcion.toLowerCase().includes(lowercasedSearchText);
      const fundamento = fundamentos.find(f => f.id === cargo.fundamento_legal);
      const fundamentoDenominacionMatches = fundamento
        ? fundamento.denominacion.toLowerCase().includes(lowercasedSearchText)
        : false;

      // Excluir los cargos ya seleccionados
      const isAlreadySelected = selectedCargos.some(selectedCargo => selectedCargo.cargo === cargo.id);

      // Mostrar solo los cargos que coincidan con la búsqueda y que no estén seleccionados
      return (cargoDescripcionMatches || fundamentoDenominacionMatches) && !isAlreadySelected;
    });
  };

  const renderCargoItem = ({ item }: { item: Cargo }) => (
    <View style={styles.cargoItem}>
      <TouchableOpacity
        onPress={() => {
          if (item.es_concepto_capturable) {
            openModalForImporte(item);
          } else {
            const cargoObj = {
              cargo: item.id,
              descripcion: item.descripcion,
              importe_total: item.importe_de_moneda_fija_inicial * UMA_VALUE,
              importe_base: item.importe_de_moneda_fija_inicial ?? 1 * UMA_VALUE,
              moneda: 'UMA'
            };
            setSelectedCargos((prevSelected) => [...prevSelected, cargoObj]);
          }
        }}
        style={[globalStyles.buttonIcon]}
      >
        <Icon name="plus-square" size={32} color={colors.main} />
      </TouchableOpacity>
      <Text style={styles.cargoText}>{item.descripcion}</Text>
    </View>
  );


  const filteredCargos: Cargo[] = filterCargosBySearchText(searchText);

  const renderSelectedCargo = ({ item }: { item: any }) => (
    <View style={styles.selectedCargoItem}>
      <TouchableOpacity onPress={() => removeCargo(item.cargo)} style={styles.removeButton}>
        <Icon name="minus-square" size={28} color={colors.orange} />
      </TouchableOpacity>
      <View style={styles.selectedCargoInfo}>
        <Text style={styles.selectedCargoText}>
          {item.descripcion}
        </Text>
        <Text style={styles.selectedCargoImporte}>
          Importe: <Text style={{ fontWeight: 'bold' }}>${item.importe_total.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedCargos.length > 0 && (
        <FlatList
          data={selectedCargos}
          renderItem={renderSelectedCargo}
          keyExtractor={(item) => item.cargo.toString()}
          ListHeaderComponent={<Text style={styles.selectedHeader}>Cargos seleccionados</Text>}
        />
      )}

      <TextInput
        style={styles.searchBar}
        placeholderTextColor={colors.placeHolderText}
        placeholder="Buscar por cargo o fundamento"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredCargos}
        renderItem={renderCargoItem}
        keyExtractor={(item) => item.descripcion}
        extraData={selectedCargos}
      />

      <TouchableOpacity onPress={confirmSelection} style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { textTransform: 'uppercase', fontSize: 16 }]}>
              Importe para el cargo
            </Text>
            {currentCargo && (
              <TextInput
                placeholderTextColor={colors.placeHolderText}
                style={[globalStyles.input, { fontSize: 14 }]}
                placeholder={`Importe entre ${currentCargo.importe_de_moneda_minima} y ${currentCargo.importe_de_moneda_maxima} UMAS`}
                keyboardType="numeric"
                value={importe}
                onChangeText={setImporte}
              />
            )}
            <View style={styles.modalButtonContainer}>
              <Button onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>Cancelar</Text>
              </Button>
              <Button onPress={handleAgregarCargo}>
                <Text style={{ color: colors.main, fontSize: 18 }}>Aceptar</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    marginBottom: 10,
    color: colors.textPrimary,
  },
  cargoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  cargoText: {
    marginLeft: 10,
    fontSize: 12,
    color: colors.textPrimary,
    flex: 1,
  },
  selectedCargoItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginBottom: 5,
  },
  removeButton: {
    marginRight: 10,
    marginTop: 4,
  },
  selectedCargoInfo: {
    flex: 1,
  },
  selectedCargoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.orange,
  },
  selectedCargoImporte: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});


export default CatalogoScreen;
