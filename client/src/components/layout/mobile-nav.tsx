import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { X, Building, ChartLine, ArrowLeftRight, CalendarClock, Bookmark, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  
  // Define navigation items
  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: <ChartLine className="w-5 h-5" />,
    },
    {
      href: "/compare",
      label: "Compare Prices",
      icon: <ArrowLeftRight className="w-5 h-5" />,
    },
    {
      href: "/history",
      label: "Price History",
      icon: <CalendarClock className="w-5 h-5" />,
    },
    {
      href: "/saved",
      label: "Saved Searches",
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      href: "/subscription",
      label: "Subscription",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      href: "/support",
      label: "Help & Support",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];
  
  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white h-full w-64 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary-600 text-white flex items-center justify-center mr-2">
              <span className="font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-heading font-semibold text-gray-800">Trinity Trading</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500">
            <X size={24} />
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 p-4 border-b border-gray-200">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username || "User"}</p>
              <p className="text-xs text-gray-500">{user?.companyName || "Company"}</p>
            </div>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={onClose}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
          
          <button 
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
