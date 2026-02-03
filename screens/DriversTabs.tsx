import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import DriverWalletScreen from './DriverWalletScreen';
import HistoryScreen from './HistoryScreen';
import DriverWalletAddressScreen from './DriverWalletAddressScreen'; // Import the new screen

const Tab = createBottomTabNavigator();

const DriversTabs = () => {
  return (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'DriverWallet') {
                  iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'History') {
                  iconName = focused ? 'time' : 'time-outline';
                } else if (route.name === 'Address') {
                  iconName = focused ? 'qr-code' : 'qr-code-outline';
                }
    
                if (!iconName) {
                  iconName = 'help-circle-outline';
                }
    
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#1E90FF',
              tabBarInactiveTintColor: '#00008B',
              headerShown: false,
            })}
          >
            <Tab.Screen name="DriverWallet" component={DriverWalletScreen} /><Tab.Screen name="History" component={HistoryScreen} /><Tab.Screen name="Address" component={DriverWalletAddressScreen} />
          </Tab.Navigator>  );
};

export default DriversTabs;
