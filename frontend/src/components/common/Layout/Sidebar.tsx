import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Search,
  MapPin,
  Shield,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Package,
  FileText,
  CheckCircle,
  BarChart3,
  Users,
  Bell,
  MessageSquare,
  Star
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useUIStore } from '../../../store/ui.store'
import { ROUTES } from '../../../utils/constants'

interface SidebarProps {
  collapsed?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, logout } = useAuth()
  const { sidebarOpen } = useUIStore()
  
  const isCollapsed = collapsed && !sidebarOpen
  
  const mainLinks = [
    { to: ROUTES.HOME, icon: Home, label: 'Home', exact: true },
    { to: ROUTES.SEARCH, icon: Search, label: 'Search Items' },
    { to: ROUTES.REPORT_LOST, icon: MapPin, label: 'Report Lost' },
    { to: ROUTES.REPORT_FOUND, icon: Package, label: 'Report Found' },
  ]
  
  const userLinks = [
    { to: ROUTES.DASHBOARD, icon: BarChart3, label: 'Dashboard' },
    { to: '/my-items', icon: Package, label: 'My Items' },
    { to: ROUTES.CLAIMS, icon: FileText, label: 'My Claims' },
    { to: ROUTES.VERIFICATION, icon: CheckCircle, label: 'Verification' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/reviews', icon: Star, label: 'Reviews' },
  ]
  
  const adminLinks = user?.role === 'admin' || user?.role === 'verifier' ? [
    { to: ROUTES.ADMIN, icon: Shield, label: 'Admin Dashboard' },
    { to: ROUTES.ADMIN_USERS, icon: Users, label: 'User Management' },
    { to: ROUTES.ADMIN_ITEMS, icon: Package, label: 'Item Management' },
    { to: ROUTES.ADMIN_VERIFICATIONS, icon: CheckCircle, label: 'Verifications' },
    { to: ROUTES.ADMIN_CLAIMS, icon: FileText, label: 'Claims Review' },
  ] : []
  
  const accountLinks = [
    { to: ROUTES.PROFILE, icon: User, label: 'Profile' },
    { to: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
    { to: '/help', icon: HelpCircle, label: 'Help & Support' },
  ]
  
  const renderLinks = (links: Array<{ to: string; icon: any; label: string; exact?: boolean }>) => {
    return links.map((link) => (
      <li key={link.to}>
        <NavLink
          to={link.to}
          end={link.exact}
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <link.icon size={18} className="mr-3" />
          {!isCollapsed && <span>{link.label}</span>}
        </NavLink>
      </li>
    ))
  }
  
  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-gray-200
        transition-all duration-300 z-30 overflow-y-auto
        ${isCollapsed ? 'w-0' : 'w-64'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="text-blue-600" size={24} />
            {!isCollapsed && (
              <div>
                <div className="text-lg font-bold text-gray-900">Secure</div>
                <div className="text-lg font-bold text-blue-600">Finder</div>
              </div>
            )}
          </div>
        </div>
        
        {/* User info */}
        {user && !isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {(user as any).profileImage ? (
                <img
                  src={(user as any).profileImage}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            {user.identityVerified && (
              <div className="mt-2 flex items-center text-xs text-green-600">
                <CheckCircle size={12} className="mr-1" />
                Verified User
              </div>
            )}
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
              Main
            </h3>
            <ul className="space-y-1">{renderLinks(mainLinks)}</ul>
          </div>
          
          {user && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
                  My Account
                </h3>
                <ul className="space-y-1">{renderLinks(userLinks)}</ul>
              </div>
              
              {adminLinks.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
                    Administration
                  </h3>
                  <ul className="space-y-1">{renderLinks(adminLinks)}</ul>
                </div>
              )}
            </>
          )}
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
              Account
            </h3>
            <ul className="space-y-1">
              {user ? (
                <>
                  {renderLinks(accountLinks)}
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      {!isCollapsed && <span>Logout</span>}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      <LogOut size={18} className="mr-3" />
                      {!isCollapsed && <span>Login</span>}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        
        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Secure Finder</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar