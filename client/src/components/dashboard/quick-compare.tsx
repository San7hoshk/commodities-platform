import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Clock, Box, MapPin, Calendar, ArrowRight } from "lucide-react";

export default function QuickCompare() {
  const [, setLocation] = useLocation();
  
  // Form state
  const [commodityType, setCommodityType] = useState("rice-basmati");
  const [quantity, setQuantity] = useState("1000");
  const [unit, setUnit] = useState("kg");
  const [deliveryLocation, setDeliveryLocation] = useState("london");
  const [deliveryTimeframe, setDeliveryTimeframe] = useState("14");
  
  // Recent searches (mock data - in a real app, this would come from the server)
  const recentSearches = [
    {
      id: 1,
      commodity: "Rice (Basmati)",
      quantity: "1000kg",
      location: "London",
      timeframe: "2 weeks",
      optionsFound: 8,
      timeAgo: "5 hours ago"
    },
    {
      id: 2,
      commodity: "Sugar (Refined)",
      quantity: "500kg",
      location: "Manchester",
      timeframe: "1 month",
      optionsFound: 12,
      timeAgo: "Yesterday"
    }
  ];
  
  // Handle navigation to compare page
  const handleCompare = () => {
    setLocation("/compare");
  };
  
  // Handle click on recent search
  const handleRecentSearchClick = (searchId: number) => {
    setLocation("/compare");
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="relative border-b border-zinc-100">
        <CardTitle className="flex items-center gap-2 text-xl text-zinc-900">
          <Search className="h-5 w-5 text-zinc-800" />
          <span className="gradient-heading">Quick Commodity Comparison</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        {/* Commodity Search Form */}
        <form className="mb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="commodity" className="flex items-center gap-1.5 mb-1.5 text-zinc-700">
                <Box className="h-4 w-4 text-zinc-600" />
                Commodity Type
              </Label>
              <Select value={commodityType} onValueChange={setCommodityType}>
                <SelectTrigger id="commodity" className="ai-input text-zinc-800">
                  <SelectValue placeholder="Select a commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice-basmati">Rice (Basmati)</SelectItem>
                  <SelectItem value="rice-jasmine">Rice (Jasmine)</SelectItem>
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="sugar">Sugar</SelectItem>
                  <SelectItem value="coffee">Coffee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity" className="flex items-center gap-1.5 mb-1.5 text-zinc-700">
                <Box className="h-4 w-4 text-zinc-600" />
                Quantity
              </Label>
              <div className="flex">
                <Input 
                  id="quantity" 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded-r-none ai-input text-zinc-800"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-[80px] rounded-l-none border-l bg-white border-zinc-200 text-zinc-800">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="tons">tons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="location" className="flex items-center gap-1.5 mb-1.5 text-zinc-700">
                <MapPin className="h-4 w-4 text-zinc-600" />
                Delivery Location
              </Label>
              <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                <SelectTrigger id="location" className="ai-input text-zinc-800">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="london">London, UK</SelectItem>
                  <SelectItem value="manchester">Manchester, UK</SelectItem>
                  <SelectItem value="birmingham">Birmingham, UK</SelectItem>
                  <SelectItem value="glasgow">Glasgow, UK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timeframe" className="flex items-center gap-1.5 mb-1.5 text-zinc-700">
                <Calendar className="h-4 w-4 text-zinc-600" />
                Delivery Timeframe
              </Label>
              <Select value={deliveryTimeframe} onValueChange={setDeliveryTimeframe}>
                <SelectTrigger id="timeframe" className="ai-input text-zinc-800">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Within 1 week</SelectItem>
                  <SelectItem value="14">Within 2 weeks</SelectItem>
                  <SelectItem value="30">Within 1 month</SelectItem>
                  <SelectItem value="60">Within 2 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="button" 
            className="w-full gradient-button h-11 mt-2"
            onClick={handleCompare}
          >
            Compare Prices
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        
        <div className="black-separator"></div>
        
        {/* Recent Searches */}
        <div>
          <h3 className="flex items-center gap-1.5 font-medium text-zinc-800 mb-3">
            <Clock className="h-4 w-4 text-zinc-600" />
            Recent Searches
          </h3>
          
          <div className="space-y-3">
            {recentSearches.map((search) => (
              <div 
                key={search.id}
                className="monochrome-section p-4 hover:shadow-md cursor-pointer transition-all duration-200 hover-lift"
                onClick={() => handleRecentSearchClick(search.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-zinc-800">{search.commodity} - {search.quantity}</h4>
                    <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3 w-3" />
                      {search.location}
                      <span className="inline-block w-1 h-1 rounded-full bg-zinc-300 mx-1"></span>
                      <Calendar className="h-3 w-3" />
                      {search.timeframe}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-900 flex items-center justify-end">
                      {search.optionsFound} options
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center justify-end gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {search.timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
