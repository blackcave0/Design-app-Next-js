import {z} from 'zod';

export const userNameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(10, "Username must be at most 10 characters long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers, and underscores")

export const signUpValidation = z.object({
  username: userNameValidation,
  email: z.string().email({message : "Invalid email address"}),
  password : z.string().min(8, "Password must be at least 8 characters long")
})

