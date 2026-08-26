import {
  Bell,
  ClipboardList,
  LayoutDashboard,
  PawPrint,
  Tractor,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/animals", label: "Animals", icon: PawPrint },
  { href: "/dashboard/log", label: "Log", icon: ClipboardList },
  { href: "/dashboard/notifications", label: "Alerts", icon: Bell },
  { href: "/dashboard/farms", label: "Farms", icon: Tractor },
] as const;
