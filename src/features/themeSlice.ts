import { createSlice } from "@reduxjs/toolkit";

interface ITheme {
  theme: "light" | "dark";
}

const initialState: ITheme = {
  theme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === "light") {
        state.theme = "dark";
      } else {
        state.theme = "light";
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
const themeReducer = themeSlice.reducer;
export default themeReducer;
