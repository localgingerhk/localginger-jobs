import { resolver } from "blitz"
import { authenticateUser, ensureUserConfirmed } from "app/auth/auth-utils"
import db from "db"
import { Login } from "../validations"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)

  await ensureUserConfirmed(user)

  await ctx.session.$create({ userId: user.id, role: user.role as Role })

  return user
})
