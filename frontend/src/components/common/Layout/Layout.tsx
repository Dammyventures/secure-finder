import React  from 'react'
import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useUIStore } from '../../../store/ui.store'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  showSidebar?: boolean
  showFooter?: boolean
  sidebarCollapsed?: boolean
  className?: string
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showSidebar = true,
  showFooter = true,
  sidebarCollapsed = false,
  className = '',
}) => {
  const { sidebarOpen } = useUIStore()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      <div className="flex">
        {showSidebar && <Sidebar collapsed={sidebarCollapsed} />}
        
        <main
          className={`
            flex-1 transition-all duration-300
            ${showSidebar ? 'ml-0 lg:ml-64' : ''}
            ${sidebarOpen && showSidebar ? 'ml-64' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      {showFooter && <Footer />}
    </div>
  )
}

export default Layout