const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })

const chapterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: String,
  icon: String,
  content: { type: String, required: true },
  sections: [{
    id: String,
    title: String,
    content: String,
    subsections: [{
      id: String,
      title: String,
      content: String,
    }]
  }],
  exercises: [{
    id: Number,
    title: String,
    question: String,
    solution: String,
    type: { type: String, enum: ['practice', 'quiz'], default: 'practice' }
  }],
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Chapter = mongoose.model('Chapter', chapterSchema)

const sampleChapters = [
  {
    id: 'gioi-thieu',
    title: 'Giới thiệu về dao động',
    subtitle: 'Khái niệm cơ bản về dao động',
    icon: 'fas fa-play-circle',
    content: `Dao động là một hiện tượng phổ biến trong tự nhiên và kỹ thuật. 
    Từ việc lắc lư của cành cây trong gió đến hoạt động của đồng hồ quả lắc, 
    dao động có mặt khắp nơi xung quanh chúng ta.`,
    sections: [],
    exercises: [],
    order: 1,
    isPublished: true
  },
  {
    id: 'dao-dong-dieu-hoa',
    title: 'Dao động điều hòa',
    subtitle: 'Lý thuyết về dao động điều hòa',
    icon: 'fas fa-wave-square',
    content: 'Dao động điều hòa là dao động trong đó li độ của vật biến thiên theo thời gian theo quy luật hình sin.',
    sections: [
      {
        id: 'dinh-nghia',
        title: 'Định nghĩa',
        content: 'Dao động điều hòa là dao động trong đó li độ của vật biến thiên theo thời gian theo quy luật hình sin (hoặc cosin).',
        subsections: []
      },
      {
        id: 'phuong-trinh',
        title: 'Phương trình dao động',
        content: 'Phương trình li độ: x = A*cos(ωt + φ)',
        subsections: []
      },
      {
        id: 'cac-dai-luong',
        title: 'Các đại lượng đặc trưng',
        content: 'Biên độ A, chu kì T, tần số f, tần số góc ω',
        subsections: []
      }
    ],
    exercises: [],
    order: 2,
    isPublished: true
  },
  {
    id: 'con-lac-lo-xo',
    title: 'Con lắc lò xo',
    subtitle: 'Ứng dụng của dao động điều hòa',
    icon: 'fas fa-compress-arrows-alt',
    content: 'Con lắc lò xo gồm một vật có khối lượng m gắn vào đầu lò xo có độ cứng k.',
    sections: [
      {
        id: 'ly-thuyet',
        title: 'Lý thuyết',
        content: 'Con lắc lò xo dao động điều hòa với tần số góc ω = √(k/m)',
        subsections: []
      },
      {
        id: 'cong-thuc',
        title: 'Công thức cơ bản',
        content: 'Chu kì T = 2π√(m/k), Tần số f = 1/(2π)√(k/m)',
        subsections: []
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'Bài tập 1: Con lắc lò xo',
        question: 'Một con lắc lò xo có khối lượng m = 200g, độ cứng k = 50 N/m. Tính chu kì và tần số dao động.',
        solution: 'T = 2π√(m/k) = 2π√(0.2/50) = 0.4s; f = 1/T = 2.5Hz',
        type: 'practice'
      }
    ],
    order: 3,
    isPublished: true
  }
]

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Chapter.deleteMany({})
    console.log('Cleared existing chapters')
    
    // Insert sample data
    await Chapter.insertMany(sampleChapters)
    console.log('Sample chapters inserted successfully')
    
    await mongoose.disconnect()
    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()