import React from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getProductCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../api/products';
import { ProductsResponse } from '../domain/products/types';
import { useDebouncedValue } from './useDebouncedValue';

const PAGE_SIZE = 10;

export function useProductsCatalog() {
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 400);

  const categoriesQuery = useQuery({
    queryKey: ['product-categories'],
    queryFn: ({ signal }) => getProductCategories(signal),
  });

  const productsQuery = useInfiniteQuery({
    queryKey: ['products', debouncedSearch, selectedCategory],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchProductsPage({
        search: debouncedSearch,
        category: selectedCategory,
        limit: PAGE_SIZE,
        skip: pageParam,
        signal,
      }),
    getNextPageParam: lastPage => {
      const nextSkip = lastPage.skip + lastPage.products.length;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

  const products = React.useMemo(
    () => productsQuery.data?.pages.flatMap(page => page.products) ?? [],
    [productsQuery.data],
  );

  const onChangeSearch = React.useCallback(
    (value: string) => {
      setSearchValue(value);
      if (value.trim().length > 0 && selectedCategory) {
        setSelectedCategory(null);
      }
    },
    [selectedCategory],
  );

  const onSelectCategory = React.useCallback((categorySlug: string) => {
    setSelectedCategory(current =>
      current === categorySlug ? null : categorySlug,
    );
    setSearchValue('');
  }, []);

  return {
    categoriesQuery,
    products,
    productsQuery,
    searchValue,
    selectedCategory,
    onChangeSearch,
    onSelectCategory,
  };
}

export async function fetchProductsPage({
  search,
  category,
  limit,
  skip,
  signal,
}: {
  search: string;
  category: string | null;
  limit: number;
  skip: number;
  signal?: AbortSignal;
}): Promise<ProductsResponse> {
  if (search) {
    return searchProducts({ query: search, limit, skip, signal });
  }

  if (category) {
    return getProductsByCategory({ category, limit, skip, signal });
  }

  return getProducts({ limit, skip, signal });
}
