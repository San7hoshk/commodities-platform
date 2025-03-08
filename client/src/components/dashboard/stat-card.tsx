import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  changePercent: number;
  changeDirection: "up" | "down" | "neutral";
}

export default function StatCard({ title, value, subtext, changePercent, changeDirection }: StatCardProps) {
  // Determine color based on change direction
  const getBadgeColor = () => {
    if (changeDirection === "up") return "bg-green-100 text-green-800";
    if (changeDirection === "down") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Format change with sign
  const getFormattedChange = () => {
    if (changeDirection === "up") return `+${changePercent}%`;
    if (changeDirection === "down") return `-${changePercent}%`;
    return `${changePercent}%`;
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className={`rounded-full px-2 py-1 text-xs font-medium ${getBadgeColor()}`}>
            {getFormattedChange()}
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-2xl font-semibold">{value}</span>
          <span className="text-sm text-gray-500">{subtext}</span>
        </div>
      </CardContent>
    </Card>
  );
}
