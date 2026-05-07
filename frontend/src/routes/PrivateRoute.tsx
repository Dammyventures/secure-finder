import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/common/Layout/Layout'
import Loader from '../components/common/UI/Loader'

const PrivateRoute: React.FC = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!user) {
    // Redirect to login page, saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user needs identity verification for certain routes
  const requiresVerification = location.pathname.startsWith('/report') || 
                               location.pathname.startsWith('/claims')
  
  if (requiresVerification && !user.identityVerified) {
    return <Navigate to="/verify" state={{ from: location }} replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default PrivateRoute