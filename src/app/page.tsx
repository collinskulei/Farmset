"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const inputClass =
  "h-11 rounded-lg border border-pasture-200 px-3 text-base focus-visible:border-harvest-500 focus-visible:ring-2 focus-visible:ring-harvest-400/40";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col bg-pasture-50">
      <Container className="flex flex-1 flex-col items-center justify-center py-12">
        <div className="mb-8 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 font-heading text-xl font-semibold text-pasture-950">
            <span className="flex size-9 items-center justify-center rounded-lg bg-pasture-600 text-white">
              <Sprout className="size-5" aria-hidden="true" />
            </span>
            FarmSet
          </div>
          <p className="text-xs text-pasture-600">Provided by Muse Set Farm Services</p>
        </div>

        <Card className="w-full max-w-sm gap-5 border-pasture-100 p-6 sm:p-8">
          <div className="text-center">
            <h1 className="font-heading text-xl font-semibold text-pasture-950">Welcome back</h1>
            <p className="mt-1 text-sm text-pasture-600">Log in to your farm dashboard.</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required placeholder="••••••••" className={inputClass} />
            </div>
            <Button type="submit" size="lg" className="btn-metallic gold-line h-11 font-semibold">
              Log in
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-pasture-100" />
            <span className="text-xs text-pasture-400">or</span>
            <span className="h-px flex-1 bg-pasture-100" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gold-line h-11"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Continue with demo account
          </Button>
        </Card>

        <p className="mt-6 text-center text-xs text-pasture-500">
          Prototype build — authentication is not yet wired to a live account.
        </p>
      </Container>
    </div>
  );
}
