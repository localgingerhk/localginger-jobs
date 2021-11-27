import { resolver, SecurePassword, hash256, generateToken } from "blitz"
import db, { TokenType } from "db"
import { ensureUserEmailNotUsed } from "app/auth/auth-utils"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { nanoid } from "nanoid"
import { userConfirmationNotification } from "../notifications/userConfirmation"

const EMAIL_CONFIRMATION_TOKEN_EXPIRATION_IN_HOURS = 24

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const formattedEmail = email.toLowerCase()

  await ensureUserEmailNotUsed(formattedEmail)

  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { id: true, name: true, email: true, role: true },
  })

  const token = generateToken()
  const hashedToken = hash256(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + EMAIL_CONFIRMATION_TOKEN_EXPIRATION_IN_HOURS)

  await userConfirmationNotification.notify(user, { token })

  await db.token.create({
    data: {
      hashedToken,
      type: TokenType.EMAIL_CONFIRMATION,
      expiresAt,
      sentTo: user.email,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})
