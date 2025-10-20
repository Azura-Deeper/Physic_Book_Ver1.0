'use client'

import { useState, useEffect } from 'react'

interface ProgressData {
  sectionsRead: { [key: string]: boolean }
  exercisesCompleted: { [key: string]: boolean }
  readingTime: { [key: string]: number } // in seconds
  bookmarks: string[]
  lastReadSection: string
  totalTimeSpent: number
}

interface ProgressTrackerProps {
  currentSection: string
  onProgressUpdate: (progress: ProgressData) => void
}

export default function ProgressTracker({ currentSection, onProgressUpdate }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData>({
    sectionsRead: {},
    exercisesCompleted: {},
    readingTime: {},
    bookmarks: [],
    lastReadSection: '',
    totalTimeSpent: 0
  })
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now())
  const [currentSectionStartTime, setCurrentSectionStartTime] = useState<number>(Date.now())

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('physics-detailed-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setProgress(parsed)
      } catch (e) {
        console.error('Error parsing detailed progress:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Track section reading time
    if (currentSection) {
      const now = Date.now()
      const timeSpent = Math.floor((now - currentSectionStartTime) / 1000)
      
      if (timeSpent > 5) { // Only count if spent more than 5 seconds
        const newProgress = {
          ...progress,
          sectionsRead: { ...progress.sectionsRead, [currentSection]: true },
          readingTime: { 
            ...progress.readingTime, 
            [currentSection]: (progress.readingTime[currentSection] || 0) + timeSpent 
          },
          lastReadSection: currentSection,
          totalTimeSpent: progress.totalTimeSpent + timeSpent
        }
        
        setProgress(newProgress)
        localStorage.setItem('physics-detailed-progress', JSON.stringify(newProgress))
        onProgressUpdate(newProgress)
      }
      
      setCurrentSectionStartTime(now)
    }
  }, [currentSection])

  const markExerciseCompleted = (exerciseId: string) => {
    const newProgress = {
      ...progress,
      exercisesCompleted: { ...progress.exercisesCompleted, [exerciseId]: true }
    }
    
    setProgress(newProgress)
    localStorage.setItem('physics-detailed-progress', JSON.stringify(newProgress))
    onProgressUpdate(newProgress)
  }

  const toggleBookmark = (sectionId: string) => {
    const isBookmarked = progress.bookmarks.includes(sectionId)
    const newBookmarks = isBookmarked 
      ? progress.bookmarks.filter(id => id !== sectionId)
      : [...progress.bookmarks, sectionId]
    
    const newProgress = {
      ...progress,
      bookmarks: newBookmarks
    }
    
    setProgress(newProgress)
    localStorage.setItem('physics-detailed-progress', JSON.stringify(newProgress))
    onProgressUpdate(newProgress)
  }

  const getReadingStats = () => {
    const totalSections = Object.keys(progress.sectionsRead).length
    const totalExercises = Object.keys(progress.exercisesCompleted).length
    const totalTimeHours = Math.floor(progress.totalTimeSpent / 3600)
    const totalTimeMinutes = Math.floor((progress.totalTimeSpent % 3600) / 60)
    
    return {
      sectionsRead: Object.values(progress.sectionsRead).filter(Boolean).length,
      totalSections,
      exercisesCompleted: Object.values(progress.exercisesCompleted).filter(Boolean).length,
      totalExercises,
      totalTimeFormatted: `${totalTimeHours}h ${totalTimeMinutes}m`,
      bookmarksCount: progress.bookmarks.length
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return {
    markExerciseCompleted,
    toggleBookmark,
    getReadingStats,
    formatTime,
    isBookmarked: (sectionId: string) => progress.bookmarks.includes(sectionId),
    isExerciseCompleted: (exerciseId: string) => progress.exercisesCompleted[exerciseId] || false,
    getSectionTime: (sectionId: string) => progress.readingTime[sectionId] || 0,
    progress
  }
}

export type { ProgressData }