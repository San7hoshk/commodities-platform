import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";

// Mock data for recent comparison results - in a real app, this would come from an API
const results = [
  {
    id: 1,
    commodity: {
      name: "Rice (Basmati)",
      grade: "Premium Grade"
    },
    supplier: {
      name: "Eastern Traders Ltd",
      country: "India"
    },
    commodityPrice: {
      value: 850,
      unit: "ton"
    },
    shippingCost: {
      value: 120,
      method: "sea freight"
    },
    totalPrice: 970,
    isBestPrice: true,
    deliveryTime: "14-21 days"
  },
  {
    id: 2,
    commodity: {
      name: "Rice (Basmati)",
      grade: "Premium Grade"
    },
    supplier: {
      name: "Global Rice Suppliers",
      country: "Pakistan"
    },
    commodityPrice: {
      value: 820,
      unit: "ton"
    },
    shippingCost: {
      value: 185,
      method: "sea freight"
    },
    totalPrice: 1005,
    isBestPrice: false,
    deliveryTime: "18-25 days"
  },
  {
    id: 3,
    commodity: {
      name: "Rice (Basmati)",
      grade: "Premium Grade"
    },
    supplier: {
      name: "Rice Express Ltd",
      country: "India"
    },
    commodityPrice: {
      value: 890,
      unit: "ton"
    },
    shippingCost: {
      value: 110,
      method: "sea freight"
    },
    totalPrice: 1000,
    isBestPrice: false,
    deliveryTime: "12-18 days"
  }
];

export default function RecentResults() {
  const [, setLocation] = useLocation();
  
  // Handle view all click
  const handleViewAll = () => {
    setLocation("/compare");
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Comparison Results</CardTitle>
        <Button 
          variant="link" 
          className="text-primary-600 hover:text-primary-700"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
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
              {results.map((result) => (
                <TableRow key={result.id} className={result.isBestPrice ? "bg-green-50" : ""}>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{result.commodity.name}</div>
                      <div className="text-sm text-gray-500">{result.commodity.grade}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{result.supplier.name}</div>
                      <div className="text-sm text-gray-500">{result.supplier.country}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">£{result.commodityPrice.value.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">per {result.commodityPrice.unit}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">£{result.shippingCost.value.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">via {result.shippingCost.method}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`text-sm font-medium ${result.isBestPrice ? "text-green-700" : "text-gray-900"}`}>
                        £{result.totalPrice.toFixed(2)}
                      </div>
                      {result.isBestPrice && (
                        <div className="text-xs text-green-600">Lowest price</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{result.deliveryTime}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 text-sm font-medium">
                      <Button variant="link" className="text-primary-600 hover:text-primary-900 p-0 h-auto">Contact</Button>
                      <Button variant="link" className="text-gray-600 hover:text-gray-900 p-0 h-auto">Details</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
