import { registerUserSchema } from "./user/signupValidator";
import { loginUserSchema } from "./user/loginValidator";
import { uploadVideoSchema } from "./video/uploadValidator";
import { updateVideoSchema } from "./video/updateValidator";
import { createPlaylistSchema } from "./playlist/createPlaylistValidator";

export {
  registerUserSchema,
  loginUserSchema,
  uploadVideoSchema,
  updateVideoSchema,
  createPlaylistSchema,
};
