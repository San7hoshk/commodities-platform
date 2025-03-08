import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Building, ChartLine, BarChart3, Bookmark, CreditCard, Settings, HelpCircle, ArrowLeftRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { user } = useAuth();
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

  return (
    <aside className="hidden md:block w-64 border-r border-gray-200 bg-white">
      <div className="p-4">
        {/* Company Info */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <Building className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.companyName || "Company"}</p>
            <p className="text-xs text-gray-500">Business Account</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                  isActive(item.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Upgrade CTA */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-primary-50 rounded-lg p-4">
          <h4 className="font-medium text-primary-800 mb-2">Upgrade to Pro</h4>
          <p className="text-sm text-gray-600 mb-3">Get unlimited comparisons and real-time analytics</p>
          <Button className="w-full">
            View Plans
          </Button>
        </div>
      </div>
    </aside>
  );
}
