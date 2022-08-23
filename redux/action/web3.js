export const web3ActionType = {
    WEB3_CONNECT:'WEB3_CONNECT',
    WEB3_DISCONNECT:'WEB3_DISCONNECT',
    WEB3_GET_NETWORK_CHAIN_ID:'WEB3_GET_NETWORK_CHAIN_ID',
    WEB3_GET_USER_PUBLIC_KEY:'WEB3_GET_USER_PUBLIC_KEY',
    WEB3_GET_ALL_VALUES:'WEB3_GET_ALL_VALUES',
    WEB3_GET_CONTRACT_VALUES:'WEB3_GET_CONTRACT_VALUES',
    WEB3_GET_WALLET_PROVIDER:'WEB3_GET_WALLET_PROVIDER'
}

export const setWeb3Data = (data) => {
    return { type: web3ActionType.TEST_SET, web3:data.web3, networkid:data.networkid, useraddress:data.useraddress, walletname:data.walletname, contractname:data.contractname, walletname:data.walletname}
}

export const disconnectWeb3 = () =>{

}

export const getWeb3ChainID = () =>{

}

export const getPublicAddress = ()=>{

}

export const getAllValues = ()=>{

}

export const getcontractValues = ()=>{

}