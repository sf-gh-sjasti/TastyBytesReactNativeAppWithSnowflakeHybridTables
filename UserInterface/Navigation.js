import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderListScreen from './Orders';
import LocationsScreen from './Locations';
import OrderDetailsScreen from './OrderDetails';
import LocationDetailsScreen from './LocationDetails';
import LaunchScreen from './Launch';
import SignUpScreen from './SignUp';
import SignInScreen from './SignIn';
import ChecklistScreen from './Checklist';
import NotificationsScreen from './Notifications';
import ProfileScreen from './Profile';
import ReviewDetailsScreen from './ReviewDetails';
import ReviewListScreen from './ReviewList';
import MenuScreen from './Menu';
import EarningsScreen from './Earnings';
import EarningsDetailScreen from './EarningsDetail';
import CurrentInventoryScreen from './CurrentInventory';
import SelectLocationsScreen from './SelectLocations';
import InventoryOrderScreen from './InventoryOrder';
import OrderSummaryScreen from './OrderSummary';
import FoodWasteScreen from './FoodWaste';
import FoodWasteDetailsScreen from './FoodWasteDetails'
import Styles from './Styles';

export default function Navigation() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function TabNavigator() {
    return (
      <Tab.Navigator
        initialRouteName="LOCATION"
        screenOptions={{
          tabBarActiveTintColor: '#FAFAFA',
          tabBarInactiveTintColor: '#FFFFFF',
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: { backgroundColor: '#11567F', height: '55px', paddingBottom: '5px', marginBottom: 20 },
          headerTitleStyle: Styles.headerTitleStyle
        }}
      >
        <Stack.Screen
          name="LOCATION"
          component={LocationDetailsScreen}
          options={{
            tabBarLabel: 'Location',
            cardStyle: { flex: 1 },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={color == '#FAFAFA' ? "location-sharp" : "location-outline"} color={color} size={size} />
            ),
          }}
        />
        <Stack.Screen
          name="ORDERS"
          component={OrderListScreen}
          options={{
            tabBarLabel: 'Orders',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={color == '#FFFFFF' ? "list-circle-outline" : "list-circle"} color={color} size={size} />
            ),
          }}
        />
        <Stack.Screen
          name="NOTIFICATIONS"
          component={NotificationsScreen}
          options={{
            tabBarLabel: 'Notifications',
            tabBarIcon: ({ color, size }) => (
              <Octicons name={color == '#FFFFFF' ? "bell" : "bell-fill"} color={color} size={size} />
            ),
          }}
        />
        <Stack.Screen
          name="MY ACCOUNT"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Octicons name={color == '#FFFFFF' ? "person" : "person-fill"} color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Launch"  >
        <Stack.Screen name="Launch" component={LaunchScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen}
          options={{
            title: ''
          }}
        />
        <Stack.Screen name="SignIn" component={SignInScreen}
          options={{
            title: ''
          }}
        />
        <Stack.Screen name="Checklist" component={ChecklistScreen}
          options={{
            title: 'CHECKLIST',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="Home" component={TabNavigator}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Locations" component={LocationsScreen}
          options={{
            title: 'LOCATIONS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="Details" component={OrderDetailsScreen}
          options={{
            title: 'ORDER DETAILS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="ReviewDetails" component={ReviewDetailsScreen}
          options={{
            title: 'REVIEW DETAILS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="ReviewList" component={ReviewListScreen}
          options={{
            title: 'REVIEWS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="Menu" component={MenuScreen}
          options={{
            title: 'MENU',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="Earnings" component={EarningsScreen}
          options={{
            title: 'MY EARNINGS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="EarningsDetail" component={EarningsDetailScreen}
          options={{
            title: 'EARNING DETAILS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="FoodWaste" component={FoodWasteScreen}
          options={{
            title: 'FOOD WASTE',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="FoodWasteDetails" component={FoodWasteDetailsScreen}
          options={{
            title: 'FOOD WASTE DETAILS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="CurrentInventory" component={CurrentInventoryScreen}
          options={{
            title: 'CURRENT INVENTORY',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="SelectLocations" component={SelectLocationsScreen}
          options={{
            title: 'LOCATIONS',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="InventoryOrder" component={InventoryOrderScreen}
          options={{
            title: 'INVENTORY ORDER',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen}
          options={{
            title: 'ORDER SUMMARY',
            headerTitleStyle: Styles.headerTitleStyle
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
