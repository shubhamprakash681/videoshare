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
