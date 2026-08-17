jest.mock('react-native-gesture-handler', () => ({}));

jest.mock('react-native-mmkv', () => {
  const storage = new Map<string, string>();

  return {
    MMKV: class MockMMKV {
      set(key: string, value: string) {
        storage.set(key, value);
      }

      getString(key: string) {
        return storage.get(key);
      }

      delete(key: string) {
        storage.delete(key);
      }

      clearAll() {
        storage.clear();
      }
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const { FlatList, View } = require('react-native');

  const mockModule = {
    createAnimatedComponent: <T>(Component: T) => Component,
    FlatList,
    View,
    interpolate: (
      value: number,
      inputRange: number[],
      outputRange: number[],
    ) => {
      const matchIndex = inputRange.findIndex(input => input === value);

      if (matchIndex >= 0) {
        return outputRange[matchIndex];
      }

      return outputRange[Math.floor(outputRange.length / 2)];
    },
    useAnimatedScrollHandler:
      (handler: (event: { contentOffset: { x: number; y: number } }) => void) =>
      (event: { nativeEvent: { contentOffset: { x: number; y: number } } }) =>
        handler(event.nativeEvent),
    useAnimatedStyle: (updater: () => object) => updater(),
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    withSpring: (value: number) => value,
  };

  return {
    __esModule: true,
    ...mockModule,
    default: mockModule,
  };
});
