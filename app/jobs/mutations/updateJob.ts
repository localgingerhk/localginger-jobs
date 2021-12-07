import { AuthorizationError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ tags, id, ...parsedInput }, ctx) => {
  const job = await db.job.findFirst({
    where: {
      id,
      userId: ctx.session!.userId,
    },
  })

  if (!job) {
    throw new AuthorizationError()
  }

  await db.job.update({
    where: {
      id,
    },
    data: {
      ...parsedInput,
      tags: {
        connect: tags.map((tag) => ({ name: tag })),
      },
    },
  })
})
