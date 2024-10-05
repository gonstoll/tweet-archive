import {Outlet} from '@remix-run/react'

export default function AuthLayout() {
  return (
    <div className="m-auto">
      <Outlet />
    </div>
  )
}
