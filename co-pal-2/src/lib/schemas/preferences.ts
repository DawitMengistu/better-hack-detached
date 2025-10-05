import { z } from "zod"

export const preferencesSchema = z.object({
  preferredGenders: z.array(z.enum(["male", "female", "non-binary", "prefer-not-to-say"]))
    .min(1, "Select at least one gender preference"),
  ageRange: z.tuple([z.number().min(18), z.number().max(100)])
    .refine(([min, max]) => min <= max, "Minimum age must be <= maximum age"),
  timeCommitment: z.tuple([z.number(), z.number()]).refine(
    ([min, max]) => min <= max,
    "Minimum hours must be less than or equal to maximum hours"
  ),
  techStack: z.array(z.string()).min(0),
  countryPreferences: z.array(z.string()).min(0),
  occupations: z.array(z.string()).min(0),
})

export type PreferencesFormData = z.infer<typeof preferencesSchema>
