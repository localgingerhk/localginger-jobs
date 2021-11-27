import { AuthorizationError, resolver } from "blitz"
import db from "db"
import { getActiveTags } from "../tags"

export default resolver.pipe(resolver.authorize(), async ({ tags, id, ...parsedInput }, ctx) => {
  const [job] = await db.job.findMany({
    where: {
      id,
      userId: ctx.session!.userId,
    },
  })

  if (!job) {
    throw new AuthorizationError()
  }

  await db.job.updateMany({
    where: {
      id,
      userId: ctx.session!.userId,
    },
    data: {
      ...parsedInput,
      tags: getActiveTags(tags),
    },
  })
})
