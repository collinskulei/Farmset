"use client";

import Link from "next/link";
import { MapPin, Plus, Users } from "lucide-react";
import { useFarmContext } from "@/components/site/farm-context";
import { AppPageHeader } from "@/components/site/app-page-header";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoAnimals, demoManagers, demoProfile } from "@/lib/demo-data";

export default function FarmsPage() {
  const { farms } = useFarmContext();

  return (
    <div>
      <AppPageHeader
        title="Farms"
        description={`${demoProfile.name} — owner of ${farms.length} farm${farms.length === 1 ? "" : "s"}`}
        actions={
          <Button variant="outline" className="gold-line gap-1.5">
            <Plus className="size-4" aria-hidden="true" />
            Add farm
          </Button>
        }
      />

      <Container className="flex flex-col gap-4 py-6">
        {farms.map((farm) => {
          const managers = demoManagers.filter((m) => m.farmIds.includes(farm.id));
          const animalCount = demoAnimals.filter((a) => a.farmId === farm.id).length;
          return (
            <Card key={farm.id} className="gap-4 border-pasture-100 p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-pasture-950">
                    {farm.name}
                  </h2>
                  <p className="flex items-center gap-1.5 text-sm text-pasture-600">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {farm.location}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  nativeButton={false}
                  render={<Link href={`/dashboard/animals?farm=${farm.id}`} />}
                >
                  View animals ({animalCount})
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-pasture-800">
                  <Users className="size-4 text-harvest-600" aria-hidden="true" />
                  Farm managers
                </div>
                <div className="flex flex-wrap gap-2">
                  {managers.length === 0 ? (
                    <p className="text-sm text-pasture-500">No managers assigned yet.</p>
                  ) : (
                    managers.map((m) => (
                      <Badge key={m.id} variant="outline" className="gold-line text-pasture-800">
                        {m.name}
                      </Badge>
                    ))
                  )}
                  <Button variant="ghost" size="sm" className="h-6 gap-1 text-harvest-700">
                    <Plus className="size-3" aria-hidden="true" />
                    Invite manager
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </Container>
    </div>
  );
}
