'use client'

import { useState } from 'react'

interface Exercise {
  id: number
  title: string
  question: string
  solution: string
  type: 'practice' | 'quiz'
}

interface ExerciseComponentProps {
  exercises: Exercise[]
  onCompleteExercise?: (exerciseId: number) => void
}

interface QuizOption {
  label: string
  value: string
  text: string
}

export default function ExerciseComponent({ exercises, onCompleteExercise }: ExerciseComponentProps) {
  const [visibleSolutions, setVisibleSolutions] = useState<Set<number>>(new Set())
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({})
  const [quizResults, setQuizResults] = useState<{ [key: number]: 'correct' | 'incorrect' | null }>({})

  const toggleSolution = (exerciseId: number) => {
    const newVisible = new Set(visibleSolutions)
    if (newVisible.has(exerciseId)) {
      newVisible.delete(exerciseId)
    } else {
      newVisible.add(exerciseId)
      onCompleteExercise?.(exerciseId)
    }
    setVisibleSolutions(newVisible)
  }

  const handleQuizAnswer = (exerciseId: number, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [exerciseId]: answer }))
  }

  const checkQuizAnswer = (exerciseId: number, correctAnswer: string) => {
    const userAnswer = quizAnswers[exerciseId]
    const isCorrect = userAnswer === correctAnswer
    
    setQuizResults(prev => ({ 
      ...prev, 
      [exerciseId]: isCorrect ? 'correct' : 'incorrect' 
    }))
    
    if (isCorrect) {
      onCompleteExercise?.(exerciseId)
    }
  }

  // Sample quiz questions with predefined answers
  const getQuizOptions = (exerciseId: number): QuizOption[] => {
    switch (exerciseId) {
      case 1:
        return [
          { label: 'A', value: 'a', text: 'Chiều dài dây treo' },
          { label: 'B', value: 'b', text: 'Khối lượng vật nặng' },
          { label: 'C', value: 'c', text: 'Gia tốc trọng trường' },
          { label: 'D', value: 'd', text: 'Vị trí địa lý' }
        ]
      default:
        return []
    }
  }

  const getCorrectAnswer = (exerciseId: number): string => {
    switch (exerciseId) {
      case 1: return 'b' // Khối lượng vật nặng không ảnh hưởng đến chu kì con lắc đơn
      default: return ''
    }
  }

  if (exercises.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <i className="fas fa-tasks text-blue-500"></i>
        Bài tập và Thực hành
      </h3>

      {exercises.map((exercise) => {
        const isQuiz = exercise.type === 'quiz'
        const options = isQuiz ? getQuizOptions(exercise.id) : []
        const correctAnswer = isQuiz ? getCorrectAnswer(exercise.id) : ''
        const userAnswer = quizAnswers[exercise.id]
        const result = quizResults[exercise.id]
        const solutionVisible = visibleSolutions.has(exercise.id)

        return (
          <div key={exercise.id} className="exercise border border-gray-200 dark:border-gray-600 rounded-lg p-6 bg-white dark:bg-gray-800">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold">
                {exercise.id}
              </span>
              {exercise.title}
              {isQuiz && (
                <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs rounded-full">
                  Trắc nghiệm
                </span>
              )}
            </h4>

            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {exercise.question}
              </p>
            </div>

            {isQuiz && options.length > 0 && (
              <div className="mb-4">
                <div className="space-y-2">
                  {options.map((option) => (
                    <label 
                      key={option.value}
                      className={`quiz-options label cursor-pointer flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        userAnswer === option.value 
                          ? result === 'correct' 
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                            : result === 'incorrect'
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${exercise.id}`}
                        value={option.value}
                        checked={userAnswer === option.value}
                        onChange={(e) => handleQuizAnswer(exercise.id, e.target.value)}
                        disabled={result !== null}
                        className="text-blue-600"
                      />
                      <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-[24px]">
                        {option.label}.
                      </span>
                      <span className="flex-1">{option.text}</span>
                      {result && userAnswer === option.value && (
                        <i className={`fas ${result === 'correct' ? 'fa-check text-green-500' : 'fa-times text-red-500'}`}></i>
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-4">
                  {result === null && userAnswer && (
                    <button
                      onClick={() => checkQuizAnswer(exercise.id, correctAnswer)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-check"></i>
                      Kiểm tra đáp án
                    </button>
                  )}

                  {result && (
                    <div className={`quiz-result p-3 rounded-lg ${result === 'correct' ? 'correct' : 'incorrect'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <i className={`fas ${result === 'correct' ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                        <span className="font-semibold">
                          {result === 'correct' ? 'Chính xác!' : 'Chưa đúng!'}
                        </span>
                      </div>
                      {result === 'correct' ? (
                        <p>Tuyệt vời! Bạn đã trả lời đúng.</p>
                      ) : (
                        <p>Đáp án đúng là: <strong>{options.find(opt => opt.value === correctAnswer)?.label}</strong> - {options.find(opt => opt.value === correctAnswer)?.text}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSolution(exercise.id)}
                className={`btn px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  solutionVisible 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <i className={`fas ${solutionVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                {solutionVisible ? 'Ẩn lời giải' : 'Xem lời giải'}
              </button>

              {solutionVisible && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <i className="fas fa-check-circle"></i>
                  Đã hoàn thành
                </span>
              )}
            </div>

            {solutionVisible && (
              <div className="solution mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-t-4 border-green-500">
                <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  <i className="fas fa-lightbulb"></i>
                  Lời giải chi tiết:
                </h5>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: exercise.solution }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}