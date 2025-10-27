'use client'

import { useState, useEffect } from 'react'
import { Chapter } from '../../types/Chapter'

export default function AdminPanel() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    subtitle: '',
    icon: '',
    content: '',
    order: 0,
    isPublished: true
  })

  useEffect(() => {
    loadChapters()
  }, [])

  const loadChapters = async () => {
    try {
      const response = await fetch('/api/chapters')
      const data = await response.json()
      setChapters(data)
    } catch (error) {
      console.error('Error loading chapters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setEditForm({
      id: chapter.id,
      title: chapter.title,
      subtitle: chapter.subtitle || '',
      icon: chapter.icon || '',
      content: chapter.content,
      order: chapter.order,
      isPublished: chapter.isPublished
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/chapters/${selectedChapter?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        await loadChapters()
        setIsEditing(false)
        setSelectedChapter(null)
        alert('Cập nhật thành công!')
      } else {
        alert('Có lỗi xảy ra khi cập nhật')
      }
    } catch (error) {
      console.error('Error saving chapter:', error)
      alert('Có lỗi xảy ra khi cập nhật')
    }
  }

  const handleDelete = async (chapterId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chương này?')) return

    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadChapters()
        alert('Xóa thành công!')
      } else {
        alert('Có lỗi xảy ra khi xóa')
      }
    } catch (error) {
      console.error('Error deleting chapter:', error)
      alert('Có lỗi xảy ra khi xóa')
    }
  }

  const handleTogglePublish = async (chapter: Chapter) => {
    try {
      const response = await fetch(`/api/chapters/${chapter._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...chapter,
          isPublished: !chapter.isPublished
        }),
      })

      if (response.ok) {
        await loadChapters()
      } else {
        alert('Có lỗi xảy ra khi cập nhật')
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
      alert('Có lỗi xảy ra khi cập nhật')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Panel - Physics Book
            </h1>
            <a
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Về trang chính
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isEditing ? (
          /* Chapter List */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý chương
              </h2>
              <button
                onClick={() => {
                  setEditForm({
                    id: '',
                    title: '',
                    subtitle: '',
                    icon: '',
                    content: '',
                    order: chapters.length + 1,
                    isPublished: true
                  })
                  setSelectedChapter(null)
                  setIsEditing(true)
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Thêm chương mới
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {chapters.map((chapter) => (
                  <li key={chapter._id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            chapter.isPublished ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <i className={`${chapter.icon || 'fas fa-book'} ${
                              chapter.isPublished ? 'text-green-600' : 'text-gray-600'
                            }`}></i>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {chapter.title}
                            </h3>
                            <span className="text-sm text-gray-500">#{chapter.order}</span>
                            {!chapter.isPublished && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Chưa xuất bản
                              </span>
                            )}
                          </div>
                          {chapter.subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {chapter.subtitle}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>
                              <i className="fas fa-list mr-1"></i>
                              {chapter.sections.length} phần
                            </span>
                            <span>
                              <i className="fas fa-tasks mr-1"></i>
                              {chapter.exercises.length} bài tập
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(chapter)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            chapter.isPublished
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {chapter.isPublished ? 'Ẩn' : 'Xuất bản'}
                        </button>
                        <button
                          onClick={() => handleEdit(chapter)}
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(chapter._id)}
                          className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedChapter ? 'Chỉnh sửa chương' : 'Thêm chương mới'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-times mr-2"></i>
                Hủy
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      ID Chương
                    </label>
                    <input
                      type="text"
                      value={editForm.id}
                      onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="vd: gioi-thieu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiêu đề
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phụ đề
                    </label>
                    <input
                      type="text"
                      value={editForm.subtitle}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Icon (FontAwesome)
                      </label>
                      <input
                        type="text"
                        value={editForm.icon}
                        onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="fas fa-wave-square"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Thứ tự
                      </label>
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nội dung (HTML)
                    </label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      rows={20}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.isPublished}
                      onChange={(e) => setEditForm({ ...editForm, isPublished: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Xuất bản ngay
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}