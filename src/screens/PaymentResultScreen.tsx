import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export const PaymentResultScreen: React.FC<Props> = ({
  amount,
  success,
  onPressConfirm,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {success ? '✅ Payment Successful' : '❌ Payment Failed'}
      </Text>
      <Text style={styles.subtitle}>Amount: ${amount}</Text>

      <TouchableOpacity style={styles.button} onPress={() => onPressConfirm()}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 28, marginBottom: 20},
  subtitle: {fontSize: 20, marginBottom: 20},
  button: {padding: 15, backgroundColor: 'blue', borderRadius: 8},
  buttonText: {color: 'white', fontSize: 18},
});

type Props = {
  amount: string;
  success: boolean;
  onPressConfirm: () => void;
};
