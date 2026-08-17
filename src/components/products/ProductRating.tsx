import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ProductRating({ rating }: Readonly<{ rating: number }>) {
  const filledStars = Math.round(rating);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rating</Text>
      <View style={styles.row}>
        <Text style={styles.stars}>
          {Array.from({ length: 5 }, (_, index) =>
            index < filledStars ? '★' : '☆',
          ).join(' ')}
        </Text>
        <Text style={styles.value}>{rating.toFixed(1)}/5</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  stars: {
    color: '#d97706',
    fontSize: 18,
    letterSpacing: 1,
  },
  value: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
