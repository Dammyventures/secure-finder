import React from 'react'
import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ChatBot from '../../chat/ChatBot'
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
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-[#150734] via-[#0F2557] to-[#345DA7]">
      {showHeader && <Header />}
      
      <div className="flex flex-1 w-full">
        {showSidebar && <Sidebar collapsed={sidebarCollapsed} />}
        
        <main
          className={`
            flex-1 w-full transition-all duration-300 overflow-x-hidden
            ${showSidebar ? 'ml-0 lg:ml-64' : ''}
            ${sidebarOpen && showSidebar ? 'ml-64' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
        >
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>
      
      {showFooter && <Footer />}
      
      <ChatBot />
    </div>
  )
}

export default Layout