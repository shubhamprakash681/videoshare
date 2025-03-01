export interface IUser {
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
  watchHistory?: any[];
  password?: string;
  refreshToken?: string;
}

export interface IVideo {
  _id: string;
  videoFile: {
    public_id: string;
    url: string;
  };
  thumbnail: {
    public_id: string;
    url: string;
  };
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublic: boolean;
  owner: IUser;
  createdAt: Date;
}

interface PlaylistVideo {
  _id: string;
  videoFile: {
    public_id: string;
    url: string;
  };
  thumbnail: {
    public_id: string;
    url: string;
  };
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
    avatar: string;
  };
}
export interface IPlaylist {
  _id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  owner: string;
  createdAt: Date;
  updatedAt: string;
  videos: PlaylistVideo[];
}

export interface PlaylistOptions {
  _id: string;
  title: string;
  description: string;
  visibility: "private" | "public";
  videos: string[];
  isPresent: boolean;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  _id: string;
  subscriber: string;
  createdAt: Date;
  updatedAt: Date;
  channel: {
    _id: string;
    username: string;
    fullname: string;
    avatar: {
      url: string;
    };
    recentVideos: IVideo[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface LikedVideo {
  _id: string;
  likeType: "like" | "dislike";
  likedBy: string;
  createdAt: Date;
  updatedAt: Date;
  video: PlaylistVideo;
}
