import { useRef } from "react"
import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Card } from "app/components/Card"
import { StyledLink } from "app/components/StyledLink"
import { Logo } from "app/components/Logo"
import { AuthHeading } from "./AuthHeading"
import { AuthWrapper } from "./AuthWrapper"
import { AuthSubheading } from "./AuthSubheading"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
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

        <AuthHeading>Sign in to your account</AuthHeading>
        <AuthSubheading>
          Or{" "}
          <Link href="/signup" passHref>
            <StyledLink>create a new account for free</StyledLink>
          </Link>
        </AuthSubheading>
      </div>
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <Form
            submitText="Log in"
            schema={Login}
            initialValues={{ email: undefined, password: undefined }}
            onSubmit={async (values, form) => {
              try {
                await login(values)
                props.onSuccess && props.onSuccess()
              } catch (error) {
                setTimeout(() => {
                  form.change("password", undefined)
                  form.resetFieldState("password")
                  emailInputRef.current?.focus()
                })

                switch (error.name) {
                  case "AuthenticationError": {
                    return { [FORM_ERROR]: "Sorry, those credentials are invalid." }
                  }
                  case "UnconfirmedEmailError": {
                    return { [FORM_ERROR]: "Please confirm your email first." }
                  }
                  default: {
                    return {
                      [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                    }
                  }
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
          </Form>
        </Card>
      </div>
    </AuthWrapper>
  )
  return (
    <div>
      <h1>Login</h1>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <div>
          <Link href={Routes.ForgotPasswordPage()}>
            <a>Forgot your password?</a>
          </Link>
        </div>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or <Link href={Routes.SignupPage()}>Sign Up</Link>
      </div>
    </div>
  )
}

export default LoginForm
