import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {TextInput} from 'react-native';
import {useState} from 'react';

export const HomeScreen: React.FC<Props> = ({onPressStartPayment}) => {
  const [amount, setAmount] = useState('');

  const payButtonDisabled = !amount || isNaN(amount as any);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="$"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        autoComplete={'off'}
        autoFocus={true}
      />
      <TouchableOpacity
        style={payButtonDisabled ? styles.buttonDisabled : styles.button}
        onPress={() => onPressStartPayment(amount)}
        disabled={payButtonDisabled}>
        <Text style={styles.buttonText}>💳 Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 28, marginBottom: 20},
  input: {
    width: '80%',
    padding: 15,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {padding: 15, backgroundColor: 'green', borderRadius: 8},
  buttonDisabled: {
    padding: 15,
    backgroundColor: '#bbb',
    borderRadius: 8,
  },
  buttonText: {color: 'white', fontSize: 18},
});

type Props = {
  onPressStartPayment: (amount: string) => any;
};
