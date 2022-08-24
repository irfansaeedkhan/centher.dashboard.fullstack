import {web3ActionType} from "../action/web3";

const web3InitialState = {
    web3:null,
    useraddress:"",
    networkid:"",
    walletname:"metamask",
    contractname:null,
    transactionInprogress:false
};

const web3Reducer = (state = web3InitialState, action)=>{
    console.log("Hello ")
    switch(action.type){
        case web3ActionType.WEB3_GET_ALL_VALUES:return{
            ...state
        }
        case web3ActionType.WEB3_CONNECT:return{
            ...state,
            web3:action.web3,
            useraddress:action.useraddress,
            networkid:action.networkid,
            walletname:"metamask",
            contractname:action.contractname
        }
        case web3ActionType.WEB3_DISCONNECT:return{
            web3:null,
            useraddress:"",
            networkid:"",
            walletname:"metamask",
            contractname:null,
            transactionInprogress:false
        }
        case web3ActionType.WEB3_GET_NETWORK_CHAIN_ID:return{
            networkid:state.networkid,
        }
        case web3ActionType.WEB3_GET_USER_PUBLIC_KEY:return{
            useraddress:state.useraddress,
        }
        case web3ActionType.WEB3_GET_CONTRACT_VALUES:return{
            contractname:state.contractname,
        }
        case web3ActionType.WEB3_GET_WALLET_PROVIDER:return{
            walletname:state.walletname,
        }
        case web3ActionType.WEB3_TRANSACTION_TRUE:return{
            ...state,
            transactionInprogress:true
        }
        case web3ActionType.WEB3_TRANSACTION_FALSE:return{
            ...state,
            transactionInprogress:false
        }
        case web3ActionType.WEB3_GET_TRANSACTION_STATUS:return{
            transactionInprogress:state.transactionInprogress,
        }
        default:
            return state
    }
}

module.exports.web3Reducer = web3Reducer;
module.exports.web3InitialState = web3InitialState;