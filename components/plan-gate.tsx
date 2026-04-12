import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { hasSufficientPlan, PlanName } from "@/lib/plan-limits";
import { cn } from "@/lib/utils";

interface PlanGateProps {
  currentPlan: PlanName;
  requiredPlan: PlanName;
  children: ReactNode;
  label?: string; // override badge text
}

export function PlanGate({
  currentPlan,
  requiredPlan,
  children,
  label,
}: PlanGateProps) {
  if (hasSufficientPlan(currentPlan, requiredPlan)) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative inline-flex items-center gap-1 opacity-60 cursor-not-allowed select-none">
          <div className="pointer-events-none">{children}</div>
          <Badge
            variant="outline"
            className="text-[10px] border-amber-500 text-amber-600 dark:text-amber-400"
          >
            <Lock className="h-2.5 w-2.5 mr-1" />
            {label ?? `${requiredPlan}+`}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-xs mb-1">
          This feature requires the <strong>{requiredPlan}</strong> plan or
          higher.
        </p>
        <ButtonLink href="/billing" variant="link" size="sm" className="h-auto p-0 text-xs">Upgrade now →</ButtonLink>
      </TooltipContent>
    </Tooltip>
  );
}

export function PlanBadge({
  requiredPlan,
  className,
}: {
  requiredPlan: PlanName;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] border-amber-500 text-amber-600 dark:text-amber-400",
        className
      )}
    >
      <Lock className="h-2.5 w-2.5 mr-1" />
      {requiredPlan}+
    </Badge>
  );
}
