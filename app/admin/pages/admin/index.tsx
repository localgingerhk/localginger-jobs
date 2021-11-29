import React, { Suspense } from "react"
import { BlitzPage, useRouter, Routes } from "blitz"
import { AppLayout } from "app/layouts/AppLayout"
import { JobsList } from "app/jobs/components/JobsList"
import { Loading } from "app/components/Loading"
import { Role } from "app/users/role"
import getUnpublishedJobs from "app/admin/queries/getUnpublishedJobs"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

const AdminComponent = () => {
  const user = useCurrentUser()
  const router = useRouter()

  if (user && user.role !== Role.ADMIN) {
    router.push(Routes.LoginPage())
  }
  return (
    <>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Manage All Jobs</h3>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          Here you can publish all the submitted jobs.
        </p>
      </div>
      <JobsList query={getUnpublishedJobs} withAdminActions />
    </>
  )
}

const Admin: BlitzPage = () => (
  <Suspense
    fallback={
      <div className="flex items-end justify-center h-12">
        <Loading className="w-5 h-5 text-red-500" />
      </div>
    }
  >
    <AdminComponent />
  </Suspense>
)

Admin.getLayout = (page) => <AppLayout title="Dashboard">{page}</AppLayout>
Admin.authenticate = { redirectTo: Routes.LoginPage() }

export default Admin
