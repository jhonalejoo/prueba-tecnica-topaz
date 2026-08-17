import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/EmptyState';
import { FavoriteProductItem } from '../../components/products/FavoriteProductItem';
import { useFavorites } from '../../hooks/useFavorites';

export function FavoritesScreen() {
  const { favoriteProducts, removeFavorite } = useFavorites();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={favoriteProducts}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Favoritos</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState message="No hay favoritos guardados localmente en el dispositivo." />
            <Text style={styles.helper}>
              Cuando agregue productos desde la lista o el detalle, apareceran
              aqui sin recargar manualmente.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <FavoriteProductItem
            onRemove={() => removeFavorite(item.id)}
            product={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f3efe7',
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 18,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  helper: {
    color: '#6b7280',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
