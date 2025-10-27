'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MathFormula } from '@/components/Math'
import SlidePresentation, { SlidePresentationRef } from '@/components/SlidePresentation'
import { useProgress } from '@/hooks/useProgress'
import Toast from '@/components/Toast'
import OscillationSimulation from '@/components/OscillationSimulation'

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
            
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold mb-3 text-lg">I. Định nghĩa</h3>
              <p class="text-base leading-relaxed">
                Dao động cơ học là chuyển động có giới hạn trong không gian, lặp lại nhiều lần quanh một vị trí cân bằng.
              </p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mt-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 class="font-bold text-blue-800 dark:text-blue-200 mb-2">Ví dụ thực tế</h3>
                <ul class="space-y-1 text-sm">
                  <li>• Con lắc đồng hồ quả lắc</li>
                  <li>• Dây đàn guitar sau khi gảy</li>
                  <li>• Màng loa khi phát ra âm thanh</li>
                  <li>• Cánh hoa trong gió nhẹ</li>
                  <li>• Dao động của phân tử trong chất rắn</li>
                </ul>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 class="font-bold text-green-800 dark:text-green-200 mb-2">Đặc điểm cơ bản</h3>
                <ul class="space-y-1 text-sm">
                  <li>• Chuyển động lặp lại theo thời gian</li>
                  <li>• Có vị trí cân bằng ổn định</li>
                  <li>• Có biên độ dao động xác định</li>
                  <li>• Có chu kì và tần số đặc trưng</li>
                  <li>• Có lực phục hồi hướng về VTCB</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
              <h4 class="font-semibold text-amber-800 dark:text-amber-200 mb-2">Chú ý:</h4>
              <p class="text-sm">Dao động khác với chuyển động tròn đều ở chỗ: dao động có giới hạn trong không gian và có sự đổi chiều chuyển động.</p>
            </div>

            <div class="mt-8">
              <h3 class="font-bold text-lg mb-4 text-center">Mô phỏng dao động điều hòa</h3>
              <div id="simulation-simple"></div>
            </div>
          `,
          notes: "Dao động xuất hiện khắp nơi trong tự nhiên và công nghệ"
        },
        {
          id: 2,
          title: "Phân loại dao động",
          type: "concept",
          content: `
            <h2>II. Các loại dao động cơ bản</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div class="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 class="font-bold text-blue-800 dark:text-blue-200 mb-2">1. Dao động tự do</h3>
                <p class="text-sm mb-3 font-medium">Dao động chỉ chịu tác dụng của nội lực</p>
                <div class="text-xs space-y-1">
                  <p>• Tần số riêng của hệ (f₀ = const)</p>
                  <p>• Không có ngoại lực tác động</p>
                  <p>• Biên độ phụ thuộc điều kiện ban đầu</p>
                  <p>• VD: Con lắc trong chân không</p>
                </div>
              </div>
              
              <div class="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-500">
                <h3 class="font-bold text-green-800 dark:text-green-200 mb-2">2. Dao động cưỡng bức</h3>
                <p class="text-sm mb-3 font-medium">Dao động dưới tác dụng của ngoại lực tuần hoàn</p>
                <div class="text-xs space-y-1">
                  <p>• Tần số bằng tần số ngoại lực (f = f_ngoai)</p>
                  <p>• Có ngoại lực tuần hoàn tác động</p>
                  <p>• Biên độ phụ thuộc cường độ ngoại lực</p>
                  <p>• VD: Loa phát âm, động cơ rung</p>
                </div>
              </div>
              
              <div class="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-500">
                <h3 class="font-bold text-purple-800 dark:text-purple-200 mb-2">3. Dao động tắt dần</h3>
                <p class="text-sm mb-3 font-medium">Dao động có ma sát, biên độ giảm dần</p>
                <div class="text-xs space-y-1">
                  <p>• Có lực cản (ma sát, không khí)</p>
                  <p>• Biên độ giảm theo hàm mũ</p>
                  <p>• Năng lượng chuyển thành nhiệt</p>
                  <p>• VD: Con lắc trong không khí</p>
                </div>
              </div>
            </div>

            <div class="mt-8 bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
              <h3 class="font-bold mb-4 text-lg">Bảng 1: So sánh các loại dao động</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-700">
                      <th class="border dark:border-gray-600 text-left py-3 px-3 font-bold">Loại dao động</th>
                      <th class="border dark:border-gray-600 text-left py-3 px-3 font-bold">Ngoại lực</th>
                      <th class="border dark:border-gray-600 text-left py-3 px-3 font-bold">Tần số</th>
                      <th class="border dark:border-gray-600 text-left py-3 px-3 font-bold">Biên độ</th>
                    </tr>
                  </thead>
                  <tbody class="text-sm">
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="border dark:border-gray-600 py-2 px-3 font-medium">Tự do</td>
                      <td class="border dark:border-gray-600 py-2 px-3">Không có</td>
                      <td class="border dark:border-gray-600 py-2 px-3">f₀ (tần số riêng)</td>
                      <td class="border dark:border-gray-600 py-2 px-3">Không đổi</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="border dark:border-gray-600 py-2 px-3 font-medium">Cưỡng bức</td>
                      <td class="border dark:border-gray-600 py-2 px-3">F = F₀cos(ωt)</td>
                      <td class="border dark:border-gray-600 py-2 px-3">f = f_ngoại lực</td>
                      <td class="border dark:border-gray-600 py-2 px-3">Phụ thuộc F₀</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="border dark:border-gray-600 py-2 px-3 font-medium">Tắt dần</td>
                      <td class="border dark:border-gray-600 py-2 px-3">Lực cản F_c = -bv</td>
                      <td class="border dark:border-gray-600 py-2 px-3">f < f₀</td>
                      <td class="border dark:border-gray-600 py-2 px-3">A(t) = A₀e^(-δt)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="font-bold text-lg mb-4 text-center">Mô phỏng con lắc lò xo</h3>
              <div id="simulation-spring"></div>
              <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                Mô phỏng dao động tự do của con lắc lò xo
              </p>
            </div>

            <div class="mt-8">
              <h3 class="font-bold text-lg mb-4 text-center">Mô phỏng con lắc đơn</h3>
              <div id="simulation-pendulum"></div>
              <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                Mô phỏng dao động của con lắc đơn với góc lệch nhỏ
              </p>
            </div>
          `,
          notes: "Mỗi loại dao động có đặc điểm và ứng dụng riêng trong thực tế"
        },
        {
          id: 3,
          title: "Các đại lượng đặc trưng của dao động",
          type: "formula",
          content: `
            <h2>III. Các đại lượng đặc trưng</h2>
            
            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700">
                <h3 class="font-bold mb-3 text-blue-800 dark:text-blue-200 text-lg">1. Chu kì (T)</h3>
                <p class="mb-2"><strong>Định nghĩa:</strong> Thời gian để vật thực hiện được một dao động toàn phần</p>
                <p class="mb-2"><strong>Đơn vị:</strong> giây (s)</p>
                <div class="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg mt-3">
                  <p class="text-sm"><strong>Ví dụ:</strong> Con lắc đồng hồ có T = 2s</p>
                </div>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-700">
                <h3 class="font-bold mb-3 text-green-800 dark:text-green-200 text-lg">2. Tần số (f)</h3>
                <p class="mb-2"><strong>Định nghĩa:</strong> Số dao động toàn phần thực hiện trong một đơn vị thời gian</p>
                <p class="mb-2"><strong>Đơn vị:</strong> hertz (Hz)</p>
                <div class="bg-green-100 dark:bg-green-800/30 p-3 rounded-lg mt-3">
                  <p class="text-sm"><strong>Ví dụ:</strong> Dây đàn guitar f = 440 Hz (nốt La)</p>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-700 mb-6">
              <h3 class="font-bold mb-3 text-purple-800 dark:text-purple-200 text-lg">3. Tần số góc (ω)</h3>
              <p class="mb-2"><strong>Định nghĩa:</strong> Đặc trưng cho tốc độ biến thiên của pha dao động</p>
              <p class="mb-2"><strong>Đơn vị:</strong> rad/s (radian trên giây)</p>
              <div class="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-lg mt-3">
                <p class="text-sm"><strong>Ý nghĩa:</strong> Góc mà véc tơ quay được trong 1 giây</p>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 class="font-bold mb-4 text-amber-800 dark:text-amber-200 text-lg">Mối liên hệ giữa các đại lượng</h3>
              <div class="grid md:grid-cols-3 gap-4 text-center">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <p class="font-mono text-lg mb-2">f = 1/T</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Tần số nghịch đảo chu kì</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <p class="font-mono text-lg mb-2">ω = 2πf</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Tần số góc tỉ lệ tần số</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <p class="font-mono text-lg mb-2">ω = 2π/T</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Tần số góc nghịch đảo chu kì</p>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400">
              <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">Chú ý:</h4>
              <ul class="text-sm space-y-1">
                <li>• Chu kì T và tần số f là nghịch đảo của nhau</li>
                <li>• Tần số góc ω luôn lớn hơn tần số f (vì 2π ≈ 6.28)</li>
                <li>• Đơn vị phải nhất quán trong tính toán</li>
              </ul>
            </div>
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
                Ví dụ 1: Tính chu kì và tần số
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
            <h2>Tổng kết</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="font-bold text-lg mb-3">Nội dung chính</h3>
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
                <h3 class="font-bold text-lg mb-3">Công thức cần nhớ</h3>
                <div class="formula-box text-center">
                  <p>$f = \\frac{1}{T}$</p>
                </div>
                <div class="formula-box text-center">
                  <p>$\\omega = 2\\pi f$</p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <h3 class="font-bold mb-2">Bài tiếp theo</h3>
              <p>Bài 2 sẽ học về <strong>Phương trình dao động điều hòa</strong> - dạng dao động đặc biệt quan trọng!</p>
            </div>
          `,
          notes: "Bài học tổng quan về dao động cơ học"
        },
        {
          id: 6,
          title: "Các thông số dao động",
          type: "concept",
          content: `
            <h2>IV. Thông số cơ bản của dao động</h2>
            
            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700">
                <h3 class="font-bold mb-3 text-blue-800 dark:text-blue-200 text-lg">1. Biên độ dao động (A)</h3>
                <p class="mb-2"><strong>Định nghĩa:</strong> Độ lệch cực đại của vật khỏi vị trí cân bằng</p>
                <p class="mb-2"><strong>Đơn vị:</strong> mét (m), cm, mm</p>
                <div class="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg mt-3">
                  <p class="text-sm"><strong>Đặc điểm:</strong> Luôn có giá trị dương (A > 0)</p>
                </div>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-700">
                <h3 class="font-bold mb-3 text-green-800 dark:text-green-200 text-lg">2. Li độ (x)</h3>
                <p class="mb-2"><strong>Định nghĩa:</strong> Tọa độ của vật tại thời điểm t so với vị trí cân bằng</p>
                <p class="mb-2"><strong>Đơn vị:</strong> mét (m), cm, mm</p>
                <div class="bg-green-100 dark:bg-green-800/30 p-3 rounded-lg mt-3">
                  <p class="text-sm"><strong>Đặc điểm:</strong> Có thể âm, dương hoặc bằng 0</p>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-700">
                <h3 class="font-bold mb-3 text-purple-800 dark:text-purple-200 text-lg">3. Pha dao động (φ)</h3>
                <p class="mb-2"><strong>Định nghĩa:</strong> Đại lượng xác định trạng thái dao động tại thời điểm t</p>
                <p class="mb-2"><strong>Đơn vị:</strong> radian (rad) hoặc độ (°)</p>
                <div class="bg-purple-100 dark:bg-purple-800/30 p-3 rounded-lg mt-3">
                  <p class="text-sm"><strong>Công thức:</strong> φ = ωt + φ₀</p>
                </div>
              </div>

              <div class="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl border border-orange-200 dark:border-orange-700">
                <h3 class="font-bold mb-3 text-orange-800 dark:text-orange-200 text-lg">4. Pha ban đầu (φ₀)</h3>
                <p class="mb-2"><strong>Định nghĩa:</strong> Pha dao động tại thời điểm t = 0</p>
                <p class="mb-2"><strong>Đơn vị:</strong> radian (rad) hoặc độ (°)</p>
                <div class="bg-orange-100 dark:bg-orange-800/30 p-3 rounded-lg mt-3">
                  <p class="text-sm"><strong>Phụ thuộc:</strong> Điều kiện ban đầu của hệ</p>
                </div>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 class="font-bold mb-4 text-amber-800 dark:text-amber-200 text-lg">Mối quan hệ giữa các thông số</h3>
              <div class="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p class="text-lg font-mono mb-2">-A ≤ x ≤ +A</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Li độ luôn nằm trong khoảng từ -A đến +A</p>
              </div>
            </div>
          `,
          notes: "Các thông số này xác định hoàn toàn trạng thái dao động"
        },
        {
          id: 7,
          title: "Ứng dụng thực tế của dao động",
          type: "example",
          content: `
            <h2>V. Ứng dụng của dao động trong thực tế</h2>
            
            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 p-5 rounded-xl">
                <h3 class="font-bold mb-3 text-blue-800 dark:text-blue-200">1. Âm nhạc & Âm thanh</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Dây đàn guitar, piano</li>
                  <li>• Màng loa, tai nghe</li>
                  <li>• Dây thanh âm con người</li>
                  <li>• Ống sáo, kèn trumpet</li>
                </ul>
                <div class="mt-3 p-2 bg-blue-200 dark:bg-blue-700/50 rounded text-xs">
                  <strong>Tần số âm thanh:</strong> 20 Hz - 20.000 Hz
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 p-5 rounded-xl">
                <h3 class="font-bold mb-3 text-green-800 dark:text-green-200">2. Xây dựng & Kiến trúc</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Cách ly chấn động tòa nhà</li>
                  <li>• Giảm chấn cầu treo</li>
                  <li>• Hệ thống chống động đất</li>
                  <li>• Thiết kế chống gió lớn</li>
                </ul>
                <div class="mt-3 p-2 bg-green-200 dark:bg-green-700/50 rounded text-xs">
                  <strong>Tần số tự nhiên tòa nhà:</strong> 0.1 - 10 Hz
                </div>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 p-5 rounded-xl">
                <h3 class="font-bold mb-3 text-purple-800 dark:text-purple-200">3. Giao thông vận tải</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Hệ thống giảm chấn ô tô</li>
                  <li>• Cân bằng bánh xe</li>
                  <li>• Chống rung động cơ</li>
                  <li>• Hệ thống treo tàu hỏa</li>
                </ul>
                <div class="mt-3 p-2 bg-purple-200 dark:bg-purple-700/50 rounded text-xs">
                  <strong>Tần số dao động ô tô:</strong> 1 - 20 Hz
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-700">
                <h3 class="font-bold mb-3 text-red-800 dark:text-red-200">4. Y tế & Sức khỏe</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Máy siêu âm chẩn đoán (1-10 MHz)</li>
                  <li>• Máy rung massage trị liệu</li>
                  <li>• Dao động tim (ECG): 0.5-100 Hz</li>
                  <li>• Sóng não (EEG): 0.5-50 Hz</li>
                </ul>
              </div>

              <div class="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-200 dark:border-indigo-700">
                <h3 class="font-bold mb-3 text-indigo-800 dark:text-indigo-200">5. Công nghệ điện tử</h3>
                <ul class="space-y-2 text-sm">
                  <li>• Thạch anh đồng hồ: 32.768 Hz</li>
                  <li>• Vi xử lý máy tính: GHz</li>
                  <li>• Sóng radio: kHz - MHz</li>
                  <li>• Cảm biến rung động</li>
                </ul>
              </div>
            </div>

            <div class="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-5 rounded-xl">
              <h3 class="font-bold mb-3 text-cyan-800 dark:text-cyan-200">Ví dụ tính toán thực tế</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p class="mb-2"><strong>Bài toán:</strong> Dây đàn guitar có tần số 440 Hz (nốt La). Tính chu kì dao động?</p>
                <p class="mb-2"><strong>Giải:</strong> T = 1/f = 1/440 ≈ 0.0023 s = 2.3 ms</p>
                <p class="text-sm text-gray-600 dark:text-gray-400"><strong>Ý nghĩa:</strong> Dây đàn hoàn thành 1 dao động trong 2.3 mili giây!</p>
              </div>
            </div>
          `,
          notes: "Dao động có mặt ở khắp mọi nơi trong cuộc sống"
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
            <h2>🎯 Dao động điều hòa - Chuyển động hoàn hảo</h2>
            <p class="text-xl mb-6">Dao động điều hòa là dao động trong đó <strong>li độ của vật</strong> biến thiên theo quy luật hàm <strong>cosin</strong> (hoặc sin) theo thời gian.</p>
            
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold mb-3 text-lg">🔍 Định nghĩa chính xác</h3>
              <p class="text-base leading-relaxed">
                Dao động điều hòa là dao động mà li độ x của vật là hàm cosin hoặc sin của thời gian:
              </p>
              <div class="text-center bg-white dark:bg-gray-800 p-4 rounded-lg mt-3">
                <p class="text-xl font-mono"><strong>x = A cos(ωt + φ₀)</strong></p>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold mb-4 text-lg">✨ Đặc điểm quan trọng</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔄 Tính tuần hoàn</h4>
                  <p class="text-sm">Lặp lại sau mỗi chu kì T = 2π/ω</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">📊 Dự đoán được</h4>
                  <p class="text-sm">Tính chính xác vị trí tại mọi thời điểm</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">⚖️ Lực phục hồi</h4>
                  <p class="text-sm">F = -kx (tỉ lệ thuận với li độ)</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">🎵 Âm thanh thuần</h4>
                  <p class="text-sm">Tạo ra tần số đơn âm chuẩn</p>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-400">
                <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Ví dụ thực tế</h4>
                <ul class="text-sm space-y-1">
                  <li>• Con lắc lò xo (biên độ nhỏ)</li>
                  <li>• Con lắc đơn (góc lệch nhỏ)</li>
                  <li>• Dây đàn guitar rung động</li>
                  <li>• Mạch LC trong điện học</li>
                </ul>
              </div>
              
              <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
                <h4 class="font-semibold text-amber-800 dark:text-amber-200 mb-2">⚠️ Điều kiện</h4>
                <ul class="text-sm space-y-1">
                  <li>• Không có ma sát</li>
                  <li>• Biên độ dao động nhỏ</li>
                  <li>• Lực phục hồi tỉ lệ li độ</li>
                  <li>• Môi trường không đổi</li>
                </ul>
              </div>
            </div>
          `,
          notes: "Dao động điều hòa là mô hình cơ bản để hiểu mọi loại dao động khác"
        },
        {
          id: 2,
          title: "Phương trình li độ dao động điều hòa",
          type: "formula",
          content: `
            <h2>📐 Phương trình dao động điều hòa</h2>
            
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-8">
              <h3 class="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4 text-center">
                🎯 Phương trình cơ bản
              </h3>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
                <div class="text-3xl mb-4 font-mono text-blue-600 dark:text-blue-400">
                  <strong>x = A cos(ωt + φ₀)</strong>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Phương trình li độ theo thời gian</p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">📍 Ý nghĩa các đại lượng</h3>
                <div class="space-y-4">
                  <div class="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="font-bold text-blue-500 text-lg">x:</span>
                    <div>
                      <p class="font-medium">Li độ</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Tọa độ của vật tại thời điểm t (m)</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="font-bold text-red-500 text-lg">A:</span>
                    <div>
                      <p class="font-medium">Biên độ dao động</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Li độ cực đại, A > 0 (m)</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="font-bold text-green-500 text-lg">ω:</span>
                    <div>
                      <p class="font-medium">Tần số góc</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">ω = 2π/T = 2πf (rad/s)</p>
                    </div>
                  </div>
                  <div class="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span class="font-bold text-purple-500 text-lg">φ₀:</span>
                    <div>
                      <p class="font-medium">Pha ban đầu</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Pha tại t = 0 (rad)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-green-800 dark:text-green-200">📊 Đặc điểm quan trọng</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-2">🔄 Miền giá trị</h4>
                    <p class="text-sm">-A ≤ x ≤ +A</p>
                    <p class="text-xs text-gray-500">Li độ luôn nằm trong khoảng [-A, A]</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-2">⏰ Chu kì</h4>
                    <p class="text-sm">T = 2π/ω</p>
                    <p class="text-xs text-gray-500">x(t + T) = x(t) với mọi t</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-2">📈 Pha dao động</h4>
                    <p class="text-sm">φ = ωt + φ₀</p>
                    <p class="text-xs text-gray-500">Xác định trạng thái tại thời điểm t</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-2">🎛️ Điều kiện ban đầu</h4>
                    <p class="text-sm">Tại t = 0: x₀ = A cos(φ₀)</p>
                    <p class="text-xs text-gray-500">φ₀ phụ thuộc vào x₀ và v₀</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 class="font-bold mb-3 text-amber-800 dark:text-amber-200">💡 Dạng khác của phương trình</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <p class="font-mono text-lg mb-2">x = A sin(ωt + φ₀')</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">với φ₀' = φ₀ + π/2</p>
                </div>
                <div class="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <p class="font-mono text-lg mb-2">x = a cos(ωt) + b sin(ωt)</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">với A = √(a² + b²)</p>
                </div>
              </div>
            </div>
          `,
          formulas: [
            "x = A\\cos(\\omega t + \\varphi_0)"
          ],
          notes: "Phương trình li độ là cơ sở để xây dựng các phương trình khác"
        },
        {
          id: 3,
          title: "Phương trình vận tốc dao động điều hòa",
          type: "formula",
          content: `
            <h2>🚀 Phương trình vận tốc</h2>
            
            <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-8">
              <h3 class="text-xl font-bold text-green-700 dark:text-green-300 mb-4 text-center">
                ⚡ Vận tốc tức thời
              </h3>
              <div class="text-center">
                <p class="text-lg mb-3">Vận tốc là đạo hàm của li độ theo thời gian:</p>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <p class="text-lg mb-2">v = dx/dt</p>
                  <div class="text-2xl font-mono text-green-600 dark:text-green-400">
                    <strong>v = -Aω sin(ωt + φ₀)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">📊 Phân tích vận tốc</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">🔢 Biên độ vận tốc</h4>
                    <p class="text-sm">v_max = Aω</p>
                    <p class="text-xs text-gray-500">Vận tốc cực đại khi qua vị trí cân bằng</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">📐 Miền giá trị</h4>
                    <p class="text-sm">-Aω ≤ v ≤ +Aω</p>
                    <p class="text-xs text-gray-500">Vận tốc dao động trong khoảng [-Aω, Aω]</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">🔄 Độ lệch pha</h4>
                    <p class="text-sm">v sớm pha π/2 so với x</p>
                    <p class="text-xs text-gray-500">Khi x = 0 thì |v| = max</p>
                  </div>
                </div>
              </div>

              <div class="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-purple-800 dark:text-purple-200">🎯 Đặc điểm quan trọng</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">🏠 Tại VTCB (x = 0)</h4>
                    <p class="text-sm">v = ±Aω (cực đại)</p>
                    <p class="text-xs text-gray-500">Vật chuyển động nhanh nhất</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">🔄 Tại biên (x = ±A)</h4>
                    <p class="text-sm">v = 0</p>
                    <p class="text-xs text-gray-500">Vật đổi chiều chuyển động</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">⏰ Chu kì</h4>
                    <p class="text-sm">Giống li độ: T = 2π/ω</p>
                    <p class="text-xs text-gray-500">v(t + T) = v(t)</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">🔗 Liên hệ với li độ</h4>
                    <p class="text-sm">v² + (ωx)² = (ωA)²</p>
                    <p class="text-xs text-gray-500">Mối liên hệ độc lập thời gian</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-5 rounded-xl">
              <h3 class="font-bold mb-3 text-red-800 dark:text-red-200">📈 Đồ thị so sánh x và v</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div class="grid md:grid-cols-2 gap-6 text-center">
                  <div>
                    <h4 class="font-semibold mb-2">Đồ thị li độ x(t)</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">x = A cos(ωt + φ₀)</p>
                    <p class="text-xs">📊 Hình sin chuẩn</p>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2">Đồ thị vận tốc v(t)</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">v = -Aω sin(ωt + φ₀)</p>
                    <p class="text-xs">📊 Sớm pha π/2 so với x(t)</p>
                  </div>
                </div>
              </div>
            </div>
          `,
          formulas: [
            "v = \\frac{dx}{dt} = -A\\omega\\sin(\\omega t + \\varphi_0)",
            "v_{max} = A\\omega"
          ],
          notes: "Vận tốc sớm pha π/2 so với li độ"
        },
        {
          id: 4,
          title: "Phương trình gia tốc dao động điều hòa",
          type: "formula",
          content: `
            <h2>⚡ Phương trình gia tốc</h2>
            
            <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-8">
              <h3 class="text-xl font-bold text-red-700 dark:text-red-300 mb-4 text-center">
                📐 Gia tốc tức thời
              </h3>
              <div class="text-center">
                <p class="text-lg mb-3">Gia tốc là đạo hàm của vận tốc theo thời gian:</p>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <p class="text-lg mb-2">a = dv/dt = d²x/dt²</p>
                  <div class="text-2xl font-mono text-red-600 dark:text-red-400">
                    <strong>a = -Aω² cos(ωt + φ₀)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-red-800 dark:text-red-200">📊 Phân tích gia tốc</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-2">� Biên độ gia tốc</h4>
                    <p class="text-sm">a_max = Aω²</p>
                    <p class="text-xs text-gray-500">Gia tốc cực đại tại vị trí biên</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-2">📐 Miền giá trị</h4>
                    <p class="text-sm">-Aω² ≤ a ≤ +Aω²</p>
                    <p class="text-xs text-gray-500">Gia tốc dao động trong khoảng [-Aω², Aω²]</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-2">🔄 Độ lệch pha</h4>
                    <p class="text-sm">a ngược pha với x</p>
                    <p class="text-xs text-gray-500">Khi x = A thì a = -Aω²</p>
                  </div>
                </div>
              </div>

              <div class="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-orange-800 dark:text-orange-200">🎯 Đặc điểm quan trọng</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🏠 Tại VTCB (x = 0)</h4>
                    <p class="text-sm">a = 0</p>
                    <p class="text-xs text-gray-500">Không có lực phục hồi</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🔄 Tại biên (x = ±A)</h4>
                    <p class="text-sm">|a| = Aω² (cực đại)</p>
                    <p class="text-xs text-gray-500">Lực phục hồi mạnh nhất</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🔗 Liên hệ với li độ</h4>
                    <p class="text-sm">a = -ω²x</p>
                    <p class="text-xs text-gray-500">Tỉ lệ thuận với li độ, ngược chiều</p>
                  </div>

                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">⚖️ Ý nghĩa vật lý</h4>
                    <p class="text-sm">a ∝ lực phục hồi</p>
                    <p class="text-xs text-gray-500">F = ma = -mω²x = -kx</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-5 rounded-xl">
              <h3 class="font-bold mb-3 text-purple-800 dark:text-purple-200">📈 So sánh x, v, a</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div class="grid md:grid-cols-3 gap-6 text-center text-sm">
                  <div>
                    <h4 class="font-semibold mb-2">Li độ x(t)</h4>
                    <p class="mb-2">x = A cos(ωt + φ₀)</p>
                    <p class="text-xs text-gray-500">Pha gốc</p>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2">Vận tốc v(t)</h4>
                    <p class="mb-2">v = -Aω sin(ωt + φ₀)</p>
                    <p class="text-xs text-gray-500">Sớm pha π/2</p>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2">Gia tốc a(t)</h4>
                    <p class="mb-2">a = -Aω² cos(ωt + φ₀)</p>
                    <p class="text-xs text-gray-500">Ngược pha với x</p>
                  </div>
                </div>
              </div>
            </div>
          `,
          formulas: [
            "a = \\frac{dv}{dt} = -A\\omega^2\\cos(\\omega t + \\varphi_0)",
            "a = -\\omega^2 x",
            "F = ma = -kx"
          ],
          notes: "Gia tốc ngược pha với li độ và tỉ lệ với lực phục hồi"
        },
        {
          id: 5,
          title: "Bảng tổng kết các phương trình",
          type: "summary",
          content: `
            <h2>📋 Bảng tổng kết dao động điều hòa</h2>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl mb-8">
              <h3 class="text-xl font-bold text-center mb-6">🎯 Hệ phương trình dao động điều hòa</h3>
              <div class="grid md:grid-cols-3 gap-6">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <h4 class="font-bold text-blue-600 dark:text-blue-400 mb-3">📍 Li độ</h4>
                  <p class="text-lg font-mono mb-2">x = A cos(ωt + φ₀)</p>
                  <p class="text-xs text-gray-500">Vị trí tại thời điểm t</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <h4 class="font-bold text-green-600 dark:text-green-400 mb-3">🚀 Vận tốc</h4>
                  <p class="text-lg font-mono mb-2">v = -Aω sin(ωt + φ₀)</p>
                  <p class="text-xs text-gray-500">Sớm pha π/2 so với x</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <h4 class="font-bold text-red-600 dark:text-red-400 mb-3">⚡ Gia tốc</h4>
                  <p class="text-lg font-mono mb-2">a = -Aω² cos(ωt + φ₀)</p>
                  <p class="text-xs text-gray-500">Ngược pha với x</p>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-cyan-800 dark:text-cyan-200">📏 Các thông số</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <span class="font-medium">Biên độ:</span>
                    <span class="font-mono">A > 0</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <span class="font-medium">Tần số góc:</span>
                    <span class="font-mono">ω = 2π/T</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <span class="font-medium">Pha ban đầu:</span>
                    <span class="font-mono">φ₀</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <span class="font-medium">Chu kì:</span>
                    <span class="font-mono">T = 2π/ω</span>
                  </div>
                  <div class="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                    <span class="font-medium">Tần số:</span>
                    <span class="font-mono">f = 1/T</span>
                  </div>
                </div>
              </div>

              <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-amber-800 dark:text-amber-200">🔍 Giá trị đặc biệt</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">🏠 Tại vị trí cân bằng (x = 0)</h4>
                    <ul class="text-sm space-y-1">
                      <li>• v = ±Aω (cực đại)</li>
                      <li>• a = 0</li>
                      <li>• F = 0</li>
                    </ul>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">🔄 Tại vị trí biên (x = ±A)</h4>
                    <ul class="text-sm space-y-1">
                      <li>• v = 0</li>
                      <li>• a = ±Aω² (cực đại)</li>
                      <li>• F = ±kA (cực đại)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-xl">
              <h3 class="font-bold mb-4 text-purple-800 dark:text-purple-200">🔗 Mối liên hệ quan trọng</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <h4 class="font-semibold mb-2">Liên hệ gia tốc - li độ</h4>
                  <p class="font-mono text-lg">a = -ω²x</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                  <h4 class="font-semibold mb-2">Liên hệ vận tốc - li độ</h4>
                  <p class="font-mono text-lg">v² + (ωx)² = (ωA)²</p>
                </div>
              </div>
            </div>
          `,
          notes: "Nắm vững hệ phương trình này để giải mọi bài tập dao động điều hòa"
        },
        {
          id: 6,
          title: "Ví dụ thực hành với dao động điều hòa",
          type: "example",
          content: `
            <h2>📝 Bài tập mẫu dao động điều hòa</h2>
            
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold text-lg mb-4 text-yellow-800 dark:text-yellow-200">🎯 Ví dụ 1: Xác định phương trình dao động</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p class="mb-3"><strong>Đề bài:</strong> Một vật dao động điều hòa với biên độ A = 4 cm, chu kì T = 2s. Tại t = 0, vật ở vị trí x₀ = 2 cm và chuyển động theo chiều dương. Viết phương trình dao động.</p>
                
                <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p class="font-semibold mb-2">🔍 Phân tích:</p>
                  <ul class="text-sm space-y-1">
                    <li>• A = 4 cm = 0.04 m</li>
                    <li>• T = 2s ⟹ ω = 2π/T = π rad/s</li>
                    <li>• Tại t = 0: x₀ = 2 cm, v₀ > 0</li>
                  </ul>
                </div>

                <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <p class="font-semibold mb-2">📐 Lời giải:</p>
                  <div class="space-y-2 text-sm">
                    <p>1. Dạng tổng quát: x = A cos(ωt + φ₀)</p>
                    <p>2. Điều kiện ban đầu: x₀ = A cos(φ₀) = 4 cos(φ₀) = 2</p>
                    <p>3. ⟹ cos(φ₀) = 1/2 ⟹ φ₀ = ±π/3</p>
                    <p>4. Vận tốc: v = -Aω sin(ωt + φ₀)</p>
                    <p>5. Tại t = 0: v₀ = -Aω sin(φ₀) > 0 ⟹ sin(φ₀) < 0</p>
                    <p>6. ⟹ φ₀ = -π/3</p>
                  </div>
                </div>

                <div class="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                  <p class="font-semibold text-purple-800 dark:text-purple-200">✅ Đáp án:</p>
                  <p class="font-mono text-lg">x = 4 cos(πt - π/3) cm</p>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
              <h3 class="font-bold text-lg mb-4 text-green-800 dark:text-green-200">🎯 Ví dụ 2: Tính vận tốc và gia tốc</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p class="mb-3"><strong>Đề bài:</strong> Từ phương trình trên, tính vận tốc và gia tốc tại thời điểm t = 0.5s.</p>
                
                <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p class="font-semibold mb-2">📐 Lời giải:</p>
                  <div class="space-y-3 text-sm">
                    <div>
                      <p><strong>Vận tốc:</strong> v = -4π sin(πt - π/3)</p>
                      <p>Tại t = 0.5s: v = -4π sin(π×0.5 - π/3) = -4π sin(π/6) = -4π × 0.5 = -2π cm/s</p>
                    </div>
                    <div>
                      <p><strong>Gia tốc:</strong> a = -4π² cos(πt - π/3)</p>
                      <p>Tại t = 0.5s: a = -4π² cos(π/6) = -4π² × (√3/2) = -2π²√3 cm/s²</p>
                    </div>
                  </div>
                </div>

                <div class="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <p class="font-semibold text-purple-800 dark:text-purple-200 mb-2">✅ Đáp án:</p>
                  <ul class="text-sm">
                    <li>• v(0.5s) = -2π ≈ -6.28 cm/s</li>
                    <li>• a(0.5s) = -2π²√3 ≈ -34.2 cm/s²</li>
                  </ul>
                </div>
              </div>
            </div>
            
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
          title: "Khái niệm năng lượng trong dao động",
          type: "intro",
          content: `
            <h2>🔋 Năng lượng trong dao động điều hòa</h2>
            <p class="text-xl mb-6">Trong dao động điều hòa, năng lượng liên tục <strong>chuyển đổi</strong> giữa <strong>động năng</strong> và <strong>thế năng</strong>, nhưng tổng cơ năng được <strong>bảo toàn</strong>.</p>
            
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-8">
              <h3 class="font-bold text-lg mb-4 text-purple-800 dark:text-purple-200">⚖️ Định luật bảo toàn năng lượng</h3>
              <div class="text-center bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p class="text-xl font-mono text-purple-600 dark:text-purple-400">
                  <strong>W = Wđ + Wt = const</strong>
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Cơ năng = Động năng + Thế năng = hằng số</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <h3 class="font-bold text-green-700 dark:text-green-300 mb-4 text-lg">⚡ Động năng (Wđ)</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">📍 Định nghĩa</h4>
                    <p class="text-sm">Năng lượng do chuyển động của vật</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🏠 Tại VTCB</h4>
                    <p class="text-sm">Cực đại: Wđ_max = ½mv_max² = ½mA²ω²</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🔄 Tại biên</h4>
                    <p class="text-sm">Bằng 0: Wđ = 0 (vì v = 0)</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🔗 Phụ thuộc</h4>
                    <p class="text-sm">Tỉ lệ với bình phương vận tốc</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                <h3 class="font-bold text-blue-700 dark:text-blue-300 mb-4 text-lg">🏔️ Thế năng (Wt)</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">📍 Định nghĩa</h4>
                    <p class="text-sm">Năng lượng dự trữ do biến dạng đàn hồi</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔄 Tại biên</h4>
                    <p class="text-sm">Cực đại: Wt_max = ½kA² = ½mA²ω²</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">🏠 Tại VTCB</h4>
                    <p class="text-sm">Bằng 0: Wt = 0 (vì x = 0)</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔗 Phụ thuộc</h4>
                    <p class="text-sm">Tỉ lệ với bình phương li độ</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 class="font-bold mb-3 text-amber-800 dark:text-amber-200">🔄 Quá trình chuyển hóa năng lượng</h3>
              <div class="grid md:grid-cols-4 gap-3 text-center text-sm">
                <div class="bg-white dark:bg-gray-800 p-3 rounded">
                  <p class="font-semibold mb-1">x = 0</p>
                  <p class="text-green-600">Wđ = max</p>
                  <p class="text-blue-600">Wt = 0</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded">
                  <p class="font-semibold mb-1">0 < |x| < A</p>
                  <p class="text-green-600">Wđ > 0</p>
                  <p class="text-blue-600">Wt > 0</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded">
                  <p class="font-semibold mb-1">x = ±A</p>
                  <p class="text-green-600">Wđ = 0</p>
                  <p class="text-blue-600">Wt = max</p>
                </div>
                <div class="bg-white dark:bg-gray-800 p-3 rounded">
                  <p class="font-semibold mb-1">Mọi vị trí</p>
                  <p class="text-purple-600">W = const</p>
                  <p class="text-xs">Bảo toàn</p>
                </div>
              </div>
            </div>
          `,
          notes: "Năng lượng chuyển hóa liên tục nhưng tổng năng lượng được bảo toàn"
        },
        {
          id: 2,
          title: "Công thức tính động năng và thế năng",
          type: "formula",
          content: `
            <h2>⚡ Các công thức năng lượng cơ bản</h2>
            
            <div class="grid md:grid-cols-2 gap-8 mb-8">
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <h3 class="font-bold text-green-700 dark:text-green-300 mb-4 text-lg text-center">⚡ Động năng (Wđ)</h3>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 text-center">
                  <p class="text-2xl font-mono text-green-600 dark:text-green-400 mb-2">
                    <strong>Wđ = ½mv²</strong>
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Công thức cơ bản</p>
                </div>
                
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">📐 Thay v = -Aω sin(ωt + φ₀)</h4>
                    <p class="text-sm font-mono">Wđ = ½mA²ω² sin²(ωt + φ₀)</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🔢 Giá trị cực đại</h4>
                    <p class="text-sm font-mono">Wđ_max = ½mA²ω² (tại VTCB)</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🔗 Liên hệ với thế năng</h4>
                    <p class="text-sm font-mono">Wđ = ½mω²(A² - x²)</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                <h3 class="font-bold text-blue-700 dark:text-blue-300 mb-4 text-lg text-center">🏔️ Thế năng (Wt)</h3>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 text-center">
                  <p class="text-2xl font-mono text-blue-600 dark:text-blue-400 mb-2">
                    <strong>Wt = ½kx²</strong>
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Công thức cơ bản</p>
                </div>
                
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">📐 Thay x = A cos(ωt + φ₀)</h4>
                    <p class="text-sm font-mono">Wt = ½kA² cos²(ωt + φ₀)</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔢 Giá trị cực đại</h4>
                    <p class="text-sm font-mono">Wt_max = ½kA² (tại biên)</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">🔗 Với k = mω²</h4>
                    <p class="text-sm font-mono">Wt = ½mω²x²</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700 mb-6">
              <h3 class="font-bold text-purple-700 dark:text-purple-300 mb-4 text-lg text-center">🔋 Cơ năng toàn phần (W)</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center mb-4">
                <p class="text-2xl font-mono text-purple-600 dark:text-purple-400 mb-2">
                  <strong>W = Wđ + Wt = ½mA²ω² = ½kA²</strong>
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Hằng số tại mọi thời điểm</p>
              </div>
              
              <div class="grid md:grid-cols-3 gap-4">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                  <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">Dạng 1</h4>
                  <p class="text-sm font-mono">W = ½mA²ω²</p>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                  <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">Dạng 2</h4>
                  <p class="text-sm font-mono">W = ½kA²</p>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                  <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">Dạng 3</h4>
                  <p class="text-sm font-mono">W = ½mv_max²</p>
                </div>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 class="font-bold mb-3 text-amber-800 dark:text-amber-200">📈 Biến thiên năng lượng theo thời gian</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div class="text-center text-sm space-y-2">
                  <p><strong>Động năng:</strong> Wđ = ½mA²ω² sin²(ωt + φ₀) (biến thiên với chu kì T/2)</p>
                  <p><strong>Thế năng:</strong> Wt = ½mA²ω² cos²(ωt + φ₀) (biến thiên với chu kì T/2)</p>
                  <p><strong>Cơ năng:</strong> W = ½mA²ω² = const (không biến thiên)</p>
                </div>
              </div>
            </div>
          `,
          formulas: [
            "W_d = \\frac{1}{2}mv^2 = \\frac{1}{2}mA^2\\omega^2\\sin^2(\\omega t + \\varphi_0)",
            "W_t = \\frac{1}{2}kx^2 = \\frac{1}{2}mA^2\\omega^2\\cos^2(\\omega t + \\varphi_0)",
            "W = W_d + W_t = \\frac{1}{2}mA^2\\omega^2 = const"
          ],
          notes: "Cơ năng được bảo toàn trong dao động điều hòa lý tưởng"
        },
        {
          id: 3,
          title: "Định luật bảo toàn cơ năng",
          type: "concept",
          content: `
            <h2>⚖️ Định luật bảo toàn cơ năng</h2>
            
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl mb-8">
              <h3 class="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4 text-center">
                🎯 Phát biểu định luật
              </h3>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg text-center">
                <p class="text-lg mb-3">Trong dao động điều hòa lý tưởng (không ma sát), <strong>cơ năng được bảo toàn</strong>:</p>
                <div class="text-2xl font-mono text-purple-600 dark:text-purple-400 mb-3">
                  <strong>W = Wđ + Wt = const</strong>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Tại mọi thời điểm và mọi vị trí</p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-green-800 dark:text-green-200">✅ Bằng chứng toán học</h3>
                <div class="space-y-4 text-sm">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p class="mb-2"><strong>Tại vị trí bất kỳ:</strong></p>
                    <p class="font-mono">W = ½mv² + ½kx²</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p class="mb-2"><strong>Thay v² = ω²(A² - x²):</strong></p>
                    <p class="font-mono">W = ½mω²(A² - x²) + ½kx²</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p class="mb-2"><strong>Với k = mω²:</strong></p>
                    <p class="font-mono">W = ½mω²A² - ½mω²x² + ½mω²x²</p>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p class="mb-2"><strong>Kết quả:</strong></p>
                    <p class="font-mono text-green-600 dark:text-green-400"><strong>W = ½mω²A² = const</strong></p>
                  </div>
                </div>
              </div>

              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">🔄 Quá trình chuyển hóa</h3>
                <div class="space-y-4">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">🏠 Tại VTCB (x = 0)</h4>
                    <div class="text-sm space-y-1">
                      <p>• Wđ = ½mv²_max = ½mA²ω² = W</p>
                      <p>• Wt = 0</p>
                      <p class="text-green-600">➜ Toàn bộ cơ năng là động năng</p>
                    </div>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">🔄 Tại biên (x = ±A)</h4>
                    <div class="text-sm space-y-1">
                      <p>• Wđ = 0</p>
                      <p>• Wt = ½kA² = ½mA²ω² = W</p>
                      <p class="text-blue-600">➜ Toàn bộ cơ năng là thế năng</p>
                    </div>
                  </div>
                  
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">📍 Vị trí trung gian</h4>
                    <div class="text-sm space-y-1">
                      <p>• Wđ > 0, Wt > 0</p>
                      <p>• Wđ + Wt = W = const</p>
                      <p class="text-purple-600">➜ Chuyển hóa liên tục</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-700">
              <h3 class="font-bold mb-3 text-amber-800 dark:text-amber-200">💡 Ý nghĩa vật lý</h3>
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 class="font-semibold mb-2">🔋 Trong dao động điều hòa:</h4>
                  <ul class="space-y-1">
                    <li>• Không có ma sát ⟹ không mất năng lượng</li>
                    <li>• Chỉ có chuyển hóa năng lượng</li>
                    <li>• Tổng năng lượng không đổi</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">🌍 Trong thực tế:</h4>
                  <ul class="space-y-1">
                    <li>• Luôn có ma sát ⟹ mất dần năng lượng</li>
                    <li>• Biên độ giảm dần theo thời gian</li>
                    <li>• Dao động tắt dần</li>
                  </ul>
                </div>
              </div>
            </div>
          `,
          notes: "Định luật bảo toàn cơ năng là cơ sở để phân tích dao động"
        },
        {
          id: 4,
          title: "Ví dụ tính toán năng lượng",
          type: "example",
          content: `
            <h2>📝 Bài tập mẫu về năng lượng</h2>
            
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-6">
              <h3 class="font-bold text-lg mb-4 text-yellow-800 dark:text-yellow-200">🎯 Ví dụ: Tính năng lượng tại các vị trí</h3>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg">
                <p class="mb-4"><strong>Đề bài:</strong> Một vật dao động điều hòa theo phương trình x = 4cos(2πt) cm. Khối lượng m = 100g. Tính động năng, thế năng và cơ năng tại các vị trí x = 0, x = 2cm, x = 4cm.</p>
                
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-3">🔍 Xác định thông số</h4>
                    <div class="text-sm space-y-2">
                      <p>• A = 4 cm = 0.04 m</p>
                      <p>• ω = 2π rad/s</p>
                      <p>• m = 100g = 0.1 kg</p>
                      <p>• k = mω² = 0.1 × (2π)² ≈ 3.95 N/m</p>
                    </div>
                  </div>
                  
                  <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 class="font-semibold text-green-800 dark:text-green-200 mb-3">🔋 Cơ năng toàn phần</h4>
                    <div class="text-sm space-y-2">
                      <p>W = ½mA²ω²</p>
                      <p>W = ½ × 0.1 × (0.04)² × (2π)²</p>
                      <p>W ≈ 0.0316 J = 31.6 mJ</p>
                    </div>
                  </div>
                </div>

                <div class="mt-6 space-y-4">
                  <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-3">📍 Tại x = 0 (VTCB)</h4>
                    <div class="grid md:grid-cols-3 gap-4 text-sm">
                      <div class="text-center">
                        <p class="font-semibold mb-1">Thế năng</p>
                        <p>Wt = ½kx² = 0</p>
                      </div>
                      <div class="text-center">
                        <p class="font-semibold mb-1">Động năng</p>
                        <p>Wđ = W - Wt = 31.6 mJ</p>
                      </div>
                      <div class="text-center">
                        <p class="font-semibold mb-1">Cơ năng</p>
                        <p>W = 31.6 mJ</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h4 class="font-semibold text-amber-800 dark:text-amber-200 mb-3">📍 Tại x = 2 cm</h4>
                    <div class="grid md:grid-cols-3 gap-4 text-sm">
                      <div class="text-center">
                        <p class="font-semibold mb-1">Thế năng</p>
                        <p>Wt = ½ × 3.95 × (0.02)² ≈ 7.9 mJ</p>
                      </div>
                      <div class="text-center">
                        <p class="font-semibold mb-1">Động năng</p>
                        <p>Wđ = 31.6 - 7.9 ≈ 23.7 mJ</p>
                      </div>
                      <div class="text-center">
                        <p class="font-semibold mb-1">Cơ năng</p>
                        <p>W = 31.6 mJ</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <h4 class="font-semibold text-red-800 dark:text-red-200 mb-3">📍 Tại x = 4 cm (biên)</h4>
                    <div class="grid md:grid-cols-3 gap-4 text-sm">
                      <div class="text-center">
                        <p class="font-semibold mb-1">Thế năng</p>
                        <p>Wt = ½ × 3.95 × (0.04)² ≈ 31.6 mJ</p>
                      </div>
                      <div class="text-center">
                        <p class="font-semibold mb-1">Động năng</p>
                        <p>Wđ = W - Wt = 0</p>
                      </div>
                      <div class="text-center">
                        <p class="font-semibold mb-1">Cơ năng</p>
                        <p>W = 31.6 mJ</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
                  <h4 class="font-semibold mb-2">✅ Kết luận:</h4>
                  <p class="text-sm">Cơ năng được bảo toàn tại mọi vị trí (W = 31.6 mJ), nhưng tỉ lệ động năng và thế năng thay đổi liên tục.</p>
                </div>
              </div>
            </div>
          `,
          notes: "Luôn kiểm tra định luật bảo toàn cơ năng khi giải bài tập"
        }
      ]
    },
    "4": {
      id: 4,
      title: "Dao động tắt dần và hiện tượng cộng hưởng",
      slides: [
        {
          id: 1,
          title: "Dao động tắt dần trong thực tế",
          type: "intro",
          content: `
            <h2>📉 Dao động tắt dần</h2>
            <p class="text-xl mb-6">Dao động tắt dần là dao động có <strong>biên độ giảm dần</strong> theo thời gian do tác dụng của <strong>lực cản</strong> (ma sát, sức cản không khí, độ nhớt chất lỏng...).</p>
            
            <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-8">
              <h3 class="font-bold text-lg mb-4 text-red-800 dark:text-red-200">⚠️ Nguyên nhân và cơ chế</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <p class="mb-3"><strong>Lực cản:</strong> F_cản = -bv (tỉ lệ với vận tốc, ngược chiều chuyển động)</p>
                <p class="text-sm">Trong đó: b là hệ số cản (phụ thuộc tính chất môi trường và hình dạng vật)</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                <h3 class="font-bold text-red-700 dark:text-red-300 mb-4">📉 Đặc điểm của dao động tắt dần</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">📐 Biên độ</h4>
                    <p class="text-sm">A(t) = A₀e^(-δt) (giảm theo hàm mũ)</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">⏱️ Chu kì</h4>
                    <p class="text-sm">T ≈ T₀ (gần như không đổi nếu cản nhỏ)</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">🔋 Năng lượng</h4>
                    <p class="text-sm">Giảm dần, chuyển thành nhiệt năng</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">🎯 Kết thúc</h4>
                    <p class="text-sm">Vật dừng tại vị trí cân bằng</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-700">
                <h3 class="font-bold text-orange-700 dark:text-orange-300 mb-4">🌍 Ví dụ trong thực tế</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🕰️ Đồng hồ quả lắc</h4>
                    <p class="text-sm">Cần lên cót để bù đắp năng lượng mất</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🚗 Hệ thống treo ô tô</h4>
                    <p class="text-sm">Giảm xóc giúp dao động tắt nhanh</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🎸 Dây đàn guitar</h4>
                    <p class="text-sm">Âm thanh nhỏ dần và tắt hẳn</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🌉 Cầu treo</h4>
                    <p class="text-sm">Cần thiết kế chống dao động</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700">
              <h3 class="font-bold mb-3 text-blue-800 dark:text-blue-200">🔧 Ứng dụng tích cực</h3>
              <div class="grid md:grid-cols-3 gap-4 text-sm">
                <div class="text-center">
                  <h4 class="font-semibold mb-2">Giảm chấn</h4>
                  <p>Xe ô tô, xe máy sử dụng giảm xóc để tắt dao động nhanh chóng</p>
                </div>
                <div class="text-center">
                  <h4 class="font-semibold mb-2">Cách âm</h4>
                  <p>Vật liệu cách âm làm tắt dao động âm thanh</p>
                </div>
                <div class="text-center">
                  <h4 class="font-semibold mb-2">An toàn</h4>
                  <p>Tòa nhà cao tầng cần hệ thống chống rung</p>
                </div>
              </div>
            </div>
          `,
          notes: "Dao động tắt dần xảy ra trong hầu hết các tình huống thực tế"
        },
        {
          id: 2,
          title: "Hiện tượng cộng hưởng - Dao động cưỡng bức",
          type: "concept",
          content: `
            <h2>🔊 Hiện tượng cộng hưởng</h2>
            <p class="text-xl mb-6">Cộng hưởng xảy ra khi tần số của <strong>ngoại lực cưỡng bức</strong> bằng hoặc gần bằng <strong>tần số riêng</strong> của hệ dao động, làm cho <strong>biên độ dao động tăng mạnh</strong>.</p>
            
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl mb-8">
              <h3 class="font-bold text-lg mb-4 text-purple-800 dark:text-purple-200">🎯 Điều kiện cộng hưởng</h3>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <p class="text-2xl font-mono text-purple-600 dark:text-purple-400 mb-2">
                  <strong>f_ngoại lực ≈ f₀</strong>
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Tần số ngoại lực ≈ Tần số riêng của hệ</p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-green-800 dark:text-green-200">✅ Cộng hưởng có lợi</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🎸 Nhạc cụ</h4>
                    <p class="text-sm">Hộp cộng hưởng đàn guitar, piano tạo âm thanh to, trong</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">📻 Radio, TV</h4>
                    <p class="text-sm">Mạch LC cộng hưởng để bắt sóng đúng tần số</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🏥 Y học</h4>
                    <p class="text-sm">Siêu âm cộng hưởng để phá vỡ sỏi thận</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🔬 Nghiên cứu</h4>
                    <p class="text-sm">Máy phổ cộng hưởng từ hạt nhân (NMR)</p>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-red-800 dark:text-red-200">⚠️ Cộng hưởng có hại</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">🌉 Cầu Tacoma (1940)</h4>
                    <p class="text-sm">Sập do gió tạo cộng hưởng với tần số riêng của cầu</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">🏢 Tòa nhà cao tầng</h4>
                    <p class="text-sm">Động đất có thể gây cộng hưởng nguy hiểm</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">⚙️ Máy móc</h4>
                    <p class="text-sm">Động cơ quay có thể gây rung cộng hưởng</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-red-600 dark:text-red-400 mb-1">✈️ Máy bay</h4>
                    <p class="text-sm">Cộng hưởng có thể gây rung lắc nguy hiểm</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700">
              <h3 class="font-bold mb-3 text-blue-800 dark:text-blue-200">📊 Đặc điểm của cộng hưởng</h3>
              <div class="grid md:grid-cols-3 gap-4 text-sm">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                  <h4 class="font-semibold mb-2">📈 Biên độ</h4>
                  <p>Tăng rất mạnh khi f ≈ f₀</p>
                  <p class="text-xs text-gray-500">Có thể gấp hàng chục lần</p>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                  <h4 class="font-semibold mb-2">🔄 Tần số</h4>
                  <p>Bằng tần số ngoại lực</p>
                  <p class="text-xs text-gray-500">Không phải tần số riêng</p>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
                  <h4 class="font-semibold mb-2">🎯 Độ nhạy</h4>
                  <p>Phụ thuộc ma sát</p>
                  <p class="text-xs text-gray-500">Ma sát nhỏ → cộng hưởng mạnh</p>
                </div>
              </div>
            </div>
          `,
          notes: "Cộng hưởng có thể có lợi hoặc có hại tùy vào ứng dụng"
        },
        {
          id: 3,
          title: "Ứng dụng thực tế của dao động",
          type: "example",
          content: `
            <h2>🌍 Ứng dụng dao động trong công nghệ</h2>
            
            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">📱 Công nghệ thông tin</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">💾 Ổ cứng máy tính</h4>
                    <p class="text-sm">Đầu đọc dao động với tần số cao để truy cập dữ liệu</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">📶 Anten thu phát</h4>
                    <p class="text-sm">Dao động điện từ để truyền tín hiệu radio, WiFi</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-1">⏰ Đồng hồ số</h4>
                    <p class="text-sm">Thạch anh dao động 32.768 Hz làm chuẩn thời gian</p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-green-800 dark:text-green-200">🏥 Y tế và sức khỏe</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🔊 Siêu âm chẩn đoán</h4>
                    <p class="text-sm">Tần số 1-10 MHz để tạo hình ảnh bên trong cơ thể</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">💊 Phá sỏi thận</h4>
                    <p class="text-sm">Sóng xung kích với cộng hưởng phá vỡ sỏi</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-green-600 dark:text-green-400 mb-1">🦷 Máy cạo vôi răng</h4>
                    <p class="text-sm">Dao động siêu âm 25-30 kHz làm sạch răng</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-purple-800 dark:text-purple-200">🏗️ Xây dựng và kiến trúc</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">🏢 Giảm chấn tòa nhà</h4>
                    <p class="text-sm">Hệ thống giảm chấn chống động đất (TMD)</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">🌉 Thiết kế cầu</h4>
                    <p class="text-sm">Tránh tần số cộng hưởng với gió và tải trọng</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-purple-600 dark:text-purple-400 mb-1">🔨 Máy khoan</h4>
                    <p class="text-sm">Dao động tần số cao để khoan bê tông</p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-6 rounded-xl">
                <h3 class="font-bold text-lg mb-4 text-orange-800 dark:text-orange-200">🚗 Giao thông vận tải</h3>
                <div class="space-y-3">
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">⚙️ Động cơ ô tô</h4>
                    <p class="text-sm">Giảm chấn để hạn chế rung động từ động cơ</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">🛣️ Hệ thống treo</h4>
                    <p class="text-sm">Lò xo + giảm xóc tạo dao động tắt dần</p>
                  </div>
                  <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <h4 class="font-semibold text-orange-600 dark:text-orange-400 mb-1">✈️ Máy bay</h4>
                    <p class="text-sm">Thiết kế tránh dao động cộng hưởng nguy hiểm</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 rounded-xl">
              <h3 class="font-bold text-lg mb-4 text-indigo-800 dark:text-indigo-200">📊 Bài toán thực tế</h3>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg">
                <p class="mb-3"><strong>Tình huống:</strong> Thiết kế tòa nhà 40 tầng tại khu vực có động đất</p>
                
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 class="font-semibold mb-2 text-indigo-600 dark:text-indigo-400">🔍 Phân tích:</h4>
                    <ul class="space-y-1">
                      <li>• Tần số riêng tòa nhà: f₀ ≈ 0.25 Hz</li>
                      <li>• Tần số động đất: 0.1 - 10 Hz</li>
                      <li>• Nguy cơ cộng hưởng khi f ≈ f₀</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2 text-indigo-600 dark:text-indigo-400">🛡️ Giải pháp:</h4>
                    <ul class="space-y-1">
                      <li>• Thay đổi thiết kế để tránh f₀ = 0.1-10 Hz</li>
                      <li>• Lắp đặt hệ thống TMD (giảm chấn khối lượng)</li>
                      <li>• Sử dụng vật liệu có ma sát phù hợp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          `,
          notes: "Dao động có ứng dụng rộng rãi trong mọi lĩnh vực của đời sống"
        },
        {
          id: 4,
          title: "Tổng kết và tương lai",
          type: "summary",
          content: `
            <h2>🎯 Tổng kết chương dao động cơ</h2>
            
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl mb-8">
              <h3 class="font-bold text-lg mb-4 text-blue-800 dark:text-blue-200">📚 Kiến thức đã học</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-3">🔤 Khái niệm cơ bản</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Dao động, chu kì, tần số, biên độ</li>
                    <li>• Phân loại: tự do, cưỡng bức, tắt dần</li>
                    <li>• Dao động điều hòa - mô hình lý tưởng</li>
                  </ul>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-3">📐 Phương trình toán học</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Li độ: x = A cos(ωt + φ₀)</li>
                    <li>• Vận tốc: v = -Aω sin(ωt + φ₀)</li>
                    <li>• Gia tốc: a = -Aω² cos(ωt + φ₀)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-700">
                <h3 class="font-bold text-green-700 dark:text-green-300 mb-3">🔋 Năng lượng</h3>
                <div class="text-sm space-y-2">
                  <p>• Động năng: Wđ = ½mv²</p>
                  <p>• Thế năng: Wt = ½kx²</p>
                  <p>• Bảo toàn: W = Wđ + Wt = const</p>
                  <p>• Chuyển hóa liên tục</p>
                </div>
              </div>

              <div class="bg-red-50 dark:bg-red-900/20 p-5 rounded-xl border border-red-200 dark:border-red-700">
                <h3 class="font-bold text-red-700 dark:text-red-300 mb-3">📉 Dao động tắt dần</h3>
                <div class="text-sm space-y-2">
                  <p>• Nguyên nhân: lực cản</p>
                  <p>• Biên độ: A(t) = A₀e^(-δt)</p>
                  <p>• Năng lượng → nhiệt năng</p>
                  <p>• Ứng dụng: giảm chấn</p>
                </div>
              </div>

              <div class="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-700">
                <h3 class="font-bold text-purple-700 dark:text-purple-300 mb-3">🔊 Cộng hưởng</h3>
                <div class="text-sm space-y-2">
                  <p>• Điều kiện: f ≈ f₀</p>
                  <p>• Biên độ tăng mạnh</p>
                  <p>• Có lợi: nhạc cụ, radio</p>
                  <p>• Có hại: sập cầu, rung lắc</p>
                </div>
              </div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-700 mb-6">
              <h3 class="font-bold text-lg mb-4 text-amber-800 dark:text-amber-200">🚀 Xu hướng phát triển</h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-3">🔬 Nghiên cứu hiện đại</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Dao động lượng tử (quantum oscillations)</li>
                    <li>• Metamaterials với dao động âm tần</li>
                    <li>• Dao động trong vật liệu nano</li>
                    <li>• AI điều khiển dao động thông minh</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-3">🌟 Ứng dụng tương lai</h4>
                  <ul class="text-sm space-y-1">
                    <li>• Điều khiển rung động bằng AI</li>
                    <li>• Năng lượng từ dao động (energy harvesting)</li>
                    <li>• Y học: điều trị bằng dao động</li>
                    <li>• Kiến trúc thông minh chống thiên tai</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
              <h3 class="font-bold text-lg mb-4 text-center">🎓 Kết luận</h3>
              <div class="text-center">
                <p class="text-lg mb-4">Dao động cơ là nền tảng để hiểu:</p>
                <div class="grid md:grid-cols-4 gap-4 text-sm">
                  <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 class="font-semibold mb-1">🌊 Sóng cơ</h4>
                    <p>Âm thanh, sóng nước</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 class="font-semibold mb-1">⚡ Điện xoay chiều</h4>
                    <p>Dòng và áp xoay chiều</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 class="font-semibold mb-1">💡 Điện từ học</h4>
                    <p>Sóng điện từ, ánh sáng</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <h4 class="font-semibold mb-1">⚛️ Vật lý hiện đại</h4>
                    <p>Cơ học lượng tử</p>
                  </div>
                </div>
              </div>
            </div>
          `,
          notes: "Dao động cơ là nền tảng cho nhiều chương khác trong vật lý"
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