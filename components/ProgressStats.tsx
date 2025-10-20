'use client'

import { ProgressData } from './ProgressTracker'

interface ProgressStatsProps {
  progress: ProgressData
  totalSections: number
  totalExercises: number
}

export default function ProgressStats({ progress, totalSections, totalExercises }: ProgressStatsProps) {
  const sectionsCompleted = Object.values(progress.sectionsRead).filter(Boolean).length
  const exercisesCompleted = Object.values(progress.exercisesCompleted).filter(Boolean).length
  
  const sectionProgress = totalSections > 0 ? (sectionsCompleted / totalSections) * 100 : 0
  const exerciseProgress = totalExercises > 0 ? (exercisesCompleted / totalExercises) * 100 : 0
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else {
      return `${seconds}s`
    }
  }

  const getMotivationalMessage = () => {
    if (sectionProgress === 100) {
      return "🎉 Tuyệt vời! Bạn đã hoàn thành tất cả nội dung!"
    } else if (sectionProgress >= 75) {
      return "💪 Sắp hoàn thành rồi! Cố gắng lên!"
    } else if (sectionProgress >= 50) {
      return "📚 Đã đi được nửa chặng đường! Tiếp tục phát huy!"
    } else if (sectionProgress >= 25) {
      return "🌱 Khởi đầu tốt! Hãy duy trì nhịp độ học tập!"
    } else if (sectionProgress > 0) {
      return "🚀 Chào mừng bạn đến với hành trình khám phá vật lý!"
    } else {
      return "📖 Bắt đầu hành trình học tập của bạn ngay!"
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-chart-line"></i>
        Thống kê học tập
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Section Progress */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Nội dung</span>
            <span className="text-lg font-bold">{sectionsCompleted}/{totalSections}</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${sectionProgress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 opacity-90">{Math.round(sectionProgress)}% hoàn thành</p>
        </div>

        {/* Exercise Progress */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Bài tập</span>
            <span className="text-lg font-bold">{exercisesCompleted}/{totalExercises}</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${exerciseProgress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 opacity-90">{Math.round(exerciseProgress)}% hoàn thành</p>
        </div>

        {/* Time Spent */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Thời gian học</span>
            <span className="text-lg font-bold">{formatTime(progress.totalTimeSpent)}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-clock text-sm"></i>
            <span className="text-xs opacity-90">
              {progress.bookmarks.length} bookmark
            </span>
          </div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
        <p className="text-sm font-medium">{getMotivationalMessage()}</p>
      </div>

      {/* Recent activity */}
      {progress.lastReadSection && (
        <div className="mt-4 text-sm opacity-90">
          <p>
            <i className="fas fa-bookmark mr-2"></i>
            Lần cuối đọc: <span className="font-medium">{progress.lastReadSection}</span>
          </p>
        </div>
      )}
    </div>
  )
}