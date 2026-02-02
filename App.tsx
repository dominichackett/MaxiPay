import CustomButton from 'components/CustomButton';
import './global.css';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PassengersScreen from './screens/passengers';
import QRScannerScreen from './screens/QRScannerScreen'; // Import QRScannerScreen

const Stack = createNativeStackNavigator();

function MainAppContent() {
   const navigation = useNavigation();
   const handlePassengers = ()=>{
    navigation.navigate("Passengers")
   }
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
            <CustomButton
            title="Passenger Sign Up"
            handlePress={handlePassengers}
            containerStyles="w-full  text-white bg-secondary" textStyles={undefined} isLoading={undefined}          />

  <CustomButton
            title="Driver Sign Up"
            handlePress={() => { console.log("clicked")}}
            containerStyles="w-full  mt-2 text-white bg-accent" textStyles={undefined} isLoading={undefined}          />

 
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
        <Stack.Screen name="Passengers" component={PassengersScreen} options={{ title: 'Passengers' }} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'Scan QR Code' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}