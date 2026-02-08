import CustomButton from 'components/CustomButton';
import React,{useEffect,useState} from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { connect,getBalance,isConnected,setBalanceCallback } from 'utils/yellowdriver';

const DriverWalletScreen = () => {
  const navigation = useNavigation(); // Get navigation object
const [walletBalance,setWalletBalance] = useState(0);
const [gotDriverWalletBalance,setGotDriverWalletBalance]  =useState(true)


const updateBalance = (balance)=>{
    setWalletBalance(balance)
    setGotDriverWalletBalance(true)
  }
 useEffect(()=>{

  
   async function setup() {
    setBalanceCallback(updateBalance)   
    await connect()

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
  


  const formatCurrency = () => {
 
    return new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(walletBalance);
};

  const handlePayPress = () => {
    if(gotDriverWalletBalance)
    navigation.navigate('Payment',{balance:walletBalance}); // Navigate to QRScannerScreen
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
         <Image
                 source={require('../assets/images/colorlogo.png')}
                 className="w-[300px] h-[254px] rounded-2xl  "
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
              containerStyles={`w-full  mt-4 ${!gotDriverWalletBalance ?"bg-gray-100 text-gray-400" : "text-white bg-accent" }`}
            textStyles={` ${!gotDriverWalletBalance ?" text-gray-300" : "text-white" }`}
              isLoading={undefined}
       
                       />

    </View>
  );
};

export default DriverWalletScreen;