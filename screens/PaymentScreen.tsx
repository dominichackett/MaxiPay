import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component
import CustomButton from '../components/CustomButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const PaymentScreen = () => {
  const walletAddress = '0x123AbcD45Ef6789012345678901234567890AbC'; // Placeholder ETH address
  const payment = '0.00';
  const currencySymbol = '$';


  return (
    <View className="flex-1 items-center  bg-white p-4">
      <Text className="text-3xl font-bold text-gray-800 mt-20">Scan to Pay</Text>
      
      {/* QR Code Display */}
      <View className="mb-6 p-4 bg-white rounded-xl shadow-lg">
        <QRCode
          value={walletAddress}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>

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

export default PaymentScreen;