"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Milk,
  Syringe,
} from "lucide-react";
import { useFarmContext } from "@/components/site/farm-context";
import { AppPageHeader } from "@/components/site/app-page-header";
import { Container } from "@/components/site/container";
import { AnimatedSection } from "@/components/site/animated-section";
import { MilkTrendChart } from "@/components/site/milk-trend-chart";
import { TaskMeter } from "@/components/site/task-meter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  demoAnimals,
  demoFarms,
  demoMedicineLogs,
  demoMilkLogs,
  demoNotifications,
  demoTasks,
} from "@/lib/demo-data";

const TODAY = "2026-08-26";

function lastSevenDaysMilk(scopeFarmIds: string[]) {
  const today = new Date(`${TODAY}T00:00:00`);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const value = demoMilkLogs
      .filter((m) => scopeFarmIds.includes(m.farmId) && m.loggedAt.startsWith(dateStr))
      .reduce((sum, m) => sum + m.litres, 0);
    return {
      label: d.toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3),
      value,
      isToday: dateStr === TODAY,
    };
  });
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: typeof AlertTriangle;
  tone?: "default" | "alert";
}) {
  return (
    <Card className="gap-1 border-pasture-100 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-pasture-600 uppercase">
          {label}
        </span>
        <Icon
          className={`size-4 ${tone === "alert" ? "text-destructive" : "text-harvest-600"}`}
          aria-hidden="true"
        />
      </div>
      <span className="font-heading text-3xl font-semibold text-pasture-950">
        {value}
      </span>
    </Card>
  );
}

export default function DashboardPage() {
  const { farms, selectedFarmId, selectedFarm } = useFarmContext();
  const scopeFarmIds = selectedFarmId === "all" ? farms.map((f) => f.id) : [selectedFarmId];

  const animals = demoAnimals.filter((a) => scopeFarmIds.includes(a.farmId));
  const sickAnimals = animals.filter((a) => a.status === "sick");
  const tasks = demoTasks.filter((t) => scopeFarmIds.includes(t.farmId));
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const milkTotal = demoMilkLogs
    .filter((m) => scopeFarmIds.includes(m.farmId))
    .reduce((sum, m) => sum + m.litres, 0);
  const milkTrend = lastSevenDaysMilk(scopeFarmIds);

  type ActivityItem = {
    id: string;
    icon: typeof AlertTriangle;
    text: string;
    meta: string;
    loggedAt: string;
  };

  const activity: ActivityItem[] = [
    ...demoMedicineLogs
      .filter((m) => scopeFarmIds.includes(m.farmId))
      .map((m) => ({
        id: m.id,
        icon: Syringe,
        text: `${m.medicine} given to ${demoAnimals.find((a) => a.id === m.animalId)?.name ?? "animal"}`,
        meta: m.loggedBy,
        loggedAt: m.loggedAt,
      })),
    ...demoMilkLogs
      .filter((m) => scopeFarmIds.includes(m.farmId))
      .map((m) => ({
        id: m.id,
        icon: Milk,
        text: `${m.litres}L logged (${m.session})${m.animalId ? ` — ${demoAnimals.find((a) => a.id === m.animalId)?.name}` : ""}`,
        meta: m.loggedBy,
        loggedAt: m.loggedAt,
      })),
    ...tasks
      .filter((t) => t.status === "done" && t.completedAt)
      .map((t) => ({
        id: t.id,
        icon: CheckCircle2,
        text: `${t.title} — completed`,
        meta: t.assignedTo,
        loggedAt: t.completedAt!,
      })),
  ]
    .sort((a, b) => (a.loggedAt < b.loggedAt ? 1 : -1))
    .slice(0, 6);

  const notifications = demoNotifications
    .filter((n) => scopeFarmIds.includes(n.farmId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 3);

  return (
    <div>
      <AppPageHeader
        title={selectedFarm ? selectedFarm.name : "All farms overview"}
        description={
          selectedFarm
            ? selectedFarm.location
            : `Watching ${farms.length} farm${farms.length === 1 ? "" : "s"} — know what's happening even when you're away.`
        }
        actions={
          <Button
            className="btn-metallic gold-line font-semibold"
            nativeButton={false}
            render={<Link href="/dashboard/log" />}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            Log Activity
          </Button>
        }
      />

      <Container className="flex flex-col gap-8 py-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              label="Sick / flagged"
              value={sickAnimals.length}
              icon={AlertTriangle}
              tone={sickAnimals.length > 0 ? "alert" : "default"}
            />
            <StatTile label="Milk logged" value={`${milkTotal.toFixed(1)}L`} icon={Milk} />
            <StatTile label="Tasks pending" value={pendingTasks.length} icon={ClipboardList} />
            <StatTile label="Tasks done" value={doneTasks.length} icon={CheckCircle2} />
          </div>
        </AnimatedSection>

        {sickAnimals.length > 0 ? (
          <AnimatedSection delay={0.05}>
            <Card className="gap-2 border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-4" aria-hidden="true" />
                <span className="text-sm font-semibold">Needs attention</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {sickAnimals.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/dashboard/animals/${a.id}`}
                      className="text-sm text-pasture-900 underline-offset-2 hover:underline"
                    >
                      {a.name} ({a.tag}) — flagged sick
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </AnimatedSection>
        ) : null}

        <AnimatedSection delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="gap-4 border-pasture-100 p-5 sm:col-span-2">
              <h2 className="font-heading text-lg font-semibold text-pasture-950">
                Milk yield — last 7 days
              </h2>
              <MilkTrendChart data={milkTrend} />
            </Card>
            <Card className="justify-center gap-4 border-pasture-100 p-5">
              <h2 className="font-heading text-lg font-semibold text-pasture-950">
                Tasks this week
              </h2>
              <TaskMeter done={doneTasks.length} total={tasks.length} />
            </Card>
          </div>
        </AnimatedSection>

        {selectedFarmId === "all" ? (
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-xl font-semibold text-pasture-950">
                Your farms
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {demoFarms
                  .filter((f) => farms.some((ff) => ff.id === f.id))
                  .map((farm) => {
                    const farmAnimals = demoAnimals.filter((a) => a.farmId === farm.id);
                    const farmSick = farmAnimals.filter((a) => a.status === "sick").length;
                    const farmPending = demoTasks.filter(
                      (t) => t.farmId === farm.id && t.status === "pending",
                    ).length;
                    const farmMilk = demoMilkLogs
                      .filter((m) => m.farmId === farm.id)
                      .reduce((s, m) => s + m.litres, 0);
                    return (
                      <Card
                        key={farm.id}
                        className="gap-3 border-pasture-100 p-5 transition-transform hover:-translate-y-1 hover:shadow-md"
                      >
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-pasture-950">
                            {farm.name}
                          </h3>
                          <p className="text-sm text-pasture-600">{farm.location}</p>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-pasture-700">
                          <span>{farmAnimals.length} animals</span>
                          <span className={farmSick > 0 ? "font-medium text-destructive" : ""}>
                            {farmSick} sick
                          </span>
                          <span>{farmPending} pending tasks</span>
                          <span>{farmMilk.toFixed(1)}L milk</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-fit gap-1"
                          nativeButton={false}
                          render={<Link href={`/dashboard/animals?farm=${farm.id}`} />}
                        >
                          View farm
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Button>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </AnimatedSection>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-3">
          <AnimatedSection delay={0.1} className="lg:col-span-2">
            <Card className="gap-4 border-pasture-100 p-5">
              <h2 className="font-heading text-lg font-semibold text-pasture-950">
                Recent activity
              </h2>
              {activity.length === 0 ? (
                <p className="text-sm text-pasture-600">No activity logged yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {activity.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-pasture-50 text-pasture-700">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-pasture-900">{item.text}</p>
                          <p className="text-xs text-pasture-500">
                            {item.meta} ·{" "}
                            {new Date(item.loggedAt).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <Card className="gap-4 border-pasture-100 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-pasture-950">
                  Notifications
                </h2>
                <Link
                  href="/dashboard/notifications"
                  className="text-xs font-medium text-harvest-700 hover:underline"
                >
                  View all
                </Link>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-pasture-600">You&apos;re all caught up.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {notifications.map((n) => (
                    <li key={n.id} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.read ? "bg-pasture-200" : "bg-harvest-500"}`}
                      />
                      <p className="text-sm text-pasture-800">{n.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </AnimatedSection>
        </div>
      </Container>
    </div>
  );
}
