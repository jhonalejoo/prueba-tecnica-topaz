import { useFavoritesStore } from '../store/favorites-store';

export function useFavorites(productId?: number) {
  const favoriteProducts = useFavoritesStore(state => state.favoriteProducts);
  const addFavorite = useFavoritesStore(state => state.addFavorite);
  const removeFavorite = useFavoritesStore(state => state.removeFavorite);
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const favoriteIds = favoriteProducts.map(product => product.id);

  return {
    addFavorite,
    favoriteIds,
    favoriteProducts,
    isFavorite: productId ? favoriteIds.includes(productId) : false,
    removeFavorite,
    toggleFavorite,
  };
}
