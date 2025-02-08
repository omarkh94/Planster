import { z } from "zod";

const loginSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email address is required")
      .email("Invalid email address"),
    
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    
  })
  

export type LoginSchema = z.infer<typeof loginSchema>;
export { loginSchema };
