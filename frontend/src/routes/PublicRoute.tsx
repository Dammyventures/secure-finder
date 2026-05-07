import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/common/Layout/Layout'
import Loader from '../components/common/UI/Loader'

interface PublicRouteProps {
  restricted?: boolean // If true, logged-in users cannot access (like login/register pages)
}

const PublicRoute: React.FC<PublicRouteProps> = ({ restricted = false }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const { state } = location

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  // If user is logged in and trying to access restricted pages (login/register)
  if (user && restricted) {
    // Redirect to dashboard or the page they were trying to access before login
    const redirectTo = state?.from?.pathname || '/dashboard'
    return <Navigate to={redirectTo} replace />
  }

  // Check if current route should use layout
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthPage = authPages.some(path => location.pathname.startsWith(path))

  // Don't use layout for auth pages
  if (isAuthPage) {
    return <Outlet />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default PublicRoute
