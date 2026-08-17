import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import { ProductDetailScreen } from '../ProductDetailScreen';
import { useFavoritesStore } from '../../../store/favorites-store';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@d11/react-native-fast-image', () => {
  const { Image } = require('react-native');

  const MockFastImage = props => <Image {...props} />;
  MockFastImage.resizeMode = { cover: 'cover' };
  MockFastImage.cacheControl = { immutable: 'immutable' };

  return MockFastImage;
});

const mockedUseQuery = jest.mocked(useQuery);

describe('ProductDetailScreen', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] });
    mockedUseQuery.mockReturnValue({
      data: {
        id: 7,
        title: 'iPhone 13 Pro',
        description: 'Premium smartphone',
        category: 'smartphones',
        price: 1099.99,
        discountPercentage: 9.37,
        rating: 4.12,
        stock: 56,
        tags: ['smartphones', 'apple'],
        thumbnail: 'https://cdn.example.com/thumb.webp',
        images: [
          'https://cdn.example.com/1.webp',
          'https://cdn.example.com/2.webp',
        ],
      },
      isError: false,
      isPending: false,
      refetch: jest.fn(),
    } as never);
  });

  it('renders detail information and toggles favorites immediately', async () => {
    const { getAllByText, getByText, getByTestId } = render(
      <ProductDetailScreen
        navigation={{} as never}
        route={{
          key: 'ProductDetail',
          name: 'ProductDetail',
          params: { productId: 7, productTitle: 'iPhone 13 Pro' },
        }}
      />,
    );

    expect(getByText('iPhone 13 Pro')).toBeTruthy();
    expect(getByText('Premium smartphone')).toBeTruthy();
    expect(getByText('Rating')).toBeTruthy();
    expect(getByText('Tags')).toBeTruthy();
    expect(getAllByText('smartphones')).toHaveLength(2);
    expect(getByText('apple')).toBeTruthy();

    fireEvent.press(getByTestId('favorite-button'));

    await waitFor(() => {
      expect(getByText('Quitar favorito')).toBeTruthy();
    });
  });
});
