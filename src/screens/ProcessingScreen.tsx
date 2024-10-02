import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export const ProcessingScreen: React.FC<Props> = ({
  amount,
  processingMessage,
  onProcessingDone,
}) => {
  useEffect(() => {
    // Simulate a delay for processing
    setTimeout(() => {
      onProcessingDone();
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Processing Payment</Text>
      <Text style={styles.subtitle}>Amount: ${amount}</Text>
      <Text style={styles.subtitle}>{processingMessage ?? ''}</Text>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 28, marginBottom: 20},
  subtitle: {fontSize: 20, marginBottom: 20},
});

type Props = {
  amount: string;
  processingMessage: string | undefined;
  onProcessingDone: () => void;
};
