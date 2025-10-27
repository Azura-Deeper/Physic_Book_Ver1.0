export interface Chapter {
  _id: string
  id: string
  title: string
  subtitle?: string
  icon?: string
  content: string
  sections: {
    id: string
    title: string
    content: string
    subsections?: {
      id: string
      title: string
      content: string
    }[]
  }[]
  exercises: {
    id: number
    title: string
    question: string
    solution: string
    type: 'practice' | 'quiz'
  }[]
  order: number
  isPublished: boolean
}
