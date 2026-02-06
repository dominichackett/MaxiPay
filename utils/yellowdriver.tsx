import { getDriverWallet } from "./wallet";
import {MessageSigner,createGetLedgerBalancesMessage,parseAnyRPCResponse,RPCMethod,createEIP712AuthMessageSigner, createAuthVerifyMessage, createAuthRequestMessage, createAuthVerifyMessageWithJWT, createECDSAMessageSigner, createCreateChannelMessage} from '@erc7824/nitrolite'
import { ethers } from "ethers";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http , Hex} from "viem";
import { mainnet } from "viem/chains";
let ws: WebSocket | null = null;
let  pWallet:ethers.Wallet
let connected =false
let walletClient
let sessionPrivateKey 
let sessionAccount 
let sessionAddress 
let authParams
let jwtToken: string | null = null;
let pingInterval
let authenticated
let balanceCallback = null;
let paymentReceivedCallBack = null
// Export function to set the callback
export const setPaymentReceivedCallBack = (callback) => {
  paymentReceivedCallBack = callback;
};


// Export function to set the callback
export const setBalanceCallback = (callback) => {
  balanceCallback = callback;
};


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
export const connect = async()=>{
  ws = new WebSocket('wss://clearnet-sandbox.yellow.com/ws');
   ws.onopen = async() => {
    console.log('We are Connected');
    connected=true
    sessionPrivateKey = generatePrivateKey();
    sessionAccount = privateKeyToAccount(sessionPrivateKey);
    sessionAddress = sessionAccount.address;

   const wallet = await getDriverWallet()
    pWallet = wallet
           const viemAccount = privateKeyToAccount(pWallet.privateKey as Hex);
walletClient = createWalletClient({
    account: viemAccount,
    chain: mainnet, // Doesn't really matter for signing
    transport: http(),
});
  //console.log(ws)
  console.log('Address', pWallet.address)
    authParams ={
    address: pWallet.address,
    session_key: sessionAddress,
    application: 'MaxiPay',

    allowances: [] ,//[{ asset: 'ytest.usd', amount: '1000000000' }],
  expires_at: (Math.floor(Date.now() / 1000) + 3600), // 1 hour expiration (as string)
    scope: 'console',
}
     const authRequestMsg = await createAuthRequestMessage(authParams);
console.log(authRequestMsg)

ws.send(authRequestMsg);

  };

  ws.onmessage = async(event: MessageEvent) => {
     const message = parseAnyRPCResponse(event.data);
   
   if(message.method == RPCMethod.GetLedgerBalances)
   {
       if(paymentReceivedCallBack)
      paymentReceivedCallBack(ethers.utils.formatUnits(message.params.ledgerBalances[0].amount,6))
      console.log(event.data)
   }
   
     if(message.method == RPCMethod.AuthChallenge)
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
     
    // Handle auth success
  if (message.method === RPCMethod.AuthVerify) {
    if (message.params.success) {
                        console.log('✅ Authentication successful!');
                        authenticated = true;
                        startPing()  //Ping to keep webSocket open
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

  if(message.method === RPCMethod.BalanceUpdate)
  {
       if(balanceCallback)
      balanceCallback(ethers.utils.formatUnits(message.params.balanceUpdates[0].amount,6))
    if(paymentReceivedCallBack)
      paymentReceivedCallBack(ethers.utils.formatUnits(message.params.balanceUpdates[0].amount,6))
    console.log(ethers.utils.formatUnits(message.params.balanceUpdates[0].amount,6))
       // console.log(message.params.balanceUpdate[0].amount)
  } 

  

  if(message.method=== RPCMethod.CreateChannel)
  {

            const { channelId, channel, state, serverSignature } = message.params;
            const unsignedInitialState = {
            intent: state.intent,
            version: BigInt(state.version),
            data: state.stateData, // Map state_data to data
            allocations: state.allocations.map((a: any) => ({
                destination: a.destination,
                token: a.token,
                amount: BigInt(a.amount),
            })),
        };
   
     ws.send({
    channel,
    unsignedInitialState,
    serverSignature,
});

  }
  
  if(  message.method === RPCMethod.CloseAppSession)
    {      if(paymentReceivedCallBack)
          paymentReceivedCallBack(3)
          console.log('Payment',message)
    }
    console.log('Received:', JSON.stringify(message));
    console.log(message.method)
  };

  

 

 

  ws.onerror = async(error) => {
    console.error('Error:', error);
     console.error('❌ Error:', message.params);
            
            const errorMsg = message.params.error?.toLowerCase() || '';
            
            // Handle expired session key
            if (errorMsg.includes('session key') && 
                (errorMsg.includes('expired') || errorMsg.includes('exists'))) {
                console.log('🔄 Session key expired, clearing JWT and re-authenticating...');
                jwtToken = null;
                
                // Do full authentication
                await fullAuth(message);
            }
            // Handle other JWT errors
            else if (errorMsg.includes('jwt') || 
                     errorMsg.includes('token') ||
                     errorMsg.includes('expired') ||
                     errorMsg.includes('invalid')) {
                console.log('🔄 JWT invalid, clearing and retrying...');
                jwtToken =null;
                await fullAuth(message);
            }
        
  };

  ws.onclose = (closeEvent) => {
    console.log('Disconnected');
     console.log(
          'Disconnected. Code:',
        closeEvent.code,
         'Reason:',
            closeEvent.reason
     );
  };

}





export const getBalance = async()=>{
    if (!ws || !pWallet || !connected) {
    throw new Error('Not connected or wallet not initialized');
   }
   console.log("Balances")
    const sessionSigner = createECDSAMessageSigner(sessionPrivateKey);

     const balanceMsg = await createGetLedgerBalancesMessage(
      sessionSigner,
      pWallet.address
    );

    console.log("getting balances")

    ws.send(balanceMsg);

}

export const isConnected = ()=>{
    return connected
}


function startPing() {
    // Clear any existing interval

    console.log("Starting Ping")
    stopPing();
    
    pingInterval = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        console.log("Sennding Ping ")
       // ws.send(JSON.stringify({ type: 'ping' }));
       getBalance()
      }
    }, 29000); // 29 seconds
  }

  function stopPing() {
    console.log("Stopping Ping")
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
  }