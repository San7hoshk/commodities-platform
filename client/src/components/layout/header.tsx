import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, User, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Get user initials
  const getUserInitials = () => {
    if (!user) return "";
    
    const username = user.username;
    if (username.length <= 2) return username.toUpperCase();
    
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary-600 text-white flex items-center justify-center mr-2">
                <span className="font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-heading font-semibold text-gray-800">Trinity Trading</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-primary-600 font-medium">Dashboard</Link>
            <Link href="/compare" className="text-gray-600 hover:text-primary-600 transition-colors">Compare Commodities</Link>
            <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Subscription</Link>
            <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Support</Link>
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex text-gray-500 hover:text-gray-700"
            >
              <Bell size={20} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-0">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <span className="font-medium text-sm">{getUserInitials()}</span>
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user?.username}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-gray-500"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gray-600"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
