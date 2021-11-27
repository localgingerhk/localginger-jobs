import db, { TokenType } from "db"
import { AuthorizationError, SessionContext, resolver } from "blitz"
import { EmailConfirmation } from "app/auth/validations"
import { Role } from "types"

export default resolver.pipe(resolver.zod(EmailConfirmation), async ({ token }, ctx) => {
  const userConfirmationToken = await db.token.findFirst({
    where: {
      hashedToken: token,
      type: TokenType.EMAIL_CONFIRMATION,
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

  await db.token.delete({
    where: {
      id: userConfirmationToken.id,
    },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})
