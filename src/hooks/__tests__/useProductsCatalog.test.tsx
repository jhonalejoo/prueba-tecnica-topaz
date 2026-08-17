import { renderHook, act } from '@testing-library/react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useProductsCatalog } from '../useProductsCatalog';

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('../useDebouncedValue', () => ({
  useDebouncedValue: (value: string) => value,
}));

const mockedUseInfiniteQuery = jest.mocked(useInfiniteQuery);
const mockedUseQuery = jest.mocked(useQuery);

describe('useProductsCatalog', () => {
  beforeEach(() => {
    mockedUseQuery.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    } as never);

    mockedUseInfiniteQuery.mockReturnValue({
      data: {
        pages: [
          {
            products: [
              {
                id: 1,
                title: 'Phone',
                description: 'Phone',
                category: 'smartphones',
                price: 100,
                discountPercentage: 10,
                rating: 4.6,
                stock: 3,
                tags: ['mobile'],
                thumbnail: 'thumb',
                images: ['thumb'],
              },
            ],
            total: 1,
            skip: 0,
            limit: 10,
          },
        ],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isError: false,
      isFetchNextPageError: false,
      isFetchingNextPage: false,
      isPending: false,
      refetch: jest.fn(),
    } as never);
  });

  it('resets category when a search term is entered', () => {
    const { result } = renderHook(() => useProductsCatalog());

    act(() => {
      result.current.onSelectCategory('smartphones');
    });

    expect(result.current.selectedCategory).toBe('smartphones');
    expect(result.current.searchValue).toBe('');

    act(() => {
      result.current.onChangeSearch('iphone');
    });

    expect(result.current.searchValue).toBe('iphone');
    expect(result.current.selectedCategory).toBeNull();
  });

  it('resets search when a category is selected and flattens products', () => {
    const { result } = renderHook(() => useProductsCatalog());

    act(() => {
      result.current.onChangeSearch('ipad');
    });

    act(() => {
      result.current.onSelectCategory('laptops');
    });

    expect(result.current.searchValue).toBe('');
    expect(result.current.selectedCategory).toBe('laptops');
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].title).toBe('Phone');
  });
});
