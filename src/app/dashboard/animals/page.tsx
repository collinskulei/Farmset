"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useFarmContext } from "@/components/site/farm-context";
import { AppPageHeader } from "@/components/site/app-page-header";
import { Container } from "@/components/site/container";
import { AnimalStatusBadge } from "@/components/site/status-badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoAnimals } from "@/lib/demo-data";
import type { AnimalStatus } from "@/lib/types";

const STATUS_LABELS: Record<AnimalStatus | "all", string> = {
  all: "All statuses",
  healthy: "Healthy",
  sick: "Sick",
  pregnant: "Pregnant",
  dry: "Dry",
};

export default function AnimalsPage() {
  const { farms, selectedFarmId, selectedFarm } = useFarmContext();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | "all">("all");

  const animals = useMemo(() => {
    const scopeFarmIds = selectedFarmId === "all" ? farms.map((f) => f.id) : [selectedFarmId];
    return demoAnimals.filter((a) => {
      if (!scopeFarmIds.includes(a.farmId)) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.tag.toLowerCase().includes(q) && !a.breed.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [farms, selectedFarmId, statusFilter, query]);

  return (
    <div>
      <AppPageHeader
        title="Animals"
        description={
          selectedFarm
            ? `${selectedFarm.name} — ${animals.length} animal${animals.length === 1 ? "" : "s"}`
            : `Across all farms — ${animals.length} animal${animals.length === 1 ? "" : "s"}`
        }
      />

      <Container className="flex flex-col gap-5 py-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-pasture-400" aria-hidden="true" />
            <Input
              placeholder="Search by name, tag, or breed…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 focus-visible:border-harvest-500 focus-visible:ring-harvest-400/40"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AnimalStatus | "all")}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status">
                {(value: AnimalStatus | "all") => STATUS_LABELS[value] ?? "Status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="pregnant">Pregnant</SelectItem>
              <SelectItem value="dry">Dry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {animals.length === 0 ? (
          <p className="py-12 text-center text-sm text-pasture-600">
            No animals match your search.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal) => (
              <Link key={animal.id} href={`/dashboard/animals/${animal.id}`}>
                <Card className="flex-row items-center gap-3 border-pasture-100 p-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <Avatar className="size-12 border border-pasture-200">
                    <AvatarFallback className="bg-pasture-100 text-sm font-semibold text-pasture-800">
                      {animal.photoInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-heading text-base font-semibold text-pasture-950">
                        {animal.name}
                      </span>
                      <AnimalStatusBadge status={animal.status} />
                    </div>
                    <p className="text-xs text-pasture-600">
                      {animal.tag} · {animal.breed}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
