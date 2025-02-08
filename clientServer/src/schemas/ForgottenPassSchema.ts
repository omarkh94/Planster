import { z } from "zod";

const forgottenPassSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email address is required")
      .email("Invalid email address"),
       
  })
  

export type ForgottenPassSchema = z.infer<typeof forgottenPassSchema>;
export { forgottenPassSchema };
