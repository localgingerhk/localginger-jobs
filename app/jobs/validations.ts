import { IdInput } from "app/validations"
import * as z from "zod"
import { jobTypeEnum } from "./jobType"

export const SubmitJobInput = z.object({
  company: z.string().max(40).optional(),
  position: z.string().max(40).optional(),
  tags: z.string().optional(),
  type: jobTypeEnum,
  location: z.string().max(30).optional(),
  url: z.string().url().optional(),
})

export type SubmitJobInputType = z.infer<typeof SubmitJobInput>

export const UpdateJobInput = SubmitJobInput.merge(IdInput)

export type UpdateJobInputType = z.infer<typeof UpdateJobInput>

export const SingleJobInput = z.object({
  id: z.number().positive().int(),
})

export type SingleJobInputType = z.infer<typeof SingleJobInput>
