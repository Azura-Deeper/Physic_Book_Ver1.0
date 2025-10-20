'use client'

import { MathJax, MathJaxContext } from 'better-react-mathjax'

interface MathFormulaProps {
  formula: string
  inline?: boolean
}

export function MathFormula({ formula, inline = false }: MathFormulaProps) {
  return (
    <MathJaxContext>
      <MathJax inline={inline} dynamic>
        {`${inline ? '\\(' : '\\['} ${formula} ${inline ? '\\)' : '\\]'}`}
      </MathJax>
    </MathJaxContext>
  )
}

interface MathProviderProps {
  children: React.ReactNode
}

export function MathProvider({ children }: MathProviderProps) {
  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"]
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"]
      ]
    }
  }

  return (
    <MathJaxContext config={config}>
      {children}
    </MathJaxContext>
  )
}