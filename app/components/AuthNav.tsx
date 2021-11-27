import { Link, useRouter, useSession, useMutation } from "blitz"
import React, { useState } from "react"
import logout from "app/auth/mutations/logout"
import { MenuLink } from "./MenuLink"
import { Role } from "app/users/role"
import { FiLogOut } from "react-icons/fi"

export const AuthNav = () => {
  const [logoutLoading, setLogoutLoading] = useState(false)

  const [logoutMutation] = useMutation(logout)

  const router = useRouter()

  const logoutAction = async () => {
    if (logoutLoading) return

    setLogoutLoading(true)

    try {
      await logoutMutation()

      router.push("/")
    } finally {
      setLogoutLoading(false)
    }
  }

  const session = useSession()

  return (
    <ul className="flex flex-col md:space-x-4 md:items-center md:flex-row">
      {session.userId ? (
        <React.Fragment>
          {session.role === Role.ADMIN && (
            <li>
              <MenuLink href="/admin" active={router.pathname === "/admin"} as={Link}>
                Admin
              </MenuLink>
            </li>
          )}
          <li>
            <MenuLink href="/my-jobs" active={router.pathname === "/my-jobs"} as={Link}>
              My Jobs
            </MenuLink>
          </li>
          <li>
            <MenuLink href="/" as="button" disabled={logoutLoading} onClick={logoutAction}>
              Sign out <FiLogOut className="inline-block ml-2" />
            </MenuLink>
          </li>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <li>
            <MenuLink href="/login" as={Link}>
              Login
            </MenuLink>
          </li>
          <li>
            <MenuLink href="/signup" as={Link}>
              Sign up
            </MenuLink>
          </li>
        </React.Fragment>
      )}
    </ul>
  )
}
