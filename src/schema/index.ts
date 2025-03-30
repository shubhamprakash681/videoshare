import { registerUserSchema } from "./user/signupValidator";
import { loginUserSchema } from "./user/loginValidator";
import { forgotPasswordSchema } from "./user/forgotPasswordValidator";
import { uploadVideoSchema } from "./video/uploadValidator";
import { updateVideoSchema } from "./video/updateValidator";
import { createPlaylistSchema } from "./playlist/createPlaylistValidator";

export {
  registerUserSchema,
  loginUserSchema,
  forgotPasswordSchema,
  uploadVideoSchema,
  updateVideoSchema,
  createPlaylistSchema,
};
