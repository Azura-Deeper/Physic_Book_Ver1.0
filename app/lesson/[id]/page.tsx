'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MathFormula } from '@/components/Math'
import SlidePresentation, { SlidePresentationRef } from '@/components/SlidePresentation'
import { useProgress } from '@/hooks/useProgress'
import Toast from '@/components/Toast'

interface Slide {
  id: number
  title: string
  content: string
  type: 'intro' | 'concept' | 'formula' | 'example' | 'summary'
  formulas?: string[]
  images?: string[]
  notes?: string
}

interface LessonContent {
  id: number
  title: string
  slides: Slide[]
}

export default function LessonPage() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lessonContent, setLessonContent] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showCompletionToast, setShowCompletionToast] = useState(false)
  const slideRef = useRef<SlidePresentationRef>(null)
  const router = useRouter()
  const params = useParams()
  const lessonId = params?.id as string
  const { updateProgress } = useProgress()

  // Sample lesson data with slide format
  const lessonsData: { [key: string]: LessonContent } = {
    "1": {
      id: 1,
      title: "Mô tả dao động",
      slides: [
        {
          id: 1,
          title: "Khái niệm dao động",
          type: "intro",
          content: `
            <h2>Dao động là gì?</h2>
            <p class="text-xl mb-6">Dao động là chuyển động có tính chất <strong>tuần hoàn theo thời gian</strong>, trong đó vật chuyển động qua lại quanh một vị trí cân bằng.</p>
            
            <div class="grid md:grid-cols-2 gap-6 mt-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 class="font-bold text-blue-800 dark:text-blue-200 mb-2">🎯 Ví dụ thực tế</h3>
                <ul class="space-y-1 text-sm">
                  <li>• Con lắc đồng hồ</li>
                  <li>• Dây đàn guitar rung</li>
                  <li>• Lò xo nén và giãn</li>
                  <li>• Sóng biển lên xuống</li>
                </ul>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 class="font-bold text-green-800 dark:text-green-200 mb-2">⚡ Đặc điểm chính</h3>
                <ul class="space-y-1 text-sm">
                  <li>• Chuyển động lặp lại</li>
                  <li>• Có vị trí cân bằng</li>
                  <li>• Có biên độ giới hạn</li>
                  <li>• Có chu kì nhất định</li>
                </ul>
              </div>
            </div>
          `,
          notes: "Dao động xuất hiện khắp nơi trong tự nhiên và công nghệ"
        },
        {
          id: 2,
          title: "Các đặc điểm của dao động",
          type: "concept",
          content: `
            <h2>Ba đặc điểm quan trọng</h2>
            
            <div class="space-y-6">
              <div class="concept-box">
                <h3 class="text-lg font-bold mb-3">1️⃣ Tính tuần hoàn</h3>
                <p>Chuyển động <strong>lặp lại</strong> sau những khoảng thời gian bằng nhau</p>
                <div class="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  <em>Ví dụ: Kim đồng hồ quay một vòng mỗi 12 giờ</em>
                </div>
              </div>

              <div class="concept-box">
                <h3 class="text-lg font-bold mb-3">2️⃣ Vị trí cân bằng</h3>
                <p>Vị trí mà vật có <strong>xu hướng quay về</strong> khi không có ngoại lực</p>
                <div class="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  <em>Ví dụ: Vị trí thẳng đứng của con lắc</em>
                </div>
              </div>

              <div class="concept-box">
                <h3 class="text-lg font-bold mb-3">3️⃣ Biên độ dao động</h3>
                <p>Độ lệch <strong>cực đại</strong> khỏi vị trí cân bằng</p>
                <div class="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  <em>Ví dụ: Góc lệch lớn nhất của con lắc</em>
                </div>
              </div>
            </div>
          `,
        },
        {
          id: 3,
          title: "Chu kì và Tần số",
          type: "formula",
          content: `
            <h2>Các đại lượng đặc trưng</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="important-note">
                <h3 class="font-bold mb-2">🕐 Chu kì (T)</h3>
                <p><strong>Định nghĩa:</strong> Thời gian để vật thực hiện được một dao động toàn phần</p>
                <p><strong>Đơn vị:</strong> giây (s)</p>
              </div>

              <div class="important-note">
                <h3 class="font-bold mb-2">🔄 Tần số (f)</h3>
                <p><strong>Định nghĩa:</strong> Số dao động toàn phần thực hiện trong một đơn vị thời gian</p>
                <p><strong>Đơn vị:</strong> hertz (Hz)</p>
              </div>
            </div>

            <div class="mt-6 important-note">
              <h3 class="font-bold mb-2">⚡ Tần số góc (ω)</h3>
              <p><strong>Định nghĩa:</strong> Đặc trưng cho tốc độ biến thiên của pha dao động</p>
              <p><strong>Đơn vị:</strong> rad/s</p>
            </div>
          `,
          formulas: [
            "f = \\frac{1}{T}",
            "\\omega = 2\\pi f = \\frac{2\\pi}{T}"
          ],
          notes: "Chu kì và tần số có mối quan hệ nghịch đảo với nhau"
        },
        {
          id: 4,
          title: "Ví dụ thực hành",
          type: "example",
          content: `
            <h2>Bài tập mẫu</h2>
            
            <div class="example-box">
              <h3 class="font-semibold text-green-800 dark:text-green-200 mb-4">
                📝 Ví dụ 1: Tính chu kì và tần số
              </h3>
              
              <div class="space-y-4">
                <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p><strong>Đề bài:</strong> Một vật dao động với tần số f = 2 Hz. Tính chu kì dao động.</p>
                </div>

                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p><strong>Giải:</strong></p>
                  <p>Áp dụng công thức: $T = \\frac{1}{f}$</p>
                  <p>Thay số: $T = \\frac{1}{2} = 0,5$ giây</p>
                </div>

                <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p><strong>Đáp án:</strong> Chu kì dao động T = 0,5s</p>
                </div>
              </div>
            </div>
          `,
          notes: "Luôn nhớ kiểm tra đơn vị trong bài toán"
        },
        {
          id: 5,
          title: "Tổng kết bài học",
          type: "summary",
          content: `
            <h2>🎯 Những điều cần nhớ</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="font-bold text-lg mb-3">✅ Khái niệm chính</h3>
                <ul class="space-y-2">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                    <span>Dao động là chuyển động tuần hoàn</span>
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                    <span>Có vị trí cân bằng và biên độ</span>
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                    <span>Chu kì T và tần số f nghịch đảo</span>
                  </li>
                </ul>
              </div>

              <div class="space-y-4">
                <h3 class="font-bold text-lg mb-3">🔧 Công thức quan trọng</h3>
                <div class="formula-box text-center">
                  <p>$f = \\frac{1}{T}$</p>
                </div>
                <div class="formula-box text-center">
                  <p>$\\omega = 2\\pi f$</p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <h3 class="font-bold mb-2">🚀 Chuẩn bị cho bài tiếp theo</h3>
              <p>Bài 2 sẽ học về <strong>Phương trình dao động điều hòa</strong> - dạng dao động đặc biệt quan trọng!</p>
            </div>
          `
        }
      ]
    },
    "2": {
      id: 2,
      title: "Phương trình dao động điều hoà",
      slides: [
        {
          id: 1,
          title: "Dao động điều hòa là gì?",
          type: "intro",
          content: `
            <h2>🎯 Định nghĩa</h2>
            <p class="text-xl mb-6">Dao động điều hòa là dao động trong đó <strong>li độ của vật</strong> là một hàm <strong>cosin</strong> (hay sin) của thời gian.</p>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
              <h3 class="font-bold mb-4">✨ Đặc điểm nổi bật</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 class="font-semibold text-blue-600 dark:text-blue-400">🔄 Hoàn hảo</h4>
                  <p class="text-sm">Không có ma sát, dao động mãi mãi</p>
                </div>
                <div>
                  <h4 class="font-semibold text-purple-600 dark:text-purple-400">📊 Dự đoán được</h4>
                  <p class="text-sm">Có thể tính toán chính xác vị trí bất kỳ lúc nào</p>
                </div>
                <div>
                  <h4 class="font-semibold text-green-600 dark:text-green-400">⚖️ Cân bằng</h4>
                  <p class="text-sm">Lực phục hồi tỉ lệ với li độ</p>
                </div>
                <div>
                  <h4 class="font-semibold text-red-600 dark:text-red-400">🎵 Hài hòa</h4>
                  <p class="text-sm">Tạo ra âm thanh trong và sạch</p>
                </div>
              </div>
            </div>
          `,
          notes: "Dao động điều hòa là mô hình lý tưởng nhưng rất hữu ích trong thực tế"
        },
        {
          id: 2,
          title: "Phương trình tổng quát",
          type: "formula",
          content: `
            <h2>📐 Phương trình dao động điều hòa</h2>
            
            <div class="formula-box text-center mb-8">
              <h3 class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                Phương trình cơ bản
              </h3>
              <div class="text-3xl">
                $x = A \\cos(\\omega t + \\varphi)$
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="font-bold text-lg">📍 Các đại lượng</h3>
                <div class="space-y-3">
                  <div class="flex items-start space-x-3">
                    <span class="font-bold text-blue-500">x:</span>
                    <span>li độ (m) - vị trí của vật so với VTCB</span>
                  </div>
                  <div class="flex items-start space-x-3">
                    <span class="font-bold text-red-500">A:</span>
                    <span>biên độ dao động (m) - li độ cực đại</span>
                  </div>
                  <div class="flex items-start space-x-3">
                    <span class="font-bold text-green-500">ω:</span>
                    <span>tần số góc (rad/s) - tốc độ dao động</span>
                  </div>
                  <div class="flex items-start space-x-3">
                    <span class="font-bold text-purple-500">φ:</span>
                    <span>pha ban đầu (rad) - trạng thái lúc t=0</span>
                  </div>
                </div>
              </div>

              <div class="important-note">
                <h3 class="font-bold mb-2">🎭 Pha dao động</h3>
                <p class="mb-2"><strong>(ωt + φ)</strong> được gọi là <em>pha dao động</em> tại thời điểm t</p>
                <p class="text-sm">Pha dao động cho biết trạng thái của vật (vị trí và hướng chuyển động)</p>
              </div>
            </div>
          `,
          formulas: [
            "x = A\\cos(\\omega t + \\varphi)"
          ]
        },
        {
          id: 3,
          title: "Vận tốc trong dao động điều hòa",
          type: "formula",
          content: `
            <h2>🚀 Vận tốc - Đạo hàm bậc nhất</h2>
            
            <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold mb-3">💡 Cách tính</h3>
              <p>Vận tốc = Đạo hàm của li độ theo thời gian</p>
              <p class="text-center text-lg mt-3">$v = \\frac{dx}{dt}$</p>
            </div>

            <div class="formula-box text-center mb-6">
              <div class="text-2xl">
                $v = -A\\omega\\sin(\\omega t + \\varphi)$
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="example-box">
                <h3 class="font-bold mb-3">📊 Đặc điểm của vận tốc</h3>
                <ul class="space-y-2 text-sm">
                  <li>• <strong>Biên độ vận tốc:</strong> $v_{max} = A\\omega$</li>
                  <li>• <strong>Sớm pha hơn li độ:</strong> $\\frac{\\pi}{2}$ rad</li>
                  <li>• <strong>Tại VTCB:</strong> $|v| = v_{max}$</li>
                  <li>• <strong>Tại biên:</strong> $v = 0$</li>
                </ul>
              </div>

              <div class="important-note">
                <h3 class="font-bold mb-3">🎯 Ý nghĩa vật lý</h3>
                <p class="text-sm mb-2">Vận tốc cho biết:</p>
                <ul class="space-y-1 text-sm">
                  <li>• Tốc độ di chuyển của vật</li>
                  <li>• Hướng chuyển động (+ hay -)</li>
                  <li>• Đạt cực đại tại vị trí cân bằng</li>
                  <li>• Bằng 0 tại vị trí biên</li>
                </ul>
              </div>
            </div>
          `,
          formulas: [
            "v = \\frac{dx}{dt} = -A\\omega\\sin(\\omega t + \\varphi)",
            "v_{max} = A\\omega"
          ]
        },
        {
          id: 4,
          title: "Gia tốc trong dao động điều hòa",
          type: "formula",
          content: `
            <h2>⚡ Gia tốc - Đạo hàm bậc hai</h2>
            
            <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold mb-3">💡 Cách tính</h3>
              <p>Gia tốc = Đạo hàm của vận tốc theo thời gian</p>
              <p class="text-center text-lg mt-3">$a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2}$</p>
            </div>

            <div class="formula-box text-center mb-6">
              <div class="text-2xl">
                $a = -A\\omega^2\\cos(\\omega t + \\varphi) = -\\omega^2 x$
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="concept-box">
                <h3 class="font-bold mb-3">🔗 Mối quan hệ quan trọng</h3>
                <div class="formula-box text-center mb-3">
                  <p>$a = -\\omega^2 x$</p>
                </div>
                <p class="text-sm">Gia tốc <strong>tỉ lệ nghịch</strong> với li độ và luôn hướng về VTCB</p>
              </div>

              <div class="example-box">
                <h3 class="font-bold mb-3">📊 Đặc điểm của gia tốc</h3>
                <ul class="space-y-2 text-sm">
                  <li>• <strong>Biên độ gia tốc:</strong> $a_{max} = A\\omega^2$</li>
                  <li>• <strong>Ngược pha với li độ</strong></li>
                  <li>• <strong>Tại VTCB:</strong> $a = 0$</li>
                  <li>• <strong>Tại biên:</strong> $|a| = a_{max}$</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 important-note">
              <h3 class="font-bold mb-2">⚖️ Lực phục hồi</h3>
              <p>Theo định luật II Newton: $F = ma = -m\\omega^2 x = -kx$</p>
              <p class="text-sm mt-2">Với $k = m\\omega^2$ là hệ số đàn hồi</p>
            </div>
          `,
          formulas: [
            "a = \\frac{dv}{dt} = -A\\omega^2\\cos(\\omega t + \\varphi)",
            "a = -\\omega^2 x",
            "F = ma = -kx \\text{ (Lực phục hồi)}"
          ]
        },
        {
          id: 5,
          title: "Tổng kết các công thức",
          type: "summary",
          content: `
            <h2>📋 Bảng tổng kết dao động điều hòa</h2>
            
            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div class="formula-box text-center">
                <h3 class="font-bold text-blue-600 dark:text-blue-400 mb-2">Li độ</h3>
                <p class="text-lg">$x = A\\cos(\\omega t + \\varphi)$</p>
              </div>
              <div class="formula-box text-center">
                <h3 class="font-bold text-green-600 dark:text-green-400 mb-2">Vận tốc</h3>
                <p class="text-lg">$v = -A\\omega\\sin(\\omega t + \\varphi)$</p>
              </div>
              <div class="formula-box text-center">
                <h3 class="font-bold text-red-600 dark:text-red-400 mb-2">Gia tốc</h3>
                <p class="text-lg">$a = -A\\omega^2\\cos(\\omega t + \\varphi)$</p>
              </div>
            </div>

            <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
              <h3 class="font-bold mb-4">🎯 Mối quan hệ pha</h3>
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>• <strong>v sớm pha hơn x:</strong> $\\frac{\\pi}{2}$</p>
                  <p>• <strong>a sớm pha hơn v:</strong> $\\frac{\\pi}{2}$</p>
                </div>
                <div>
                  <p>• <strong>a ngược pha với x:</strong> $\\pi$</p>
                  <p>• <strong>a sớm pha hơn x:</strong> $\\pi$</p>
                </div>
              </div>
            </div>

            <div class="mt-6 example-box">
              <h3 class="font-bold mb-3">🚀 Chuẩn bị bài tiếp theo</h3>
              <p>Bài 3: <strong>Năng lượng trong dao động điều hòa</strong></p>
              <p class="text-sm">Sẽ học về động năng, thế năng và định luật bảo toàn cơ năng!</p>
            </div>
          `
        }
      ]
    },
    "3": {
      id: 3,
      title: "Năng lượng trong dao động điều hoà",
      slides: [
        {
          id: 1,
          title: "Năng lượng trong dao động",
          type: "intro",
          content: `
            <h2>🔋 Năng lượng là gì?</h2>
            <p class="text-xl mb-6">Trong dao động điều hòa, năng lượng liên tục <strong>chuyển đổi</strong> giữa hai dạng: <strong>động năng</strong> và <strong>thế năng</strong>.</p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-green-600 dark:text-green-400 mb-3">⚡ Động năng (Wđ)</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Năng lượng do chuyển động</li>
                  <li>• Cực đại tại vị trí cân bằng</li>
                  <li>• Bằng 0 tại vị trí biên</li>
                  <li>• Phụ thuộc vào vận tốc</li>
                </ul>
              </div>
              
              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-blue-600 dark:text-blue-400 mb-3">🏔️ Thế năng (Wt)</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Năng lượng dự trữ do biến dạng</li>
                  <li>• Cực đại tại vị trí biên</li>
                  <li>• Bằng 0 tại vị trí cân bằng</li>
                  <li>• Phụ thuộc vào li độ</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 important-note">
              <h3 class="font-bold mb-2">🔄 Sự chuyển hóa năng lượng</h3>
              <p>Động năng ⇄ Thế năng liên tục, nhưng tổng năng lượng không đổi!</p>
            </div>
          `
        },
        {
          id: 2,
          title: "Công thức tính năng lượng",
          type: "formula",
          content: `
            <h2>⚡ Các công thức năng lượng</h2>
            
            <div class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="formula-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 class="font-bold text-green-600 dark:text-green-400 mb-3">Động năng</h3>
                  <p class="text-sm">Năng lượng do chuyển động của vật</p>
                </div>
                
                <div class="formula-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 class="font-bold text-blue-600 dark:text-blue-400 mb-3">Thế năng</h3>
                  <p class="text-sm">Năng lượng dự trữ trong hệ dao động</p>
                </div>
              </div>
              
              <div class="formula-card bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 class="font-bold text-purple-600 dark:text-purple-400 mb-3">Cơ năng toàn phần</h3>
                <p class="text-sm">Tổng động năng và thế năng - không đổi theo thời gian</p>
              </div>
            </div>
          `,
          formulas: [
            "W_d = \\frac{1}{2}mv^2 = \\frac{1}{2}mA^2\\omega^2\\sin^2(\\omega t + \\varphi)",
            "W_t = \\frac{1}{2}kx^2 = \\frac{1}{2}mA^2\\omega^2\\cos^2(\\omega t + \\varphi)",
            "W = W_d + W_t = \\frac{1}{2}mA^2\\omega^2 = \\text{const}"
          ]
        }
      ]
    },
    "4": {
      id: 4,
      title: "Dao động tắt dần và hiện tượng cộng hưởng",
      slides: [
        {
          id: 1,
          title: "Dao động tắt dần",
          type: "intro",
          content: `
            <h2>� Dao động tắt dần là gì?</h2>
            <p class="text-xl mb-6">Dao động tắt dần là dao động có <strong>biên độ giảm dần</strong> theo thời gian do tác dụng của <strong>lực cản</strong> (ma sát, sức cản không khí...).</p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-red-600 dark:text-red-400 mb-3">⚠️ Đặc điểm</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Biên độ giảm dần theo thời gian</li>
                  <li>• Chu kì gần như không đổi nếu ma sát nhỏ</li>
                  <li>• Cơ năng giảm dần và chuyển thành nhiệt năng</li>
                  <li>• Cuối cùng vật dừng lại ở vị trí cân bằng</li>
                </ul>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-orange-600 dark:text-orange-400 mb-3">� Ví dụ thực tế</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Con lắc đồng hồ không lên cót</li>
                  <li>• Xe ô tô có giảm xóc</li>
                  <li>• Cầu dao động trong gió</li>
                  <li>• Dây đàn sau khi gảy</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          id: 2,
          title: "Hiện tượng cộng hưởng",
          type: "concept",
          content: `
            <h2>🎵 Cộng hưởng là gì?</h2>
            <p class="text-xl mb-6">Cộng hưởng xảy ra khi <strong>tần số của lực cưỡng bức</strong> bằng <strong>tần số riêng</strong> của hệ dao động.</p>
            
            <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold mb-4">✨ Điều kiện cộng hưởng</h3>
              <p class="text-lg font-semibold text-center">f<sub>cưỡng bức</sub> = f<sub>riêng</sub></p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="font-bold text-lg">🚀 Khi có cộng hưởng</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Biên độ dao động cực đại</li>
                  <li>• Năng lượng truyền hiệu quả nhất</li>
                  <li>• Có thể gây nguy hiểm nếu không kiểm soát</li>
                </ul>
              </div>
              
              <div class="space-y-4">
                <h3 class="font-bold text-lg">⚠️ Ứng dụng & Tác hại</h3>
                <div class="space-y-3">
                  <div>
                    <h4 class="font-semibold text-green-600 dark:text-green-400">✅ Có lợi:</h4>
                    <p class="text-sm">Đàn piano, radio, lò vi sóng...</p>
                  </div>
                  <div>
                    <h4 class="font-semibold text-red-600 dark:text-red-400">❌ Có hại:</h4>
                    <p class="text-sm">Cầu sập, động đất, máy móc rung...</p>
                  </div>
                </div>
              </div>
            </div>
          `
        }
      ]
    }

  }

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme

    // Load lesson content
    if (lessonId && lessonsData[lessonId]) {
      setLessonContent(lessonsData[lessonId])
    }
    setLoading(false)
  }, [lessonId])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Chỉ hiện sidebar khi chuột ở rất gần edge trái (trong vòng 5px)
      const threshold = 5
      if (e.clientX <= threshold) {
        setShowSidebar(true)
      } else if (e.clientX > 320) { // Hide when mouse moves away from sidebar area
        setShowSidebar(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Re-render MathJax when content changes
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.()
    }
  }, [lessonContent])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'sepia' : 'light'
    setTheme(newTheme)
    document.documentElement.className = newTheme
    localStorage.setItem('physics-book-theme', newTheme)
  }

  const handleBackToLessons = () => {
    router.push('/lessons')
  }

  const handleNextLesson = () => {
    const currentId = parseInt(lessonId)
    if (currentId < 4) {
      router.push(`/lesson/${currentId + 1}`)
    } else {
      router.push('/practice')
    }
  }

  const handlePrevLesson = () => {
    const currentId = parseInt(lessonId)
    if (currentId > 1) {
      router.push(`/lesson/${currentId - 1}`)
    }
  }

  const handleSlideChange = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  const handleLessonComplete = () => {
    // Show completion toast and navigate back to lessons
    setShowCompletionToast(true)
    setTimeout(() => {
      router.push('/lessons')
    }, 2000)
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

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lessonContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bài học không tồn tại
          </h1>
          <button
            onClick={handleBackToLessons}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Quay lại danh sách bài học
          </button>
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
                    Bài {lessonId}: {lessonContent.title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chương 1: Dao động</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '🌅'}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar with precise edge detection */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40">
        {/* Edge indicator - chỉ hiện khi cần */}
        {showSidebar && !sidebarOpen && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-20 bg-blue-500/50 rounded-r-full transition-all duration-200"></div>
        )}
        
        {/* Actual sidebar */}
        <div className={`h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 shadow-xl ${
          sidebarOpen || showSidebar ? 'translate-x-0' : '-translate-x-72'
        }`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Slides bài học
            </h2>
            <div className="space-y-2 text-sm">
              {lessonContent?.slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    slideRef.current?.goToSlide(index)
                    setCurrentSlide(index)
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentSlide
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">{getSlideTypeIcon(slide.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{slide.title}</div>
                      <div className="text-xs opacity-75 capitalize">{slide.type}</div>
                    </div>
                    <span className="text-xs opacity-60">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Quick navigation */}
            <div className="mt-8 space-y-2">
              <button
                onClick={() => router.push('/lessons')}
                className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors text-sm"
              >
                📚 Danh sách bài học
              </button>
              <button
                onClick={() => router.push('/practice')}
                className="w-full p-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg font-medium transition-colors text-sm"
              >
                🎯 Luyện tập
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="transition-all duration-300 pt-16 ml-0">
        <div className="max-w-4xl mx-auto p-6">
          {/* Navigation breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Trang chủ
            </button>
            <span>›</span>
            <button 
              onClick={handleBackToLessons}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Danh sách bài học
            </button>
            <span>›</span>
            <span className="text-blue-600 dark:text-blue-400">
              Bài {lessonId}
            </span>
          </div>

          {/* Slide Presentation */}
          <div className="h-[calc(100vh-8rem)]">
            <SlidePresentation 
              ref={slideRef}
              slides={lessonContent.slides} 
              lessonTitle={`Bài ${lessonContent.id}: ${lessonContent.title}`}
              lessonId={parseInt(lessonId)}
              onSlideChange={handleSlideChange}
              onLessonComplete={handleLessonComplete}
            />
          </div>

          {/* Navigation buttons */}
          <div id="navigation-buttons" className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevLesson}
              disabled={parseInt(lessonId) <= 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                parseInt(lessonId) <= 1
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Bài trước
            </button>

            <button
              onClick={handleBackToLessons}
              className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors"
            >
              📚 Danh sách bài học
            </button>

            <button
              onClick={handleNextLesson}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {parseInt(lessonId) >= 4 ? '🎯 Luyện tập' : 'Bài tiếp theo'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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

      {/* Completion Toast */}
      <Toast
        message={`Chúc mừng! Bạn đã hoàn thành bài ${lessonId}: ${lessonContent?.title}`}
        type="success"
        isVisible={showCompletionToast}
        onClose={() => setShowCompletionToast(false)}
        duration={2000}
      />
    </div>
  )
}