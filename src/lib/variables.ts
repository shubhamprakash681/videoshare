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
  DASHBOARD: "/dashboard",
  VIDEO: "/video/:videoId",
  PLAYLIST: "/playlist/:playlistId",
  MYCHANNEL: "/me",
  CHANNEL: "/:channelname",
  EDITPLAYLIST: "/edit-playlist/:playlistId",
};

export const authPaths = [PathConstants.LOGIN, PathConstants.SIGNUP];
