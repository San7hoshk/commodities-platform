import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

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
    if (changeDirection === "up") return "bg-green-100/80 text-green-700";
    if (changeDirection === "down") return "bg-red-100/80 text-red-700";
    return "bg-gray-100/80 text-gray-700";
  };

  // Format change with sign
  const getFormattedChange = () => {
    if (changeDirection === "up") return `+${changePercent}%`;
    if (changeDirection === "down") return `-${changePercent}%`;
    return `${changePercent}%`;
  };

  // Get icon based on direction
  const getIcon = () => {
    if (changeDirection === "up") return <ArrowUpRight className="h-3 w-3" />;
    if (changeDirection === "down") return <ArrowDownRight className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  // Get gradient based on direction
  const getGradient = () => {
    if (changeDirection === "up") return "from-green-500/10 to-green-500/5";
    if (changeDirection === "down") return "from-red-500/10 to-red-500/5";
    return "from-gray-500/10 to-gray-500/5";
  };

  return (
    <Card className="glass-card overflow-hidden border-0">
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} rounded-lg`}></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted-foreground font-medium">{title}</h3>
          <div className={`rounded-full px-2.5 py-1 text-xs font-medium flex items-center gap-1 ${getBadgeColor()}`}>
            {getIcon()}
            {getFormattedChange()}
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <span className="text-3xl font-bold gradient-heading">{value}</span>
          <span className="text-sm text-muted-foreground mb-1.5">{subtext}</span>
        </div>
      </CardContent>
    </Card>
  );
}
