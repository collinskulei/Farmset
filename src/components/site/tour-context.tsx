"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TOUR_STEPS } from "@/lib/tour-steps";

const SEEN_KEY = "farmset:tour-seen";

interface TourContextValue {
  active: boolean;
  stepIndex: number;
  totalSteps: number;
  start: () => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const pendingStartRef = useRef(false);

  // Auto-start on a visitor's first arrival at the dashboard.
  useEffect(() => {
    if (pathname !== "/dashboard") return;
    let seen: string | null = null;
    try {
      seen = window.localStorage.getItem(SEEN_KEY);
    } catch {
      // localStorage unavailable — skip auto-tour rather than error
    }
    if (seen) return;
    const timer = window.setTimeout(() => {
      setStepIndex(0);
      setActive(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  // "Guide me" from a non-dashboard page: navigate first, then start once mounted.
  useEffect(() => {
    if (!pendingStartRef.current || pathname !== "/dashboard") return;
    pendingStartRef.current = false;
    const timer = window.setTimeout(() => {
      setStepIndex(0);
      setActive(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function markSeen() {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
  }

  function start() {
    if (pathname !== "/dashboard") {
      pendingStartRef.current = true;
      router.push("/dashboard");
      return;
    }
    setStepIndex(0);
    setActive(true);
  }

  function next() {
    setStepIndex((i) => {
      if (i >= TOUR_STEPS.length - 1) {
        markSeen();
        setActive(false);
        return i;
      }
      return i + 1;
    });
  }

  function prev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function skip() {
    markSeen();
    setActive(false);
  }

  return (
    <TourContext.Provider
      value={{ active, stepIndex, totalSteps: TOUR_STEPS.length, start, next, prev, skip }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}
