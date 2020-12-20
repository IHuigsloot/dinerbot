import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

import { setItem, getItem, removeItem } from './utils/storage';
import Login from './views/Login';
import Restaurants from './views/Restaurants.js';
import Products from './views/Products';
import Map from './views/Map';

export const AuthContext = React.createContext();

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
  );
}

export default function Navigation() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            email: action.email,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            email: action.email,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            email: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      email: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let email;

      try {
        email = getItem('email');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', email: email });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
				setItem('email', data.email);
        dispatch({ type: 'SIGN_IN', email: data.email });
      },
      signOut: () => {
				removeItem('email');
				dispatch({ type: 'SIGN_OUT' })
			}
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack.Navigator headerMode="none" animation="fade">
          {state.email == null ? (
            <RootStack.Screen name="Login" component={Login} />
          ) : (
            <RootStack.Screen name="App" component={AppStack} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
