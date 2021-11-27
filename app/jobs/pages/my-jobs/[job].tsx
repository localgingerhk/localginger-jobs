import React, { Suspense } from "react"
import { useRouter, Link, Routes, useParam, useQuery } from "blitz"
import { AppLayout } from "app/layouts/AppLayout"
import JobForm from "app/jobs/components/JobForm"
import getMyJob from "app/jobs/queries/getMyJob"
import { StyledLink } from "app/components/StyledLink"
import { Alert } from "app/components/Alert"
import { JobType } from "app/jobs/jobType"
import { Tag } from "app/jobs/tags"
import { Loading } from "app/components/Loading"

const EditJobComponent = () => {
  const router = useRouter()
  const jobId = useParam("job", "number")
  const [job] = useQuery(getMyJob, {
    where: {
      id: jobId,
    },
  })

  return job ? (
    <JobForm
      onSuccess={() => router.push("/my-jobs")}
      jobId={job!.id}
      initialValues={{
        ...job,
        type: job.type as JobType,
        tags: {},
      }}
    />
  ) : (
    <div className="sm:p-5">
      <Alert variant="danger">
        The job you&apos;re looking for doesn&apos;t exist. <br />
        If you&apos;re lost, you can always{" "}
        <Link href="/" passHref>
          <StyledLink>go home</StyledLink>
        </Link>
        .
      </Alert>
    </div>
  )
}

const EditJob = () => (
  <Suspense
    fallback={
      <div className="flex items-end justify-center h-12">
        <Loading className="w-5 h-5 text-red-500" />
      </div>
    }
  >
    <EditJobComponent />
  </Suspense>
)

EditJob.getLayout = (page) => <AppLayout title="Edit Job">{page}</AppLayout>
EditJob.authenticate = { redirectTo: Routes.LoginPage() }

export default EditJob
