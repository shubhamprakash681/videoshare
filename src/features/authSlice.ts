import { IUser } from "@/types/collections";
import { createSlice } from "@reduxjs/toolkit";

interface IAuth {
  isAuthenticated: boolean;
  userData: null | IUser;
}

const initialState: IAuth = {
  isAuthenticated: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, actions) => {
      state.isAuthenticated = true;
      state.userData = actions.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
    updateUser: (state, actions: { payload: IUser }) => {
      state.userData = actions.payload;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
