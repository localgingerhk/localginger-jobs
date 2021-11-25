import { AuthenticationError, SecurePassword } from "blitz"
import db, { User } from "db"
import { EmailUsedError } from "app/errors/emailUsed"
import { UnconfirmedEmailError } from "app/errors/unconfirmedEmail"
import { Login } from "./validations"

export const ensureUserConfirmed = (user: Pick<User, "confirmedAt">) => {
  if (!user.confirmedAt) {
    throw new UnconfirmedEmailError()
  }
}

export const ensureUserEmailNotUsed = async (email: string) => {
  const user = await db.user.findFirst({ where: { email } })

  if (!!user) {
    throw new EmailUsedError({ email })
  }
}

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}
