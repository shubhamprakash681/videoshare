import { IPlaylist, IVideo } from "./collections";

export type APIResponse<T> = {
  statusCode: number;
  data: T | undefined;
  message: string;
  success: boolean;
};

export interface ChannelStatsResponse {
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
  totalSubscribers: number;
}
export interface ChannelVideoDoc extends IVideo {
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
export interface ChannelProfile {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: {
    public_id: string;
    url: string;
  };
  coverImage?: {
    public_id: string;
    url: string;
  };

  subscriberCount: number;
  subscribedToCount: number;
  isSubscribed: boolean;
}
export interface VideoLikeData {
  isLiked: boolean;
  isDisliked: boolean;
  likeCount: number;
}

export interface VideoCommentData {
  _id: string;
  content: string;
  owner: {
    username: string;
    fullname: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  totalLikesCount: number;
  isLiked: boolean;
  isDisliked: boolean;

  replies?: VideoCommentData[];
}

export interface GetPlaylistResponse {
  docs: IPlaylist[];
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

export interface AggregatedResponse<T> {
  docs: T[];
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

export interface TopSearchOption {
  _id: string;
  searchText: string;
  count: number;
}

export interface SearchSuggestions {
  title: string;
  description: string;
  score: number;
  highlights: {
    score: number;
    path: "description" | "title";
    texts: {
      value: string;
      type: "text" | "hit";
    }[];
  }[];
}
