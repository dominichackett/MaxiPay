import 'react-native-get-random-values';

import CustomButton from 'components/CustomButton';
import './global.css';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { useState ,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PassengersScreen from './screens/passengers';
import DriversScreen from './screens/drivers';

import QRScannerScreen from './screens/QRScannerScreen'; // Import QRScannerScreen
import PaymentScreen from 'screens/PaymentScreen';
import { driverWalletExist,passengerWalletExist ,createPassengerWallet,createDriverWallet} from 'utils/wallet';
const Stack = createNativeStackNavigator();

function MainAppContent() {
  const [gotDriverWallet,setGotDriverWallet]  = useState(false)
  const [gotPassengerWallet,setGotPassengerWallet] = useState(false)
  const [isPassenger,setIsPassenger] = useState(false)
  const [isDriver,setIsDriver] = useState(false)
  const [isSigningUp,setIsSigningUp] = useState(false)
   const navigation = useNavigation();
   const handlePassengers = async()=>{
    if(isPassenger)
    {
      navigation.navigate("Passengers")
    }else
    {
        try{
                if(isSigningUp)
                  return 
                setIsSigningUp(true)
                await createPassengerWallet()
                setIsPassenger(true)
                setIsSigningUp(false)
                navigation.navigate("Passengers")

        }catch(error)
        {
           setIsSigningUp(false)
           console.log(error)
        }
    }  
   }

   const handleDrivers = async()=>{
    if(isDriver){
      navigation.navigate("Drivers")
    }else{
     try{
                if(isSigningUp)
                  return 
                setIsSigningUp(true)
                await createDriverWallet()
                setIsDriver(true)
                setIsSigningUp(false)
                navigation.navigate("Drivers")

        }catch(error)
        {
           setIsSigningUp(false)
           console.log(error)
        } 
      }
   }


   useEffect(()=>{
   async function setup(){
    setIsDriver(await driverWalletExist())
    setIsPassenger(await passengerWalletExist())
    setGotDriverWallet(true)
    setGotPassengerWallet(true)
   }
   setup()
   },[])
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex items-center h-full px-4">
          <Image
            source={require('./assets/images/colorlogo.png')}
            className="w-[300px] h-[254px] rounded-2xl  mt-40"
            resizeMode="contain"
          />
          
          <View className="relative mt-10">
            <Text className="text-3xl text-secondary font-bold text-center">
              Easy Mobile Taxi Payments{"\n"}
            </Text>
          </View>
           {(gotDriverWallet && gotPassengerWallet) && <><CustomButton
            title={`Passenger ${isPassenger ? "": "Sign Up"}`}
            handlePress={handlePassengers}
            containerStyles="w-full  text-white bg-secondary" textStyles={"text-white"} isLoading={undefined}          />

  <CustomButton
            title={`Driver ${isDriver ? "": "Sign Up"}`}

            handlePress={handleDrivers}
            containerStyles="w-full  mt-2 text-white bg-accent" textStyles={"text-white"} isLoading={undefined}          />

           </>}
          <Text className="text-sm font-pregular text-accent mt-2 text-center">
            Digital Payments Powered By Yellow.
          </Text>
        </View>
      </ScrollView>
      
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainAppContent} options={{ headerShown: false }} />
        <Stack.Screen name="Passengers" component={PassengersScreen} options={{ title: 'Passenger' }} />
        <Stack.Screen name="Drivers" component={DriversScreen} options={{ title: 'Driver' }} />
 
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'Scan QR Code' }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Accept Payment' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}