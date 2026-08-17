import { fireEvent, render } from '@testing-library/react-native';
import { FavoritesScreen } from '../FavoritesScreen';
import { useFavoritesStore } from '../../../store/favorites-store';
import { Product } from '../../../domain/products/types';

jest.mock('@d11/react-native-fast-image', () => {
  const { Image } = require('react-native');

  const MockFastImage = (props: object) => <Image {...props} />;
  MockFastImage.resizeMode = { cover: 'cover' };
  MockFastImage.cacheControl = { immutable: 'immutable' };

  return MockFastImage;
});

const favoriteProduct: Product = {
  id: 4,
  title: 'Saved Product',
  description: 'Stored in MMKV',
  category: 'beauty',
  price: 59,
  discountPercentage: 15,
  rating: 4.1,
  stock: 8,
  tags: ['beauty'],
  thumbnail: 'thumb',
  images: ['thumb'],
};

describe('FavoritesScreen', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteProducts: [] });
    useFavoritesStore.persist.clearStorage();
  });

  it('shows the empty state when no local favorites exist', () => {
    const { getByText } = render(<FavoritesScreen />);

    expect(getByText('Favoritos')).toBeTruthy();
    expect(
      getByText('No hay favoritos guardados localmente en el dispositivo.'),
    ).toBeTruthy();
  });

  it('renders local favorites and removes them reactively', () => {
    useFavoritesStore.setState({ favoriteProducts: [favoriteProduct] });

    const { getByText, queryByText } = render(<FavoritesScreen />);

    expect(getByText('Saved Product')).toBeTruthy();
    expect(getByText('Stored in MMKV')).toBeTruthy();

    fireEvent.press(getByText('Eliminar'));

    expect(queryByText('Saved Product')).toBeNull();
    expect(
      getByText('No hay favoritos guardados localmente en el dispositivo.'),
    ).toBeTruthy();
  });
});
