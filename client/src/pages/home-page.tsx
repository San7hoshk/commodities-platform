import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import StatCard from "@/components/dashboard/stat-card";
import PriceTrendChart from "@/components/dashboard/price-trend-chart";
import QuickCompare from "@/components/dashboard/quick-compare";
import SubscriptionInfo from "@/components/dashboard/subscription-info";
import RecentResults from "@/components/dashboard/recent-results";
import SupplierInsights from "@/components/dashboard/supplier-insights";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header 
        onMenuClick={() => setIsMobileNavOpen(true)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            {/* Dashboard Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-heading font-semibold text-gray-800 mb-1">Dashboard</h1>
              <p className="text-gray-500">Compare commodity prices and shipping costs in real-time</p>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Total Savings"
                value="£24,350"
                subtext="this month"
                changePercent={12.5}
                changeDirection="up"
              />
              <StatCard
                title="Comparisons Made"
                value="138"
                subtext="this month"
                changePercent={5.3}
                changeDirection="up"
              />
              <StatCard
                title="Completed Orders"
                value="42"
                subtext="this month"
                changePercent={2.1}
                changeDirection="up"
              />
            </div>
            
            {/* Price Trend Chart */}
            <PriceTrendChart />
            
            {/* Quick Compare & Subscription Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <QuickCompare />
              </div>
              <div>
                <SubscriptionInfo />
              </div>
            </div>
            
            {/* Recent Results */}
            <RecentResults />
            
            {/* Supplier Insights */}
            <SupplierInsights />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </div>
  );
}
