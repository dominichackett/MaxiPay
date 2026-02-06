import { createAppSessionMessage,createECDSAMessageSigner, RPCProtocolVersion,CreateAppSessionRequestParams,RPCAppDefinition,parseAnyRPCResponse,RPCMethod ,RPCResponse,RPCAppSessionAllocation, MessageSigner, createCloseAppSessionMessage, createEIP712AuthMessageSigner, createAuthRequestMessage, createAuthVerifyMessageWithJWT, createAuthVerifyMessage, CloseAppSessionRequestParams} from '@erc7824/nitrolite';
import { getPassengerWallet } from "./wallet";
import { ethers } from "ethers";
import { createWalletClient, Hex, http } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

let ws: WebSocket | null = null;
let wallet
let amount
let paymentCallback = null
let walletClient
let sessionPrivateKey 
let sessionAccount 
let sessionAddress 
let authParams
let authenticated
let recipient
let jwtToken: string | null = null;

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



export const sendPayment = async(receiver:string,value:string)=>{
   ws = new WebSocket('wss://clearnet-sandbox.yellow.com/ws');
   recipient = receiver
   amount = value
   wallet = await getPassengerWallet()
   ws.onopen = async() => {
      console.log('Connected to Yellow Network!');
      
      await authenticate()
    };

    ws.onmessage = (event) => {
      handleMessage(parseAnyRPCResponse(event.data));
    };
    
 
}




async function handleAutMessage(message)
{
        
        console.log("Auth Challenge")
        console.log(message)
      if(jwtToken)
      {
           try{ 
            
            //Authenticate with jwtToken if available
            const authVerifyMsg = await createAuthVerifyMessageWithJWT(jwtToken);
            ws.send(authVerifyMsg);
           }catch(jwtError)
           {
            jwtToken =  null    
            await fullAuth(message)


           }  
      } else
        {
             await fullAuth(message)

        }  
     
   
    }

 async function handleVerifyAuth(message)   
{
    if (message.params.success) 
        {
           console.log('✅ Authentication successful!');
           authenticated = true;
           createSession()
                        
             // ✅ Save JWT token for future reconnections
            if (message.params.jwtToken) {
               console.log('💾 Saving JWT token for reconnection');
               jwtToken= message.params.jwtToken;
               }
                } else {
                        console.error('❌ Authentication failed');
                        jwtToken=null; // Clear invalid JWT
                    }
  }
        
 function handleMessage(message:RPCResponse) {
    switch (message.method) {
      case RPCMethod.CreateAppSession :
      console.log('✅ Session ready:', message.params.appSessionId);
 
       closeSession(message.params.appSessionId);
        break;
      case RPCMethod.CloseAppSession:
        console.log('💰 Payment sent:', amount);
        if(paymentCallback)
        paymentCallback(true)
        break;
         case RPCMethod.AuthChallenge:
          handleAutMessage(message)
         break;    
     
    // Handle auth success
   case RPCMethod.AuthVerify: 
     handleVerifyAuth(message)
     break;
    }
    console.log(message)
  }
const fullAuth = async(message) =>
{
     const eip712Signer =  createEIP712AuthMessageSigner(
      walletClient, // Your ethers wallet
      {
        scope: authParams.scope,
        session_key: sessionAddress,
        expires_at: authParams.expires_at,
        allowances: [],
      },
      {
        name: 'MaxiPay',
      }
    );
    
    console.log('EIP Signer',eip712Signer)
    // Create auth verify message
     console.log('Verify Message',authParams)

  try{  const authVerifyMsg = await createAuthVerifyMessage(
      eip712Signer,
      message  // Pass the challenge message
    );  // Send it back
    ws.send(authVerifyMsg)}catch(error)
    {
        console.log(error)
    }
    
}

async function authenticate(){
       sessionPrivateKey = generatePrivateKey();
    sessionAccount = privateKeyToAccount(sessionPrivateKey);
    sessionAddress = sessionAccount.address;

    wallet = await getPassengerWallet()

try
{const viemAccount = privateKeyToAccount(wallet.privateKey as Hex);
walletClient = createWalletClient({
    account: viemAccount,
    chain: mainnet, // Doesn't really matter for signing
    transport: http(),
});

  //console.log(ws)
  console.log('Address', wallet.address)
    authParams ={
    address: wallet.address,
    session_key: sessionAddress,
    application: 'MaxiPay',

    allowances: [] ,//[{ asset: 'ytest.usd', amount: '1000000000' }],
  expires_at: (Math.floor(Date.now() / 1000) + 3600), // 1 hour expiration (as string)
    scope: 'console',
}
     const authRequestMsg = await createAuthRequestMessage(authParams);
console.log(authRequestMsg)

ws.send(authRequestMsg);
}catch(error)
{
    console.log(error)
}

}


async function createSession() {

    let p:RPCProtocolVersion = RPCProtocolVersion.NitroRPC_0_4
        const appDefinition:RPCAppDefinition = {
      protocol:p,
      application:"MaxiPay",
      participants: [wallet.address, recipient],
      weights: [100, 0],
      quorum: 100,
      challenge: 0,
      nonce: Date.now(),
    };

    console.log('Amount',ethers.utils.parseUnits(amount,6).toString())
    console.log(`Transaction : rec ${recipient} sender: ${wallet.address}`)

    const initialAllocations:RPCAppSessionAllocation[] = [
      {
        participant: wallet.address,
        asset: 'ytest.usd',
        amount: ethers.utils.parseUnits(amount,6).toString()
      },
      {
        participant: recipient,
        asset: 'ytest.usd',
        amount: '0',
      },
    ]; 
        
    try
    {

      
       const signer = createECDSAMessageSigner(wallet.privateKey)  
      const createSessionMsg = await createAppSessionMessage(
      signer,
      {
        definition: appDefinition,
        allocations: initialAllocations,
      }
    );
    console.log('Session Message: ',createSessionMsg)
    ws?.send(createSessionMsg)

  }catch(error)
  {
    console.log('Create App Session',error)
  }
    
  
}

async function closeSession(appSessionId){
   const finalAllocations = [
     {
        participant: recipient,
        asset: 'ytest.usd',
        amount: ethers.utils.parseUnits(amount,6).toString(), // Receiver gets full amount
      },  
    {
        participant: wallet.address,
        asset: 'ytest.usd',
        amount: '0', // Sender now has 0
      }
     
    ];
    
    const signer = createECDSAMessageSigner(wallet.privateKey)  
     const params:CloseAppSessionRequestParams =  {
        
        app_session_id: appSessionId,
        allocations: finalAllocations,
      }
    const closeSessionMsg = await createCloseAppSessionMessage(
      signer,
       params
    ); 
    ws?.send(closeSessionMsg)
}