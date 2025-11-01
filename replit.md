# YoForex AI - Trading Platform Documentation

## Overview

YoForex AI is a comprehensive AI-powered forex and crypto trading platform designed to provide real-time market analysis, trading signals, and portfolio management tools. It combines modern web technologies with AI-driven insights to assist traders in making informed decisions across various asset classes, including forex pairs, cryptocurrencies, indices, and commodities. The platform aims to be a leading solution for traders seeking advanced analytical capabilities and robust trading support.

## Recent Changes (November 1, 2025)

### Latest Session - Page Enhancements & Documentation:
-   **Settings Page:** Comprehensive redesign with professional trading features
    -   Color-coded tabs with icons (Risk=red/yellow, Preferences=blue, Security=green, API=purple)
    -   Trading Tab: Favorite pairs selector, session presets, position size, profit targets, visual risk indicators
    -   Notifications Tab: Schedule settings, priority levels, sound preferences, collapsible sections
    -   Security Tab: Security score (78/100), active sessions viewer, trusted devices, password strength meter, account export
    -   API & Data Tab: Usage statistics (1,247/5,000 daily calls), export/import, webhook testing, rate limiting
    -   UX: Unsaved changes warning, keyboard shortcuts (Ctrl+S), toast notifications, recently changed badges
-   **Profile Page:** Enhanced with trading statistics and better user experience
    -   Trading Statistics Summary: Total trades, win rate, total P&L, most traded pair, 30-day sparkline chart
    -   Personal Info: Avatar upload with preview, experience level, trading style, years of experience, about me
    -   Trading Preferences: Favorite pairs, preferred timeframes, risk tolerance slider, default lot size, trading goals
    -   Preferences: Language, date/number formats with examples, regional settings
    -   Security: Password strength meter, verification badges, account creation date
    -   Billing: Current plan badge, credits remaining, renewal date, payment methods, billing history link
    -   Profile completion indicator (0-100%) with tooltip
-   **Pricing Page:** Premium SaaS design with high conversion features
    -   Enhanced cards: Large animated icons, gradient text, hover effects (scale, glow, rotate)
    -   Detailed comparison table: 13+ features across 3 categories, expandable, zebra striping
    -   Trust indicators: Customer testimonials (3), security badges (SSL, 14-day guarantee), "10,000+ traders" badge
    -   Feature highlights: 4 key differentiators with gradient icon cards
    -   FAQ section: 10 questions with search functionality, category filters, accordion UI
    -   "Most Popular" effects: Pulsing glow animation, elevated card, animated star badge
    -   Interactive calculator: ROI calculator showing cost per analysis for each plan
    -   Bottom CTA: "Ready to Transform Your Trading?" with benefits checklist and dual CTAs
-   **Polished Legal/Info Pages:** Professional design for About, Contact, Legal, Terms, Privacy, Refunds
    -   All pages feature gradient cards with icons, better typography, mobile-responsive
    -   About: Our Values (4 cards), Meet the Team (3 teams), mission & disclaimer
    -   Contact: 4 contact cards (Email, Phone, Address, Hours), FAQ accordion, billing info
    -   Legal: Table of contents, company details, related documents section
    -   Terms: 10 sections with collapsible accordion, highlighted cancellation section
    -   Privacy: GDPR badges (4), section icons, "Your Rights" cards (6 rights), security highlights
    -   Refunds: Policy cards (4 key points), managing renewals steps, FAQ accordion
-   **Comprehensive Documentation:** Created 5 detailed documentation files (50,000+ words total)
    -   USER_GUIDE.md: Getting started, dashboard, AI analysis, trades, history, subscriptions, settings, community
    -   FAQ.md: 50+ Q&A covering general, billing, trading, technical, security topics
    -   TROUBLESHOOTING.md: Login, API, analysis, payment, UI issues with solutions
    -   API_INTEGRATION.md: Developer guide with endpoints, authentication, rate limits, code examples
    -   CHANGELOG.md: Version history with added/improved/fixed features

### Previous Enhancements:
-   **ActiveTrades Page:** Complete redesign with modern UI matching LiveTrading quality
    -   Added header section with quick stats (Total Active, Total P&L, Win/Loss Ratio, Risk Exposure)
    -   Implemented comprehensive filters (search, direction, profitability, strategy, sort options)
    -   Enhanced trade cards with gradient backgrounds and better visual hierarchy
    -   Added beautiful empty state with call-to-action
    -   Improved quick action buttons and hover effects
-   **History Page:** Major improvements for better analysis tracking
    -   Added header with 4 stat cards (Total Analyses, This Month, Most Used Strategy, Most Analyzed Pair)
    -   Implemented bar chart showing "Analyses per Day" for last 7 days using recharts
    -   Added 6-filter system (search, date range, pair, strategy, signal type, provider)
    -   Enhanced history cards with gradient design, confidence progress bars, time-ago formatting
    -   Implemented CSV export functionality with proper data formatting
    -   Improved pagination with "Showing X-Y of Z" counter and better navigation
    -   Added "Copy Analysis" feature to quickly copy trade details
-   **Dashboard API Infrastructure:** Created complete backend API specifications
    -   API client functions in `src/lib/api/dashboard.ts` (8 endpoints)
    -   React hooks in `src/hooks/useDashboard.ts` for easy data fetching
    -   Comprehensive documentation in `docs/DASHBOARD_API_SPEC.md` for backend team

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The YoForex AI frontend is a Single Page Application (SPA) built with React 18, TypeScript, and Vite. It utilizes Shadcn/ui (based on Radix UI) and Tailwind CSS for a responsive, component-based UI. State management is handled by TanStack Query and React Context API, with Wouter for lightweight client-side routing.

The frontend communicates with a FastAPI (Python) backend via an API-first design. All business logic resides on the backend. Communication is managed through a centralized Axios instance with interceptors for JWT token attachment, automatic retries, and error parsing.

**Key Technical Implementations & Features:**
-   **AI-Powered Trading Analysis:**
    -   Multi-provider support: OpenAI, Claude, Gemini, DeepSeek, Mistral, Cohere, xAI.
    -   Extensive range of trading strategies (e.g., Breakout, ICT, SMC, Fibonacci, Trend Following, Momentum).
    -   Support for multiple timeframes (M1 to Monthly).
-   **Real-Time Market Data:**
    -   Integrated TradingView for advanced charting, 100+ technical indicators, and real-time price feeds.
    -   Supports Forex, Cryptocurrencies, Indices, Commodities, and Indian Stocks.
-   **Trade Management:**
    -   Tracking of trade execution, real-time P&L calculation, risk management tools, and historical trade data.
-   **Billing & Subscriptions:**
    -   Offers Free, Pro, and Max plans with varying token limits.
    -   Supports Cashfree (INR) and CoinPayments (50+ cryptocurrencies) for payments.
-   **Community Features:**
    -   Integrated forum system with discussion categories, rich text editor, image attachments, and like/comment functionality.
    -   Support ticket system with priority levels, department routing, and attachment support.

**Frontend Folder Structure:**
-   `components/`: Reusable UI components, including base UI primitives (`ui/`), layout (`layout/`), billing (`billing/`), forum (`forum/`), inputs (`inputs/`), and user (`user/`) components.
-   `pages/`: Page-level components corresponding to routes.
-   `lib/`: Utilities and API clients.
-   `context/`: React Context providers.
-   `hooks/`: Custom React hooks.
-   `types/`: TypeScript type definitions.
-   `styles/`: Global styles.
-   `utils/`: Utility functions.
-   `config/`: Configuration files.

**UI/UX Decisions:**
-   Utilizes Shadcn/ui and Tailwind CSS for a modern, consistent, and highly customizable design system.
-   Responsive design with a mobile-first approach.
-   Dark/light/system theme toggle.
-   User preference persistence (e.g., compact view).

**Core System Design Choices:**
-   **Single Page Application (SPA):** Provides a fluid user experience.
-   **API-First Design:** Ensures clear separation of concerns and a scalable backend.
-   **Component-Based Architecture:** Promotes modularity, reusability, and maintainability.
-   **TypeScript:** Enforces type safety throughout the application.

## External Dependencies

-   **Backend API:** FastAPI (Python) hosted at `https://backend.yoforexai.com`.
-   **⚠️ CRITICAL ISSUE:** Backend CORS configuration must whitelist Replit domain for API calls to work. Current frontend domain: `f4dbd08b-4383-44fb-aa22-dddbab14983e-00-3dphvgwz22lyu.riker.replit.dev`
-   **Real-time Data & Charting:** TradingView Widgets.
-   **AI Providers:** OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Mistral, Cohere, xAI.
-   **Image Uploads:** Cloudinary.
-   **Payment Gateways:**
    -   Cashfree (for INR payments).
    -   CoinPayments (for cryptocurrency payments).
-   **State Management:** TanStack Query.
-   **UI Library:** Radix UI (via Shadcn/ui).
-   **Styling:** Tailwind CSS.
-   **Notifications:** react-toastify.
-   **Rich Text Editor:** TipTap.
-   **HTTP Client:** Axios.
-   **Routing:** Wouter.