import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export const InitPosScreen: React.FC<Props> = ({initMessage}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Starting POS</Text>
      <ActivityIndicator size="large" color="blue" />
      <Text style={styles.subtitle}>{initMessage ?? ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 28, marginBottom: 20},
  subtitle: {fontSize: 20, marginBottom: 20},
});

type Props = {
  initMessage: string | undefined;
};
