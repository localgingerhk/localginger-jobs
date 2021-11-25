import { Button } from "app/components/Button"
import { Card } from "app/components/Card"
import { SiRoots } from "react-icons/si"
import { StyledLink } from "app/components/StyledLink"
import { Link } from "blitz"
import React from "react"
import { AuthHeading } from "./AuthHeading"
import { AuthSubheading } from "./AuthSubheading"
import { AuthWrapper } from "./AuthWrapper"

export const EmailConfirmationNotice = () => (
  <AuthWrapper>
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="text-center">
        <Link href="/" passHref>
          <a className="inline-block">
            <SiRoots color="yellow" size="40" />
          </a>
        </Link>
      </div>
      <AuthHeading>Welcome aboard</AuthHeading>
      <AuthSubheading>
        Already confirmed?{" "}
        <Link href="/login" passHref>
          <StyledLink>Login</StyledLink>
        </Link>
      </AuthSubheading>
    </div>
    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <p className="text-center">
          You&apos;ve successfully signed up. <br />
          We&apos;ve sent you a confirmation email.
        </p>
        <br />
        <Link href="login">
          <Button full>Go to login</Button>
        </Link>
      </Card>
    </div>
  </AuthWrapper>
)
