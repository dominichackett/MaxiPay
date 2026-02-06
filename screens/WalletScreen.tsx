import CustomButton from 'components/CustomButton';
import React, { useState,useEffect } from 'react'; // Import useState
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'; // Import TextInput
import { useNavigation } from '@react-navigation/native';
import { connect,getBalance,isConnected,setBalanceCallback } from 'utils/yellowpassenger';
import { Ionicons } from '@expo/vector-icons'; // Import icon library
import { getPassengerWallet } from 'utils/wallet';
import { saveTransaction,TransactionType,Transaction } from 'utils/storage';

   const WalletScreen = () => {
   const navigation = useNavigation();
   const [walletBalance,setWalletBalance] = useState(0);
   const [amount, setAmount] = useState(''); // New state for amount input
   const [userAddress,setUserAddress]  = useState<string>()
   const formatCurrency = () => {
 
    return new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(walletBalance);
};

const updateBalance = (balance)=>{
    setWalletBalance(balance)
  }
 useEffect(()=>{

  
   async function setup() {
    setBalanceCallback(updateBalance)   
    await connect()
    const wallet = await getPassengerWallet()
    setUserAddress(wallet.address) 
     //await authenticate()
     // await getBalance()
   }
   setup()
 },[])

 
useEffect(()=>{
   async function setup() {
      await getBalance()
   }
   if(isConnected())
   {
     console.log(isConnected())
    setup()
    //console.log("Trying to Authenticate")
   }
 },[isConnected()])

 
  const handlePayPress = () => {
    
    console.log("Attempting to pay amount:", amount);
    if (parseFloat(amount) <= 0 || amount.trim() === '') // Disable if amount is 0 or empty
      return    
    navigation.navigate('QRScanner',{amount:amount});
  };

  const handleTopUp  = async()=>{
     try {
    const response = await fetch('https://clearnet-sandbox.yellow.com/faucet/requestTokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress: userAddress
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
      const date = new Date();
          const formatted = date.toISOString().replace('T', ' ').split('.')[0]; 
          const tr:Transaction ={id:Date.now().toString(),
          date:formatted,
          description:"Top Up",
          amount:"$10.00",
          type: "income"
          }
          await saveTransaction(TransactionType.PassengerTransactions,tr)      
    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Error requesting tokens:', error);
    throw error;
  }

  }

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
         <Image
                 source={require('../assets/images/colorlogo.png')}
                 className="w-[300px] h-[254px] rounded-2xl  mt-2"
                 resizeMode="contain"
               />
      <View className="bg-primary rounded-2xl p-6 shadow-xl w-11/12 items-center mb-4"> 
        <Text className="text-lg font-semibold text-neutral mb-2">Current Balance</Text>
        <View className="flex-row items-baseline">
          <Text className="text-5xl font-extrabold text-neutral">{formatCurrency()}</Text>
        </View>
        <Text className="text-sm text-neutral mt-4">Updated: Just now</Text>
        <TouchableOpacity 
          onPress={handleTopUp}
          className="mt-4 bg-accent rounded-lg px-6 py-3 flex-row items-center">
                      <Ionicons name="add-circle" size={20} color="white" />

          <Text className="ml-2 text-white font-semibold text-base">Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View className="w-11/12 mb-8">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Enter Amount to Pay:</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 text-2xl text-gray-800 border-2 border-gray-300 text-center"
          placeholder="0.00"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

       <CustomButton
            title="Pay"
            handlePress={handlePayPress}
            containerStyles={`w-full   ${(parseFloat(amount) <= 0 || amount.trim() === "" ||  parseFloat(amount) >  walletBalance) ?"bg-gray-100 text-gray-400" : "text-white bg-accent" }`}
            textStyles={` ${(parseFloat(amount) <= 0 || amount.trim() === "" ||  parseFloat(amount) >  walletBalance ) ?" text-gray-300" : "text-white" }`}
            isLoading={undefined}
          />

    </View>
  );
};

export default WalletScreen;