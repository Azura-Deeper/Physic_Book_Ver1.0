'use client'

import { useState, useEffect } from 'react'

interface Chapter {
  _id: string
  id: string
  title: string
  subtitle?: string
  icon?: string
  content: string
  sections: {
    id: string
    title: string
    content: string
    subsections?: {
      id: string
      title: string
      content: string
    }[]
  }[]
  exercises: {
    id: number
    title: string
    question: string
    solution: string
    type: 'practice' | 'quiz'
  }[]
  order: number
  isPublished: boolean
}

interface ContentLoaderProps {
  onChaptersLoad: (chapters: Chapter[]) => void
  onError: (error: string) => void
}

export default function ContentLoader({ onChaptersLoad, onError }: ContentLoaderProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/chapters')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const chapters: Chapter[] = await response.json()
        onChaptersLoad(chapters)
      } catch (err) {
        console.error('Error loading chapters:', err)
        onError(err instanceof Error ? err.message : 'Không thể tải nội dung')
      } finally {
        setLoading(false)
      }
    }

    loadChapters()
  }, [onChaptersLoad, onError])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Đang tải nội dung...</p>
        </div>
      </div>
    )
  }

  return null
}

export type { Chapter }