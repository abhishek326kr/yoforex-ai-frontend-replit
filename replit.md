# YoForex AI - Trading Platform

## Overview

YoForex AI is a comprehensive AI-powered forex and crypto trading platform that provides real-time market analysis, trading signals, and portfolio management tools. The platform combines modern web technologies with AI-driven insights to help traders make informed decisions across multiple asset classes including forex pairs, cryptocurrencies, indices, and commodities.

## Deployment

**Current Platform:** Replit  
**Previous Platform:** Vercel (migrated November 2025)

### Running on Replit
- Development server runs on port 5000 bound to 0.0.0.0 for Replit compatibility
- Hot Module Replacement (HMR) configured for secure WebSocket over wss:// protocol
- Uses `REPLIT_DEV_DOMAIN` environment variable for proper preview domain routing
- All environment variables (API keys, Cloudinary config) stored in Replit Secrets

### Environment Variables Required
- `VITE_PUBLIC_API_BASE_URL` - Backend API URL
- `VITE_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads
- `VITE_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset
- `VITE_CLOUDINARY_FOLDER` - Optional folder path in Cloudinary

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom trading theme
- Glass morphism design system with dark theme optimized for trading interfaces
- Framer Motion for smooth animations and transitions
- Custom CSS variables for theming (`--primary`, `--background`, `--card`, etc.)

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- Context API for authentication state (`AuthProvider`)
- Context API for active trades management (`ActiveTradesProvider`)
- Local storage for user preferences, profiles, and cached data

**Authentication Flow**
- JWT-based authentication with access tokens stored in localStorage
- Protected and public route components for route guards
- Auto-logout on token expiration with cross-tab synchronization
- Session storage for redirect paths after authentication

**Key Design Patterns**
- Protected routes require authentication before rendering
- Public routes redirect authenticated users away
- Profile data cached in localStorage with `profileStorage` utility
- Theme provider supports dark/light/system modes with localStorage persistence

### Data Flow & API Integration

**API Client Architecture**
- Centralized API configuration in `src/config/api.ts`
- Backend base URL configurable via `VITE_PUBLIC_API_BASE_URL` environment variable
- Axios-based API client with interceptors for authentication headers
- Development proxy configuration in Vite for `/api`, `/prices`, `/analysis` routes

**Backend Integration Points**
- Trading analysis: `https://backend.axiontrust.com/analysis/*`
- User authentication: `/auth/*` endpoints
- Billing & subscriptions: `/billing/*` endpoints
- Forum & community: `/forum/*` endpoints
- Support tickets: `/support/*` endpoints
- Live price data: `/prices/*` endpoints

**Real-time Data**
- TradingView widgets for live charts and price tickers
- Polling mechanisms for price updates and market data
- WebSocket-ready architecture (not currently implemented)

### Feature Modules

**Trading Features**
- Multi-timeframe chart analysis (1M to 1MO intervals)
- Multiple trading strategies (Breakout, Fibonacci, ICT, SMC, etc.)
- AI-powered signal generation with multiple AI models (GPT, Claude, Gemini, etc.)
- Active trade tracking with P&L calculations
- Trade execution simulation and paper trading
- Trading journal for performance tracking

**AI Analysis System**
- Multi-provider AI analysis (OpenAI, Claude, Gemini, DeepSeek, Mistral, Cohere, xAI)
- Strategy-based analysis with confidence scoring
- Technical indicator integration (RSI, MACD, Moving Averages)
- Tiered access to AI models based on subscription plan

**Billing & Subscription**
- Cashfree payment integration for INR payments
- CoinPayments integration for cryptocurrency payments
- Three-tier subscription model (Free, Pro, Max)
- Credit-based usage system with daily and monthly caps
- Invoice generation and transaction history
- Automatic plan upgrades and downgrades

**Community Features**
- Forum system with categories and posts
- Rich text editor for post creation (TipTap)
- Support ticket system with file attachments
- User profiles and avatars

### Pricing & Localization

**Currency Handling**
- Dynamic pricing based on user's phone country code
- USD as base currency with INR conversion (1 USD = 92 INR)
- Country detection from phone dial code
- Automatic currency symbol and formatting

### Performance Optimizations

**Caching Strategy**
- Profile data cached in localStorage
- Billing summary cached with deduplication to prevent API spam
- Query client with 5-minute stale time for data freshness
- Event-based cache invalidation for billing updates

**Code Splitting**
- Route-based code splitting via dynamic imports
- Lazy loading of heavy components (charts, editors)
- Tree-shaking enabled in production builds

## External Dependencies

### Payment Processors
- **Cashfree Payments**: Indian payment gateway for INR transactions (sandbox/production modes)
- **CoinPayments**: Cryptocurrency payment processor for global payments

### Third-Party Services
- **TradingView**: Chart widgets and market data visualization
- **Cloudinary**: Image hosting for user avatars and forum attachments
- **Google Analytics**: User analytics and tracking (GA tracking ID: G-E0XL4GJHBW)

### AI Model Providers
- OpenAI (GPT models)
- Anthropic Claude
- Google Gemini
- DeepSeek
- Mistral AI
- Cohere
- xAI (Grok)

### Backend API
- **Primary Backend**: `https://backend.axiontrust.com`
- Endpoints for authentication, trading analysis, billing, forum, and support
- RESTful API architecture with JWT authentication
- No database directly accessed from frontend

### UI & Design Libraries
- Radix UI primitives (accordion, dialog, dropdown, etc.)
- Lucide React icons
- FontAwesome icons
- Recharts for data visualization
- React Toastify for notifications

### Development Tools
- ESLint for code quality
- TypeScript compiler for type checking
- PostCSS with Autoprefixer for CSS processing
- Vercel for deployment (configured in vercel.json)

### Environment Variables Required
- `VITE_PUBLIC_API_BASE_URL`: Backend API base URL
- `VITE_CASHFREE_ENV`: Cashfree environment (sandbox/production)
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset
- `VITE_CLOUDINARY_FOLDER`: Optional folder for uploads