import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsScreen } from '../screens/products/ProductsScreen';
import { ProductDetailScreen } from '../screens/products/ProductDetailScreen';
import { ProductsStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export function ProductsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f3efe7',
        },
        headerShadowVisible: false,
        headerTintColor: '#1f2937',
        contentStyle: {
          backgroundColor: '#f3efe7',
        },
      }}
    >
      <Stack.Screen
        name="ProductsList"
        component={ProductsScreen}
        options={{ title: 'Productos' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params.productTitle })}
      />
    </Stack.Navigator>
  );
}
