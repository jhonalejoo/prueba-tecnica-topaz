import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../domain/products/types';
import {
  calculateDiscountedPrice,
  formatCurrency,
} from '../../domain/products/utils';

interface FavoriteProductItemProps {
  product: Product;
  onRemove: () => void;
}

export function FavoriteProductItem({
  product,
  onRemove,
}: Readonly<FavoriteProductItemProps>) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage,
  );

  return (
    <View style={styles.card}>
      <FastImage
        source={{
          uri: product.thumbnail,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <Text numberOfLines={2} style={styles.description}>
          {product.description}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.discountedPrice}>
            {formatCurrency(discountedPrice)}
          </Text>
          <Text style={styles.originalPrice}>
            {formatCurrency(product.price)}
          </Text>
        </View>

        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Text style={styles.removeButtonLabel}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcb',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    overflow: 'hidden',
    padding: 14,
  },
  image: {
    borderRadius: 18,
    height: 112,
    width: 112,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  discountedPrice: {
    color: '#b45309',
    fontSize: 18,
    fontWeight: '800',
  },
  originalPrice: {
    color: '#9ca3af',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  removeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  removeButtonLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
