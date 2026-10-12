import Link from "next/link";
import { Sprout } from "lucide-react";
import { Container } from "@/components/site/container";

export function Footer() {
  return (
    <footer className="bg-pasture-950 text-pasture-100">
      <Container className="grid gap-8 py-12 sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 font-heading text-lg font-semibold text-white">
            <span className="flex size-8 items-center justify-center rounded-lg bg-harvest-500 text-pasture-950">
              <Sprout className="size-4.5" aria-hidden="true" />
            </span>
            FarmSet
          </div>
          <p className="max-w-xs text-sm text-pasture-300">
            Walk away from your farm without losing touch with it.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-white">Quick links</span>
          <Link href="/dashboard" className="text-pasture-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/dashboard/animals" className="text-pasture-300 hover:text-white">
            Animals
          </Link>
          <Link href="/dashboard/log" className="text-pasture-300 hover:text-white">
            Log activity
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-white">Built by</span>
          <span className="text-pasture-300">Collins Kulei</span>
          <span className="text-pasture-300">Prototype build — for client review</span>
        </div>
      </Container>
      <div className="border-t border-pasture-800 py-4">
        <p className="text-center text-xs text-pasture-400">
          © 2026 Muse Set Farm Services. FarmSet is a product of Muse Set Farm Services. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
