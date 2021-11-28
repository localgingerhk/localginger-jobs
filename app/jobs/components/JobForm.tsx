import React, { useMemo, useState } from "react"
import { useMutation } from "blitz"
import { TextField } from "app/components/TextField"
import { Form, FormProps, FORM_ERROR } from "app/core/components/Form"
import createJob from "../mutations/createJob"
import SelectField from "app/components/SelectField"
import { JobType, jobTypeLabelMap } from "../jobType"
import CheckboxField from "app/components/CheckboxField"
import { FieldLabel } from "app/components/FieldLabel"
import { getActiveTags, Tag, tagLabelMap } from "../tags"
import { FormSpy } from "react-final-form"
import debounce from "lodash.debounce"
import { JobItem } from "./JobItem"
import updateJob from "../mutations/updateJob"
import { z } from "zod"
import { SubmitJobInputType } from "../validations"

type JobFormProps = {
  jobId: number
  initialValues: {}
  onSuccess: () => {}
}

export function JobForm<S extends z.ZodType<any, any>>(props: JobFormProps) {
  const [formValues, setFormValues] = useState<SubmitJobInputType>()
  const [updateJobMutation] = useMutation(updateJob)
  const [createJobMutation] = useMutation(createJob)

  const editMode = props.initialValues && props.jobId

  const handleValuesChanged = debounce(function (values) {
    setFormValues(values)
  }, 250)

  const initialValuesComputed = useMemo(
    () =>
      editMode
        ? props.initialValues
        : {
            type: JobType.FULLTIME,
            tags: Object.keys(Tag).reduce(
              (result, tag) => ({ ...result, [tag]: tag === Tag.BLITZ }),
              {} as { [key in Tag]: boolean }
            ),
          },
    [props.initialValues, editMode]
  )

  return (
    <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:grid lg:grid-cols-12">
      <div className="p-6 mt-5 lg:mt-0 lg:col-span-4">
        <Form
          {...props}
          submitText={editMode ? "Update job" : "Post Job"}
          initialValues={initialValuesComputed}
          onSubmit={async (values, form) => {
            try {
              if (editMode) {
                await updateJobMutation({ ...values, id: props.jobId! })
              } else {
                await createJobMutation(values)
              }

              props.onSuccess && props.onSuccess()
            } catch (error) {
              switch (error.name) {
                default: {
                  return {
                    [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                  }
                }
              }
            }
          }}
        >
          <FormSpy<S> onChange={(form) => handleValuesChanged(form.values)} />
          <TextField name="company" label="Company name" placeholder="My Company" maxLength={40} />
          <div className="mt-6">
            <TextField
              name="position"
              label="Position"
              placeholder="Full-stack Engineer"
              maxLength={40}
            />
          </div>
          <div className="mt-6">
            <SelectField
              name="type"
              label="Job type"
              options={[
                { value: JobType.FULLTIME, label: jobTypeLabelMap[JobType.FULLTIME] },
                { value: JobType.PARTTIME, label: jobTypeLabelMap[JobType.PARTTIME] },
              ]}
            />
          </div>
          <div className="mt-6">
            <TextField
              name="location"
              label="Location"
              placeholder="Remote/Country"
              maxLength={30}
            />
          </div>
          <div className="mt-6">
            <TextField
              name="url"
              label="Application URL"
              placeholder="Where applicants will be redirected to apply"
            />
          </div>
          <div className="mt-6">
            <FieldLabel>Tags</FieldLabel>
            <div className="grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3">
              {Object.keys(Tag).map((tag) => (
                <CheckboxField
                  key={tag}
                  disabled={tag === Tag.BLITZ}
                  name={`tags.${tag}`}
                  label={tagLabelMap[tag]}
                />
              ))}
            </div>
          </div>
        </Form>
      </div>
      <div className="p-6 bg-gray-100 lg:col-span-8">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Job preview</h3>
        <div className="mt-4 bg-white rounded-lg shadow">
          {formValues && (
            <JobItem
              date={new Date()}
              company={formValues?.company}
              position={formValues?.position}
              type={formValues!.type}
              location={formValues.location}
              tags={getActiveTags(formValues!.tags)}
              href="/"
              preview
              onClick={(e) => e.preventDefault()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default JobForm
