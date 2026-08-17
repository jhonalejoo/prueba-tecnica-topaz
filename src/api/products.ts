import { httpClient } from './http/client';
import {
  Product,
  ProductCategory,
  ProductsResponse,
} from '../domain/products/types';

interface ProductsParams {
  limit: number;
  skip: number;
  signal?: AbortSignal;
}

interface ProductDetailParams {
  id: number;
  signal?: AbortSignal;
}

interface SearchProductsParams extends ProductsParams {
  query: string;
}

interface CategoryProductsParams extends ProductsParams {
  category: string;
}

export function getProducts(params: ProductsParams) {
  return httpClient.get<ProductsResponse>('/products', {
    params: {
      limit: params.limit,
      skip: params.skip,
    },
    signal: params.signal,
  });
}

export function searchProducts(params: SearchProductsParams) {
  return httpClient.get<ProductsResponse>('/products/search', {
    params: {
      q: params.query,
      limit: params.limit,
      skip: params.skip,
    },
    signal: params.signal,
  });
}

export function getProductsByCategory(params: CategoryProductsParams) {
  return httpClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(params.category)}`,
    {
      params: {
        limit: params.limit,
        skip: params.skip,
      },
      signal: params.signal,
    },
  );
}

export function getProductById(params: ProductDetailParams) {
  return httpClient.get<Product>(`/products/${params.id}`, {
    signal: params.signal,
  });
}

export function getProductCategories(signal?: AbortSignal) {
  return httpClient.get<ProductCategory[]>('/products/categories', {
    signal,
  });
}
