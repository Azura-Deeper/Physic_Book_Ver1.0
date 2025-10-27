'use client'

import { Chapter } from '../types/Chapter'

interface SidebarProps {
  isOpen: boolean
  onSectionClick: (sectionId: string) => void
  currentSection: string
  chapters: Chapter[]
  readingProgress: { [key: string]: boolean }
}

export default function Sidebar({ 
  isOpen, 
  onSectionClick, 
  currentSection, 
  chapters,
  readingProgress 
}: SidebarProps) {
  const getProgressIcon = (sectionId: string) => {
    return readingProgress[sectionId] ? 
      'fas fa-check-circle text-green-500' : 
      'far fa-circle text-gray-400'
  }

  const getChapterProgress = (chapter: Chapter) => {
    const totalSections = 1 + chapter.sections.length + chapter.sections.reduce((acc, section) => acc + (section.subsections?.length || 0), 0)
    const completedSections = Object.keys(readingProgress).filter(sectionId => {
      return readingProgress[sectionId] && (
        sectionId === chapter.id ||
        chapter.sections.some(section => section.id === sectionId) ||
        chapter.sections.some(section => section.subsections?.some(sub => sub.id === sectionId))
      )
    }).length
    
    return Math.round((completedSections / totalSections) * 100)
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-list text-blue-500"></i>
          Mục lục
        </h3>
        
        {chapters.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-book text-gray-400 text-2xl mb-2"></i>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Chưa có nội dung
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {chapters.map((chapter) => {
              const progress = getChapterProgress(chapter)
              return (
                <li key={chapter.id}>
                  <div className="flex items-center justify-between mb-1">
                    <a
                      href={`#${chapter.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        onSectionClick(chapter.id)
                      }}
                      className={`toc-list a flex items-center gap-2 flex-1 ${
                        currentSection === chapter.id ? 'active' : ''
                      }`}
                    >
                      <i className={getProgressIcon(chapter.id)}></i>
                      {chapter.icon && <i className={`${chapter.icon} text-sm`}></i>}
                      <span className="flex-1">{chapter.title}</span>
                    </a>
                    
                    {progress > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {progress}%
                      </span>
                    )}
                  </div>
                  
                  {/* Progress bar for chapter */}
                  {progress > 0 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
                      <div 
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}

                  {chapter.sections.length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {chapter.sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            onClick={(e) => {
                              e.preventDefault()
                              onSectionClick(section.id)
                            }}
                            className={`toc-list a text-sm flex items-center gap-2 ${
                              currentSection === section.id ? 'active' : ''
                            }`}
                          >
                            <i className={getProgressIcon(section.id)}></i>
                            {section.title}
                          </a>
                          
                          {section.subsections && section.subsections.length > 0 && (
                            <ul className="ml-4 mt-1 space-y-1">
                              {section.subsections.map((subsection) => (
                                <li key={subsection.id}>
                                  <a
                                    href={`#${subsection.id}`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      onSectionClick(subsection.id)
                                    }}
                                    className={`toc-list a text-xs flex items-center gap-2 ${
                                      currentSection === subsection.id ? 'active' : ''
                                    }`}
                                  >
                                    <i className={getProgressIcon(subsection.id)}></i>
                                    {subsection.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Show exercises count if any */}
                  {chapter.exercises.length > 0 && (
                    <div className="ml-4 mt-1">
                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <i className="fas fa-tasks"></i>
                        {chapter.exercises.length} bài tập
                      </span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {/* Overall progress */}
        {chapters.length > 0 && (
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Tiến độ học tập
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {Object.values(readingProgress).filter(Boolean).length} / {
                  chapters.reduce((total, chapter) => 
                    total + 1 + chapter.sections.length + 
                    chapter.sections.reduce((acc, section) => acc + (section.subsections?.length || 0), 0), 0
                  )
                }
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${
                    chapters.length > 0 ? 
                    (Object.values(readingProgress).filter(Boolean).length / 
                     chapters.reduce((total, chapter) => 
                       total + 1 + chapter.sections.length + 
                       chapter.sections.reduce((acc, section) => acc + (section.subsections?.length || 0), 0), 0
                     )) * 100 : 0
                  }%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}