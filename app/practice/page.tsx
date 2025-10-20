'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Exercise {
  id: number
  type: 'multiple-choice' | 'calculation' | 'true-false'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  lesson: number
}

export default function PracticePage() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState<boolean[]>([])
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showFinalResult, setShowFinalResult] = useState(false)
  const router = useRouter()

  const exercises: Exercise[] = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Dao động điều hòa là gì?',
      options: [
        'Chuyển động thẳng đều',
        'Chuyển động có li độ biến thiên theo quy luật sin hoặc cos theo thời gian',
        'Chuyển động tròn đều',
        'Chuyển động thẳng biến đổi đều'
      ],
      correctAnswer: 1,
      explanation: 'Dao động điều hòa là dao động có li độ biến thiên theo quy luật hàm sin hoặc cos của thời gian.',
      difficulty: 'easy',
      lesson: 1
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Đơn vị của tần số góc là gì?',
      options: ['Hz', 'rad/s', 's', 'm/s'],
      correctAnswer: 1,
      explanation: 'Tần số góc ω có đơn vị là rad/s (radian trên giây).',
      difficulty: 'easy',
      lesson: 1
    },
    {
      id: 3,
      type: 'calculation',
      question: 'Một vật dao động điều hòa với chu kì T = 0,5s. Tần số dao động là bao nhiêu?',
      correctAnswer: 2,
      explanation: 'Tần số f = 1/T = 1/0,5 = 2 Hz',
      difficulty: 'medium',
      lesson: 1
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: 'Trong dao động điều hòa x = Acos(ωt + φ), đại lượng A được gọi là gì?',
      options: ['Tần số góc', 'Pha ban đầu', 'Biên độ dao động', 'Li độ'],
      correctAnswer: 2,
      explanation: 'A là biên độ dao động, thể hiện độ lệch cực đại của vật khỏi vị trí cân bằng.',
      difficulty: 'easy',
      lesson: 2
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: 'Vận tốc trong dao động điều hòa x = Acos(ωt + φ) là:',
      options: [
        'v = Aωcos(ωt + φ)',
        'v = -Aωsin(ωt + φ)',
        'v = -Aω²cos(ωt + φ)',
        'v = Aωsin(ωt + φ)'
      ],
      correctAnswer: 1,
      explanation: 'Vận tốc v = dx/dt = -Aωsin(ωt + φ)',
      difficulty: 'medium',
      lesson: 2
    },
    {
      id: 6,
      type: 'true-false',
      question: 'Cơ năng trong dao động điều hòa luôn được bảo toàn.',
      correctAnswer: 'true',
      explanation: 'Đúng. Trong dao động điều hòa lý tưởng (không có ma sát), cơ năng W = ½kA² = ½mω²A² = hằng số.',
      difficulty: 'medium',
      lesson: 3
    },
    {
      id: 7,
      type: 'multiple-choice',
      question: 'Động năng của vật dao động điều hòa đạt cực đại khi:',
      options: [
        'Vật ở vị trí biên',
        'Vật ở vị trí cân bằng',
        'Vận tốc bằng 0',
        'Li độ x = A/2'
      ],
      correctAnswer: 1,
      explanation: 'Động năng đạt cực đại khi vận tốc đạt cực đại, tức là khi vật đi qua vị trí cân bằng (x = 0).',
      difficulty: 'medium',
      lesson: 3
    },
    {
      id: 8,
      type: 'multiple-choice',
      question: 'Hiện tượng cộng hưởng xảy ra khi:',
      options: [
        'Tần số ngoại lực bằng tần số riêng của hệ',
        'Biên độ dao động đạt cực tiểu',
        'Vật ngừng dao động',
        'Ma sát rất lớn'
      ],
      correctAnswer: 0,
      explanation: 'Cộng hưởng xảy ra khi tần số của ngoại lực cưỡng bức bằng tần số riêng của hệ dao động.',
      difficulty: 'hard',
      lesson: 4
    },
    {
      id: 9,
      type: 'true-false',
      question: 'Dao động tắt dần có chu kì không đổi.',
      correctAnswer: 'true',
      explanation: 'Đúng. Nếu ma sát nhỏ, chu kì dao động tắt dần gần như không đổi so với dao động tự do.',
      difficulty: 'medium',
      lesson: 4
    },
    {
      id: 10,
      type: 'calculation',
      question: 'Một lò xo có k = 100 N/m, khối lượng vật m = 1kg dao động với biên độ A = 0,1m. Cơ năng dao động là bao nhiêu? (J)',
      correctAnswer: 0.5,
      explanation: 'Cơ năng W = ½kA² = ½ × 100 × (0,1)² = 0,5 J',
      difficulty: 'hard',
      lesson: 3
    }
  ]

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
    setCompleted(new Array(exercises.length).fill(false))
    setStartTime(new Date())
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'sepia' : 'light'
    setTheme(newTheme)
    document.documentElement.className = newTheme
    localStorage.setItem('physics-book-theme', newTheme)
  }

  const handleAnswerSelect = (answer: string | number) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (selectedAnswer === '') return

    const exercise = exercises[currentExercise]
    const isCorrect = selectedAnswer === exercise.correctAnswer
    
    if (isCorrect) {
      setScore(score + 1)
    }

    const newCompleted = [...completed]
    newCompleted[currentExercise] = true
    setCompleted(newCompleted)

    setShowResult(true)
  }

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      setShowFinalResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentExercise(0)
    setScore(0)
    setSelectedAnswer('')
    setShowResult(false)
    setShowFinalResult(false)
    setCompleted(new Array(exercises.length).fill(false))
    setStartTime(new Date())
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Xuất sắc! 🏆'
    if (percentage >= 80) return 'Tốt! 👏'
    if (percentage >= 70) return 'Khá! 👍'
    if (percentage >= 60) return 'Trung bình! 📚'
    return 'Cần cố gắng hơn! 💪'
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showFinalResult) {
    const percentage = Math.round((score / exercises.length) * 100)
    const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60) : 0

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Hoàn thành bài luyện tập!
            </h1>
            
            <div className="mb-8">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                {score}/{exercises.length}
              </div>
              <div className={`text-2xl font-semibold mb-2 ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-300">
                {getScoreMessage(percentage)}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {timeTaken}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Phút hoàn thành
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(score / timeTaken * 60) || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Điểm/giờ
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                🔄 Làm lại
              </button>
              
              <button
                onClick={() => router.push('/lessons')}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                📚 Quay lại bài học
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                🏠 Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const exercise = exercises[currentExercise]
  const isCorrect = selectedAnswer === exercise.correctAnswer

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎯</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Luyện tập tổng hợp
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Câu {currentExercise + 1}/{exercises.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Điểm: <span className="font-bold text-blue-600">{score}/{currentExercise + (showResult ? 1 : 0)}</span>
              </div>
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

      {/* Progress Bar */}
      <div className="fixed top-16 w-full h-1 bg-gray-200 dark:bg-gray-700 z-40">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${((currentExercise + (showResult ? 1 : 0)) / exercises.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-3xl mx-auto p-6">
          {/* Exercise Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            {/* Exercise Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                  Bài {exercise.lesson}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  exercise.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : exercise.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}>
                  {exercise.difficulty === 'easy' ? 'Dễ' : exercise.difficulty === 'medium' ? 'TB' : 'Khó'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Câu {currentExercise + 1}/{exercises.length}
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                {exercise.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {exercise.type === 'multiple-choice' && exercise.options && (
                exercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? showResult
                          ? isCorrect
                            ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                            : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300'
                          : 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300'
                        : showResult && index === exercise.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium mr-3">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))
              )}

              {exercise.type === 'true-false' && (
                <>
                  <button
                    onClick={() => handleAnswerSelect('true')}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswer === 'true'
                        ? showResult
                          ? isCorrect
                            ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                            : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300'
                          : 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300'
                        : showResult && exercise.correctAnswer === 'true'
                        ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  >
                    ✅ Đúng
                  </button>
                  <button
                    onClick={() => handleAnswerSelect('false')}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswer === 'false'
                        ? showResult
                          ? isCorrect
                            ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                            : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300'
                          : 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300'
                        : showResult && exercise.correctAnswer === 'false'
                        ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                    }`}
                  >
                    ❌ Sai
                  </button>
                </>
              )}

              {exercise.type === 'calculation' && (
                <div className="space-y-4">
                  <input
                    type="number"
                    value={selectedAnswer}
                    onChange={(e) => handleAnswerSelect(parseFloat(e.target.value) || 0)}
                    disabled={showResult}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập đáp án của bạn..."
                  />
                  {showResult && (
                    <div className={`p-4 rounded-lg ${
                      isCorrect 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      Đáp án đúng: {exercise.correctAnswer}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Result and Explanation */}
            {showResult && (
              <div className={`mb-6 p-4 rounded-lg ${
                isCorrect 
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800'
                  : 'bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-800'
              }`}>
                <div className={`flex items-center mb-2 ${
                  isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  <span className="text-xl mr-2">{isCorrect ? '✅' : '❌'}</span>
                  <span className="font-semibold">
                    {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {exercise.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => router.push('/lessons')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                ← Quay lại
              </button>

              {!showResult ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === ''}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    selectedAnswer === ''
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Kiểm tra
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  {currentExercise < exercises.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành 🎉'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}