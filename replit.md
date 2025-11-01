# YoForex AI - Trading Platform Documentation

## Overview

YoForex AI is a comprehensive AI-powered forex and crypto trading platform providing real-time market analysis, trading signals, and portfolio management. It leverages AI-driven insights to assist traders in making informed decisions across various asset classes, including forex pairs, cryptocurrencies, indices, and commodities. The platform aims to be a leading solution for advanced analytical capabilities and robust trading support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The YoForex AI frontend is a Single Page Application (SPA) built with React 18, TypeScript, and Vite. It uses Shadcn/ui (based on Radix UI) and Tailwind CSS for a responsive, component-based UI, with state management handled by TanStack Query and React Context API, and Wouter for routing. The frontend communicates with a FastAPI (Python) backend via an API-first design, utilizing Axios for communication with interceptors for JWT, retries, and error parsing.

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

## External Dependencies

-   **Backend API:** FastAPI (Python) hosted at `https://backend.yoforexai.com`.
-   **Real-time Data & Charting:** TradingView Widgets.
-   **AI Providers:** OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Mistral, Cohere, xAI.
-   **Image Uploads:** Cloudinary.
-   **Payment Gateways:** Cashfree (INR) and CoinPayments (cryptocurrency).
-   **State Management:** TanStack Query.
-   **UI Library:** Radix UI (via Shadcn/ui).
-   **Styling:** Tailwind CSS.
-   **Notifications:** react-toastify.
-   **Rich Text Editor:** TipTap.
-   **HTTP Client:** Axios.
-   **Routing:** Wouter.