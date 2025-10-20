'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { MathFormula } from './Math'
import { useProgress } from '@/hooks/useProgress'

interface Slide {
  id: number
  title: string
  content: string
  type: 'intro' | 'concept' | 'formula' | 'example' | 'summary'
  formulas?: string[]
  images?: string[]
  notes?: string
}

interface SlidePresentationProps {
  slides: Slide[]
  lessonTitle: string
  lessonId: number
  onSlideChange?: (slideIndex: number) => void
  onLessonComplete?: () => void
}

export interface SlidePresentationRef {
  goToSlide: (index: number) => void
  getCurrentSlide: () => number
}

const SlidePresentation = forwardRef<SlidePresentationRef, SlidePresentationProps>(({ 
  slides, 
  lessonTitle, 
  lessonId,
  onSlideChange,
  onLessonComplete
}, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const containerRef = useRef<HTMLDivElement>(null)
  const { updateProgress } = useProgress()

  const nextSlide = async () => {
    if (currentSlide < slides.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
        setIsTransitioning(false)
        onSlideChange?.(currentSlide + 1)
      }, 150)
    } else {
      // Reached the end of lesson - mark as completed
      const endTime = new Date()
      const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) // minutes
      
      await updateProgress(lessonId, true, timeSpent)
      onLessonComplete?.()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1)
        setIsTransitioning(false)
        onSlideChange?.(currentSlide - 1)
      }, 150)
    }
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length && index !== currentSlide) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(index)
        setIsTransitioning(false)
        onSlideChange?.(index)
      }, 150)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') nextSlide()
    if (e.key === 'ArrowLeft') prevSlide()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  useEffect(() => {
    // Check if content is scrollable
    const checkScrollable = () => {
      if (containerRef.current) {
        const isScrollable = containerRef.current.scrollHeight > containerRef.current.clientHeight
        setIsScrollable(isScrollable)
      }
    }

    // Check after content loads
    setTimeout(checkScrollable, 100)
    
    // Check on window resize
    window.addEventListener('resize', checkScrollable)
    return () => window.removeEventListener('resize', checkScrollable)
  }, [currentSlide])

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    goToSlide,
    getCurrentSlide: () => currentSlide
  }))

  const slide = slides[currentSlide]
  const progress = ((currentSlide + 1) / slides.length) * 100

  const getSlideTypeColor = (type: string) => {
    switch (type) {
      case 'intro': return 'from-blue-500 to-blue-600'
      case 'concept': return 'from-green-500 to-green-600'
      case 'formula': return 'from-purple-500 to-purple-600'
      case 'example': return 'from-yellow-500 to-orange-500'
      case 'summary': return 'from-indigo-500 to-indigo-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getSlideTypeIcon = (type: string) => {
    switch (type) {
      case 'intro': return '📚'
      case 'concept': return '💡'
      case 'formula': return '📐'
      case 'example': return '🔍'
      case 'summary': return '📋'
      default: return '📄'
    }
  }

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>



      {/* Main Slide Container */}
      <div 
        ref={containerRef}
        className={`w-full h-full flex items-start justify-center py-8 px-8 transition-opacity duration-150 relative group overflow-y-auto scroll-smooth slide-container ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="max-w-4xl w-full relative my-auto min-h-0">
          {/* Left Click Area */}
          {currentSlide > 0 && (
            <div 
              className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer group/left"
              onClick={prevSlide}
            >
              <div className="opacity-0 group-hover/left:opacity-100 transition-opacity duration-200 absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 pointer-events-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Right Click Area */}
          {currentSlide < slides.length - 1 && (
            <div 
              className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer group/right"
              onClick={nextSlide}
            >
              <div className="opacity-0 group-hover/right:opacity-100 transition-opacity duration-200 absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-3 pointer-events-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Slide Header */}
          <div className={`bg-gradient-to-r ${getSlideTypeColor(slide.type)} rounded-t-2xl p-6 text-white transition-transform duration-200 group-hover:scale-[1.02]`}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getSlideTypeIcon(slide.type)}</span>
              <div>
                <h2 className="text-xl font-bold">{slide.title}</h2>
                <p className="text-white/80 text-sm">{lessonTitle}</p>
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transition-all duration-200 group-hover:shadow-2xl group-hover:scale-[1.02] min-h-[500px] max-h-none">
            {/* Main Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mb-6 slide-content text-gray-900 dark:text-gray-100"
              style={{ color: 'inherit' }}
              dangerouslySetInnerHTML={{ __html: slide.content }}
            />

            {/* Formulas Section */}
            {slide.formulas && slide.formulas.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  📐 Công thức quan trọng
                </h3>
                <div className="space-y-4">
                  {slide.formulas.map((formula, index) => (
                    <div key={index} className="formula-box">
                      <div className="text-center text-xl">
                        <MathFormula formula={formula} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {slide.notes && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Ghi chú:</strong> {slide.notes}
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>
      </div>





      {/* Navigation Hints */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 py-2">
        <div>🖱️ Click trái/phải slide để chuyển</div>
        <div>⌨️ Phím ← → Space để điều hướng</div>
      </div>
    </div>
  )
})

SlidePresentation.displayName = 'SlidePresentation'

export default SlidePresentation