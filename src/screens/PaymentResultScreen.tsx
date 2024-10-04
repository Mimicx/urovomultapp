import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export const PaymentResultScreen: React.FC<Props> = ({amount, paymentResultMessage, success, onPressConfirm}) => {
  return (
    <View style={styles.container}>
      <Text style={success ? styles.successTitle : styles.failedTitle}>{success ? '✔ Payment Successful️' : '❌ Payment Failed'}</Text>
      <Text style={styles.subtitle}>Amount: ${amount}</Text>
      <Text style={styles.subtitle}>{paymentResultMessage}</Text>

      <TouchableOpacity style={styles.button} onPress={() => onPressConfirm()}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  successTitle: {fontSize: 28, marginBottom: 20, color: 'green', textAlign: 'center'},
  failedTitle: {fontSize: 28, marginBottom: 20, color: 'red'},
  subtitle: {fontSize: 20, paddingHorizontal: 16, marginBottom: 20, textAlign: 'center'},
  button: {padding: 15, backgroundColor: 'blue', borderRadius: 8},
  buttonText: {color: 'white', fontSize: 18},
});

type Props = {
  amount: string;
  paymentResultMessage: string;
  success: boolean;
  onPressConfirm: () => void;
};
