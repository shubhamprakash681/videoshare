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
  },
});

export const { login, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
