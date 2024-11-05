import React, { useState } from 'react';
import { TextInput, View, StyleSheet, } from 'react-native';



const SearchHeader = ({ onSearch }: any) => {
  const [text, setText] = useState('');

  const sendText = (val: any) => {

    setText(val)
    onSearch(val)
  }



  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={sendText}
        placeholder="Buscar Infracción..."
        placeholderTextColor='#fff'
        returnKeyType="search"
        onSubmitEditing={() => onSearch(text)}
        clearButtonMode="while-editing"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: 10,

  },
  input: {
    height: 38,
    backgroundColor: '#590E20',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#fff',

  }
});

export default SearchHeader;
