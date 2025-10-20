'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchResult {
  _id: string
  id: string
  title: string
  content: string
  sections: {
    id: string
    title: string
    content: string
  }[]
}

interface SearchPanelProps {
  isVisible: boolean
  onClose: () => void
  onSectionClick: (sectionId: string) => void
}

export default function SearchPanel({ isVisible, onClose, onSectionClick }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query.trim())
      } else {
        setResults([])
        setError('')
      }
    }, 300) // Debounce search

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      
      if (!response.ok) {
        throw new Error('Tìm kiếm thất bại')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (sectionId: string) => {
    onSectionClick(sectionId)
    onClose()
    setQuery('')
    setResults([])
  }

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const getSnippet = (content: string, searchQuery: string, maxLength: number = 150) => {
    if (!searchQuery.trim()) return content.substring(0, maxLength) + '...'
    
    // Remove HTML tags
    const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    
    const lowerContent = cleanContent.toLowerCase()
    const lowerQuery = searchQuery.toLowerCase()
    const index = lowerContent.indexOf(lowerQuery)
    
    if (index === -1) {
      return cleanContent.substring(0, maxLength) + '...'
    }
    
    const start = Math.max(0, index - 50)
    const end = Math.min(cleanContent.length, index + searchQuery.length + 100)
    
    let snippet = cleanContent.substring(start, end)
    if (start > 0) snippet = '...' + snippet
    if (end < cleanContent.length) snippet = snippet + '...'
    
    return snippet
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm nội dung, công thức, bài tập..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onClose()
                  }
                }}
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="p-6 text-center">
              <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mb-2"></i>
              <p className="text-gray-600 dark:text-gray-400">Đang tìm kiếm...</p>
            </div>
          )}

          {error && (
            <div className="p-6 text-center">
              <i className="fas fa-exclamation-circle text-2xl text-red-500 mb-2"></i>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && query.trim() && results.length === 0 && (
            <div className="p-6 text-center">
              <i className="fas fa-search text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-600 dark:text-gray-400">
                Không tìm thấy kết quả nào cho "<strong>{query}</strong>"
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tìm thấy {results.length} kết quả cho "<strong>{query}</strong>"
              </p>
              
              <div className="space-y-3">
                {results.map((result) => (
                  <div key={result._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <button
                      onClick={() => handleResultClick(result.id)}
                      className="w-full text-left"
                    >
                      <h3 className="font-semibold text-lg text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                        <i className="fas fa-book-open text-sm"></i>
                        {highlightText(result.title, query)}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {highlightText(getSnippet(result.content, query), query)}
                      </p>
                    </button>

                    {/* Sections that match */}
                    {result.sections
                      .filter(section => 
                        section.title.toLowerCase().includes(query.toLowerCase()) ||
                        section.content.toLowerCase().includes(query.toLowerCase())
                      )
                      .slice(0, 2)
                      .map((section) => (
                        <div key={section.id} className="mt-3 ml-4 border-l-2 border-blue-200 dark:border-blue-600 pl-3">
                          <button
                            onClick={() => handleResultClick(section.id)}
                            className="w-full text-left"
                          >
                            <h4 className="font-medium text-blue-600 dark:text-blue-400 text-sm mb-1">
                              {highlightText(section.title, query)}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              {highlightText(getSnippet(section.content, query, 100), query)}
                            </p>
                          </button>
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && (
            <div className="p-6 text-center">
              <i className="fas fa-lightbulb text-2xl text-yellow-500 mb-2"></i>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Gợi ý tìm kiếm:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['dao động', 'con lắc', 'chu kì', 'tần số', 'biên độ'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}