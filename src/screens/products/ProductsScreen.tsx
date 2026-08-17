import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getReadableErrorMessage } from '../../api/http/errors';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { LoadingView } from '../../components/LoadingView';
import { ProductCard } from '../../components/products/ProductCard';
import { Product } from '../../domain/products/types';
import { useFavorites } from '../../hooks/useFavorites';
import { useProductsCatalog } from '../../hooks/useProductsCatalog';
import { ProductsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductsList'>;

export function ProductsScreen({ navigation }: Readonly<Props>) {
  const {
    categoriesQuery,
    products,
    productsQuery,
    searchValue,
    selectedCategory,
    onChangeSearch,
    onSelectCategory,
  } = useProductsCatalog();
  const { favoriteIds, toggleFavorite } = useFavorites();

  const renderItem: ListRenderItem<Product> = ({ item }) => {
    const isFavorite = favoriteIds.includes(item.id);

    return (
      <ProductCard
        isFavorite={isFavorite}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            productId: item.id,
            productTitle: item.title,
          })
        }
        onToggleFavorite={() => toggleFavorite(item)}
        product={item}
      />
    );
  };

  if (productsQuery.isPending) {
    return <LoadingView message="Cargando productos..." />;
  }

  if (productsQuery.isError) {
    return (
      <ErrorState
        message={getReadableErrorMessage(productsQuery.error)}
        onRetry={() => productsQuery.refetch()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={products}
        keyExtractor={item => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState message="No hay productos que coincidan con su busqueda o filtro." />
        }
        ListFooterComponent={
          <ListFooter
            hasNextPage={productsQuery.hasNextPage}
            isFetchNextPageError={productsQuery.isFetchNextPageError}
            isFetchingNextPage={productsQuery.isFetchingNextPage}
            onRetry={() => productsQuery.fetchNextPage()}
          />
        }
        ListHeaderComponent={
          <ListHeader
            categories={categoriesQuery.data ?? []}
            categoriesError={categoriesQuery.isError}
            categoriesLoading={categoriesQuery.isLoading}
            onRetryCategories={() => categoriesQuery.refetch()}
            onSearchChange={onChangeSearch}
            onSelectCategory={onSelectCategory}
            searchValue={searchValue}
            selectedCategory={selectedCategory}
          />
        }
        onEndReached={() => {
          if (productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) {
            productsQuery.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ListHeader({
  searchValue,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
}: Readonly<{
  searchValue: string;
  onSearchChange: (value: string) => void;
  categories: Array<{ slug: string; name: string }>;
  selectedCategory: string | null;
  onSelectCategory: (slug: string) => void;
  categoriesLoading: boolean;
  categoriesError: boolean;
  onRetryCategories: () => void;
}>) {
  return (
    <View style={styles.header}>
      <Text style={styles.heading}>Catalogo</Text>
      <Text style={styles.subheading}>
        Busque por nombre o explore una categoria. Si activa uno, el otro se
        limpia automaticamente.
      </Text>

      <TextInput
        autoCapitalize="none"
        clearButtonMode="while-editing"
        onChangeText={onSearchChange}
        placeholder="Buscar productos"
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
        value={searchValue}
      />

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        {selectedCategory ? (
          <Text style={styles.sectionMeta}>
            Filtro activo: {selectedCategory}
          </Text>
        ) : null}
      </View>

      {categoriesLoading ? (
        <View style={styles.categoriesLoadingRow}>
          <ActivityIndicator color="#b45309" />
          <Text style={styles.categoriesLoadingText}>
            Cargando categorias...
          </Text>
        </View>
      ) : null}

      {categoriesError ? (
        <Pressable onPress={onRetryCategories} style={styles.retryChip}>
          <Text style={styles.retryChipLabel}>Reintentar categorias</Text>
        </Pressable>
      ) : null}

      {!categoriesLoading && !categoriesError ? (
        <ScrollView
          contentContainerStyle={styles.categoriesRow}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(category => {
            const isActive = selectedCategory === category.slug;

            return (
              <Pressable
                key={category.slug}
                onPress={() => onSelectCategory(category.slug)}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipLabel,
                    isActive && styles.categoryChipLabelActive,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

function ListFooter({
  isFetchingNextPage,
  isFetchNextPageError,
  hasNextPage,
  onRetry,
}: Readonly<{
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  hasNextPage?: boolean;
  onRetry: () => void;
}>) {
  if (isFetchingNextPage) {
    return <LoadingView message="Cargando mas productos..." />;
  }

  if (isFetchNextPageError) {
    return (
      <View style={styles.footerState}>
        <Text style={styles.footerMessage}>
          No fue posible cargar la siguiente pagina.
        </Text>
        <Pressable onPress={onRetry} style={styles.footerButton}>
          <Text style={styles.footerButtonLabel}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!hasNextPage) {
    return (
      <View style={styles.footerState}>
        <Text style={styles.footerMessage}>
          No hay mas productos para mostrar.
        </Text>
      </View>
    );
  }

  return <View style={styles.footerSpacer} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3efe7',
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    paddingBottom: 18,
    paddingTop: 8,
  },
  heading: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subheading: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  searchInput: {
    backgroundColor: '#fffdf8',
    borderColor: '#eadfcb',
    borderRadius: 18,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitleRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionMeta: {
    color: '#b45309',
    fontSize: 12,
    fontWeight: '700',
  },
  categoriesLoadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  categoriesLoadingText: {
    color: '#6b7280',
    fontSize: 14,
  },
  categoriesRow: {
    gap: 10,
    paddingRight: 16,
  },
  categoryChip: {
    backgroundColor: '#fffaf1',
    borderColor: '#e5d7bd',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryChipActive: {
    backgroundColor: '#b45309',
    borderColor: '#b45309',
  },
  categoryChipLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipLabelActive: {
    color: '#fff',
  },
  retryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 999,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryChipLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  footerState: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 10,
  },
  footerMessage: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  footerButton: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  footerButtonLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  footerSpacer: {
    height: 8,
  },
});
