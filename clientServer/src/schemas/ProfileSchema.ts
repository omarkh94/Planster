import { z } from "zod";

const profileSchema = z.object({
  // gender: z.string().nonempty("Gender is required"),
  firstName: z
    .string()
    .nonempty("First name is required")
    .min(2, "First name must be at least 2 characters long"),
  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
    jobTitle: z
    .string()
    .nonempty("Job Title is required")
    .min(2, "Job Title must be at least 2 characters long"),
  email: z.string().readonly(),

  mobileNumber: z.object({
    countryCode: z
      .string()
      .nonempty("Country code is required")
      .regex(/^\+\d{1,4}$/, "Invalid country code"),
    number: z
      .string()
      .nonempty("Mobile number is required")
      .regex(/^\d{7,15}$/, "Invalid mobile number"),
  }),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export { profileSchema };
