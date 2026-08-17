import { renderHook, act } from '@testing-library/react-native';
import { Product } from '../../domain/products/types';
import { useFavorites } from '../useFavorites';
import { useFavoritesStore } from '../../store/favorites-store';

const favoriteProduct: Product = {
  id: 10,
  title: 'Test Phone',
  description: 'Device stored locally',
  category: 'smartphones',
  price: 120,
  discountPercentage: 10,
  rating: 4.2,
  stock: 5,
  tags: ['mobile'],
  thumbnail: 'thumb',
  images: ['thumb'],
};

describe('useFavorites', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteProducts: [] });
    useFavoritesStore.persist.clearStorage();
  });

  it('toggles a product in and out of favorites', () => {
    const { result, rerender } = renderHook(
      ({ productId }) => useFavorites(productId),
      {
        initialProps: { productId: 10 },
      },
    );

    expect(result.current.isFavorite).toBe(false);
    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.favoriteProducts).toEqual([]);

    act(() => {
      result.current.toggleFavorite(favoriteProduct);
    });

    rerender({ productId: 10 });

    expect(result.current.isFavorite).toBe(true);
    expect(result.current.favoriteIds).toEqual([10]);
    expect(result.current.favoriteProducts).toEqual([favoriteProduct]);

    act(() => {
      result.current.toggleFavorite(favoriteProduct);
    });

    rerender({ productId: 10 });

    expect(result.current.isFavorite).toBe(false);
    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.favoriteProducts).toEqual([]);
  });
});
