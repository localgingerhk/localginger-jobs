import { Link, useRouter, useSession } from "blitz"
import { useState, Suspense } from "react"
import classNames from "classnames"
import { AuthNav } from "./AuthNav"
import { MenuLink } from "./MenuLink"
import { Loading } from "./Loading"
import { SiRoots } from "react-icons/si"
import { FiExternalLink } from "react-icons/fi"

const NavItems = () => {
  const router = useRouter()

  return (
    <>
      <MenuLink as={Link} active={["/", "/post-job"].includes(router.pathname)} href="/">
        Listings
      </MenuLink>
      <MenuLink as="a" target="_blank" href="https://localginger.hk">
        localginger.hk <FiExternalLink className="inline-block ml-2" />
      </MenuLink>
    </>
  )
}

export const Nav = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const toggleMobileMenuVisible = () => setMobileMenuVisible(!mobileMenuVisible)

  return (
    <nav className="bg-red-600">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <Link href="/" passHref>
                <a>
                  <SiRoots color="yellow" size="40" />
                </a>
              </Link>
              <div className="hidden md:block ml-4">
                <div className="flex items-center space-x-4">
                  <NavItems />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center ml-4 md:ml-6">
                <div className="relative ml-3">
                  <Suspense
                    fallback={
                      <div className="flex items-end justify-center h-12">
                        <Loading className="w-5 h-5 text-red-500" />
                      </div>
                    }
                  >
                    <AuthNav />
                  </Suspense>
                </div>
              </div>
            </div>
            <div className="flex -mr-2 md:hidden">
              <button
                onClick={toggleMobileMenuVisible}
                className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
              >
                <svg
                  className="block w-6 h-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className="hidden w-6 h-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={classNames("border-b border-gray-700 md:hidden", {
          hidden: !mobileMenuVisible,
        })}
      >
        <div className="px-2 py-3 space-y-1 sm:px-3">
          <NavItems />
        </div>
        <div className="px-2 pt-3 pb-3 border-t border-gray-700">
          <Suspense
            fallback={
              <div className="flex items-end justify-center h-12">
                <Loading className="w-5 h-5 text-red-500" />
              </div>
            }
          >
            <AuthNav />
          </Suspense>
        </div>
      </div>
    </nav>
  )
}
