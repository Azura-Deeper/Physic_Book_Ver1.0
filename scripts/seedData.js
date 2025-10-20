const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local file');
}

// Chapter Schema
const ChapterSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  icon: String,
  content: {
    type: String,
    required: true,
  },
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
    type: {
      type: String,
      enum: ['practice', 'quiz'],
      default: 'practice'
    }
  }],
  order: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Chapter = mongoose.model('Chapter', ChapterSchema);

// Sample data
const sampleChapters = [
  {
    id: 'gioi-thieu',
    title: 'Giới thiệu về dao động',
    subtitle: 'Khái niệm và ví dụ thực tế',
    icon: 'fas fa-play-circle',
    content: `
      <h2>Giới thiệu về dao động</h2>
      <p>Dao động là một hiện tượng phổ biến trong tự nhiên và kỹ thuật. Từ việc lắc lư của cành cây trong gió đến hoạt động của đồng hồ quả lắc, dao động có mặt khắp nơi xung quanh chúng ta.</p>
      
      <div class="concept-box">
        <h4>Khái niệm cơ bản</h4>
        <p><strong>Dao động</strong> là chuyển động lặp lại theo thời gian của một vật quanh vị trí cân bằng.</p>
        <div class="examples">
          <h5>Ví dụ trong thực tế:</h5>
          <ul>
            <li>🕰️ Quả lắc đồng hồ</li>
            <li>🎸 Dây đàn guitar khi gảy</li>
            <li>🌊 Sóng trên mặt nước</li>
            <li>💓 Nhịp đập của tim</li>
            <li>🏗️ Dao động của cầu trong gió</li>
          </ul>
        </div>
      </div>
    `,
    sections: [],
    exercises: [],
    order: 1,
    isPublished: true
  },
  {
    id: 'dao-dong-dieu-hoa',
    title: 'Dao động điều hòa',
    subtitle: 'Định nghĩa và phương trình',
    icon: 'fas fa-wave-square',
    content: 'Dao động điều hòa là loại dao động cơ bản nhất và quan trọng nhất trong vật lý.',
    sections: [
      {
        id: 'dinh-nghia',
        title: 'Định nghĩa',
        content: `
          <h3>Định nghĩa</h3>
          <div class="definition-box">
            <p><strong>Dao động điều hòa</strong> là dao động trong đó li độ của vật biến thiên theo thời gian theo quy luật hình sin (hoặc cosin).</p>
          </div>
        `,
        subsections: []
      },
      {
        id: 'phuong-trinh',
        title: 'Phương trình dao động điều hòa',
        content: `
          <h3>Phương trình dao động điều hòa</h3>
          <div class="formula-box">
            <p>Phương trình li độ:</p>
            <div class="math-display">x = A cos(ωt + φ)</div>
            <div class="formula-explanation">
              <p>Trong đó:</p>
              <ul>
                <li><strong>x</strong>: li độ (m)</li>
                <li><strong>A</strong>: biên độ dao động (m)</li>
                <li><strong>ω</strong>: tần số góc (rad/s)</li>
                <li><strong>φ</strong>: pha ban đầu (rad)</li>
                <li><strong>(ωt + φ)</strong>: pha dao động (rad)</li>
              </ul>
            </div>
          </div>
        `,
        subsections: []
      },
      {
        id: 'cac-dai-luong',
        title: 'Các đại lượng đặc trưng',
        content: `
          <h3>Các đại lượng đặc trưng</h3>
          <div class="grid-2">
            <div class="info-card">
              <h4>Biên độ (A)</h4>
              <p>Giá trị cực đại của li độ. Đặc trưng cho "độ mạnh" của dao động.</p>
              <div class="math-display">A = |x|_max</div>
            </div>
            <div class="info-card">
              <h4>Chu kì (T)</h4>
              <p>Khoảng thời gian để vật thực hiện một dao động toàn phần.</p>
              <div class="math-display">T = 2π/ω</div>
            </div>
          </div>
        `,
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
    subtitle: 'Lý thuyết và công thức',
    icon: 'fas fa-compress-arrows-alt',
    content: 'Con lắc lò xo là hệ dao động điều hòa cơ bản, gồm một vật có khối lượng m gắn vào đầu lò xo có độ cứng k.',
    sections: [
      {
        id: 'ly-thuyet',
        title: 'Lý thuyết',
        content: `
          <h3>Lý thuyết</h3>
          <div class="concept-box">
            <p>Con lắc lò xo gồm một vật có khối lượng m gắn vào đầu lò xo có độ cứng k. Khi vật bị kéo ra khỏi vị trí cân bằng và thả ra, nó sẽ dao động điều hòa.</p>
          </div>
        `,
        subsections: []
      },
      {
        id: 'cong-thuc',
        title: 'Công thức cơ bản',
        content: `
          <h3>Công thức cơ bản</h3>
          <div class="formula-grid">
            <div class="formula-box">
              <h4>Tần số góc</h4>
              <div class="math-display">ω = √(k/m)</div>
            </div>
            <div class="formula-box">
              <h4>Chu kì dao động</h4>
              <div class="math-display">T = 2π√(m/k)</div>
            </div>
            <div class="formula-box">
              <h4>Lực phục hồi</h4>
              <div class="math-display">F = -kx</div>
            </div>
          </div>
        `,
        subsections: []
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'Bài tập 1: Con lắc lò xo',
        question: 'Một con lắc lò xo có khối lượng m = 200g, độ cứng k = 50 N/m. Tính chu kì và tần số dao động.',
        solution: `
          <p><strong>Giải:</strong></p>
          <div class="math-display">T = 2π√(m/k) = 2π√(0.2/50) = 2π√(0.004) = 2π × 0.063 ≈ 0.4s</div>
          <div class="math-display">f = 1/T = 1/0.4 = 2.5Hz</div>
        `,
        type: 'practice'
      }
    ],
    order: 3,
    isPublished: true
  },
  {
    id: 'con-lac-don',
    title: 'Con lắc đơn',
    subtitle: 'Dao động của con lắc đơn',
    icon: 'fas fa-circle',
    content: `
      Con lắc đơn gồm một vật nhỏ có khối lượng m treo vào một sợi dây không dãn, có khối lượng không đáng kể, có chiều dài l. 
      Khi góc lệch nhỏ (α < 10°), con lắc đơn dao động điều hòa.
      
      <div class="formula-box">
        <h4>Chu kì dao động</h4>
        <div class="math-display">T = 2π√(l/g)</div>
        <p class="note">Không phụ thuộc vào khối lượng và biên độ</p>
      </div>
    `,
    sections: [],
    exercises: [
      {
        id: 2,
        title: 'Bài tập 2: Con lắc đơn',
        question: 'Một con lắc đơn có chu kì T = 2s tại nơi có g = 10 m/s². Tính chiều dài của con lắc.',
        solution: `
          <p><strong>Giải:</strong></p>
          <div class="math-display">T = 2π√(l/g) ⇒ l = gT²/(4π²) = (10 × 4)/(4π²) = 40/40 = 1m</div>
        `,
        type: 'practice'
      }
    ],
    order: 4,
    isPublished: true
  },
  {
    id: 'bai-tap',
    title: 'Bài tập thực hành',
    subtitle: 'Luyện tập và kiểm tra',
    icon: 'fas fa-pencil-alt',
    content: 'Tổng hợp các bài tập và câu hỏi trắc nghiệm để luyện tập.',
    sections: [],
    exercises: [
      {
        id: 3,
        title: 'Bài tập 3: Phương trình dao động',
        question: 'Một vật dao động điều hòa với phương trình x = 5cos(4πt + π/3) cm. Xác định biên độ, chu kì, tần số và pha ban đầu.',
        solution: `
          <p><strong>Giải:</strong></p>
          <ul>
            <li>Biên độ: A = 5 cm</li>
            <li>Tần số góc: ω = 4π rad/s</li>
            <li>Chu kì: T = 2π/ω = 2π/(4π) = 0.5 s</li>
            <li>Tần số: f = 1/T = 2 Hz</li>
            <li>Pha ban đầu: φ = π/3 rad</li>
          </ul>
        `,
        type: 'practice'
      }
    ],
    order: 5,
    isPublished: true
  }
];

async function seedDatabase() {
  try {
    console.log('Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Kết nối thành công!');

    // Xóa dữ liệu cũ
    console.log('Đang xóa dữ liệu cũ...');
    await Chapter.deleteMany({});

    // Thêm dữ liệu mới
    console.log('Đang thêm dữ liệu mới...');
    await Chapter.insertMany(sampleChapters);

    console.log('✅ Đã seed thành công', sampleChapters.length, 'chương!');
    
    // Hiển thị dữ liệu đã thêm
    const chapters = await Chapter.find({}).select('id title order');
    console.log('📚 Các chương đã được thêm:');
    chapters.forEach(chapter => {
      console.log(`  ${chapter.order}. ${chapter.title} (${chapter.id})`);
    });

  } catch (error) {
    console.error('❌ Lỗi khi seed database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Đã đóng kết nối database');
  }
}

// Chạy script
seedDatabase();