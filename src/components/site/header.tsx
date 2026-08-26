"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/site/nav-items";
import { FarmSwitcher } from "@/components/site/farm-switcher";
import { useTour } from "@/components/site/tour-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { demoNotifications, demoProfile } from "@/lib/demo-data";

export function Header() {
  const pathname = usePathname();
  const unread = demoNotifications.filter((n) => !n.read).length;
  const tour = useTour();

  return (
    <header className="sticky top-0 z-40 border-b border-pasture-100 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-heading text-lg font-semibold text-pasture-950">
          <span className="flex size-8 items-center justify-center rounded-lg bg-pasture-600 text-white">
            <Sprout className="size-4.5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">FarmSet</span>
        </Link>

        <nav
          data-tour="tour-nav-desktop"
          className="hidden flex-1 items-center justify-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-pasture-50 text-pasture-900"
                    : "text-pasture-700 hover:bg-pasture-50 hover:text-pasture-900",
                )}
              >
                {item.label}
                {item.href === "/dashboard/notifications" && unread > 0 ? (
                  <span className="ml-1.5 rounded-full bg-harvest-500 px-1.5 py-0.5 text-[10px] font-semibold text-pasture-950">
                    {unread}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <FarmSwitcher />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<button type="button" aria-label="Account menu" />}
            >
              <Avatar className="size-8 border border-pasture-200">
                <AvatarFallback className="bg-pasture-100 text-xs font-semibold text-pasture-800">
                  {demoProfile.avatarInitials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={tour.start} className="gap-2">
                <Compass className="size-4 text-harvest-600" aria-hidden="true" />
                Guide me
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="icon" className="md:hidden" />}
            >
              <Menu className="size-4.5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="font-heading text-lg">FarmSet</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                <div className="mb-2 sm:hidden">
                  <FarmSwitcher />
                </div>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <SheetClose
                      key={item.href}
                      nativeButton={false}
                      render={<Link href={item.href} />}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                          active
                            ? "bg-pasture-50 text-pasture-900"
                            : "text-pasture-700",
                        )}
                      >
                        <Icon className="size-4.5" aria-hidden="true" />
                        {item.label}
                        {item.href === "/dashboard/notifications" && unread > 0 ? (
                          <span className="ml-auto rounded-full bg-harvest-500 px-1.5 py-0.5 text-[10px] font-semibold text-pasture-950">
                            {unread}
                          </span>
                        ) : null}
                      </span>
                    </SheetClose>
                  );
                })}
                <Separator className="my-2" />
                <SheetClose
                  nativeButton={false}
                  render={<button type="button" onClick={tour.start} />}
                >
                  <span className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pasture-700">
                    <Compass className="size-4.5" aria-hidden="true" />
                    Guide me
                  </span>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
