# Contributing to Physics Book

Thank you for your interest in contributing to Physics Book! This document provides guidelines and information for contributors.

## 🎯 Project Overview

Physics Book is an interactive learning platform for Grade 11 Physics (Vietnam curriculum). We're building a modern, engaging way for students to learn physics concepts through:

- Interactive slide presentations
- Progress tracking
- User authentication
- Practice exercises
- Mathematical formula rendering

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Check existing issues** to avoid duplicates
2. **Use the issue template** when available
3. **Provide clear reproduction steps**
4. **Include relevant environment details**

#### Bug Reports Should Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser/device information

#### Feature Requests Should Include:
- Clear description of the feature
- Use case and motivation
- Proposed solution or implementation
- Alternative solutions considered

### Pull Requests

#### Before Starting Work:
1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Check existing PRs** to avoid duplicate work
4. **Discuss large changes** in an issue first

#### Development Setup:
```bash
# 1. Fork and clone the repo
git clone https://github.com/your-username/physics-book-nextjs.git
cd physics-book-nextjs

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB Atlas connection string

# 4. Start development server
npm run dev
```

#### Code Standards:
- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Formatting**: Use Prettier (run `npm run lint:fix`)
- **Naming**: Use descriptive names for variables and functions
- **Comments**: Document complex logic and APIs

#### Pull Request Process:
1. **Update documentation** if needed
2. **Add tests** for new functionality (when applicable)
3. **Ensure all checks pass** (lint, type-check, build)
4. **Write clear commit messages**
5. **Update CHANGELOG.md** for significant changes

#### Commit Message Convention:
```
type(scope): description

feat(auth): add user registration functionality
fix(slides): resolve navigation keyboard shortcuts
docs(readme): update installation instructions
style(ui): improve dark mode contrast
refactor(api): optimize progress tracking queries
test(auth): add authentication unit tests
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Code Review Process

All submissions require review. We use GitHub pull requests for this purpose. Reviewers will check for:

- **Functionality**: Does the code work as intended?
- **Code Quality**: Is the code readable and maintainable?
- **Performance**: Are there any performance implications?
- **Security**: Are there any security concerns?
- **Testing**: Is the code adequately tested?

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   ├── lesson/[id]/       # Dynamic lesson pages
│   └── ...
├── components/            # Reusable React components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # Database schemas
└── public/               # Static assets
```

### Key Areas for Contribution:

#### 🎓 Content & Education
- **Physics lessons**: Add more chapters/lessons
- **Practice exercises**: Create interactive problems
- **Translations**: Add support for other languages
- **Accessibility**: Improve screen reader support

#### 💻 Technical Features
- **Performance**: Optimize loading times
- **Mobile**: Improve mobile experience
- **PWA**: Add offline functionality
- **Analytics**: Enhanced learning analytics

#### 🎨 Design & UX
- **Animations**: Smooth transitions
- **Themes**: Additional theme options
- **Responsive**: Better mobile layouts
- **Accessibility**: WCAG compliance

#### 🔧 Developer Experience
- **Testing**: Add unit and integration tests
- **Documentation**: Improve code documentation
- **CI/CD**: Enhance build pipeline
- **Tools**: Developer productivity tools

## 🚀 Development Guidelines

### Adding New Lessons

1. **Content Structure**: Follow existing lesson format
```typescript
interface Slide {
  id: number
  title: string
  content: string
  type: 'intro' | 'concept' | 'formula' | 'example' | 'summary'
  formulas?: string[]
  images?: string[]
  notes?: string
}
```

2. **Progress Tracking**: Ensure new lessons integrate with progress system
3. **MathJax**: Use LaTeX syntax for mathematical formulas
4. **Responsive**: Test on various screen sizes

### Adding New Features

1. **API Design**: Follow RESTful principles
2. **Database**: Use Mongoose schemas
3. **Authentication**: Respect user permissions
4. **Error Handling**: Provide meaningful error messages
5. **TypeScript**: Add proper type definitions

### Performance Considerations

- **Image Optimization**: Use Next.js Image component
- **Bundle Size**: Monitor and optimize bundle size
- **Database Queries**: Optimize MongoDB queries
- **Caching**: Implement appropriate caching strategies

## 🧪 Testing

Currently, the project is setting up testing infrastructure. Future testing should include:

- **Unit Tests**: Component and utility functions
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user flows
- **Performance Tests**: Load and speed testing

## 📚 Resources

### Learning Materials
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Physics Content Guidelines
- [Vietnam Education Curriculum](https://moet.gov.vn/)
- [MathJax Documentation](https://docs.mathjax.org/)
- [LaTeX Math Symbols](https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: hunghoang.dev@gmail.com for private matters

## 🏆 Recognition

Contributors will be acknowledged in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub contributors page

## 📋 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you agree to uphold this code.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Respecting differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment of any kind
- Publishing others' private information
- Trolling, insulting, or derogatory comments
- Other conduct inappropriate in a professional setting

## 🎉 Thank You!

Your contributions help make physics education more accessible and engaging for Vietnamese students. Every contribution, no matter how small, makes a difference!

---

**Happy Contributing! 🚀**