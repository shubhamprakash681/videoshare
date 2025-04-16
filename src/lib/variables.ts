interface IEnvVars {
  API_BASE_URI: string;
  MODE: string;
}

export const envVariables: IEnvVars = {
  API_BASE_URI: import.meta.env.VITE_APP_API_BASE_URL,
  MODE: import.meta.env.MODE,
};

export const PathConstants = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOTPASSWORD: "/password/forgot",
  RESETPASSWORD: "/password/reset",
  DASHBOARD: "/dashboard",
  VIDEO: "/video/:videoId",
  PLAYLIST: "/playlist/:playlistId",
  LIKEPLAYLIST: "/like-playlist/:videoId",
  WATCHPLAYLIST: "/watch-playlist/:videoId",
  MYCHANNEL: "/me",
  UPDATEPASSWORD: "/password/update",
  LIKEDVIDEOS: "/liked-videos",
  WATCHHISTORY: "/watch-history",
  CHANNEL: "/:channelname",
  EDITPLAYLIST: "/edit-playlist/:playlistId",
  TERMS: "/terms",
  ABOUT: "/about",
  PRIVACY: "/privacy",
};

export const authPaths = [
  PathConstants.LOGIN,
  PathConstants.SIGNUP,
  PathConstants.FORGOTPASSWORD,
  PathConstants.RESETPASSWORD,
];
