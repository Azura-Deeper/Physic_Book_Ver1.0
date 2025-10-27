'use client'

import { useEffect, useRef, useState } from 'react'

interface OscillationSimulationProps {
  type: 'simple' | 'spring' | 'pendulum' | 'wave'
  width?: number
  height?: number
}

export default function OscillationSimulation({ 
  type, 
  width = 600, 
  height = 300 
}: OscillationSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const animationRef = useRef<number>()
  const timeRef = useRef(0)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Detect dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    const animate = () => {
      if (!isPlaying) return

      ctx.clearRect(0, 0, width, height)
      timeRef.current += 0.02

      switch (type) {
        case 'simple':
          drawSimpleOscillation(ctx, width, height, timeRef.current, isDark)
          break
        case 'spring':
          drawSpringOscillation(ctx, width, height, timeRef.current, isDark)
          break
        case 'pendulum':
          drawPendulum(ctx, width, height, timeRef.current, isDark)
          break
        case 'wave':
          drawWave(ctx, width, height, timeRef.current, isDark)
          break
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [type, width, height, isPlaying, isDark])

  const drawSimpleOscillation = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const centerY = h / 2
    const amplitude = 80
    const frequency = 1
    const y = centerY + amplitude * Math.sin(2 * Math.PI * frequency * t)

    // Draw axis
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(50, centerY)
    ctx.lineTo(w - 50, centerY)
    ctx.stroke()

    // Draw amplitude lines
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(50, centerY - amplitude)
    ctx.lineTo(w - 50, centerY - amplitude)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(50, centerY + amplitude)
    ctx.lineTo(w - 50, centerY + amplitude)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw labels
    ctx.fillStyle = isDark ? '#cbd5e1' : '#64748b'
    ctx.font = '14px sans-serif'
    ctx.fillText('+A', 20, centerY - amplitude)
    ctx.fillText('0', 20, centerY + 5)
    ctx.fillText('-A', 20, centerY + amplitude)

    // Draw oscillating object
    const x = w / 2
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(x, y, 15, 0, 2 * Math.PI)
    ctx.fill()

    // Draw trajectory line
    ctx.strokeStyle = '#93c5fd'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()

    // Draw position indicator
    ctx.fillStyle = isDark ? '#93c5fd' : '#1e40af'
    ctx.font = '12px sans-serif'
    ctx.fillText(`x = ${(amplitude * Math.sin(2 * Math.PI * frequency * t)).toFixed(0)} cm`, w - 100, 30)
  }

  const drawSpringOscillation = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const centerX = w / 2
    const centerY = h / 2
    const amplitude = 100
    const x = amplitude * Math.cos(2 * Math.PI * 0.5 * t)

    // Draw wall
    ctx.fillStyle = isDark ? '#475569' : '#64748b'
    ctx.fillRect(50, centerY - 100, 10, 200)

    // Draw spring
    const springStart = 60
    const springEnd = centerX + x - 20
    const coils = 15
    const coilWidth = 20

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(springStart, centerY)

    for (let i = 0; i <= coils; i++) {
      const xPos = springStart + (springEnd - springStart) * (i / coils)
      const yOffset = (i % 2 === 0 ? 1 : -1) * coilWidth
      ctx.lineTo(xPos, centerY + yOffset)
    }
    ctx.lineTo(springEnd, centerY)
    ctx.stroke()

    // Draw mass
    const massX = centerX + x
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(massX - 20, centerY - 25, 40, 50)
    
    // Draw mass label
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('m', massX, centerY + 5)

    // Draw equilibrium position
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 50)
    ctx.lineTo(centerX, centerY + 50)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw info
    ctx.fillStyle = isDark ? '#93c5fd' : '#1e40af'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`x = ${x.toFixed(1)} cm`, 20, 30)
    ctx.fillText(`v = ${(-amplitude * 2 * Math.PI * 0.5 * Math.sin(2 * Math.PI * 0.5 * t)).toFixed(1)} cm/s`, 20, 50)
  }

  const drawPendulum = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const pivotX = w / 2
    const pivotY = 50
    const length = 150
    const amplitude = 0.5 // radians (about 30 degrees)
    const angle = amplitude * Math.cos(2 * Math.PI * 0.4 * t)

    const bobX = pivotX + length * Math.sin(angle)
    const bobY = pivotY + length * Math.cos(angle)

    // Draw angle arc
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(pivotX, pivotY, 40, Math.PI / 2, Math.PI / 2 + angle, angle < 0)
    ctx.stroke()

    // Draw vertical reference
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8'
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(pivotX, pivotY)
    ctx.lineTo(pivotX, pivotY + length)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw pivot point
    ctx.fillStyle = isDark ? '#475569' : '#64748b'
    ctx.beginPath()
    ctx.arc(pivotX, pivotY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw string
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pivotX, pivotY)
    ctx.lineTo(bobX, bobY)
    ctx.stroke()

    // Draw bob
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(bobX, bobY, 20, 0, 2 * Math.PI)
    ctx.fill()

    // Draw trajectory
    ctx.strokeStyle = isDark ? '#7f1d1d' : '#fecaca'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let a = -amplitude; a <= amplitude; a += 0.1) {
      const x = pivotX + length * Math.sin(a)
      const y = pivotY + length * Math.cos(a)
      if (a === -amplitude) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw info
    ctx.fillStyle = isDark ? '#93c5fd' : '#1e40af'
    ctx.font = '12px sans-serif'
    ctx.fillText(`θ = ${(angle * 180 / Math.PI).toFixed(1)}°`, 20, 30)
    ctx.fillText(`l = ${length} cm`, 20, 50)
  }

  const drawWave = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    isDark: boolean
  ) => {
    const centerY = h / 2
    const amplitude = 60
    const wavelength = 150
    const frequency = 0.5

    // Draw axis
    ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(w, centerY)
    ctx.stroke()

    // Draw wave
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    for (let x = 0; x < w; x++) {
      const y = centerY + amplitude * Math.sin(
        (2 * Math.PI * x) / wavelength - 2 * Math.PI * frequency * t
      )
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw wavelength indicator
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(50, centerY - amplitude - 20)
    ctx.lineTo(50, centerY - amplitude - 10)
    ctx.moveTo(50, centerY - amplitude - 15)
    ctx.lineTo(50 + wavelength, centerY - amplitude - 15)
    ctx.moveTo(50 + wavelength, centerY - amplitude - 20)
    ctx.lineTo(50 + wavelength, centerY - amplitude - 10)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw labels
    ctx.fillStyle = isDark ? '#cbd5e1' : '#64748b'
    ctx.font = '14px sans-serif'
    ctx.fillText('λ', 50 + wavelength / 2 - 5, centerY - amplitude - 20)
    ctx.fillText('A', 10, centerY - amplitude)

    // Draw info
    ctx.fillStyle = isDark ? '#93c5fd' : '#1e40af'
    ctx.font = '12px sans-serif'
    ctx.fillText(`λ = ${wavelength} cm`, w - 120, 30)
    ctx.fillText(`A = ${amplitude} cm`, w - 120, 50)
  }

  return (
    <div className="my-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <canvas
          ref={canvasRef}
          className="w-full border border-gray-300 dark:border-gray-600 rounded"
          style={{ maxWidth: `${width}px`, height: 'auto' }}
        />
        <div className="mt-3 flex justify-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {isPlaying ? 'Tạm dừng' : 'Tiếp tục'}
          </button>
          <button
            onClick={() => {
              timeRef.current = 0
              setIsPlaying(true)
            }}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Khởi động lại
          </button>
        </div>
      </div>
    </div>
  )
}
