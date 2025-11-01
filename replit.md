# YoForex AI - Trading Platform Documentation

## Overview

YoForex AI is a comprehensive AI-powered forex and crypto trading platform providing real-time market analysis, trading signals, and portfolio management. It leverages AI-driven insights to assist traders in making informed decisions across various asset classes, including forex pairs, cryptocurrencies, indices, and commodities. The platform aims to be a leading solution for advanced analytical capabilities and robust trading support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

YoForex AI is a full-stack application with both frontend and backend running locally on Replit:

**Frontend (Port 5000):**
- Single Page Application (SPA) built with React 18, TypeScript, and Vite
- Shadcn/ui (based on Radix UI) and Tailwind CSS for responsive, component-based UI
- State management with TanStack Query and React Context API
- Wouter for client-side routing
- Axios for API communication with JWT interceptors, retries, and error parsing

**Backend (Port 8000):**
- FastAPI (Python 3.11) REST API
- JWT-based authentication with bcrypt password hashing
- CORS enabled for Replit development environment
- Mock AI analysis services (GPT-4, Claude, Gemini, Perplexity)
- Comprehensive endpoint coverage:
  - `/auth/*` - Authentication (signup, login, profile)
  - `/trading/*` - Trading analysis (automated & manual AI confirmation)
  - `/market/*` - Market data (pairs, news, real-time data)
  - `/user/*` - User management (settings, billing, subscription)
- Structured with clean architecture: endpoints, schemas, services, core config

### UI/UX Decisions
-   Modern, consistent, and highly customizable design system using Shadcn/ui and Tailwind CSS.
-   Responsive design with a mobile-first approach.
-   Dark/light/system theme toggle and user preference persistence.
-   Advanced UI components for trading analysis, including multi-image uploads, voice recording for analysis input, custom template management, interactive charts with drawing tools, and multi-step progress indicators.
-   Comprehensive settings, profile, and pricing pages with professional trading features and high-conversion design elements.

### Technical Implementations
-   **AI-Powered Trading Analysis:** Supports multiple AI providers (OpenAI, Claude, Gemini, etc.) and an extensive range of trading strategies across multiple timeframes. Features include multi-model responses, consensus generation, confidence breakdowns, risk assessment, and alternative scenario analysis.
-   **Real-Time Market Data:** Integration with TradingView for advanced charting, indicators, and real-time price feeds across various asset classes.
-   **Trade Management:** Tools for tracking trade execution, real-time P&L, risk management, and historical trade data.
-   **Billing & Subscriptions:** Offers Free, Pro, and Max plans with varied token limits and supports multiple payment gateways.
-   **Community Features:** Integrated forum system and a support ticket system.

### System Design Choices
-   **Single Page Application (SPA):** For a fluid user experience.
-   **API-First Design:** Ensures clear separation of concerns and scalability.
-   **Component-Based Architecture:** Promotes modularity, reusability, and maintainability.
-   **TypeScript:** Enforces type safety.

## Backend Structure

```
backend/
├── app/
│   ├── api/
│   │   └── endpoints/
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── trading.py      # Trading analysis endpoints
│   │       ├── market.py       # Market data endpoints
│   │       └── user.py         # User management endpoints
│   ├── core/
│   │   ├── config.py           # Settings & configuration
│   │   └── security.py         # JWT & password utilities
│   ├── schemas/
│   │   ├── user.py             # User/auth schemas
│   │   ├── trading.py          # Trading schemas
│   │   └── billing.py          # Billing schemas
│   ├── services/
│   │   ├── ai_service.py       # AI analysis logic (mock)
│   │   └── market_service.py   # Market data logic (mock)
│   └── main.py                 # FastAPI app initialization
├── requirements.txt             # Python dependencies
└── run.py                       # Server entry point
```

## External Dependencies

-   **Backend Framework:** FastAPI with Uvicorn (local, port 8000)
-   **Real-time Data & Charting:** TradingView Widgets
-   **AI Providers (for production):** OpenAI, Anthropic Claude, Google Gemini, Perplexity (currently mock)
-   **Image Uploads:** Cloudinary
-   **Payment Gateways:** Cashfree (INR) and CoinPayments (cryptocurrency)
-   **State Management:** TanStack Query
-   **UI Library:** Radix UI (via Shadcn/ui)
-   **Styling:** Tailwind CSS
-   **Notifications:** react-toastify
-   **Backend Libraries:** python-jose (JWT), bcrypt (password hashing), httpx (HTTP client)
-   **Rich Text Editor:** TipTap.
-   **HTTP Client:** Axios.
-   **Routing:** Wouter.