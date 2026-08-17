import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function LoadingView({ message }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#b45309" size="large" />
      <Text style={styles.message}>{message || 'Cargando...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    color: '#6b7280',
    fontSize: 15,
    marginTop: 12,
  },
});
