import { AlertTriangle, CheckCircle2, CircleDot, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AnimalStatus, TaskStatus } from "@/lib/types";

const ANIMAL_STATUS_MAP: Record<
  AnimalStatus,
  { label: string; icon: typeof AlertTriangle; className: string }
> = {
  healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    className: "border-pasture-300 bg-pasture-50 text-pasture-700",
  },
  sick: {
    label: "Sick",
    icon: AlertTriangle,
    className: "border-destructive/40 bg-destructive/10 text-destructive",
  },
  pregnant: {
    label: "Pregnant",
    icon: CircleDot,
    className: "border-harvest-400/60 bg-harvest-50 text-harvest-700",
  },
  dry: {
    label: "Dry",
    icon: Droplets,
    className: "border-pasture-200 bg-muted text-muted-foreground",
  },
};

export function AnimalStatusBadge({ status }: { status: AnimalStatus }) {
  const config = ANIMAL_STATUS_MAP[status];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("gap-1", config.className)}>
      <Icon className="size-3" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const done = status === "done";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1",
        done
          ? "border-pasture-300 bg-pasture-50 text-pasture-700"
          : "border-harvest-400/60 bg-harvest-50 text-harvest-700",
      )}
    >
      {done ? (
        <CheckCircle2 className="size-3" aria-hidden="true" />
      ) : (
        <CircleDot className="size-3" aria-hidden="true" />
      )}
      {done ? "Done" : "Pending"}
    </Badge>
  );
}
