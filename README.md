# 🎓 CardCrafty - Modern Flashcard Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-cyan)](https://tailwindcss.com/)

> A modern, full-stack flashcard learning platform built with cutting-edge technologies. Features user authentication, deck management, and an intuitive study experience.

## 🚀 Live Demo

[**View Live Application**](https://cardcrafty.com)

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure user registration and login with Supabase Auth
- Email verification and password reset functionality
- Protected routes with Next.js 16 proxy middleware
- Session management with HTTP-only cookies

### 📚 **Deck & Card Management**
- Create, edit, and delete flashcard decks
- Add multimedia content to cards (text, images) - Future
- Organize decks by categories and tags - Future
- Import/Export deck functionality - Future

### 🎯 **Study Experience**
- Interactive flashcard study sessions
- Spaced repetition algorithm for optimal learning
- Progress tracking and performance analytics
- Multiple study modes (review, quiz, speed cards) - Future

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light mode support
- Smooth animations and transitions
- Accessible design following WCAG guidelines

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 16** - Latest React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### **Backend & Database**
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Auth** - User authentication and session management
- **Server-Side Rendering** - Optimized performance with SSR

### **Development Tools**
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Next.js Proxy** - Route protection and middleware
- **SASS** - Enhanced CSS preprocessing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jamesl1500/quizlet-clone.git
   cd quizlet-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Database Setup**
   ```bash
   # Run database migrations (if using Supabase CLI)
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up authentication providers
3. Configure database tables and policies
4. Add environment variables to your project

### Next.js 16 Features
- **Proxy Middleware**: Handles authentication and route protection
- **App Router**: File-system based routing with layouts
- **Server Components**: Improved performance with RSC
- **Streaming**: Progressive page loading

## 🎯 Key Technical Highlights

### **Authentication Flow**
- Cookie-based session management for SSR compatibility
- Protected routes using Next.js 16 proxy middleware
- Automatic redirect handling for unauthenticated users

### **Performance Optimizations**
- Server-side rendering for improved SEO
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient state management

### **Type Safety**
- Full TypeScript implementation
- Type-safe database queries with Supabase
- Comprehensive error handling

## 🧪 Testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 📈 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Minimal bundle with tree-shaking
- **Loading Speed**: Sub-second initial page loads

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**James L**
- Portfolio: [jameslatten.com](https://jameslatten.com)
- LinkedIn: [linkedin.com/in/jameslattenjr](https://www.linkedin.com/in/jameslattenjr/)
- GitHub: [@jamesl1500](https://github.com/jamesl1500)

---

## 🎯 Why This Project?

This project demonstrates:
- **Modern React/Next.js Development** - Using the latest features and best practices
- **Full-Stack Capabilities** - From database design to user interface
- **Production-Ready Code** - Proper error handling, authentication, and security
- **Clean Architecture** - Maintainable and scalable code structure
- **Performance Focus** - Optimized for speed and user experience

*Built with ❤️ using Next.js 16, React 19, and TypeScript*
