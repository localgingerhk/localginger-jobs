import React, { useMemo, useState } from "react"
import { useMutation, invoke } from "blitz"
import { TextField } from "app/components/TextField"
import { Form, FormProps, FORM_ERROR } from "app/core/components/Form"
import createJob from "../mutations/createJob"
import SelectField from "app/components/SelectField"
import { JobType, jobTypeLabelMap } from "../jobType"
import { FieldLabel } from "app/components/FieldLabel"
import { FormSpy } from "react-final-form"
import debounce from "lodash.debounce"
import { JobItem } from "./JobItem"
import updateJob from "../mutations/updateJob"
import { z } from "zod"
import { SubmitJobInputType } from "../validations"
import AsyncCreatableSelect from "react-select/async-creatable"
import getTags from "app/tags/queries/getTags"
import createTag from "app/tags/mutations/createTag"

type JobFormProps = {
  jobId?: number
  initialValues?: {}
  onSuccess: Function
}

export function JobForm<S extends z.ZodType<any, any>>(props: JobFormProps) {
  const [formValues, setFormValues] = useState<SubmitJobInputType>()
  const [updateJobMutation] = useMutation(updateJob)
  const [createJobMutation] = useMutation(createJob)
  const [createTagMutation] = useMutation(createTag)
  const [selectedTags, setSelectedTags] = useState<{ value: string; label: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
          },
    [props.initialValues, editMode]
  )

  const promiseOptions = (inputValue: string) => {
    return new Promise(async (resolve) => {
      const result = await invoke(getTags, { where: { name: { contains: inputValue } } })
      const tags = result.tags.map((tag) => ({ value: tag.name, label: tag.name }))
      resolve(tags)
    })
  }

  const onCreateTag = async (inputValue: string) => {
    setIsLoading(true)
    const newOption = await createTagMutation({
      name: inputValue,
    })
    setSelectedTags([
      ...selectedTags,
      {
        value: newOption.name,
        label: newOption.name,
      },
    ])
    setIsLoading(false)
  }

  const onChangeTags = (selected) => {
    setSelectedTags(selected)
  }

  return (
    <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-6 lg:grid lg:grid-cols-12">
      <div className="p-6 mt-5 lg:mt-0 lg:col-span-4">
        <Form
          {...props}
          submitText={editMode ? "Update job" : "Post Job"}
          initialValues={initialValuesComputed}
          onSubmit={async (values) => {
            const valuesWithTags = {
              ...values,
              tags: formValues?.tags ? formValues.tags.split(",") : [],
            }
            try {
              if (editMode) {
                await updateJobMutation({ ...valuesWithTags, id: props.jobId! })
              } else {
                await createJobMutation(valuesWithTags)
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
          <FormSpy<S>
            onChange={(form) => {
              handleValuesChanged({
                ...form.values,
                tags: selectedTags.map((tag) => tag.value).join(","),
              })
            }}
          />
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
            <AsyncCreatableSelect
              isMulti
              isClearable
              isDisabled={isLoading}
              isLoading={isLoading}
              onCreateOption={onCreateTag}
              loadOptions={promiseOptions}
              noOptionsMessage={() => "Type to search tags..."}
              value={selectedTags}
              onChange={onChangeTags}
            />
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
              tags={formValues?.tags || ""}
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
