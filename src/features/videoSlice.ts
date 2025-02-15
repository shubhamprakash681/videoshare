import { TopSearchOption } from "@/types/APIResponse";
import { IVideo } from "@/types/collections";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IVideoSlice {
  searchKey: string;
  query: string;
  sortBy: keyof IVideo;
  sortType: "asc" | "des";
  userId: string | null;
  topSearches: TopSearchOption[];
}
const initialState: IVideoSlice = {
  searchKey: "",
  query: "",
  sortBy: "createdAt",
  sortType: "des",
  userId: null,
  topSearches: [],
};
type setVideoPayload = {
  searchKey?: string;
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

    setTopSearches: (state, actions: PayloadAction<TopSearchOption[]>) => {
      return { ...state, topSearches: actions.payload };
    },
  },
});

export const { setVideoStates, setTopSearches } = videoSlice.actions;
const videoReducer = videoSlice.reducer;
export default videoReducer;
