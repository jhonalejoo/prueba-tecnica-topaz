import { NavigatorScreenParams } from '@react-navigation/native';

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: {
    productId: number;
    productTitle: string;
  };
};

export type RootTabParamList = {
  ProductsTab: NavigatorScreenParams<ProductsStackParamList> | undefined;
  FavoritesTab: undefined;
};
