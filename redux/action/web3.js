export const web3ActionType = {
    WEB3_CONNECT:'WEB3_CONNECT',
    WEB3_DISCONNECT:'WEB3_DISCONNECT',
    WEB3_GET_NETWORK_CHAIN_ID:'WEB3_GET_NETWORK_CHAIN_ID',
    WEB3_GET_USER_PUBLIC_KEY:'WEB3_GET_USER_PUBLIC_KEY',
    WEB3_GET_ALL_VALUES:'WEB3_GET_ALL_VALUES',
    WEB3_GET_CONTRACT_VALUES:'WEB3_GET_CONTRACT_VALUES',
    WEB3_GET_WALLET_PROVIDER:'WEB3_GET_WALLET_PROVIDER',
    WEB3_TRANSACTION_TRUE:'WEB3_TRANSACTION_TRUE',
    WEB3_TRANSACTION_FALSE:'WEB3_TRANSACTION_FALSE',
    WEB3_GET_TRANSACTION_STATUS:'WEB3_GET_TRANSACTION_STATUS'
}

export const setWeb3Data = (data) => (dispatch) => {
    return { type: web3ActionType.WEB3_CONNECT, web3:data.web3, networkid:data.networkid, useraddress:data.useraddress, walletname:data.walletname, contractname:data.contractname}
}

export const disconnectWeb3 = ()  => (dispatch) => {
    return { type: web3ActionType.WEB3_DISCONNECT}
}

export const getWeb3ChainID = () => (dispatch) => {
    return { type: web3ActionType.WEB3_GET_NETWORK_CHAIN_ID}
}

export const getPublicAddress = () => (dispatch) =>{
    return { type: web3ActionType.WEB3_GET_USER_PUBLIC_KEY}
}

export const getAllValues = () => (dispatch) =>{
    return { type: web3ActionType.WEB3_GET_ALL_VALUES}
}

export const getcontractValues = () => (dispatch) => {
    return { type: web3ActionType.WEB3_GET_CONTRACT_VALUES}
}

export const getwalletProvider = () => (dispatch) =>{
    return { type: web3ActionType.WEB3_GET_WALLET_PROVIDER}
}

export const web3TransactionTrue = () => (dispatch) =>{
    return { type: web3ActionType.WEB3_TRANSACTION_TRUE}
}

export const web3TransactionFalse = () => (dispatch) =>{
    return { type: web3ActionType.WEB3_TRANSACTION_FALSE}
}

export const web3GetTransactionStatus = () => (dispatch) =>{
    return { type: web3ActionType.WEB3_GET_TRANSACTION_STATUS}
}