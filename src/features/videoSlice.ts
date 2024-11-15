import { IVideo } from "@/types/collections";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IVideoSlice {
  page: number;
  limit: number;
  query: string;
  sortBy: keyof IVideo;
  sortType: "asc" | "des";
  userId: string | null;
}
const initialState: IVideoSlice = {
  page: 1,
  limit: 10,
  query: "",
  sortBy: "createdAt",
  sortType: "des",
  userId: null,
};
type setVideoPayload = {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: keyof IVideo;
  sortType?: "asc" | "des";
  userId?: string | null;
};
const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setVideoStates: (state, actions: PayloadAction<setVideoPayload>) => {
      return { ...state, ...actions.payload };
    },
  },
});

export const { setVideoStates } = videoSlice.actions;
const videoReducer = videoSlice.reducer;
export default videoReducer;
