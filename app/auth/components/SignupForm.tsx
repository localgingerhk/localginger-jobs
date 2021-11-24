import { useRef } from "react"
import { Link, useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { Card } from "app/components/Card"
import { StyledLink } from "app/components/StyledLink"
import { Logo } from "app/components/Logo"
import { AuthHeading } from "./AuthHeading"
import { AuthWrapper } from "./AuthWrapper"
import { AuthSubheading } from "./AuthSubheading"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const emailInputRef = useRef<HTMLInputElement>(null)

  return (
    <AuthWrapper>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" passHref>
            <a className="inline-block">
              <Logo className="w-auto h-12" />
            </a>
          </Link>
        </div>

        <AuthHeading>Sign up for free</AuthHeading>
        <AuthSubheading>
          Already have an account?{" "}
          <Link href="/login" passHref>
            <StyledLink>Login</StyledLink>
          </Link>
        </AuthSubheading>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <Form
            submitText="Create Account"
            schema={Signup}
            initialValues={{ email: "", password: "", passwordConfirm: "" }}
            onSubmit={async (values) => {
              try {
                await signupMutation(values)
                props.onSuccess?.()
              } catch (error: any) {
                if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                  // This error comes from Prisma
                  return { [FORM_ERROR]: `The email ${values.email} is already being used.` }
                } else {
                  return { [FORM_ERROR]: error.toString() }
                }
              }
            }}
          >
            <LabeledTextField ref={emailInputRef} name="email" label="Email" placeholder="Email" />
            <div className="mt-6">
              <LabeledTextField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </div>
            <div className="mt-6">
              <LabeledTextField
                name="passwordConfirm"
                label="Repeat Password"
                placeholder="Repeat Password"
                type="password"
              />
            </div>
          </Form>
        </Card>
      </div>
    </AuthWrapper>
  )
}

export default SignupForm
