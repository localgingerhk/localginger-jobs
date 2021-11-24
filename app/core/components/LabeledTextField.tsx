import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import classNames from "classnames"
import { ErrorMessage } from "app/components/ErrorMessage"
import { FieldErrorIcon } from "app/components/FieldErrorIcon"
import { FieldLabel } from "app/components/FieldLabel"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label?: string
  placeholder?: string
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, type, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { error, touched, submitFailed, submitError, submitting },
    } = useField(name, {
      parse:
        props.type === "number"
          ? (Number as any)
          : // Converting `""` to `null` ensures empty values will be set to null in the DB
            (v) => (v === "" ? null : v),
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

    const hasError = touched && submitFailed && !!normalizedError

    const ariaErrorName = `${name}-error`

    return (
      <div {...outerProps}>
        {label && (
          <FieldLabel {...labelProps} htmlFor={name}>
            {label}
          </FieldLabel>
        )}
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            id={name}
            ref={ref}
            className={classNames(
              "block w-full pr-10 form-input sm:text-sm sm:leading-5 transition-all duration-200",
              {
                "text-red-900 placeholder-red-300 border-red-300 focus:border-red-300 focus:shadow-outline-red":
                  hasError,
              }
            )}
            aria-invalid={hasError}
            disabled={submitting}
            aria-describedby={hasError ? ariaErrorName : undefined}
            type={type}
            {...input}
            {...props}
          />
          {hasError && <FieldErrorIcon />}
        </div>
        {hasError && (
          <div className="mt-2">
            <ErrorMessage error={normalizedError} ariaErrorName={ariaErrorName} />
          </div>
        )}
      </div>
    )
  }
)

export default LabeledTextField
