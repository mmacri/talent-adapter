import * as React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  iconClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function InfoTooltip({ content, className, iconClassName, side = "top" }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info 
            className={cn(
              "w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors",
              iconClassName
            )} 
          />
        </TooltipTrigger>
        <TooltipContent side={side} className={cn("max-w-xs", className)}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}