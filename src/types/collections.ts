export interface IUser {
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
