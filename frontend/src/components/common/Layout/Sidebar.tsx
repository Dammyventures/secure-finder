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
  Star,
  X
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useUIStore } from '../../../store/ui.store'
import { ROUTES } from '../../../utils/constants'

interface SidebarProps {
  collapsed?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, logout } = useAuth()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  
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
                ? 'bg-[#4BB4DE]/20 text-[#4BB4DE]'
                : 'text-[#EFDBCB]/70 hover:bg-[#4BB4DE]/10 hover:text-[#EFDBCB]'
            }`
          }
          onClick={() => {
            // Close sidebar on mobile when a link is clicked
            if (window.innerWidth < 1024) {
              toggleSidebar()
            }
          }}
        >
          <link.icon size={18} className="mr-3 flex-shrink-0" />
          {!isCollapsed && <span>{link.label}</span>}
        </NavLink>
      </li>
    ))
  }
  
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-64
          bg-gradient-to-br from-[#150734] via-[#0F2557] to-[#345DA7]
          border-r border-[#4BB4DE]/10
          overflow-y-auto
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-[#4BB4DE]/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="text-[#4BB4DE]" size={24} />
              <div>
                <div className="text-lg font-bold text-[#EFDBCB]">Secure</div>
                <div className="text-lg font-bold text-[#4BB4DE]">Finder</div>
              </div>
            </div>
            {/* Close button on mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 rounded-lg text-[#EFDBCB]/60 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* User info */}
          {user && (
            <div className="p-4 border-b border-[#4BB4DE]/10">
              <div className="flex items-center space-x-3">
                {(user as any).profileImage ? (
                  <img
                    src={(user as any).profileImage}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full border-2 border-[#4BB4DE]"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-[#4BB4DE] to-[#63BCE5] rounded-full flex items-center justify-center">
                    <User size={20} className="text-[#150734]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#EFDBCB] truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-[#EFDBCB]/50 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              {user.identityVerified && (
                <div className="mt-2 flex items-center text-xs text-[#4BB4DE]">
                  <CheckCircle size={12} className="mr-1" />
                  Verified User
                </div>
              )}
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div>
              <h3 className="text-xs font-semibold text-[#EFDBCB]/40 uppercase tracking-wider px-4 py-2">
                Main
              </h3>
              <ul className="space-y-1">{renderLinks(mainLinks)}</ul>
            </div>
            
            {user && (
              <>
                <div>
                  <h3 className="text-xs font-semibold text-[#EFDBCB]/40 uppercase tracking-wider px-4 py-2">
                    My Account
                  </h3>
                  <ul className="space-y-1">{renderLinks(userLinks)}</ul>
                </div>
                
                {adminLinks.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-[#EFDBCB]/40 uppercase tracking-wider px-4 py-2">
                      Administration
                    </h3>
                    <ul className="space-y-1">{renderLinks(adminLinks)}</ul>
                  </div>
                )}
              </>
            )}
            
            <div>
              <h3 className="text-xs font-semibold text-[#EFDBCB]/40 uppercase tracking-wider px-4 py-2">
                Account
              </h3>
              <ul className="space-y-1">
                {user ? (
                  <>
                    {renderLinks(accountLinks)}
                    <li>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-[#EFDBCB]/70 hover:text-[#EFDBCB] hover:bg-[#4BB4DE]/10 rounded-lg transition-colors"
                      >
                        <LogOut size={18} className="mr-3 flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#4BB4DE]/20 text-[#4BB4DE]'
                            : 'text-[#EFDBCB]/70 hover:bg-[#4BB4DE]/10 hover:text-[#EFDBCB]'
                        }`
                      }
                    >
                      <LogOut size={18} className="mr-3 flex-shrink-0" />
                      <span>Login</span>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-[#4BB4DE]/10">
            <div className="text-xs text-[#EFDBCB]/30">
              <p>© {new Date().getFullYear()} Secure Finder</p>
              <p className="mt-1">All rights reserved</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar