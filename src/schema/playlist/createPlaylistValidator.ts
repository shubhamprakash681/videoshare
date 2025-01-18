import { z } from "zod";

export const createPlaylistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Playlist title must be of atleast 3 characters" })
    .max(20, { message: "Playlist title must not be more than 20 characters" }),
  description: z.string().trim(),
  visibility: z.enum(["public", "private"]),
  videos: z.array(z.string()).optional(),
});
