# 📚 Physics Book - Interactive Learning Platform

> **Sách Vật Lí 11 Tương Tác - Chương 1: Dao động**
> 
> Nền tảng học tập trực tuyến hiện đại cho môn Vật Lí lớp 11 theo chương trình Chân trời sáng tạo

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Tổng quan

Physics Book là một ứng dụng web tương tác được xây dựng bằng **Next.js 14** và **TypeScript**, cung cấp trải nghiệm học tập vật lí hiện đại với:

## ✨ Tính năng nổi bật

- � **Slide Presentation System**: Hệ thống trình chiếu bài học mượt mà với navigation keyboard/mouse
- 🔐 **User Authentication**: Đăng nhập/đăng ký an toàn với JWT và MongoDB Atlas
- � **Progress Tracking**: Theo dõi tiến độ học tập real-time với tích xanh và progress bar
- 🎨 **Multi-theme Support**: Dark mode với 3 chế độ (light/dark/sepia)
- 📱 **Responsive Design**: Tối ưu hoàn hảo cho desktop, tablet và mobile
- 🧮 **MathJax Integration**: Hiển thị công thức toán học LaTeX đẹp mắt
- 🎯 **Interactive Exercises**: Hệ thống bài tập trắc nghiệm tương tác
- � **Toast Notifications**: Thông báo hoàn thành bài học với animation
- 📈 **Learning Analytics**: Thống kê thời gian học và tỷ lệ hoàn thành

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 14** - React framework với App Router
- **TypeScript** - Type safety và developer experience  
- **Tailwind CSS** - Utility-first CSS framework
- **MathJax** - Render công thức toán học LaTeX

### Backend & Database
- **MongoDB Atlas** - Cloud database NoSQL
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing security

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Multiple theme options
- **Progress Tracking** - Real-time learning progress
- **Toast Notifications** - User feedback system

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Atlas account

### 1. Clone repository
```bash
git clone https://github.com/your-username/physics-book-nextjs.git
cd physics-book-nextjs
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment variables
Tạo file `.env.local` trong thư mục root:

```env
# MongoDB Atlas connection string  
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/physics_book?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Chạy development server
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### 5. Build cho production
```bash
npm run build
npm start
```

## 📁 Cấu trúc dự án

```
physics-book-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify/
│   │   └── progress/             # Progress tracking API
│   ├── lesson/[id]/              # Dynamic lesson pages
│   ├── lessons/                  # Lessons listing page
│   ├── practice/                 # Practice exercises
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable components
│   ├── AuthModal.tsx             # Login/Register modal
│   ├── SlidePresentation.tsx     # Slide presentation system
│   ├── Toast.tsx                 # Notification component
│   ├── UserMenu.tsx              # User dropdown menu
│   └── Math.tsx                  # MathJax wrapper
├── contexts/                     # React contexts
│   └── AuthContext.tsx           # Authentication context
├── hooks/                        # Custom React hooks
│   └── useProgress.ts            # Progress tracking hook
├── lib/                          # Utility libraries
│   └── mongodb.ts                # Database connection
├── models/                       # Database models
│   ├── User.ts                   # User schema
│   └── UserProgress.ts           # Progress schema
└── public/                       # Static assets
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập user
- `GET /api/auth/verify` - Verify JWT token

### Progress Tracking
- `GET /api/progress` - Lấy tiến độ học tập của user
- `POST /api/progress` - Cập nhật tiến độ bài học

## 📚 Nội dung học tập

### Chương 1: Dao động
1. **Bài 1**: Mô tả dao động - Khái niệm cơ bản và các đại lượng đặc trưng
2. **Bài 2**: Phương trình dao động điều hoà - Nghiên cứu phương trình vi phân
3. **Bài 3**: Năng lượng trong dao động điều hoà - Phân tích động năng và thế năng
4. **Bài 4**: Dao động tắt dần và hiện tượng cộng hưởng - Dao động có ma sát

### Tính năng bài học
- **Interactive slides** với animations mượt mà
- **Formula rendering** với MathJax LaTeX
- **Examples và exercises** tương tác
- **Progress tracking** từng bài chi tiết
- **Practice mode** với câu hỏi trắc nghiệm

## 🔧 Scripts có sẵn

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm start            # Chạy production server  
npm run lint         # Kiểm tra ESLint
npm run lint:fix     # Tự động fix ESLint errors
npm run type-check   # Kiểm tra TypeScript
npm run clean        # Xóa build cache
```

## 🌟 Tính năng đặc biệt

### 🔐 Authentication System
- **JWT-based authentication** với MongoDB Atlas
- **Secure password hashing** với bcrypt
- **Auto login persistence** với localStorage
- **Protected routes** cho user đã đăng nhập
- **User profile** với avatar và thông tin cá nhân

### 📊 Progress Tracking
- **Real-time progress** lưu trữ trên cloud
- **Completion badges** hiển thị trực quan
- **Time tracking** thời gian học từng bài
- **Progress analytics** với charts và statistics
- **Auto-completion** khi hoàn thành slides

### 🎨 UI/UX Excellence  
- **Multi-theme support** (light/dark/sepia)
- **Responsive design** hoàn hảo trên mọi device
- **Smooth animations** và transitions
- **Toast notifications** với custom styling
- **Keyboard shortcuts** cho power users

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Connect repository với Vercel
3. Cấu hình environment variables
4. Deploy tự động

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Hung Hoang**
- GitHub: [@hunghoang](https://github.com/hunghoang)
- Email: hunghoang.dev@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework  
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud Database Platform
- [MathJax](https://www.mathjax.org/) - Beautiful Math in All Browsers
- [Chân trời sáng tạo](https://chantroihcm.edu.vn/) - Educational Curriculum

**⭐ Đừng quên star repository nếu project hữu ích cho bạn!**
  sections: [...],
  exercises: [...],
  order: 1,
  isPublished: true
}
```

### 2. Thêm bài tập
```javascript
{
  id: 1,
  title: 'Tên bài tập',
  question: 'Câu hỏi...',
  solution: 'Lời giải...',
  type: 'practice' // hoặc 'quiz'
}
```

## Deployment

### Vercel
1. Push code lên GitHub
2. Kết nối với Vercel
3. Cấu hình environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## License

MIT License