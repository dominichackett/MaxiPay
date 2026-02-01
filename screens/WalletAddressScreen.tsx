import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component
import CustomButton from '../components/CustomButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const WalletAddressScreen = () => {
  const walletAddress = '0x123AbcD45Ef6789012345678901234567890AbC'; // Placeholder ETH address
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(walletAddress);
    setCopied(true);
    Alert.alert('Copied!', 'Wallet address copied to clipboard.');
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-xl font-bold text-gray-800 mb-6">Your Ethereum Wallet Address</Text>
      
      {/* QR Code Display */}
      <View className="mb-6 p-4 bg-white rounded-xl shadow-lg">
        <QRCode
          value={walletAddress}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>

      <View className="bg-neutral p-4 rounded-xl shadow-md w-11/12 items-center mb-6">
        <Text className="text-sm font-medium text-gray-300 mb-2">Tap to copy</Text>
        <TouchableOpacity onPress={copyToClipboard} className="flex-row items-center justify-center">
          <Text className="text-2xl font-bold text-primary text-center mr-2 ml-2">{walletAddress}</Text>
          <Ionicons name="copy-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <CustomButton
        title={copied ? "Copied!" : "Copy Address"}
        handlePress={copyToClipboard}
        containerStyles="w-full text-white bg-secondary"
        textStyles={undefined}
        isLoading={undefined}
      />
    </View>
  );
};

export default WalletAddressScreen;