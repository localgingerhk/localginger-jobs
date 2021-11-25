import { useState } from "react"
import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { EmailConfirmationNotice } from "app/auth/components/EmailConfirmationNotice"

const SignupPage: BlitzPage = () => {
  const [signedUp, setSignedUp] = useState(false)

  return (
    <div>
      {!signedUp ? <SignupForm onSuccess={() => setSignedUp(true)} /> : <EmailConfirmationNotice />}
    </div>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
