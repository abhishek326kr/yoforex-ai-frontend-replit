# YoForex AI - Trading Platform Documentation

## Overview
YoForex AI is a comprehensive AI-powered forex and crypto trading platform providing real-time market analysis, trading signals, and portfolio management. It leverages modern web technologies with AI-driven insights to assist traders across various asset classes including forex, cryptocurrencies, indices, and commodities. The platform aims to empower traders with informed decision-making tools and a robust trading ecosystem.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is a Single Page Application (SPA) built with React 18, TypeScript, and Vite. It utilizes Shadcn/ui (Radix UI) and Tailwind CSS for a responsive, mobile-first design, and Wouter for client-side routing. State management is handled by TanStack Query and React Context API. The codebase follows a component-based architecture with clear separation of concerns in `src/` for components, pages, utilities, and hooks.

### Backend Integration Architecture
The frontend communicates with a FastAPI backend located at `https://backend.axiontrust.com`. An Axios-based API client (`src/lib/api/client.ts`) manages all API calls, including interceptors for JWT token attachment, automatic retry logic, and error parsing.

### Core Architectural Decisions
- **API-First Design**: Business logic is primarily backend-driven.
- **TypeScript**: Ensures full type safety across the application.
- **Component-Based**: Promotes modularity and reusability of UI elements.
- **Responsive Design**: Prioritizes mobile experience with adaptable layouts.

### UI/UX Decisions
The platform uses Shadcn/ui (Radix UI) and Tailwind CSS for a consistent, modern, and highly customizable user interface. Key layout components like `TradingLayout`, `TradingSidebar`, and `TradingHeader` ensure a cohesive user experience with features like live price tracking, navigation, and user-specific information displays. Core trading components like `MarketOverview`, `TradeExecution`, and `AIMultiPanel` provide specialized functionality.

### Feature Specifications
- **AI-Powered Trading Analysis**: Supports multiple AI providers (OpenAI, Claude, Gemini, DeepSeek, Mistral, Cohere, xAI) across various trading strategies (e.g., Breakout, ICT, SMC, Fibonacci) and timeframes (M1 to Monthly).
- **Real-Time Market Data**: Integrates TradingView for advanced charting, 100+ technical indicators, and real-time price feeds for Forex, Cryptocurrencies, Indices, and Commodities.
- **Trade Management**: Offers features for trade execution tracking, real-time P&L, risk management, trade journaling, and performance analytics.
- **Billing & Subscriptions**: Includes Free, Pro, and Max plans with different credit limits. Integrates Cashfree (for INR payments) and CoinPayments (for 50+ cryptocurrencies).
- **Community Features**: Provides a forum system with discussion categories, rich text editing, interaction features (likes, comments), and a support ticket system with priority levels and attachments.

### System Design Choices
- **Authentication**: JWT-based with access tokens stored in localStorage, automatic token refresh, and protected routes. Supports email/password, WhatsApp OTP, and email OTP verification for signup/login.
- **Security**: HTTPS for all API calls, 24-hour JWT token expiry, rate limiting, input validation, and secure handling of sensitive data and environment variables.

## External Dependencies

- **Backend API**: FastAPI (Python) hosted at `https://backend.axiontrust.com`
- **Real-time Data & Charting**: TradingView Widgets
- **AI Providers**: OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Mistral AI, Cohere, xAI
- **Payment Gateways**:
    - Cashfree (for INR payments, credit/debit cards, UPI, net banking)
    - CoinPayments (for cryptocurrency payments: BTC, ETH, USDT, BNB, etc.)
- **UI Framework**: Shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Image Uploads**: Cloudinary
- **Notifications**: react-toastify
- **Charting Library**: Recharts
- **Form Management**: react-hook-form
- **Rich Text Editor**: TipTap