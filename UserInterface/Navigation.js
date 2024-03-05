import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from './Orders';
import OrderDetailsScreen from './OrderDetails';
import Styles from './Styles';

export default function Navigation() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="OrderListScreen"  >
        <Stack.Screen name="ORDERS" component={OrderListScreen}
          options={{
            title: 'ORDERS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="Details" component={OrderDetailsScreen}
          options={{
            title: 'ORDER DETAILS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}