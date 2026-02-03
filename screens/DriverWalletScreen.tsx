import CustomButton from 'components/CustomButton';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const DriverWalletScreen = () => {
  const navigation = useNavigation(); // Get navigation object
  const walletBalance = 0;
  


  const formatCurrency = () => {
 
    return new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(walletBalance);
};

  const handlePayPress = () => {
    navigation.navigate('Payment'); // Navigate to QRScannerScreen
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
         <Image
                 source={require('../assets/images/colorlogo.png')}
                 className="w-[300px] h-[254px] rounded-2xl  mt-2"
                 resizeMode="contain"
               />
      <View className="bg-primary rounded-2xl p-6 shadow-xl w-11/12 items-center">
        <Text className="text-lg font-semibold text-neutral mb-2">Current Balance</Text>
        <View className="flex-row items-baseline">
          <Text className="text-5xl font-extrabold text-neutral">{formatCurrency()}</Text>
        </View>
        <Text className="text-sm text-neutral mt-4">Updated: Just now</Text>
      </View>
       <CustomButton
            title="Accept Payments"
            handlePress={handlePayPress} // Use the new handlePayPress function
            containerStyles="w-full  mt-12 text-white bg-accent" textStyles={"text-white"} isLoading={undefined}          />

    </View>
  );
};

export default DriverWalletScreen;