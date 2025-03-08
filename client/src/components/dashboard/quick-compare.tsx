import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

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
    <Card>
      <CardHeader>
        <CardTitle>Quick Commodity Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Commodity Search Form */}
        <form className="mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="commodity">Commodity Type</Label>
              <Select value={commodityType} onValueChange={setCommodityType}>
                <SelectTrigger id="commodity">
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
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex">
                <Input 
                  id="quantity" 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded-r-none"
                />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-[80px] rounded-l-none">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="location">Delivery Location</Label>
              <Select value={deliveryLocation} onValueChange={setDeliveryLocation}>
                <SelectTrigger id="location">
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
              <Label htmlFor="timeframe">Delivery Timeframe</Label>
              <Select value={deliveryTimeframe} onValueChange={setDeliveryTimeframe}>
                <SelectTrigger id="timeframe">
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
            className="w-full"
            onClick={handleCompare}
          >
            Compare Prices
          </Button>
        </form>
        
        {/* Recent Searches */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
          
          {recentSearches.map((search) => (
            <div 
              key={search.id}
              className="border border-gray-200 rounded-md p-3 mb-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRecentSearchClick(search.id)}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-sm">{search.commodity} - {search.quantity}</h4>
                  <p className="text-sm text-gray-500">Delivery to {search.location} within {search.timeframe}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-600">{search.optionsFound} options found</p>
                  <p className="text-xs text-gray-500">{search.timeAgo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
