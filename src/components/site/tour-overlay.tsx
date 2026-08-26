"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTour } from "@/components/site/tour-context";
import { TOUR_STEPS } from "@/lib/tour-steps";
import { Button } from "@/components/ui/button";

function findVisibleTarget(keys: string[]): HTMLElement | null {
  for (const key of keys) {
    const els = document.querySelectorAll<HTMLElement>(`[data-tour="${key}"]`);
    for (const el of Array.from(els)) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return el;
    }
  }
  return null;
}

export function TourOverlay() {
  const { active, stepIndex, totalSteps, next, prev, skip } = useTour();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = TOUR_STEPS[stepIndex];

  useEffect(() => {
    if (!active) return;
    if (step.targets.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing to a step change, not a render loop
      setRect(null);
      return;
    }
    const el = findVisibleTarget(step.targets);
    if (!el) {
      // No matching element visible at this viewport size — skip past this step.
      const timer = window.setTimeout(() => next(), 0);
      return () => window.clearTimeout(timer);
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const update = () => setRect(el.getBoundingClientRect());
    update();
    const interval = window.setInterval(update, 100);
    window.addEventListener("resize", update);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  if (!active) return null;

  const padding = 8;
  const cardWidth = 320;
  const cardHeightEstimate = 180;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;

  let cardTop: number;
  let cardLeft: number;

  if (rect) {
    const roomBelow = vh - rect.bottom;
    cardTop =
      roomBelow > cardHeightEstimate + 24
        ? rect.bottom + 16
        : Math.max(16, rect.top - cardHeightEstimate - 16);
    cardLeft = Math.min(
      Math.max(16, rect.left + rect.width / 2 - cardWidth / 2),
      vw - cardWidth - 16,
    );
  } else {
    cardTop = vh / 2 - cardHeightEstimate / 2;
    cardLeft = vw / 2 - cardWidth / 2;
  }

  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[100]">
      {rect ? (
        <div
          className="pointer-events-none fixed rounded-xl ring-2 ring-harvest-400 transition-[top,left,width,height] duration-150"
          style={{
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            boxShadow: "0 0 0 9999px rgba(16,36,21,0.6)",
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-pasture-950/60" />
      )}

      <div
        className="fixed w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-pasture-100 bg-white p-5 shadow-lg transition-[top,left] duration-150"
        style={{ top: cardTop, left: cardLeft }}
        role="dialog"
        aria-label="Product tour"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-harvest-700 uppercase">
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={skip}
            aria-label="Close tour"
            className="text-pasture-400 hover:text-pasture-700"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <h3 className="font-heading text-lg font-semibold text-pasture-950">{step.title}</h3>
        <p className="mt-1 text-sm text-pasture-700">{step.body}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={skip}
            className="text-sm font-medium text-pasture-500 hover:text-pasture-800"
          >
            Skip
          </button>
          <div className="flex gap-2">
            {stepIndex > 0 ? (
              <Button variant="outline" size="sm" onClick={prev}>
                Back
              </Button>
            ) : null}
            <Button size="sm" className="btn-metallic gold-line font-semibold" onClick={next}>
              {isLast ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
