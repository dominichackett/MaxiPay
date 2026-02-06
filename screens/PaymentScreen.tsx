import React, { useState,useEffect,useRef } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component
import { ethers } from 'ethers';
import { getDriverWallet } from 'utils/wallet';
import { setPaymentReceivedCallBack } from 'utils/yellowdriver';
import { saveTransaction, Transaction, TransactionType } from 'utils/storage';
const PaymentScreen = ({route}) => {
const {balance} = route.params
  const lastBalance = useRef(balance) 
  //const [lastBalance,setLastBalance] = useState(balance)
  const [walletAddress,setWalletAddress] = useState<null | ethers.Wallet>(null)
  const [payment,setPayment] = useState(0);

const paymentRecieved = async(value)=>{
  
 // if(lastBalance==value)
   // return
 console.log(value)
 //if(value ==lastBalance.current)
   //return 
 if(value-lastBalance.current>0)
 { 
   setPayment(value-lastBalance.current )
    const date = new Date();
         const formatted = date.toISOString().split('T')[0];
         const tr:Transaction ={id:Date.now().toString(),
         date:formatted,
         description:"Payment Received",
         amount:`-${formatCurrency()}`,
         type: "income"
         }
         await saveTransaction(TransactionType.PassengerTransactions,tr)
         
  }
 lastBalance.current =value
} 


const formatCurrency = () => {
 
    return new Intl.NumberFormat( 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(payment);
}; 
useEffect(()=>{
    async function setup(){
      console.log("Wallet Address")
      console.log(await getDriverWallet())
       setWalletAddress(await getDriverWallet())
       setPaymentReceivedCallBack(paymentRecieved)
    }
    setup()
  },[])
  return (
   <View className="flex-1 items-center  bg-white p-4">
   {walletAddress && <>
      <Text className="text-3xl font-bold text-gray-800 mt-20">Scan to Pay</Text>
      
      {/* QR Code Display */}
      <View className="mb-6 p-4 bg-white rounded-xl shadow-lg">
        <QRCode
          value={walletAddress?.address}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>

     <View className="bg-primary rounded-2xl p-6 shadow-xl w-11/12 items-center">
            <Text className="text-lg font-semibold text-neutral mb-2">Last Payment Received</Text>
            <View className="flex-row items-baseline">

              <Text className="text-6xl font-extrabold text-neutral">{formatCurrency()}</Text>
            </View>
            <Text className="text-sm text-neutral mt-4">Updated: Just now</Text>
          </View></>}
    </View>
  );
};

export default PaymentScreen;