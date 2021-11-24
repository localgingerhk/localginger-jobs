import React, { PropsWithoutRef } from "react"

export interface StyledLinkProps extends PropsWithoutRef<JSX.IntrinsicElements["a"]> {}

export const StyledLink = React.forwardRef<HTMLAnchorElement, StyledLinkProps>(
  ({ children, ...props }, ref) => {
    const { className, ...propsWithoutClassName } = props
    const classNames = `font-medium text-red-500 transition duration-150 ease-in-out hover:text-red-400 focus:outline-none focus:underline ${className}`
    return (
      <a ref={ref} className={classNames} {...propsWithoutClassName}>
        {children}
      </a>
    )
  }
)
