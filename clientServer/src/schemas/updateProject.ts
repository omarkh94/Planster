import { z } from "zod";

const projectSchema = z
  .object({
    name: z
      .string()
      .nonempty("Project Name is required")
      .min(3 , "Name should Be At Least Three Character")
       
  })
  

export type ProjectSchema = z.infer<typeof projectSchema>;
export { projectSchema };
