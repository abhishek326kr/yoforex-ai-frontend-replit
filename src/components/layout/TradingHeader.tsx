import { useState } from "react";
import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LivePriceTracker from "@/components/LivePriceTracker";

export function TradingHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();

  return (
    <div className="fixed top-0 right-0 left-0 md:left-60 bg-card/90 backdrop-blur-md border-b border-border/20">
      <div className="h-[75px] flex items-center px-4 md:px-6 gap-4">
        {/* Live Price Tracker - Takes remaining space */}
        <div className="flex-1 min-w-0">
          <LivePriceTracker />
        </div>

        {/* Search Bar - Fixed width that won't grow */}
        <div className="w-[250px] flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search currencies, strategies..."
              className="pl-10 bg-muted/50 border-0 focus:bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right Section - Don't allow to grow */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Credit Display */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-glass backdrop-blur-sm rounded-lg border border-border/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">2,153</span>
            <span className="text-xs text-muted-foreground">credits</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">John Trader</p>
                  <p className="text-xs text-muted-foreground">Pro Plan</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account Balance</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      </div>
    
    
  );
}