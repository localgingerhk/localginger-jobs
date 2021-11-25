import db from "db"
import { AuthorizationError, SessionContext, resolver } from "blitz"
import { EmailConfirmation } from "app/auth/validations"

export default resolver.pipe(resolver.zod(EmailConfirmation), async ({ token }, ctx) => {
  const userConfirmationToken = await db.userConfirmationToken.findFirst({
    where: {
      token,
    },
    select: {
      id: true,
      userId: true,
    },
  })

  if (!userConfirmationToken) {
    throw new AuthorizationError()
  }

  const user = await db.user.update({
    where: {
      id: userConfirmationToken.userId,
    },
    data: {
      confirmedAt: new Date(),
    },
  })

  await db.userConfirmationToken.delete({
    where: {
      id: userConfirmationToken.id,
    },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})
