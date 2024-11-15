import authReducer from "@/features/authSlice";
import themeReducer from "@/features/themeSlice";
import uiReducer from "@/features/uiSlice";
import videoReducer from "@/features/videoSlice";
import { configureStore } from "@reduxjs/toolkit";

const reduxStore = configureStore({
  reducer: { themeReducer, uiReducer, authReducer, videoReducer },
});

export default reduxStore;

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
