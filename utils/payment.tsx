import { createAppSessionMessage, parseAnyRPCResponse,RPCMethod ,RPCResponse,RPCAppSessionAllocation, MessageSigner, createCloseAppSessionMessage} from '@erc7824/nitrolite';
import { getPassengerWallet } from "./wallet";
import { ethers } from "ethers";
import { Hex } from 'viem';

let ws: WebSocket | null = null;
let wallet
let amount
let paymentCallback = null
// Export function to set the callback
export const setCallback = (callback) => {
  paymentCallback = callback;
};

const messageSigner: MessageSigner = async (payload): Promise<Hex> => {
    try {
        const wallet = await getPassengerWallet();
        
        // For ethers v5.7.2:
        // 1. Convert payload to JSON string
        const message = JSON.stringify(payload);
        
        // 2. Hash the message to get the digest
        const messageBytes = ethers.utils.arrayify(ethers.utils.id(message));
        
        // 3. Sign the digest directly (without EIP-191 prefix)
        const flatSignature =  wallet._signingKey().signDigest(messageBytes);
        console.log(wallet)
        // 4. Join the signature components
        const signature = ethers.utils.joinSignature(flatSignature);
        
        return signature as Hex;
    } catch (error) {
        console.error('Error signing message:', error);
        throw error;
    }
};

export const sendPayment = async(recipient:string,value:string)=>{
   ws = new WebSocket('wss://clearnet-sandbox.yellow.com/ws');
   wallet = await getPassengerWallet()
   ws.onopen = async() => {
      console.log('Connected to Yellow Network!');
       const appDefinition = {
      protocol: 'nitroliterpc',
      participants: [wallet.address, recipient],
      weights: [100, 0],
      quorum: 100,
      challenge: 0,
      nonce: Date.now(),
    };

    const initialAllocations:RPCAppSessionAllocation[] = [
      {
        participant: wallet.address,
        asset: 'ytest.usd',
        amount: ethers.utils.parseUnits(value,6).toString() 
      },
      {
        participant: recipient,
        asset: 'ytest.usd',
        amount: '0',
      },
    ]; 

    try
    {
      const createSessionMsg = await createAppSessionMessage(
      messageSigner,
      [{
        definition: appDefinition,
        allocations: initialAllocations,
      }]
    );
    console.log('Session Message: ',createSessionMsg)
    ws?.send(createSessionMsg)

  }catch(error)
  {
    console.log('Create App Session',error)
  }
    
    };

    ws.onmessage = (event) => {
      handleMessage(parseAnyRPCResponse(event.data));
    };
    
 
}


async function closeSession(appSessionId){
   const finalAllocations = [
      {
        participant: senderAddress,
        asset: 'usdc',
        amount: '0', // Sender now has 0
      },
      {
        participant: receiverAddress,
        asset: 'usdc',
        amount: amount, // Receiver gets full amount
      },
    ];

    const closeSessionMsg = await createCloseAppSessionMessage(
      messageSigner,
      [{
        
        appSessionId: appSessionId,
        allocations: finalAllocations,
      }]
    ); 
    ws?.send(closeSessionMsg)
}

function handleMessage(message:RPCResponse) {
    switch (message.method) {
      case RPCMethod.CreateAppSession :
      console.log('✅ Session ready:', message.params.appSessionId);
 
       closeSession(message.params.appSessionId);
        break;
      case RPCMethod.CloseAppSession:
        console.log('💰 Payment sent:', message.amount);
        if(paymentCallback)
        paymentCallback(true)
        break;
    }
    console.log(message)
  }
