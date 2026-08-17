import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const appStorage = createMMKV({
  id: 'prueba-tecnica-topaz-storage',
});

export const zustandMmkvStorage: StateStorage = {
  setItem: (name, value) => {
    appStorage.set(name, value);
  },
  getItem: name => appStorage.getString(name) ?? null,
  removeItem: name => {
    appStorage.remove(name);
  },
};
