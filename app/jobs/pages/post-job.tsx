import React, { useState } from "react"
import { BlitzPage, Routes } from "blitz"
import JobForm from "../components/JobForm"
import { AppLayout } from "app/layouts/AppLayout"
import { Alert } from "app/components/Alert"

const PostJob: BlitzPage = () => {
  const [submitted, setSubmitted] = useState(false)

  return submitted ? (
    <div className="sm:p-5">
      <Alert variant="success">
        You&apos;ve successfully submitted your job post.
        <br />
        We will need to review it before it becomes public.
      </Alert>
    </div>
  ) : (
    <JobForm onSuccess={() => setSubmitted(true)} />
  )
}

PostJob.getLayout = (page) => <AppLayout title="Post New Job">{page}</AppLayout>
PostJob.authenticate = { redirectTo: Routes.LoginPage() }

export default PostJob
