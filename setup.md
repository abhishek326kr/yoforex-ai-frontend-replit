# Setup Instructions for YoForex AI Frontend

This is a clean, frontend-only version of the YoForex AI trading platform.

## Quick Setup

1. **Navigate to the frontend-only directory**:
   ```bash
   cd frontend-only
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to: `http://localhost:5173`

## What's Included

✅ **Complete Frontend**: All React components and pages from the original project
✅ **Professional UI**: Shadcn/ui components with trading-specific styling
✅ **Mock Data**: Sample trading data for demonstration
✅ **Responsive Design**: Works on desktop and mobile
✅ **TypeScript**: Full type safety throughout the application
✅ **Tailwind CSS**: Professional trading theme with glass morphism effects

## Removed (Backend Dependencies)

❌ Express.js server
❌ Database connections (PostgreSQL/Neon)
❌ Authentication system
❌ API routes
❌ Server-side storage

## Key Files

- `src/App.tsx` - Main application component
- `src/pages/Dashboard.tsx` - Trading dashboard with portfolio stats
- `src/components/layout/TradingLayout.tsx` - Main layout component
- `src/lib/queryClient.ts` - Mock API client (replace with real API calls)
- `src/index.css` - Professional trading theme styles
- `vite.config.ts` - Vite configuration with proper aliases

## Troubleshooting

### If you get import errors:
- Make sure you ran `npm install` in the frontend-only directory
- Check that all alias paths are working (`@/components/...`)

### If styling looks broken:
- Ensure Tailwind CSS is properly installed
- Check that `postcss.config.js` and `tailwind.config.js` are in place

### If you need to connect to your own APIs:
- Edit `src/lib/queryClient.ts` to point to your backend
- Replace mock data with real API calls
- Update TypeScript interfaces to match your API responses

## Next Steps

1. **Connect to your APIs**: Replace mock data in `queryClient.ts`
2. **Add authentication**: Implement user login/logout
3. **Real-time data**: Add WebSocket connections for live market data
4. **Deploy**: Use Vercel, Netlify, or any static hosting service