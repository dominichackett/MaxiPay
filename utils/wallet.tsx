
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const passengerWalletExist= async()=>{
   const value = await AsyncStorage.getItem('passengerWallet');
  return value ? true: false
}

export const driverWalletExist= async()=>{
   const value = await AsyncStorage.getItem('driverWallet');
  return value ? true: false
}


export const createPassengerWallet= async()=>{
   if(!await passengerWalletExist()) 
   { 
       const wallet = ethers.Wallet.createRandom();
      await AsyncStorage.setItem('passengerWallet',wallet.privateKey);
    
    }
}


export const createDriverWallet= async()=>{
   if(! await driverWalletExist()) 
   { 
      const wallet = ethers.Wallet.createRandom();
      await AsyncStorage.setItem('driverWallet',wallet.privateKey);
   }
}

export const getPassengerWallet = async()=>{
     const value = await AsyncStorage.getItem('passengerWallet');
    return new ethers.Wallet(value)   
}


export const getDriverWallet = async()=>{
     const value = await AsyncStorage.getItem('driverWallet');
            
    return new ethers.Wallet(value)   
}