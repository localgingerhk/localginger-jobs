import React from "react"
import {
  useRouter,
  ssrQuery,
  InferGetServerSidePropsType,
  Link,
  GetServerSideProps,
  Routes,
} from "blitz"
import { AppLayout } from "app/layouts/AppLayout"
import JobForm from "app/jobs/components/JobForm"
import getMyJob from "app/jobs/queries/getMyJob"
import { StyledLink } from "app/components/StyledLink"
import { Alert } from "app/components/Alert"
import { JobType } from "app/jobs/jobType"
import { SubmitJobInput } from "app/jobs/validations"
import { Tag } from "app/jobs/tags"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const job = await ssrQuery(
    getMyJob,
    { id: Number.parseInt(context!.params!.job as unknown as string) },
    { req: context.req, res: context.res }
  )

  return { props: { job } }
}

const EditJob = ({ job }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()

  return job ? (
    <JobForm
      onSuccess={() => router.push("/my-jobs")}
      jobId={job!.id}
      initialValues={{
        ...job,
        type: job.type as JobType,
        tags: Object.keys(SubmitJobInput.shape.tags.shape).reduce(
          (result, tag) => ({
            ...result,
            [tag]: (job.tags as Tag[]).findIndex((item) => item === tag) > -1,
          }),
          {} as { [key in Tag]: boolean }
        ),
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

EditJob.getLayout = (page) => <AppLayout title="Edit Job">{page}</AppLayout>
EditJob.authenticate = { redirectTo: Routes.LoginPage() }

export default EditJob
