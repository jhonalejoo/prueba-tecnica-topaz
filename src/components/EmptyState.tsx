import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function EmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sin resultados</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: '#6b7280',
    fontSize: 15,
    textAlign: 'center',
  },
});
