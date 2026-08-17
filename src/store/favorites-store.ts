import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product } from '../domain/products/types';
import { zustandMmkvStorage } from '../storage/mmkv';

interface FavoritesState {
  favoriteProducts: Product[];
  isFavorite: (productId: number) => boolean;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteProducts: [],
      isFavorite: productId =>
        get().favoriteProducts.some(product => product.id === productId),
      addFavorite: product =>
        set(state => ({
          favoriteProducts: state.favoriteProducts.some(
            favoriteProduct => favoriteProduct.id === product.id,
          )
            ? state.favoriteProducts.map(favoriteProduct =>
                favoriteProduct.id === product.id ? product : favoriteProduct,
              )
            : [product, ...state.favoriteProducts],
        })),
      removeFavorite: productId =>
        set(state => ({
          favoriteProducts: state.favoriteProducts.filter(
            product => product.id !== productId,
          ),
        })),
      toggleFavorite: product => {
        if (get().isFavorite(product.id)) {
          get().removeFavorite(product.id);
          return;
        }

        get().addFavorite(product);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => zustandMmkvStorage),
      partialize: state => ({
        favoriteProducts: state.favoriteProducts,
      }),
    },
  ),
);
