import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component
import CustomButton from '../components/CustomButton';

const TopupScreen = () => {
  const walletAddress = '0x123AbcD45Ef6789012345678901234567890AbC'; // Placeholder ETH address
  const payment = '0.00';
  const currencySymbol = '$';
  
  const requestFunds = ()=>{

  }

  return (
    <View className="flex-1 items-center  bg-white p-4">
      <CustomButton
               title="Request Funds"
               handlePress={requestFunds}
               containerStyles="w-full mt-4 text-white bg-secondary" textStyles={"text-white"} isLoading={undefined}
             />
     <View className="bg-primary rounded-2xl p-6 shadow-xl w-11/12 items-center">
            <Text className="text-lg font-semibold text-neutral mb-2">Last Payment Received</Text>
            <View className="flex-row items-baseline">
              <Text className="text-4xl font-bold text-neutral mr-1">{currencySymbol}</Text>
              <Text className="text-6xl font-extrabold text-neutral">{payment}</Text>
            </View>
            <Text className="text-sm text-neutral mt-4">Updated: Just now</Text>
          </View>
    </View>
  );
};

export default TopupScreen;