import { createSlice } from "@reduxjs/toolkit";

interface IUiSliceState {
  isSidebarOpen: boolean;
  isSearchboxOpen: boolean;
  preventCustomKeyPress: boolean;
}

const initialState: IUiSliceState = {
  isSidebarOpen: false,
  isSearchboxOpen: false,
  preventCustomKeyPress: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarOpen: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, actions: { payload: boolean }) => {
      state.isSidebarOpen = actions.payload;
    },
    setSearchboxOpen: (state, actions: { payload: boolean }) => {
      state.isSearchboxOpen = actions.payload;
    },
    setPreventCustomKeyPress: (state, actions: { payload: boolean }) => {
      state.preventCustomKeyPress = actions.payload;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebarOpen,
  setSearchboxOpen,
  setPreventCustomKeyPress,
} = uiSlice.actions;
const uiReducer = uiSlice.reducer;
export default uiReducer;
