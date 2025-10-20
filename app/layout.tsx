import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MathProvider } from '../components/Math'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Sách Vật Lí 11 - Dao động',
  description: 'Chương 1: Dao động - Vật lí 11 Chân trời sáng tạo',
  keywords: 'vật lý, dao động, vật lí 11, chân trời sáng tạo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script 
          src="https://polyfill.io/v3/polyfill.min.js?features=es6"
          async
        />
        <script 
          id="MathJax-script" 
          async 
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
                },
                svg: {
                  fontCache: 'global'
                }
              };
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <MathProvider>
            {children}
          </MathProvider>
        </AuthProvider>
      </body>
    </html>
  )
}