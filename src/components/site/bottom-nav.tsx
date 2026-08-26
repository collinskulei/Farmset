"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/site/nav-items";
import { demoNotifications } from "@/lib/demo-data";

export function BottomNav() {
  const pathname = usePathname();
  const unread = demoNotifications.filter((n) => !n.read).length;

  return (
    <nav
      data-tour="tour-nav-mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-pasture-100 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const isLog = item.href === "/dashboard/log";
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium"
            >
              <span
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-full transition-colors",
                  isLog
                    ? "bg-harvest-500 text-pasture-950"
                    : active
                      ? "bg-pasture-100 text-pasture-900"
                      : "text-pasture-500",
                )}
              >
                <Icon className="size-4.5" aria-hidden="true" />
                {item.href === "/dashboard/notifications" && unread > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[9px] text-white">
                    {unread}
                  </span>
                ) : null}
              </span>
              <span className={active ? "text-pasture-900" : "text-pasture-500"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
