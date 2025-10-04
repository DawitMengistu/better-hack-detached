import { z } from "zod"

export const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "Must be at least 18 years old").max(100, "Age must be reasonable"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    message: "Please select a gender",
  }),
  timeCommitment: z.tuple([z.number(), z.number()]).refine(
    ([min, max]) => min <= max,
    "Minimum hours must be less than or equal to maximum hours"
  ),
  techStack: z.array(z.string()).min(1, "Please select at least one technology"),
  country: z.string().min(1, "Please select your country"),
  occupation: z.string().min(1, "Please select your occupation"),
  openForProjects: z.boolean(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
