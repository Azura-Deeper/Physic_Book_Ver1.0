'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from '@/components/UserMenu'
import { useProgress } from '@/hooks/useProgress'

interface Lesson {
  id: number
  title: string
  description: string
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
}

export default function LessonsPage() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()
  const { progress, isLessonCompleted, getCompletionRate } = useProgress()

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Mô tả dao động",
      description: "Tìm hiểu khái niệm cơ bản về dao động, các đại lượng đặc trưng và phân loại dao động.",
      duration: "45 phút",
      difficulty: "easy",
      completed: false
    },
    {
      id: 2,
      title: "Phương trình dao động điều hoà",
      description: "Nghiên cứu phương trình vi phân, nghiệm và các đặc điểm của dao động điều hòa.",
      duration: "60 phút",
      difficulty: "medium",
      completed: false
    },
    {
      id: 3,
      title: "Năng lượng trong dao động điều hoà",
      description: "Phân tích động năng, thế năng và sự chuyển hóa năng lượng trong dao động.",
      duration: "50 phút",
      difficulty: "medium",
      completed: false
    },
    {
      id: 4,
      title: "Dao động tắt dần và hiện tượng cộng hưởng",
      description: "Tìm hiểu dao động có ma sát, dao động cưỡng bức và hiện tượng cộng hưởng.",
      duration: "55 phút",
      difficulty: "hard",
      completed: false
    }
  ]

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'sepia' : 'light'
    setTheme(newTheme)
    document.documentElement.className = newTheme
    localStorage.setItem('physics-book-theme', newTheme)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Cơ bản'
      case 'medium': return 'Trung bình'
      case 'hard': return 'Nâng cao'
      default: return 'Không xác định'
    }
  }

  const handleLessonClick = (lessonId: number) => {
    router.push(`/lesson/${lessonId}`)
  }

  const handleBackHome = () => {
    router.push('/')
  }

  const handlePractice = () => {
    router.push('/practice')
  }

  // Redirect to home if not authenticated
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/');
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang chuyển hướng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Chương 1: Dao Động
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chọn bài học</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {user && <UserMenu user={user} />}
              <button
                onClick={handleBackHome}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                ← Về trang chủ
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '🌅'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar with hover effect */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40 group">
        {/* Hover trigger area với indicator */}
        <div className="absolute left-0 top-0 w-4 h-full bg-transparent hover:bg-blue-500/10 transition-colors duration-200 flex items-center justify-center">
          <div className="w-1 h-20 bg-blue-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
        
        {/* Actual sidebar */}
        <div className={`h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-72 group-hover:translate-x-0 group-hover:shadow-xl'
        }`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Danh sách bài học
            </h2>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson.id)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Bài {lesson.id}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                      {getDifficultyText(lesson.difficulty)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ⏱️ {lesson.duration}
                  </p>
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <button
                onClick={handlePractice}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                🎯 Luyện tập tổng hợp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="transition-all duration-300 pt-16 ml-0">
        <div className="max-w-4xl mx-auto p-6">
          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tiến độ học tập
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{Object.values(progress).filter(p => p.completed).length}/4 bài hoàn thành</span>
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${getCompletionRate()}%` }}
                  ></div>
                </div>
                <span className="font-medium">{getCompletionRate()}%</span>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">{lesson.id}</span>
                    </div>
                    {isLessonCompleted(lesson.id) && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                      {getDifficultyText(lesson.difficulty)}
                    </span>
                    {isLessonCompleted(lesson.id) && (
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full font-medium">
                        Hoàn thành
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {lesson.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {lesson.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.duration}
                  </div>
                  
                  <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLessonCompleted(lesson.id)
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                    {isLessonCompleted(lesson.id) ? 'Học lại ↻' : 'Bắt đầu →'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center space-y-4">
            <button
              onClick={handlePractice}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span className="mr-3">🎯</span>
              Luyện tập tổng hợp
            </button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hoàn thành tất cả bài học để mở khóa phần luyện tập
            </p>
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}