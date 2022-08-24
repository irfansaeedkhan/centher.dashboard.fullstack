import { useMemo } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistReducer, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {testReducer,initialStates} from "../reducer/testv1"
import {web3Reducer, web3InitialState} from "../reducer/web3"

let store;

const persistConfig = {
    key: 'value2',
    storage,
    //timeout: null,
    debug: true,
    whitelist: ['value1'], // place to select which state you want to persist
}

const combinedReducersServer = combineReducers({
  test: testReducer,
  web3: web3Reducer
});

const combinedReducersClient = combineReducers({
  test:persistReducer({
    key: "root",
    storage,
    whitelist: ["web3"]
  },testReducer),
  web3: web3Reducer
})
const persistedReducer = persistReducer(persistConfig, testReducer)

function makeStore(initialState = initialStates) {
    return createStore(
      combinedReducersClient,
      initialState,
      composeWithDevTools(applyMiddleware())
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? makeStore(preloadedState)
  
    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
      _store = makeStore({
        ...store.getState(),
        ...preloadedState,
      })
      // Reset the current store
      store = undefined
    }
  
    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store
  
    return _store
}
  
export function useStore(initialState) {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}
