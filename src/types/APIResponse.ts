import { IVideo } from "./collections";

export type APIResponse<T> = {
  statusCode: number;
  data: T | undefined;
  message: string;
  success: boolean;
};

export interface GetVideosResponse {
  docs: IVideo[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}
export interface ChannelStatsResponse {
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
  totalSubscribers: number;
}
interface ChannelVideoDoc extends IVideo {
  likeCount: number;
  commentCount: number;
}
export interface ChannelVideosResponse {
  docs: ChannelVideoDoc[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}
