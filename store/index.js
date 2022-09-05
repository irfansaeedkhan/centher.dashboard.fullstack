import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistedReducer, { authSlice } from "./auth.slice";

const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return configureStore({
      reducer: {
        [authSlice.name]: authSlice.reducer,
      },
      devTools: false,
    });
  }

  const store = configureStore({
    reducer: {
      [authSlice.name]: persistedReducer,
    },

    devTools: process.env.NODE_ENV !== "production",

    // For Redux Persist
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  // For Redux Persist
  store.__persistor = persistStore(store);
  return store;
};

export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});
