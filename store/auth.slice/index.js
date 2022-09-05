import { HYDRATE } from "next-redux-wrapper";
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import localForage from "localforage";

const initialState = {
  user: null,
  jwt: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAndJwt: (state, action) => {
      state.user = action.payload.user;
      state.jwt = action.payload.jwt;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setJwt: (state, action) => {
      state.jwt = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserAndJwt, setUser, setJwt } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectJwt = (state) => state.auth.jwt;

const persistedReducer = persistReducer(
  {
    key: "auth",
    storage: localForage,
  },
  authSlice.reducer
);

export default persistedReducer;
