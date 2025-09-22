# NextUI Dashboard Template - Complete Application Structure

## 📋 Project Overview

**Project Name:** NextUI Dashboard Template  
**Framework:** Next.js 14.0.4 with App Router  
**UI Library:** NextUI v2.0.22  
**Styling:** Tailwind CSS 3.3.3  
**Language:** TypeScript 4.8.3  
**Demo:** [https://nextui-dashboard-template.vercel.app/](https://nextui-dashboard-template.vercel.app/)

## 🏗️ Complete Directory Structure

```
nextui-dashboard/
├── 📁 actions/                          # Server Actions
│   └── auth.action.ts                   # Authentication server actions
├── 📁 app/                              # Next.js App Router Directory
│   ├── 📁 (app)/                        # Main application routes (grouped)
│   │   ├── 📁 accounts/                 # Accounts management
│   │   │   └── page.tsx                 # Accounts page component
│   │   ├── layout.tsx                   # App layout wrapper
│   │   └── page.tsx                     # Home/dashboard page
│   ├── 📁 (auth)/                       # Authentication routes (grouped)
│   │   ├── layout.tsx                   # Auth layout wrapper
│   │   ├── 📁 login/                    # Login functionality
│   │   │   └── page.tsx                 # Login page component
│   │   └── 📁 register/                 # Registration functionality
│   │       └── page.tsx                 # Register page component
│   ├── layout.tsx                       # Root layout component
│   └── providers.tsx                    # Theme and UI providers
├── 📁 components/                       # Reusable React Components
│   ├── 📁 accounts/                     # Account-related components
│   │   ├── add-user.tsx                 # Add user form component
│   │   └── index.tsx                    # Main accounts component
│   ├── 📁 auth/                         # Authentication components
│   │   ├── authLayout.tsx               # Authentication layout
│   │   ├── login.tsx                    # Login form component
│   │   └── register.tsx                 # Registration form component
│   ├── 📁 charts/                       # Chart components
│   │   └── steam.tsx                    # Steam chart component
│   ├── 📁 home/                         # Home page components
│   │   ├── card-agents.tsx              # Agents card component
│   │   ├── card-balance1.tsx            # Balance card variant 1
│   │   ├── card-balance2.tsx            # Balance card variant 2
│   │   ├── card-balance3.tsx            # Balance card variant 3
│   │   ├── card-transactions.tsx        # Transactions card
│   │   └── content.tsx                  # Main home content
│   ├── 📁 hooks/                        # Custom React hooks
│   │   ├── useBodyLock.ts               # Body scroll lock hook
│   │   └── useIsomorphicLayoutEffect.ts # SSR-safe layout effect
│   ├── 📁 icons/                        # Icon components
│   │   ├── 📁 accounts/                 # Account-related icons
│   │   │   ├── dots-icon.tsx            # Three dots menu icon
│   │   │   ├── export-icon.tsx          # Export icon
│   │   │   ├── info-icon.tsx            # Information icon
│   │   │   └── trash-icon.tsx           # Delete icon
│   │   ├── 📁 breadcrumb/               # Breadcrumb icons
│   │   │   ├── house-icon.tsx           # Home icon
│   │   │   └── users-icon.tsx           # Users icon
│   │   ├── 📁 navbar/                   # Navigation bar icons
│   │   │   ├── feedback-icon.tsx        # Feedback icon
│   │   │   ├── github-icon.tsx          # GitHub icon
│   │   │   ├── notificationicon.tsx     # Notification icon
│   │   │   └── support-icon.tsx         # Support icon
│   │   ├── 📁 sidebar/                  # Sidebar navigation icons
│   │   │   ├── accounts-icon.tsx        # Accounts icon
│   │   │   ├── balance-icon.tsx         # Balance icon
│   │   │   ├── bottom-icon.tsx          # Bottom navigation icon
│   │   │   ├── changelog-icon.tsx       # Changelog icon
│   │   │   ├── chevron-down-icon.tsx    # Chevron down icon
│   │   │   ├── chevron-up-icon.tsx      # Chevron up icon
│   │   │   ├── customers-icon.tsx       # Customers icon
│   │   │   ├── dev-icon.tsx             # Development icon
│   │   │   ├── filter-icon.tsx          # Filter icon
│   │   │   ├── home-icon.tsx            # Home icon
│   │   │   ├── payments-icon.tsx        # Payments icon
│   │   │   ├── products-icon.tsx        # Products icon
│   │   │   ├── reports-icon.tsx         # Reports icon
│   │   │   ├── settings-icon.tsx        # Settings icon
│   │   │   └── view-icon.tsx            # View icon
│   │   ├── 📁 table/                    # Table action icons
│   │   │   ├── delete-icon.tsx          # Delete action icon
│   │   │   ├── edit-icon.tsx            # Edit action icon
│   │   │   └── eye-icon.tsx             # View action icon
│   │   ├── acme-icon.tsx                # ACME company icon
│   │   ├── acmelogo.tsx                 # ACME logo component
│   │   ├── community.tsx                # Community icon
│   │   └── searchicon.tsx               # Search icon
│   ├── 📁 layout/                       # Layout components
│   │   ├── layout-context.ts            # Layout context provider
│   │   └── layout.tsx                   # Main layout component
│   ├── 📁 navbar/                       # Navigation bar components
│   │   ├── burguer-button.tsx           # Mobile menu button
│   │   ├── darkmodeswitch.tsx           # Dark mode toggle
│   │   ├── navbar.styles.ts             # Navbar styles
│   │   ├── navbar.tsx                   # Main navbar component
│   │   ├── notifications-dropdown.tsx   # Notifications dropdown
│   │   └── user-dropdown.tsx            # User profile dropdown
│   ├── 📁 sidebar/                      # Sidebar components
│   │   ├── collapse-items.tsx           # Collapsible menu items
│   │   ├── companies-dropdown.tsx       # Companies dropdown
│   │   ├── sidebar-item.tsx             # Individual sidebar item
│   │   ├── sidebar-menu.tsx             # Sidebar menu component
│   │   ├── sidebar.styles.ts            # Sidebar styles
│   │   └── sidebar.tsx                  # Main sidebar component
│   └── 📁 table/                        # Table components
│       ├── data.ts                      # Table data definitions
│       ├── render-cell.tsx              # Cell renderer component
│       └── table.tsx                    # Main table component
├── 📁 config/                           # Configuration files
│   └── fonts.ts                         # Font configuration
├── 📁 helpers/                          # Utility functions
│   ├── schemas.ts                       # Form validation schemas
│   └── types.ts                         # TypeScript type definitions
├── 📁 public/                           # Static assets
│   ├── dark.png                         # Dark mode preview image
│   ├── favicon.ico                      # Website favicon
│   ├── light.png                        # Light mode preview image
│   └── vercel.svg                       # Vercel logo
├── 📁 styles/                           # Global styles
│   └── globals.css                      # Global CSS styles
├── 📄 .eslintrc.json                    # ESLint configuration
├── 📄 .gitignore                        # Git ignore rules
├── 📄 LICENSE                           # MIT License
├── 📄 middleware.ts                     # Next.js middleware
├── 📄 next-env.d.ts                     # Next.js TypeScript definitions
├── 📄 next.config.js                    # Next.js configuration
├── 📄 package-lock.json                 # NPM lock file
├── 📄 package.json                      # Project dependencies and scripts
├── 📄 postcss.config.js                 # PostCSS configuration
├── 📄 README.md                         # Project documentation
├── 📄 tailwind.config.js                # Tailwind CSS configuration
└── 📄 tsconfig.json                     # TypeScript configuration
```

## 🚀 Key Features

### ✨ Core Functionality
- **Dark/Light Mode Support** - Built-in theme switching with next-themes
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Multi-Actor Dashboard System** - Role-based dashboards for different user types
- **Dynamic Navigation** - Sidebar navigation that changes based on user role
- **Dashboard Analytics** - Charts and data visualization with ApexCharts
- **Modern UI Components** - NextUI v2 components with beautiful design
- **Demo-Ready** - No authentication required, all routes accessible

### 🛠️ Technology Stack

#### Frontend
- **Next.js 14.0.4** - React framework with App Router
- **React 18.2.0** - UI library
- **NextUI 2.0.22** - Modern React component library
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **TypeScript 4.8.3** - Type-safe JavaScript

#### Charts & Visualization
- **ApexCharts 3.35.5** - Interactive charts
- **React-ApexCharts 1.4.0** - React wrapper for ApexCharts

#### Forms & Validation
- **Formik 2.4.6** - Form management
- **Yup 1.4.0** - Schema validation

#### Animation & Motion
- **Framer Motion 10.16.0** - Animation library

#### Utilities
- **clsx 2.0.0** - Conditional className utility
- **next-themes 0.2.1** - Theme management

## 🛣️ Application Routes

### Public Routes
- `/` - Home/Dashboard page
- `/login` - User login
- `/register` - User registration

### Protected Routes (App Group)
- `/accounts` - User accounts management

## 🎨 Component Architecture

### Layout System
- **Root Layout** (`app/layout.tsx`) - Global layout with providers
- **App Layout** (`app/(app)/layout.tsx`) - Main application layout
- **Auth Layout** (`app/(auth)/layout.tsx`) - Authentication pages layout

### Component Organization
- **Feature-based grouping** - Components organized by functionality
- **Icon system** - Centralized icon components with consistent naming
- **Reusable components** - Modular design for easy maintenance
- **Custom hooks** - Shared logic extraction

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Live Demo

The application is currently running at: **http://localhost:3000**

You can also view the live demo at: [https://nextui-dashboard-template.vercel.app/](https://nextui-dashboard-template.vercel.app/)

## 📊 Project Statistics

- **Total Components:** 50+ React components
- **Icon Components:** 25+ custom icons
- **Pages:** 4 main pages (Home, Login, Register, Accounts)
- **Dependencies:** 12 production dependencies
- **Dev Dependencies:** 8 development dependencies

## 📝 Package.json Dependencies

### Production Dependencies
```json
{
  "@nextui-org/react": "2.0.22",
  "apexcharts": "^3.35.5",
  "clsx": "^2.0.0",
  "formik": "^2.4.6",
  "framer-motion": "^10.16.0",
  "next": "^14.0.4",
  "next-themes": "0.2.1",
  "react": "18.2.0",
  "react-apexcharts": "^1.4.0",
  "react-dom": "18.2.0",
  "yup": "^1.4.0"
}
```

### Development Dependencies
```json
{
  "@types/node": "18.7.18",
  "@types/react": "18.0.20",
  "@types/react-dom": "18.0.6",
  "autoprefixer": "^10.4.15",
  "eslint": "8.23.1",
  "eslint-config-next": "13.4.16",
  "postcss": "^8.4.28",
  "tailwindcss": "^3.3.3",
  "typescript": "4.8.3"
}
```

## 🎯 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📚 Additional Resources

- [NextUI Documentation](https://nextui.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ApexCharts Documentation](https://apexcharts.com/)

---

This NextUI dashboard template provides a solid foundation for building modern, responsive web applications with a beautiful UI and excellent developer experience.
