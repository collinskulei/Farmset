"use client";

import { AlertTriangle, Bell, CalendarClock, Newspaper } from "lucide-react";
import { useFarmContext } from "@/components/site/farm-context";
import { AppPageHeader } from "@/components/site/app-page-header";
import { Container } from "@/components/site/container";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { demoFarms, demoNotifications } from "@/lib/demo-data";
import type { AppNotification } from "@/lib/types";

const TYPE_CONFIG: Record<
  AppNotification["type"],
  { icon: typeof AlertTriangle; className: string }
> = {
  "sick-animal": {
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive",
  },
  "overdue-task": {
    icon: CalendarClock,
    className: "bg-harvest-50 text-harvest-700",
  },
  "daily-digest": {
    icon: Newspaper,
    className: "bg-pasture-50 text-pasture-700",
  },
};

export default function NotificationsPage() {
  const { farms, selectedFarmId } = useFarmContext();
  const scopeFarmIds = selectedFarmId === "all" ? farms.map((f) => f.id) : [selectedFarmId];

  const notifications = demoNotifications
    .filter((n) => scopeFarmIds.includes(n.farmId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div>
      <AppPageHeader
        title="Notifications"
        description="Sick-animal flags, overdue tasks, and daily digests — surfaced the moment they happen."
      />

      <Container className="flex flex-col gap-3 py-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Bell className="size-8 text-pasture-300" aria-hidden="true" />
            <p className="text-sm text-pasture-600">You&apos;re all caught up.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const config = TYPE_CONFIG[n.type];
            const Icon = config.icon;
            const farm = demoFarms.find((f) => f.id === n.farmId);
            return (
              <Card
                key={n.id}
                className={cn(
                  "flex-row items-start gap-3 border-pasture-100 p-4",
                  !n.read && "border-harvest-300 bg-harvest-50/40",
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", config.className)}>
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-pasture-900">{n.message}</p>
                  <p className="mt-1 text-xs text-pasture-500">
                    {farm?.name} ·{" "}
                    {new Date(n.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!n.read ? <span className="mt-1.5 size-2 shrink-0 rounded-full bg-harvest-500" /> : null}
              </Card>
            );
          })
        )}
      </Container>
    </div>
  );
}
