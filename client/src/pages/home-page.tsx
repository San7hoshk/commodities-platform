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
            <div className="mb-8 relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-light/5 blur-3xl"></div>
              <h1 className="gradient-heading text-3xl font-bold mb-2 relative z-10">Dashboard</h1>
              <p className="text-muted-foreground relative z-10">Compare commodity prices and shipping costs in real-time</p>
              <div className="absolute -z-10 top-1/2 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="hover-lift">
                <StatCard
                  title="Total Savings"
                  value="£24,350"
                  subtext="this month"
                  changePercent={12.5}
                  changeDirection="up"
                />
              </div>
              <div className="hover-lift">
                <StatCard
                  title="Comparisons Made"
                  value="138"
                  subtext="this month"
                  changePercent={5.3}
                  changeDirection="up"
                />
              </div>
              <div className="hover-lift">
                <StatCard
                  title="Completed Orders"
                  value="42"
                  subtext="this month"
                  changePercent={2.1}
                  changeDirection="up"
                />
              </div>
            </div>
            
            {/* Price Trend Chart */}
            <div className="mb-8 glass-card rounded-xl p-1">
              <PriceTrendChart />
            </div>
            
            {/* Quick Compare & Subscription Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 hover-lift">
                <QuickCompare />
              </div>
              <div className="hover-lift">
                <SubscriptionInfo />
              </div>
            </div>
            
            {/* Recent Results */}
            <div className="mb-8 hover-lift">
              <RecentResults />
            </div>
            
            {/* Supplier Insights */}
            <div className="hover-lift">
              <SupplierInsights />
            </div>
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
