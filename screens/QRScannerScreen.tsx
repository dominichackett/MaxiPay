import React, { useState, useEffect } from 'react';
import {Image, Text, View, StyleSheet, Button, Alert, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from 'components/CustomButton';
import { sendPayment ,setCallback} from 'utils/payment';

import {ethers} from 'ethers'
import { saveTransaction,TransactionType,Transaction } from 'utils/storage';
const { width } = Dimensions.get('window');
const qrCodeAreaSize = width * 0.7; // 70% of screen width
const QRScannerScreen = ({ route }) => {
  const {amount} = route.params
const formatCurrency = () => {
 
    return new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); // Start with scanned=true to disable scanning initially
  const [isValidQRCode,setIsValidQRCode] = useState(false)
  const [scanError,setScanError] = useState(false)
  const [recipient,setRecipient]  = useState()
  const [paymentSuccess,setPaymentSuccess]  = useState<Boolean| null>()
  const [paying,setPaying] = useState(false)
  const navigation = useNavigation();
  
  const listenForPayment = async(result:Boolean)=>{
      setPaymentSuccess(result)
      setPaying(false)

      const date = new Date();
      const formatted = date.toISOString().split('T')[0];
      const tr:Transaction ={id:Date.now().toString(),
      date:formatted,
      description:"Taxi Ride",
      amount:`-${formatCurrency()}`,
      type: "expense"
      }
      await saveTransaction(TransactionType.PassengerTransactions,tr)
    
  }
  
  useEffect(()=>{
     setCallback(listenForPayment)
     
  },[])
  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
  }, [permission]);

  const resetScan = ()=>{
    setIsValidQRCode(false)
    setScanError(false)
    setScanned(false)
  }

  const makePayment = async()=>{
   sendPayment(recipient,amount)
  }

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    setScanned(true); // Disable further scanning
    /*Alert.alert(
      "QR Code Scanned!",
      `Type: ${scanningResult.type}\nData: ${scanningResult.data}`,
      [
        { text: "OK", onPress: () => {
          console.log("Success")
        }}
      ]
    );*/

   /* Alert.alert(
      "QR Code Scanned!",
      `${scanningResult.data}`,
      [
        { text: "OK", onPress: () => {
          console.log("Success")
        }}
      ]
    );*/
    console.log(`ETH: ${scanningResult.data}`)
       
     if (  ethers.utils.isAddress(scanningResult.data)) {
          console.log("Starts with ethereum:");
          setRecipient(scanningResult.data)
              setIsValidQRCode(true)
         setScanError(false)
     }else
     {
            setIsValidQRCode(false)
           setScanError(true)
     }


    
    console.log(`Bar code with type ${scanningResult.type} and data ${scanningResult.data} has been scanned!`);
  };

  const startScan = () => {
    setScanned(false); // Enable scanning
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={80} color="gray" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={120} color="red" />
        <Text style={[styles.permissionText, { color: 'red' }]}>Camera access denied</Text>
        <Text style={styles.permissionTextSmall}>
          Please grant camera permission in your device settings to scan QR codes.
        </Text>
        <CustomButton
          title="Grant Permission"
          handlePress={requestPermission}
          containerStyles="w-full mt-4 text-white bg-secondary" textStyles={"text-white"} isLoading={undefined}
        />
        <CustomButton
          title="Go Back"
          handlePress={() => navigation.goBack()}
          containerStyles="w-full mt-2 text-white bg-neutral" textStyles={"text-white"} isLoading={undefined}
        />
      </View>
    );
  }


if(isValidQRCode )
{
    return (
      <View style={styles.permissionContainer}> 
        <Image
          source={require('../assets/images/colorlogo.png')}
          style={styles.errorLogo} // Add a new style for the logo
          resizeMode="contain"
        />
        {paymentSuccess===true && <><MaterialIcons name="done-outline" size={120} color="green" />
         <Text style={[styles.paymentText, { color: 'green' }]}>Approved</Text>
        </>}
        {paymentSuccess==false && <><MaterialIcons name="error-outline" size={120} color="red" />        
        <Text style={[styles.paymentText, { color: 'red' }]}>Declined</Text>
     </>}

        <Text style={[styles.paymentText, { color: 'green' }]}>Pay: {formatCurrency()}</Text>
       {(!paymentSuccess===true ) && <Text style={styles.permissionTextSmall}>
          This is a valid MaxiPay QR code.
        </Text>}

        {paymentSuccess &&<Text style={styles.paymentTextSuccess}>
            Payment Sent                            
        </Text>}

        {paymentSuccess==false &&<Text style={styles.paymentTextError}>
            Payment Declined                            
        </Text>}
        
         
        {!paymentSuccess && <CustomButton
          title="Tap to Pay"
          handlePress={makePayment}
          containerStyles={`w-full mt-4 ${(paying) ?"bg-gray-100 text-gray-400" : "text-white bg-accent" }`}
          textStyles={`${(paying) ?"text-gray-300" : "text-white " }`}
          isLoading={undefined}
        />}
        <CustomButton
          title="Cancel"
          handlePress={() => navigation.goBack()}
          containerStyles="w-full mt-2 text-white bg-neutral"
          textStyles={"text-white"}
          isLoading={undefined}
        />
      </View>
    )
} 

  if(scanError)
  {
    return (
      <View style={styles.permissionContainer}> 
        <Image
          source={require('../assets/images/logoblk2.png')}
          style={styles.errorLogo} // Add a new style for the logo
          resizeMode="contain"
        />
        <MaterialIcons name="error-outline" size={120} color="red" />
        <Text style={[styles.permissionText, { color: 'red' }]}>Scan Failed</Text>
        <Text style={styles.permissionTextSmall}>
          The QR code scanned is not recognized or is invalid. Please ensure you are scanning a valid MaxiPay QR code.
        </Text>
        <CustomButton
          title="Try Again"
          handlePress={resetScan}
          containerStyles="w-full mt-4 text-white bg-secondary"
          textStyles={"text-white"}
          isLoading={undefined}
        />
        <CustomButton
          title="Go Back"
          handlePress={() => navigation.goBack()}
          containerStyles="w-full mt-2 text-white bg-neutral"
          textStyles={"text-white"}
          isLoading={undefined}
        />
      </View>
    )
  }  

  if(!scanError )
  return (
    <View style={styles.container}>
      {/* Full-screen camera view - always active */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Only scan when 'scanned' is false
      />

      {/* Semi-transparent overlay with a transparent hole for the scanner */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer} />
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.description}>Scan QR Code</Text>
        <Text style={styles.instructions}>Align QR code within the frame</Text>
                <Text style={styles.pay}>Pay: {formatCurrency()}</Text>

      </View>

      <View style={styles.scanButtonContainer}>

<CustomButton
             title={scanned ? 'Tap to Scan' : 'Scanning...'}
            handlePress={startScan}
            containerStyles="w-full  mt-2 text-white bg-accent" textStyles={"text-white"} isLoading={undefined}          />

 </View>
          
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
   paymentText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },paymentTextSuccess: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color:"green"
  },paymentTextError: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color:"red"
  }
  ,

  permissionTextSmall: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'gray',
  },
  errorLogo: { // New style for the logo
    width: 150, // Adjust size as needed
    height: 150, // Adjust size as needed
    marginBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'column',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  middleContainer: {
    flexDirection: 'row',
  },
  focusedContainer: {
    width: qrCodeAreaSize,
    height: qrCodeAreaSize,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
   pay: {
    fontSize: 26,
    color: 'red',
    textAlign: 'center',
    top:10
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
  },
});
export default QRScannerScreen;
