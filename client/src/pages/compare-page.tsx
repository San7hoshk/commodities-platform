import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ComparePage() {
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [commodityType, setCommodityType] = useState("rice-basmati");
  const [quantity, setQuantity] = useState("1000");
  const [unit, setUnit] = useState("kg");
  const [deliveryLocation, setDeliveryLocation] = useState("london");
  const [deliveryTimeframe, setDeliveryTimeframe] = useState("7");
  
  // Comparison mutation
  const compareMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/compare", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Comparison Complete",
        description: `Found ${data.results.length} options for your search.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Comparison Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle comparison form submit
  const handleCompare = () => {
    const data = {
      commodityId: 1, // Placeholder for MVP
      quantity: parseInt(quantity),
      unit,
      destinationCountry: "UK",
      destinationCity: deliveryLocation,
      timeframe: parseInt(deliveryTimeframe),
      filters: {
        commodityType
      }
    };
    
    compareMutation.mutate(data);
  };
  
  // Map commodity types to human-readable names
  const commodityTypeNames: Record<string, string> = {
    "rice-basmati": "Rice (Basmati)",
    "rice-jasmine": "Rice (Jasmine)",
    "wheat": "Wheat",
    "sugar": "Sugar",
    "coffee": "Coffee"
  };
  
  // Map location codes to human-readable names
  const locationNames: Record<string, string> = {
    "london": "London, UK",
    "manchester": "Manchester, UK",
    "birmingham": "Birmingham, UK",
    "glasgow": "Glasgow, UK"
  };

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
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-heading font-semibold text-gray-800 mb-1">Compare Commodities</h1>
              <p className="text-gray-500">Find the best prices for commodities and shipping across multiple suppliers</p>
            </div>
            
            {/* Comparison Form */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Commodity Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="commodity-type">Commodity Type</Label>
                    <Select value={commodityType} onValueChange={setCommodityType}>
                      <SelectTrigger id="commodity-type">
                        <SelectValue placeholder="Select commodity type" />
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
                        <SelectTrigger className="w-24 rounded-l-none">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  onClick={handleCompare} 
                  className="w-full"
                  disabled={compareMutation.isPending}
                >
                  {compareMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparing Prices...
                    </>
                  ) : (
                    "Compare Prices"
                  )}
                </Button>
              </CardContent>
            </Card>
            
            {/* Comparison Results */}
            {compareMutation.isSuccess && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {commodityTypeNames[commodityType] || commodityType} - {quantity} {unit}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Delivery to {locationNames[deliveryLocation] || deliveryLocation} within {deliveryTimeframe === "7" ? "1 week" : 
                            deliveryTimeframe === "14" ? "2 weeks" :
                            deliveryTimeframe === "30" ? "1 month" : "2 months"}
                        </p>
                      </div>
                      <Badge className="mt-2 md:mt-0">{compareMutation.data.results.length} options found</Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Commodity</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Commodity Price</TableHead>
                            <TableHead>Shipping Cost</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Delivery Time</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {compareMutation.data.results.map((result: any, index: number) => (
                            <TableRow key={index} className={result.isBestPrice ? "bg-green-50" : ""}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{commodityTypeNames[commodityType] || commodityType}</div>
                                  <div className="text-sm text-gray-500">{result.commodityPrice.grade}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{result.supplier.name}</div>
                                  <div className="text-sm text-gray-500">{result.supplier.country}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>£{(result.commodityPrice.price / 100).toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">per {result.commodityPrice.unit}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>£{(result.shippingCost.cost / 100).toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">via {result.shippingCost.method}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={`font-medium ${result.isBestPrice ? "text-green-700" : ""}`}>
                                  £{(result.totalPrice / 100).toFixed(2)}
                                </div>
                                {result.isBestPrice && (
                                  <div className="text-xs text-green-600">Lowest price</div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div>{result.deliveryTime}</div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="link" className="text-primary-600 h-auto p-0">Contact</Button>
                                  <Button variant="link" className="text-gray-600 h-auto p-0">Details</Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
