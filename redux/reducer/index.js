import { combineReducers } from 'redux'
import {testReducer} from "./test"
import {web3Reducer} from "./web3"

export default combineReducers({
    test:testReducer,
    web3:web3Reducer
})