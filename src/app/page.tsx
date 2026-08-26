import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckSquare,
  ClipboardList,
  Milk,
  PaintBucket,
  Sprout,
  Syringe,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { AnimatedSection } from "@/components/site/animated-section";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const VALUE_POINTS = [
  { icon: AlertTriangle, text: "Which cow or calf is sick" },
  { icon: Syringe, text: "Which animal received medicine, and when" },
  { icon: Milk, text: "How many litres of milk were produced, and when" },
  { icon: CheckSquare, text: "Which farm jobs have been completed" },
  { icon: PaintBucket, text: "Whether sheds have been scraped and cleaned" },
  { icon: Bell, text: "What needs to be done, and when" },
  { icon: ClipboardList, text: "What has not been done" },
  { icon: BarChart3, text: "A clear picture of the farm's daily performance" },
];

const STEPS = [
  {
    title: "Managers log from the field",
    text: "Medicine given, milk collected, sheds cleaned, jobs done — logged in seconds from a phone, right where the work happens.",
  },
  {
    title: "Owners see it all, from anywhere",
    text: "One dashboard rolls up every farm, every manager, every animal — sick alerts and overdue jobs surface immediately.",
  },
  {
    title: "Walk away with confidence",
    text: "Leave for 5-10 days and come back knowing exactly what happened, every day you were gone.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-pasture-100 bg-background/95 backdrop-blur">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-heading text-lg font-semibold text-pasture-950">
            <span className="flex size-8 items-center justify-center rounded-lg bg-pasture-600 text-white">
              <Sprout className="size-4.5" aria-hidden="true" />
            </span>
            FarmSet
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
              Log in
            </Button>
            <Button
              className="btn-metallic gold-line font-semibold"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              View live demo
            </Button>
          </div>
        </Container>
      </header>

      <section className="bg-pasture-950 py-16 text-center text-white sm:py-24">
        <Container className="flex flex-col items-center gap-5">
          <span className="rounded-full border border-harvest-400/60 px-3 py-1 text-xs font-semibold tracking-wide text-harvest-300 uppercase">
            Designed by a farmer, for farmers
          </span>
          <h1 className="font-heading max-w-3xl text-4xl font-bold sm:text-5xl">
            Walk away from your farm without losing touch with it.
          </h1>
          <span className="h-px w-16 bg-harvest-400" />
          <p className="max-w-xl text-pasture-100">
            FarmSet gives dairy farm owners and managers peace of mind through
            visibility and accountability — across every farm, every manager,
            every animal.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="btn-metallic gold-line h-11 font-semibold"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              View live demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gold-line h-11 border-white/40 bg-transparent text-white hover:bg-white/10"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Log in
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-pasture-50 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Total visibility"
            title="Leave for 5–10 days. Know exactly what happened, every day."
            description="Everything an owner needs to check on while away — surfaced automatically, not chased down."
            align="center"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <AnimatedSection key={point.text} delay={(i % 4) * 0.05}>
                  <Card className="gold-line h-full gap-2 border p-5">
                    <Icon className="size-5 text-harvest-600" aria-hidden="true" />
                    <p className="text-sm font-medium text-pasture-900">{point.text}</p>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="How it works"
            title="Built around the daily rhythm of a working farm"
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.1}>
                <div className="flex h-full flex-col gap-2 rounded-2xl border border-pasture-100 bg-white p-6 shadow-sm">
                  <span className="flex size-8 items-center justify-center rounded-full bg-pasture-950 font-heading text-sm font-semibold text-harvest-300">
                    {i + 1}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-pasture-950">
                    {step.title}
                  </h3>
                  <p className="text-sm text-pasture-700">{step.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-pasture-950 py-16 text-center text-white sm:py-20">
        <Container className="flex flex-col items-center gap-5">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Ready to walk through the prototype?
          </h2>
          <p className="max-w-xl text-pasture-100">
            This is a working prototype for review — dashboard, animal
            profiles, field logging, and notifications, all connected.
          </p>
          <Button
            size="lg"
            className="btn-metallic gold-line h-11 font-semibold"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            View live demo
          </Button>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
