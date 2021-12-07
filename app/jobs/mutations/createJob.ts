import { resolver } from "blitz"
import db from "db"
import { getActiveTags } from "../tags"
import { SubmitJobInput, SubmitJobInputType } from "../validations"

export default resolver.pipe(resolver.authorize(), async ({ tags, ...parsedInput }, ctx) => {
  const job = await db.job.create({
    data: {
      ...parsedInput,
      tags: {
        connect: tags.map((tag) => ({ name: tag })),
      },
      user: {
        connect: {
          id: ctx.session?.userId || undefined,
        },
      },
    },
  })

  return job
})
