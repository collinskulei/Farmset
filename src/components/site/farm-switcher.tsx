"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { useFarmContext } from "@/components/site/farm-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function FarmSwitcher() {
  const { farms, selectedFarmId, setSelectedFarmId, selectedFarm } =
    useFarmContext();

  const label = selectedFarm ? selectedFarm.name : "All farms";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="gold-line max-w-[11rem] justify-between gap-2 border-pasture-200 sm:max-w-none"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin className="size-4 shrink-0 text-harvest-600" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-60" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => setSelectedFarmId("all")}
          className={selectedFarmId === "all" ? "bg-muted" : ""}
        >
          All farms
        </DropdownMenuItem>
        {farms.map((farm) => (
          <DropdownMenuItem
            key={farm.id}
            onClick={() => setSelectedFarmId(farm.id)}
            className={selectedFarmId === farm.id ? "bg-muted" : ""}
          >
            <div className="flex flex-col">
              <span>{farm.name}</span>
              <span className="text-xs text-muted-foreground">
                {farm.location}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
