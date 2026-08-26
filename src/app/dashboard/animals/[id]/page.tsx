"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Cake, Milk, Syringe, Tag, Venus, VenusAndMars } from "lucide-react";
import { AppPageHeader } from "@/components/site/app-page-header";
import { Container } from "@/components/site/container";
import { AnimalStatusBadge } from "@/components/site/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  demoMedicineLogs,
  demoMilkLogs,
  getAnimalById,
  getFarmById,
} from "@/lib/demo-data";

function ageFromBirthDate(birthDate: string) {
  const birth = new Date(birthDate);
  const reference = new Date("2026-08-26");
  let years = reference.getFullYear() - birth.getFullYear();
  let months = reference.getMonth() - birth.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0) return `${months} mo`;
  return `${years} yr${months ? ` ${months} mo` : ""}`;
}

export default function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const animal = getAnimalById(id);
  if (!animal) notFound();

  const farm = getFarmById(animal.farmId);
  const medicineLogs = demoMedicineLogs
    .filter((m) => m.animalId === animal.id)
    .sort((a, b) => (a.loggedAt < b.loggedAt ? 1 : -1));
  const milkLogs = demoMilkLogs
    .filter((m) => m.animalId === animal.id)
    .sort((a, b) => (a.loggedAt < b.loggedAt ? 1 : -1));

  return (
    <div>
      <AppPageHeader
        title={animal.name}
        description={`${farm?.name ?? ""} · ${animal.tag}`}
        actions={<AnimalStatusBadge status={animal.status} />}
      />

      <Container className="flex flex-col gap-6 py-6">
        <Link
          href="/dashboard/animals"
          className="flex w-fit items-center gap-1.5 text-sm text-pasture-600 hover:text-pasture-900"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to animals
        </Link>

        <Card className="flex-col gap-4 border-pasture-100 p-5 sm:flex-row sm:items-center">
          <Avatar className="size-20 border border-pasture-200">
            <AvatarFallback className="bg-pasture-100 text-xl font-semibold text-pasture-800">
              {animal.photoInitials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="flex items-center gap-2 text-pasture-700">
              <Tag className="size-4 text-harvest-600" aria-hidden="true" />
              <div>
                <p className="text-xs text-pasture-500">Breed</p>
                <p className="font-medium text-pasture-900">{animal.breed}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-pasture-700">
              <Cake className="size-4 text-harvest-600" aria-hidden="true" />
              <div>
                <p className="text-xs text-pasture-500">Age</p>
                <p className="font-medium text-pasture-900">
                  {ageFromBirthDate(animal.birthDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-pasture-700">
              {animal.sex === "female" ? (
                <Venus className="size-4 text-harvest-600" aria-hidden="true" />
              ) : (
                <VenusAndMars className="size-4 text-harvest-600" aria-hidden="true" />
              )}
              <div>
                <p className="text-xs text-pasture-500">Sex</p>
                <p className="font-medium text-pasture-900 capitalize">{animal.sex}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-pasture-700">
              <Milk className="size-4 text-harvest-600" aria-hidden="true" />
              <div>
                <p className="text-xs text-pasture-500">Total logged</p>
                <p className="font-medium text-pasture-900">
                  {milkLogs.reduce((s, m) => s + m.litres, 0).toFixed(1)}L
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="medicine">
          <TabsList>
            <TabsTrigger value="medicine">Medicine history</TabsTrigger>
            <TabsTrigger value="milk">Milk history</TabsTrigger>
          </TabsList>

          <TabsContent value="medicine" className="mt-4 flex flex-col gap-3">
            {medicineLogs.length === 0 ? (
              <p className="py-8 text-center text-sm text-pasture-600">
                No medicine records for {animal.name} yet.
              </p>
            ) : (
              medicineLogs.map((log) => (
                <Card key={log.id} className="flex-row items-start gap-3 border-pasture-100 p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-harvest-50 text-harvest-700">
                    <Syringe className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="font-medium text-pasture-950">{log.medicine}</p>
                      <p className="text-xs text-pasture-500">
                        {new Date(log.loggedAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-pasture-700">{log.dosage}</p>
                    {log.notes ? (
                      <p className="mt-1 text-sm text-pasture-600 italic">{log.notes}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-pasture-500">Logged by {log.loggedBy}</p>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="milk" className="mt-4 flex flex-col gap-3">
            {milkLogs.length === 0 ? (
              <p className="py-8 text-center text-sm text-pasture-600">
                No milk records for {animal.name} yet.
              </p>
            ) : (
              milkLogs.map((log) => (
                <Card key={log.id} className="flex-row items-center gap-3 border-pasture-100 p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pasture-50 text-pasture-700">
                    <Milk className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="font-medium text-pasture-950">
                        {log.litres}L · {log.session}
                      </p>
                      <p className="text-xs text-pasture-500">
                        {new Date(log.loggedAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-pasture-500">Logged by {log.loggedBy}</p>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
