import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../domain/products/types';
import {
  calculateDiscountedPrice,
  formatCurrency,
} from '../../domain/products/utils';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function ProductCard({
  product,
  isFavorite,
  onPress,
  onToggleFavorite,
}: Readonly<ProductCardProps>) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage,
  );

  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      testID={`product-card-${product.id}`}
    >
      <FastImage
        source={{
          uri: product.thumbnail,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
      />

      <Pressable
        hitSlop={10}
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
        testID={`favorite-toggle-${product.id}`}
      >
        <Text
          style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}
        >
          {isFavorite ? '♥' : '♡'}
        </Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {product.title}
          </Text>
          {isFavorite ? (
            <Text style={styles.favoriteBadge}>Favorito</Text>
          ) : null}
        </View>

        <Text style={styles.discountedPrice}>
          {formatCurrency(discountedPrice)}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>
            {formatCurrency(product.price)}
          </Text>
          <Text style={styles.discountLabel}>
            -{product.discountPercentage.toFixed(0)}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcb',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
  },
  image: {
    height: 210,
    width: '100%',
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 250, 241, 0.95)',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    top: 14,
    width: 36,
  },
  favoriteIcon: {
    color: '#6b7280',
    fontSize: 20,
  },
  favoriteIconActive: {
    color: '#dc2626',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: '#111827',
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  favoriteBadge: {
    backgroundColor: '#fee2e2',
    borderRadius: 999,
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  discountedPrice: {
    color: '#b45309',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  originalPrice: {
    color: '#9ca3af',
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  discountLabel: {
    color: '#047857',
    fontSize: 14,
    fontWeight: '700',
  },
});
