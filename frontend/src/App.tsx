import './index.css'; // or './App.css'
import { SidebarProvider } from './contexts/SidebarContext'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Contexts
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/auth/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import SearchItems from './pages/items/Search'
import ReportLost from './pages/items/ReportLost'
import ReportFound from './pages/items/ReportFound'
import ItemDetail from './pages/items/ItemDetail'
import Verification from './pages/verification/IdentityVerify'
import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'

// Routes
import PrivateRoute from './routes/PrivateRoute'
import AdminRoute from './routes/AdminRoute'
import ErrorBoundary from './components/common/UI/ErrorBoundary'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <AuthProvider>
              <NotificationProvider>
                <SidebarProvider>  {/* ← WRAP EVERYTHING WITH SidebarProvider */}
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<SearchItems />} />
                    <Route path="/items/:id" element={<ItemDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/report/lost" element={<ReportLost />} />
                      <Route path="/report/found" element={<ReportFound />} />
                      <Route path="/verify" element={<Verification />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/my-items" element={<div>My Items</div>} />
                      <Route path="/claims" element={<div>My Claims</div>} />
                      <Route path="/messages" element={<div>Messages</div>} />
                    </Route>
                    
                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/users" element={<div>User Management</div>} />
                      <Route path="/admin/items" element={<div>Item Management</div>} />
                      <Route path="/admin/verifications" element={<div>Verifications</div>} />
                      <Route path="/admin/claims" element={<div>Claims Review</div>} />
                    </Route>
                    
                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#10B981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: '#EF4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </SidebarProvider>  {/* ← CLOSE SidebarProvider */}
              </NotificationProvider>
            </AuthProvider>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App