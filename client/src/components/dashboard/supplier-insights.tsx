import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

// Mock data for top suppliers - in a real app, this would come from an API
const topSuppliers = [
  {
    id: 1,
    name: "Eastern Traders Ltd",
    savings: 4520,
    percentage: 85
  },
  {
    id: 2,
    name: "Global Rice Suppliers",
    savings: 3250,
    percentage: 68
  },
  {
    id: 3,
    name: "Rice Express Ltd",
    savings: 2180,
    percentage: 45
  }
];

// Mock data for shipping methods - in a real app, this would come from an API
const shippingMethods = [
  {
    id: 1,
    name: "Sea Freight",
    percentage: 78,
    avgCost: 120,
    avgTime: 18
  },
  {
    id: 2,
    name: "Air Freight",
    percentage: 15,
    avgCost: 420,
    avgTime: 3
  },
  {
    id: 3,
    name: "Rail Freight",
    percentage: 7,
    avgCost: 210,
    avgTime: 12
  }
];

export default function SupplierInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Top Suppliers by Savings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Suppliers by Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSuppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex-shrink-0 flex items-center justify-center text-primary-700 mr-4">
                  <Building size={20} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{supplier.name}</span>
                    <span className="text-sm font-medium text-green-600">£{supplier.savings.toLocaleString()} saved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${supplier.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Shipping Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <div key={method.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{method.name}</span>
                  <span className="text-sm text-gray-600">{method.percentage}% of shipments</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Avg. Cost: £{method.avgCost}/ton</span>
                  <span>Avg. Time: {method.avgTime} days</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
