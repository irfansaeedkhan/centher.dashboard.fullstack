import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { User } from "@/models/user";

import { RootState } from "..";

const initialState: AuthState = {
  user: "init",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      if (action.payload.auth.user === "init") {
        delete action.payload.auth.user;
      }

      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

// Action Creators
export const { setUser } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) =>
  state.auth.user === "init" ? null : state.auth.user;

// Types
interface AuthState {
  user: "init" | User | null;
}
