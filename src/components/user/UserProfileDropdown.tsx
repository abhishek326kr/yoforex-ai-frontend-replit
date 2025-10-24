import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { profileStorage } from "@/utils/profileStorage";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileDropdown() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.email) {
        try {
          // First try to get from profile storage
          const profile = await profileStorage.getProfile();
          if (profile) {
            setUserProfile(profile);
          } else {
            // If no profile in storage, use the user data from auth context
            setUserProfile(user);
          }
        } catch (error) {
          console.error('Failed to load user profile in dropdown:', error);
          // Fallback to auth context user data
          setUserProfile(user);
        }
      } else {
        setUserProfile(null);
      }
    };
    
    loadUserProfile();
  }, [user]);
  
  // Prioritize fetched profile data over auth context data
  const displayName = userProfile?.name || user?.name || 'User';
  const displayEmail = userProfile?.email || user?.email || 'user@example.com';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full border border-border/30 p-0 overflow-hidden"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.avatar_url || user?.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="text-xs">
              {(displayName || 'U')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0,2)
              }
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
            {userProfile?.location && (
              <p className="text-xs leading-none text-primary">
                📍 {userProfile.location}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setLocation('/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setLocation('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
