import { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import { validateZodSchema } from "blitz"
export { Mutator, FORM_ERROR } from "final-form"
import { Alert } from "app/components/Alert"
import { Button } from "app/components/Button"

type FormProps<FormValues> = {
  children: ReactNode
  submitText: string
  onSubmit: FinalFormProps<FormValues>["onSubmit"]
  initialValues?: FinalFormProps<FormValues>["initialValues"]
  schema?: z.ZodType<any, any>
  mutators?: { [key: string]: Mutator<FormValues> }
} & Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit">

const errorMap: z.ZodErrorMap = (error, ctx) => {
  if (error.message) return { message: error.message }

  switch (error.code) {
    case z.ZodErrorCode.invalid_type:
      if (error.expected === "string" && error.received === "undefined") {
        return { message: "This field is required" }
      }
  }

  return { message: ctx.defaultError }
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  mutators,
  onSubmit,
  ...props
}: FormProps<FormValues>) {
  return (
    <FinalForm
      initialValues={initialValues}
      mutators={mutators}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {submitError && (
            <Alert variant="danger" className="mb-4">
              {submitError}
            </Alert>
          )}

          {children}
          {submitText && (
            <div className="mt-6">
              <Button type="submit" full disabled={submitting}>
                {submitText}
              </Button>
            </div>
          )}
        </form>
      )}
    />
  )
}

export default Form
