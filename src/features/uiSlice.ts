import { createSlice } from "@reduxjs/toolkit";

interface IUiSliceState {
  isSidebarOpen: boolean;
  isSearchboxOpen: boolean;
  preventCustomKeyPress: boolean;
  renderLoadingOnSearchOrSort: boolean;
}

const initialState: IUiSliceState = {
  isSidebarOpen: false,
  isSearchboxOpen: false,
  preventCustomKeyPress: false,
  renderLoadingOnSearchOrSort: false,
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
    setRenderLoadingOnSearchOrSort: (state, actions: { payload: boolean }) => {
      state.renderLoadingOnSearchOrSort = actions.payload;
    },
  },
});

export const {
  setSidebarOpen,
  toggleSidebarOpen,
  setSearchboxOpen,
  setPreventCustomKeyPress,
  setRenderLoadingOnSearchOrSort,
} = uiSlice.actions;
const uiReducer = uiSlice.reducer;
export default uiReducer;
