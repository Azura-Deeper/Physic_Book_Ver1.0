'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  onThemeToggle: () => void
  onSearchToggle: () => void
  onMenuToggle: () => void
  currentTheme: string
}

export default function Header({ onThemeToggle, onSearchToggle, onMenuToggle, currentTheme }: HeaderProps) {
  const getThemeIcon = () => {
    switch (currentTheme) {
      case 'dark': return 'fas fa-sun'
      case 'sepia': return 'fas fa-adjust'
      case 'high-contrast': return 'fas fa-moon'
      default: return 'fas fa-moon'
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 md:gap-3 truncate">
            <i className="fas fa-wave-square text-blue-500 text-lg md:text-xl"></i>
            <span className="hidden sm:inline">Chương 1: </span>Dao động
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm truncate">
            Vật lí 11 - Chân trời sáng tạo
          </p>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={onThemeToggle}
            className="btn-icon"
            title="Chuyển đổi chế độ"
          >
            <i className={getThemeIcon()}></i>
          </button>
          
          <button
            onClick={onSearchToggle}
            className="btn-icon"
            title="Tìm kiếm"
          >
            <i className="fas fa-search"></i>
          </button>
          
          <button
            onClick={onMenuToggle}
            className="btn-icon lg:hidden"
            title="Menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  )
}