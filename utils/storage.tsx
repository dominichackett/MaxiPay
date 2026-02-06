import AsyncStorage from '@react-native-async-storage/async-storage';
export enum TransactionType{
    PassengerTransactions ="Passenger",
    DriverTransactions= "Driver" 
}

export interface Transaction{
    id:string,
    date:string,
    description:string,
    amount:string,
    type:string
}

export const getTransactions = async(trType:TransactionType) {
    try {
        const data = await AsyncStorage.getItem(trType);
        if(data)
        {
           const values = JSON.parse(data)
           return values 
        }   
        else{
            return []
        }   
    }catch(error)
    {
          throw error;
    }

}

export const saveTransaction = async (trType:TransactionType,tr:Transaction)=>{
  try
    {
        let values = await getTransactions(trType)
        values.push(tr)
        const data = JSON.stringify(values)
        await AsyncStorage.setItem(trType,data)
    }catch(error)
    {
        throw error
    }
}