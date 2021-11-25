import { resolver, SecurePassword } from "blitz"
import db from "db"
import { ensureUserEmailNotUsed, hashPassword } from "app/auth/auth-utils"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { nanoid } from "nanoid"
import { userConfirmationNotification } from "../notifications/userConfirmation"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const formattedEmail = email.toLowerCase()

  await ensureUserEmailNotUsed(formattedEmail)

  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { id: true, name: true, email: true, role: true },
  })

  const confirmationToken = nanoid(100)

  await userConfirmationNotification.notify(user, { token: confirmationToken })

  await db.userConfirmationToken.create({
    data: {
      token: confirmationToken,
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
