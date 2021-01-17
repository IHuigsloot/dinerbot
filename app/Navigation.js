import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

import Login from './views/Login';
import Restaurants from './views/Restaurants.js';
import Products from './views/Products';
import Map from './views/Map';

import { getItem } from './utils/storage';
import AuthContextProvider from './utils/authContext';
import useAuthReducer from './utils/authReducer';
import CartContextProvider from './utils/cartContext';
import Cart from './views/Cart';
import setAuthUser from './utils/setAuthUser';
import Status from './views/Status';

const Tab = createBottomTabNavigator();
const RestaurantStack = createStackNavigator();
const MapStack = createStackNavigator();
const RootStack = createStackNavigator();

function RestaurantStackScreen() {
  return (
    <RestaurantStack.Navigator headerMode="none" animation="fade">
      <RestaurantStack.Screen
        name="Restaurants"
        component={Restaurants}
        options={{ tabBarLabel: 'Restaurant!' }}
      />
      <RestaurantStack.Screen
        name="Producten"
        component={Products}
        options={{ tabBarLabel: 'Restaurant!' }}
      />
      <RestaurantStack.Screen
        name="Winkelwagen"
        component={Cart}
        options={{ tabBarLabel: 'Restaurant!' }}
      />
      <RestaurantStack.Screen
        name="Status"
        component={Status}
        options={{ tabBarLabel: 'Restaurant!' }}
      />
    </RestaurantStack.Navigator>
  );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator headerMode="none">
      <MapStack.Screen
        name="Map"
        component={Map}
        options={{ tabBarLabel: 'Map!' }}
      />
    </MapStack.Navigator>
  );
}

function AppStack() {
	const {colors} = useTheme();

  return (
    <CartContextProvider>
      <Tab.Navigator 
        tabBarOptions={{
          activeTintColor: colors.accent,
          showLabel: false,
        }} 
        headerMode="none">
        <Tab.Screen 
          name="Restaurant" 
          component={RestaurantStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="store" color={color} size={30} />
            ),
          }} />
        <Tab.Screen  
          name="Map" 
          component={MapStackScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="map" color={color} size={30} />
            ),
          }}  />
      </Tab.Navigator>
    </CartContextProvider>
  );
}

export default function Navigation() {
  const [state, dispatch] = useAuthReducer();

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let email;

      try {
        email = await getItem('email');
        setAuthUser(email);
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', email: email });
    };

    bootstrapAsync();
  }, [state]);

  return (
    <AuthContextProvider>
      <NavigationContainer>
        <RootStack.Navigator headerMode="none" animation="fade">
          {state.email == null ? (
            <RootStack.Screen name="Login" component={Login} />
          ) : (
            <RootStack.Screen name="App" component={AppStack} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
}
