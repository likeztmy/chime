import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  verify_code: z.string().length(6, "Must be 6 characters long"),
});
