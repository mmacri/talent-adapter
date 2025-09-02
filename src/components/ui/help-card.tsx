import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultVisible?: boolean;
  icon?: React.ComponentType<any>;
}

export function HelpCard({ 
  title, 
  children, 
  className, 
  defaultVisible = true,
  icon: Icon = HelpCircle 
}: HelpCardProps) {
  const [isVisible, setIsVisible] = React.useState(defaultVisible);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="mb-4"
      >
        <Icon className="w-4 h-4 mr-2" />
        Show Help
      </Button>
    );
  }

  return (
    <Card className={cn("mb-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Icon className="w-4 h-4" />
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-blue-800 dark:text-blue-200">
        {children}
      </CardContent>
    </Card>
  );
}