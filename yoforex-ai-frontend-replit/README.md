# YoForex AI - Frontend Only

A clean, standalone frontend version of the YoForex AI trading platform extracted from the original full-stack Replit project.

## Features

- **Professional Trading Interface**: Modern, responsive design optimized for forex trading
- **AI Trading Dashboard**: Comprehensive dashboard with portfolio stats and AI signals
- **Real-time Trading Views**: Live trading interface with market data visualization
- **Trading History**: Complete trading history and performance analytics
- **Settings & Configuration**: User preferences and platform settings
- **Pricing & Billing**: Subscription management interface

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom trading theme
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for trading data visualization

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (TradingLayout, Sidebar, etc.)
│   └── ui/             # Shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main trading dashboard
│   ├── LiveTrading.tsx # Live trading interface
│   ├── History.tsx     # Trading history
│   ├── ActiveTrades.tsx # Active trades management
│   ├── Settings.tsx    # User settings
│   ├── Pricing.tsx     # Pricing plans
│   └── Billing.tsx     # Billing management
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports
```

## Customization

### API Integration

The current version uses mock data for demonstration. To integrate with your own APIs:

1. Update `src/lib/queryClient.ts` to point to your backend endpoints
2. Replace mock data with actual API calls
3. Update TypeScript interfaces to match your API responses

### Styling

The application uses a professional trading theme. To customize:

1. Edit CSS variables in `src/index.css`
2. Modify `tailwind.config.js` for theme adjustments
3. Update component styles in individual component files

### Adding New Features

1. Create new page components in `src/pages/`
2. Add routes in `src/App.tsx`
3. Update navigation in `src/components/layout/TradingSidebar.tsx`

## Design System

The application uses a professional dark theme optimized for trading interfaces:

- **Colors**: Trading-specific palette with profit/loss indicators
- **Typography**: Clean, readable fonts optimized for financial data
- **Components**: Glass morphism effects and smooth animations
- **Responsive**: Mobile-first design with adaptive layouts

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Original Project

This frontend was extracted from a full-stack YoForex AI trading platform originally built on Replit. The backend components have been removed and replaced with mock data for standalone operation.

## Next Steps

To make this a complete trading platform:

1. **Backend Integration**: Connect to your trading APIs
2. **Authentication**: Add user authentication system
3. **Real-time Data**: Implement WebSocket connections for live market data
4. **Trading Execution**: Add actual trade execution capabilities
5. **Database**: Connect to your database for persistent data storage

## Support

For issues or questions about this frontend-only version, please refer to the original project documentation or create a new issue in your project repository.