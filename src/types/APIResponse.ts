export type APIResponse<T> = {
  statusCode: number;
  data: T | undefined;
  message: string;
  success: boolean;
};
