import { resolver } from "blitz"
import db, { Prisma } from "db"

export default resolver.pipe(resolver.authorize(), async (args: Prisma.JobFindUniqueArgs) => {
  const job = await db.job.findFirst({
    ...args,
    select: {
      id: true,
      company: true,
      position: true,
      tags: true,
      type: true,
      location: true,
      url: true,
    },
  })

  return job || null
})
