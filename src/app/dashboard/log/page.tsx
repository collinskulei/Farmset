"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, Milk, Syringe } from "lucide-react";
import { useFarmContext } from "@/components/site/farm-context";
import { AppPageHeader } from "@/components/site/app-page-header";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoAnimals } from "@/lib/demo-data";

const inputClass =
  "h-11 rounded-lg border border-pasture-200 px-3 text-base focus-visible:border-harvest-500 focus-visible:ring-2 focus-visible:ring-harvest-400/40";

function ConfirmToast({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-pasture-300 bg-pasture-50 px-4 py-3 text-sm font-medium text-pasture-800">
      <CheckCircle2 className="size-4 shrink-0 text-pasture-600" aria-hidden="true" />
      {message}
    </div>
  );
}

export default function LogActivityPage() {
  const { farms, selectedFarmId } = useFarmContext();
  const activeFarmId = selectedFarmId === "all" ? farms[0]?.id : selectedFarmId;
  const animals = demoAnimals.filter((a) => a.farmId === activeFarmId);
  const animalLabels: Record<string, string> = Object.fromEntries(
    animals.map((a) => [a.id, `${a.name} (${a.tag})`]),
  );

  const [confirmed, setConfirmed] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>, message: string) {
    e.preventDefault();
    setConfirmed(message);
    e.currentTarget.reset();
    window.setTimeout(() => setConfirmed(null), 3500);
  }

  return (
    <div>
      <AppPageHeader
        title="Log Activity"
        description="Quick-entry forms, built for logging from the field on a phone."
      />

      <Container className="flex flex-col gap-5 py-6">
        {confirmed ? <ConfirmToast message={confirmed} /> : null}

        <Tabs defaultValue="medicine">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="medicine" className="gap-1.5">
              <Syringe className="size-4" aria-hidden="true" />
              Medicine
            </TabsTrigger>
            <TabsTrigger value="milk" className="gap-1.5">
              <Milk className="size-4" aria-hidden="true" />
              Milk
            </TabsTrigger>
            <TabsTrigger value="task" className="gap-1.5">
              <ClipboardList className="size-4" aria-hidden="true" />
              Task
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medicine" className="mt-4">
            <Card className="border-pasture-100 p-5">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => handleSubmit(e, "Medicine record saved.")}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="med-animal">Animal</Label>
                  <Select required name="animalId">
                    <SelectTrigger id="med-animal" className={`w-full ${inputClass}`}>
                      <SelectValue placeholder="Select animal">
                        {(value: string) => animalLabels[value] ?? "Select animal"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name} ({a.tag})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="med-name">Medicine</Label>
                  <Input id="med-name" required placeholder="e.g. Oxytetracycline" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="med-dosage">Dosage</Label>
                  <Input id="med-dosage" required placeholder="e.g. 10ml IM" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="med-notes">Notes (optional)</Label>
                  <Input id="med-notes" placeholder="Anything the owner should know" className={inputClass} />
                </div>
                <Button type="submit" size="lg" className="btn-metallic gold-line h-11 font-semibold">
                  Save medicine record
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="milk" className="mt-4">
            <Card className="border-pasture-100 p-5">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => handleSubmit(e, "Milk record saved.")}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="milk-animal">Animal (optional — herd-level if blank)</Label>
                  <Select name="animalId">
                    <SelectTrigger id="milk-animal" className={`w-full ${inputClass}`}>
                      <SelectValue placeholder="Select animal">
                        {(value: string) => animalLabels[value] ?? "Select animal"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name} ({a.tag})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="milk-litres">Litres</Label>
                    <Input
                      id="milk-litres"
                      required
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="milk-session">Session</Label>
                    <Select required name="session" defaultValue="morning">
                      <SelectTrigger id="milk-session" className={`w-full ${inputClass}`}>
                        <SelectValue placeholder="Session">
                          {(value: string) => (value === "evening" ? "Evening" : "Morning")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" size="lg" className="btn-metallic gold-line h-11 font-semibold">
                  Save milk record
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="task" className="mt-4">
            <Card className="border-pasture-100 p-5">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => handleSubmit(e, "Task logged.")}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="task-title">Task</Label>
                  <Input
                    id="task-title"
                    required
                    placeholder="e.g. Scrape & clean main shed"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="task-status">Status</Label>
                  <Select required name="status" defaultValue="done">
                    <SelectTrigger id="task-status" className={`w-full ${inputClass}`}>
                      <SelectValue placeholder="Status">
                        {(value: string) => (value === "pending" ? "Still pending" : "Done")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="pending">Still pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="lg" className="btn-metallic gold-line h-11 font-semibold">
                  Save task
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
}
