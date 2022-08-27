import Web3 from 'web3';
//import detectEthereumProvider from '@metamask/detect-provider';

const checkWalletExits = async (wallet)=>{
    let walletexits = false;
    // Checking which extension exits in the wallet
    switch (wallet) {
        case "metamask":{
            walletexits = window.ethereum.isMetaMask? true:false
            break;
        }
        case "coin99": {
            walletexits = window.ethereum.isMetaMask? true:false
            break;
        }
        case "walletconnect":{
            break;
        }
        default:
            throw new Error("Invalid web3 provider or no provider")
    }
    if(!walletexits){
        throw new Error("Failed to fetch wallet")
    }
}

module.exports.connectToWallet = async (walletname="metamask")=>{
    //let provider = await detectEthereumProvider();
    let provider = null;
    let web3 = null;
    let chainID = 0;
    //let validChain = false;
    
    //Checking if window etherum exits and wallet type 
    if(window.ethereum && walletname=="metamask"){
        
        //
        await checkWalletExits(walletname)

        //
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        //Connecting to web3
        web3 = await new Web3(window.ethereum)

    }else if(window.web3 && walletname=="metamask"){
        
        //Checking if web3 varaible exits or not
        await checkWalletExits(walletname)

        //
        web3 = await new Web3(window.web3.currentProvider)
    }else if(walletname=="walletconnect"){
        
        //
        let rpcObject = {};
        rpcObject.rpc = {};
        rpcObject.rpc[process.env.NEXT_PUBLIC_BINANCE_CHAIN_LINK] = process.env.NEXT_PUBLIC_BINANCE_CHAIN_LINK;
        provider = await new WalletConnectProvider(rpcObject);
        await provider.enable();
        web3 = await new Web3(provider);
    }else {

        //
        throw new Error("Failed to connect to wallet")
    }

    //Getting chain id of connected
    chainID = await web3.eth.net.getId();
    
    //Comparing chain id
    if(chainID!=process.env.NEXT_PUBLIC_BINANCE_CHAIN_ID){
        throw new Error("Invalid chain id")
    }
    
    return {web3:web3,networkid:chainID};
}