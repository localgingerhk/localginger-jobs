import React, { useEffect, useState } from "react"
import { BlitzPage, useParam, useRouter, Routes, useMutation } from "blitz"
import Layout from "app/layouts/Layout"
import { AuthWrapper } from "app/auth/components/AuthWrapper"
import { SiRoots } from "react-icons/si"
import { AuthHeading } from "app/auth/components/AuthHeading"
import { AuthSubheading } from "app/auth/components/AuthSubheading"
import confirmEmail from "app/auth/mutations/confirmEmail"

const ConfirmEmail: BlitzPage = () => {
  const token = useParam("token")

  const router = useRouter()

  const [unauthorized, setUnauthorized] = useState(false)

  const [confirmEmailMutation] = useMutation(confirmEmail)

  useEffect(() => {
    setTimeout(async () => {
      try {
        await confirmEmailMutation({ token: token as string })

        router.push(Routes.Home())
      } catch (e) {
        if (e.name === "AuthorizationError") {
          setUnauthorized(true)
        }
      }
    }, 2000)
  }, [token, router, confirmEmailMutation])

  return (
    <AuthWrapper>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SiRoots color="yellow" size="40" className="m-auto" />

        <AuthHeading>{unauthorized ? "Whoops 😳" : "Confirming your email"}</AuthHeading>
        <AuthSubheading>
          {unauthorized
            ? "It looks like this link is expired."
            : "Please wait a few moments while your email is being confirmed"}
        </AuthSubheading>
      </div>
    </AuthWrapper>
  )
}

ConfirmEmail.getLayout = (page) => <Layout title="Confirm Email">{page}</Layout>
ConfirmEmail.redirectAuthenticatedTo = "/"

export default ConfirmEmail
