import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is too short")
    .max(80, "Name is too long"),
  email: z.string().trim().email("Invalid email").max(120),
  message: z
    .string()
    .trim()
    .min(10, "Message is too short")
    .max(2000, "Message is too long"),
});
