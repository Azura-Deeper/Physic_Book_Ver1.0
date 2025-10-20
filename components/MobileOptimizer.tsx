'use client'

import { useState, useEffect } from 'react'

interface MobileOptimizerProps {
  children: React.ReactNode
}

export default function MobileOptimizer({ children }: MobileOptimizerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setIsLandscape(window.innerHeight < window.innerWidth && window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100)
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Add mobile-specific styles
  useEffect(() => {
    if (isMobile) {
      // Use type assertion for webkit properties
      const bodyStyle = document.body.style as any
      bodyStyle.webkitTapHighlightColor = 'transparent'
      bodyStyle.webkitTouchCallout = 'none'
      bodyStyle.webkitUserSelect = 'none'
      document.body.style.overscrollBehavior = 'contain'
    }
  }, [isMobile])

  return (
    <div className={`${isMobile ? 'mobile-optimized' : ''} ${isLandscape ? 'landscape-mode' : ''}`}>
      {children}
      
      {/* Mobile-specific UI enhancements */}
      {isMobile && (
        <>
          {/* Floating action button for quick access */}
          <div className="fixed bottom-4 right-4 z-50 md:hidden">
            <button className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>

          {/* Mobile bottom navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden">
            <div className="flex items-center justify-around py-2">
              <button className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <i className="fas fa-home text-lg"></i>
                <span className="text-xs mt-1">Trang chủ</span>
              </button>
              <button className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <i className="fas fa-bookmark text-lg"></i>
                <span className="text-xs mt-1">Bookmark</span>
              </button>
              <button className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <i className="fas fa-chart-line text-lg"></i>
                <span className="text-xs mt-1">Tiến độ</span>
              </button>
              <button className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <i className="fas fa-cog text-lg"></i>
                <span className="text-xs mt-1">Cài đặt</span>
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .mobile-optimized {
          padding-bottom: 70px; /* Space for bottom nav */
        }
        
        .landscape-mode {
          padding-bottom: 0;
        }
        
        @media (max-width: 768px) {
          .mobile-optimized .content-section {
            padding: 1rem;
          }
          
          .mobile-optimized .math-display {
            font-size: 0.9rem;
            overflow-x: auto;
            white-space: nowrap;
            padding: 0.5rem;
          }
          
          .mobile-optimized .formula-box {
            padding: 0.75rem;
          }
          
          .mobile-optimized .exercise {
            padding: 1rem;
          }
          
          /* Better touch targets */
          .mobile-optimized button {
            min-height: 44px;
            min-width: 44px;
          }
          
          .mobile-optimized .toc-list a {
            padding: 1rem;
            font-size: 1rem;
          }
          
          /* Improved text readability */
          .mobile-optimized .content-section h2 {
            font-size: 1.5rem;
            line-height: 1.3;
          }
          
          .mobile-optimized .content-section h3 {
            font-size: 1.25rem;
            line-height: 1.4;
          }
          
          .mobile-optimized .content-section p {
            line-height: 1.6;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}