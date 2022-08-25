export const web3ActionType = {
    WEB3_CONNECT:'WEB3_CONNECT',
    WEB3_DISCONNECT:'WEB3_DISCONNECT',
    WEB3_GET_NETWORK_CHAIN_ID:'WEB3_GET_NETWORK_CHAIN_ID',
    WEB3_GET_USER_PUBLIC_KEY:'WEB3_GET_USER_PUBLIC_KEY',
    WEB3_GET_ALL_VALUES:'WEB3_GET_ALL_VALUES',
    WEB3_GET_CONTRACT_VALUES:'WEB3_GET_CONTRACT_VALUES',
    WEB3_SET_CONTRACT_VALUES:'WEB3_SET_CONTRACT_VALUES',
    WEB3_GET_WALLET_PROVIDER:'WEB3_GET_WALLET_PROVIDER',
    WEB3_TRANSACTION_TRUE:'WEB3_TRANSACTION_TRUE',
    WEB3_TRANSACTION_FALSE:'WEB3_TRANSACTION_FALSE',
    WEB3_GET_TRANSACTION_STATUS:'WEB3_GET_TRANSACTION_STATUS'
}

export const setWeb3Data = (type, payload) => (dispatch) => {
    dispatch({
		type,
		payload
	})
}

export const disconnectWeb3 = (type, payload)  => (dispatch) => {
    dispatch({
		type,
		payload
	})
}

export const getWeb3ChainID = (type, payload) => (dispatch) => {
    dispatch({
		type,
		payload
	})
}

export const getPublicAddress = (type, payload) => (dispatch) =>{
    dispatch({
		type,
		payload
	})
}

export const getAllValues = (type, payload) => (dispatch) =>{
    dispatch({
		type,
		payload
	})
}

export const getcontractValues = (type, payload) => (dispatch) => {
    dispatch({
		type,
		payload
	})
}

export const setcontractValues = (type, payload) => (dispatch) => {
    dispatch({
		type,
		payload
	})
}

export const getwalletProvider = (type, payload) => (dispatch) =>{
    dispatch({
		type,
		payload
	})
}

export const web3TransactionTrue = (type, payload) => (dispatch) =>{
    dispatch({
		type,
		payload
	})
}

export const web3TransactionFalse = (type, payload) => (dispatch) =>{
    dispatch({
		type,
		payload
	})
}

export const web3GetTransactionStatus = (type, payload) => (dispatch) =>{
    dispatch({
		type,
		payload
	})
}