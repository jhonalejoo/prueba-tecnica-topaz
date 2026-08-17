import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { getProductById } from '../../api/products';
import { getReadableErrorMessage } from '../../api/http/errors';
import { ErrorState } from '../../components/ErrorState';
import { LoadingView } from '../../components/LoadingView';
import { ProductImageCarousel } from '../../components/products/ProductImageCarousel';
import { ProductRating } from '../../components/products/ProductRating';
import {
  calculateDiscountedPrice,
  formatCurrency,
} from '../../domain/products/utils';
import { useFavorites } from '../../hooks/useFavorites';
import { ProductsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductDetail'>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProductDetailScreen({ route }: Readonly<Props>) {
  const { productId } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites(productId);
  const favoriteScale = useSharedValue(1);
  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const productQuery = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: ({ signal }) => getProductById({ id: productId, signal }),
  });

  if (productQuery.isPending) {
    return <LoadingView message="Cargando detalle..." />;
  }

  if (productQuery.isError) {
    return (
      <ErrorState
        message={getReadableErrorMessage(productQuery.error)}
        onRetry={() => productQuery.refetch()}
      />
    );
  }

  const product = productQuery.data;
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage,
  );
  const galleryImages =
    product.images.length > 0 ? product.images : [product.thumbnail];

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    favoriteScale.value = 0.92;
    favoriteScale.value = withSpring(
      1.08,
      { damping: 10, stiffness: 240 },
      () => {
        favoriteScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      },
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <ProductImageCarousel images={galleryImages} />

      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
          <AnimatedPressable
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
              favoriteAnimatedStyle,
            ]}
            testID="favorite-button"
          >
            <Text
              style={[
                styles.favoriteButtonLabel,
                isFavorite && styles.favoriteButtonLabelActive,
              ]}
            >
              {isFavorite ? 'Quitar favorito' : 'Agregar favorito'}
            </Text>
          </AnimatedPressable>
        </View>

        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.discountedPrice}>
          {formatCurrency(discountedPrice)}
        </Text>
        <Text style={styles.originalPrice}>
          {formatCurrency(product.price)}
        </Text>
        <ProductRating rating={product.rating} />
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.tagsSection}>
          <Text style={styles.sectionLabel}>Tags</Text>
          <View style={styles.tagsRow}>
            {product.tags.map(tag => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagLabel}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3efe7',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcb',
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
  },
  titleRow: {
    gap: 12,
    marginBottom: 10,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  favoriteButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  favoriteButtonActive: {
    backgroundColor: '#fee2e2',
  },
  favoriteButtonLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  favoriteButtonLabelActive: {
    color: '#b91c1c',
  },
  category: {
    color: '#b45309',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  discountedPrice: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  originalPrice: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 18,
    textDecorationLine: 'line-through',
  },
  description: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsSection: {
    gap: 12,
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagChip: {
    backgroundColor: '#fef3c7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagLabel: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '700',
  },
});
