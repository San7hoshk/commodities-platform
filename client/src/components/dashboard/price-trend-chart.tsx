import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Generate some data for the chart
const generateChartData = (period: string) => {
  // Number of data points based on period
  const points = period === "week" ? 7 : period === "month" ? 30 : 12;
  
  // Base values and multipliers for random variation
  const baseRice = 850;
  const baseWheat = 750;
  const baseSugar = 600;
  
  return Array.from({ length: points }).map((_, i) => {
    // Create realistic trends with some randomness
    const day = i + 1;
    const rice = baseRice + Math.sin(day / (points / 2) * Math.PI) * 50 + Math.random() * 20;
    const wheat = baseWheat + Math.cos(day / (points / 3) * Math.PI) * 40 + Math.random() * 15;
    const sugar = baseSugar + Math.sin(day / (points / 4) * Math.PI + 1) * 30 + Math.random() * 10;
    
    return {
      name: period === "week" ? `Day ${day}` : 
            period === "month" ? `Day ${day}` : `Month ${day}`,
      rice: Math.round(rice),
      wheat: Math.round(wheat),
      sugar: Math.round(sugar),
    };
  });
};

export default function PriceTrendChart() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const data = generateChartData(period);

  return (
    <Card className="mb-6">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Commodity Price Trends</h2>
          <div className="flex space-x-2">
            <Button 
              variant={period === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("week")}
              className={period === "week" ? "bg-primary-50 text-primary-700 hover:bg-primary-100" : ""}
            >
              Week
            </Button>
            <Button 
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("month")}
              className={period === "month" ? "bg-primary-50 text-primary-700 hover:bg-primary-100" : ""}
            >
              Month
            </Button>
            <Button 
              variant={period === "year" ? "default" : "outline"} 
              size="sm"
              onClick={() => setPeriod("year")}
              className={period === "year" ? "bg-primary-50 text-primary-700 hover:bg-primary-100" : ""}
            >
              Year
            </Button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `£${value}`} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="rice" 
                stackId="1" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.5}
                name="Rice"
              />
              <Area 
                type="monotone" 
                dataKey="wheat" 
                stackId="2" 
                stroke="#eab308" 
                fill="#eab308" 
                fillOpacity={0.5}
                name="Wheat"
              />
              <Area 
                type="monotone" 
                dataKey="sugar" 
                stackId="3" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.5}
                name="Sugar"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
            <span className="text-sm text-gray-600">Rice</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-600">Wheat</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Sugar</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
