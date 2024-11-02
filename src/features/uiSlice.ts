import { createSlice } from "@reduxjs/toolkit";

interface IUiSliceState {
  isSidebarOpen: boolean;
}

const initialState: IUiSliceState = {
  isSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarOpen: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { toggleSidebarOpen } = uiSlice.actions;
const uiReducer = uiSlice.reducer;
export default uiReducer;
