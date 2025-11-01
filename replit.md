# YoForex AI - Trading Platform Documentation

## Overview

YoForex AI is a comprehensive AI-powered forex and crypto trading platform designed to provide real-time market analysis, trading signals, and portfolio management tools. It combines modern web technologies with AI-driven insights to assist traders in making informed decisions across various asset classes, including forex pairs, cryptocurrencies, indices, and commodities. The platform aims to be a leading solution for traders seeking advanced analytical capabilities and robust trading support.

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

-   **Backend API:** FastAPI (Python) hosted at `https://backend.axiontrust.com`.
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