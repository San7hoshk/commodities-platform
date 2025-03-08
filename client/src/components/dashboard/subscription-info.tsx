import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionInfo() {
  // Fetch user subscription data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/user-subscription"],
    retry: false,
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full mb-4" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
            <p className="font-medium">Unable to load subscription data</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
          <Button className="w-full">Refresh</Button>
        </CardContent>
      </Card>
    );
  }
  
  const { subscription, plan } = data;
  
  // Calculate usage percentage
  const usagePercent = plan.comparisonsPerMonth === -1 
    ? 0 // Unlimited plan
    : (subscription.comparisonsUsed / plan.comparisonsPerMonth) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-primary-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{plan.name}</h4>
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {plan.comparisonsPerMonth === -1 
              ? "Unlimited comparisons" 
              : `${plan.comparisonsPerMonth} comparisons per month`}
          </p>
          
          {plan.comparisonsPerMonth !== -1 && (
            <>
              <div className="w-full bg-white rounded-full h-2 mb-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {subscription.comparisonsUsed} of {plan.comparisonsPerMonth} comparisons used
              </p>
            </>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Plan Benefits</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start">
                <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
            
            {/* Features not included in the current plan */}
            {plan.name !== "Enterprise Plan" && (
              <>
                <li className="flex items-start opacity-50">
                  <XIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <span>API access for system integration</span>
                </li>
                <li className="flex items-start opacity-50">
                  <XIcon className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                  <span>Advanced price trend analytics</span>
                </li>
              </>
            )}
          </ul>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
        >
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
}
