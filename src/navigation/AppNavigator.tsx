import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { ProductsStackNavigator } from './ProductsStackNavigator';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function ProductsTabIcon({ color, size }: { color: string; size: number }) {
  return <Ionicons name="grid-outline" color={color} size={size} />;
}

function FavoritesTabIcon({ color, size }: { color: string; size: number }) {
  return <Ionicons name="heart-outline" color={color} size={size} />;
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#b45309',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#fffaf1',
          borderTopColor: '#eadfcb',
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStackNavigator}
        options={{
          tabBarLabel: 'Productos',
          tabBarIcon: ProductsTabIcon,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: FavoritesTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
