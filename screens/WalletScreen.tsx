import CustomButton from 'components/CustomButton';
import React from 'react';
import { View, Text,Image } from 'react-native';

const WalletScreen = () => {
  const walletBalance = '1,234.56';
  const currencySymbol = '$';

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
          <Text className="text-4xl font-bold text-neutral mr-1">{currencySymbol}</Text>
          <Text className="text-6xl font-extrabold text-neutral">{walletBalance}</Text>
        </View>
        <Text className="text-sm text-neutral mt-4">Updated: Just now</Text>
      </View>
       <CustomButton
            title="Pay"
            handlePress={() => { console.log("clicked")}}
            containerStyles="w-full  mt-2 text-white bg-accent" textStyles={undefined} isLoading={undefined}          />

    </View>
  );
};

export default WalletScreen;