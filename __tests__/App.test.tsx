/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@d11/react-native-fast-image', () => {
  const React = require('react');
  const { Image } = require('react-native');

  const MockFastImage = props => <Image {...props} />;
  MockFastImage.resizeMode = { cover: 'cover' };
  MockFastImage.cacheControl = { immutable: 'immutable' };

  return MockFastImage;
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ component: Component }) => <Component />,
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ component: Component, name }) =>
      name === 'ProductsList' ? (
        <Component
          navigation={{ navigate: jest.fn() }}
          route={{ params: {} }}
        />
      ) : null,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-native-vector-icons/ionicons', () => 'Ionicons');

jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }) => children,
  useQuery: jest.fn().mockReturnValue({
    data: [],
    isError: false,
    isLoading: false,
    isPending: false,
    refetch: jest.fn(),
  }),
  useInfiniteQuery: jest.fn().mockReturnValue({
    data: { pages: [{ products: [], total: 0, skip: 0, limit: 10 }] },
    error: null,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isError: false,
    isFetchNextPageError: false,
    isFetchingNextPage: false,
    isPending: false,
    refetch: jest.fn(),
  }),
}));

test('renders correctly', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree!.toJSON()).toBeTruthy();
});
