import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useState} from 'react';
import {Button} from 'react-native';
import {TouchableOpacity} from 'react-native';

export const ProcessingScreen: React.FC<Props> = ({amount, processingMessage, processingMessageCode, onPressCancel}) => {
  const [cancelling, setCancelling] = useState(false);

  const showCancelButton =
    !cancelling && (processingMessageCode === 115 || processingMessageCode === 121 || processingMessageCode === 122 || processingMessageCode === 123 || processingMessageCode === 124);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Processing Payment</Text>
      <Text style={styles.subtitle}>Amount: ${amount}</Text>
      <Text style={styles.subtitle}>{processingMessage ?? ''}</Text>
      {showCancelButton ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setCancelling(true);
            onPressCancel();
          }}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <ActivityIndicator size="large" color="blue" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 28, marginBottom: 20},
  subtitle: {fontSize: 20, paddingHorizontal: 16, marginBottom: 20},
  button: {padding: 15, backgroundColor: 'red', borderRadius: 8},
  buttonText: {color: 'white', fontSize: 18},
});

type Props = {
  amount: string;
  processingMessage: string | undefined;
  processingMessageCode: number | undefined;
  onPressCancel: () => any;
};
