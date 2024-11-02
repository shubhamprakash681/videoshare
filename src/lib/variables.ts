interface IEnvVars {
  API_BASE_URI: string;
}

export const envVariables: IEnvVars = {
  API_BASE_URI: import.meta.env.VITE_APP_API_BASE_URL,
};
