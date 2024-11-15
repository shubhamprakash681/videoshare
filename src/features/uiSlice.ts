import { createSlice } from "@reduxjs/toolkit";

interface IUiSliceState {
  isSidebarOpen: boolean;
  isSearchboxOpen: boolean;
}

const initialState: IUiSliceState = {
  isSidebarOpen: false,
  isSearchboxOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarOpen: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSearchboxOpen: (state, actions: { payload: boolean }) => {
      state.isSearchboxOpen = actions.payload;
    },
  },
});

export const { toggleSidebarOpen, setSearchboxOpen } = uiSlice.actions;
const uiReducer = uiSlice.reducer;
export default uiReducer;
