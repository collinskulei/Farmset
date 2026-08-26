"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoFarms, demoProfile } from "@/lib/demo-data";
import type { Farm } from "@/lib/types";

const STORAGE_KEY = "farmset:selected-farm";

interface FarmContextValue {
  farms: Farm[];
  selectedFarmId: string | "all";
  setSelectedFarmId: (id: string | "all") => void;
  selectedFarm: Farm | null;
}

const FarmContext = createContext<FarmContextValue | null>(null);

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const farms = useMemo(
    () => demoFarms.filter((f) => demoProfile.farmIds.includes(f.id)),
    [],
  );
  const [selectedFarmId, setSelectedFarmIdState] = useState<string | "all">(
    "all",
  );

  useEffect(() => {
    // Read after mount (not in a lazy useState initializer) so the client's
    // first render matches the server-rendered "all" default and avoids a
    // hydration mismatch; the deferred update to a stored farm is intentional.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setSelectedFarmIdState(stored as string | "all");
    } catch {
      // localStorage unavailable — fall back to default "all"
    }
  }, []);

  function setSelectedFarmId(id: string | "all") {
    setSelectedFarmIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }

  const selectedFarm =
    selectedFarmId === "all"
      ? null
      : (farms.find((f) => f.id === selectedFarmId) ?? null);

  return (
    <FarmContext.Provider
      value={{ farms, selectedFarmId, setSelectedFarmId, selectedFarm }}
    >
      {children}
    </FarmContext.Provider>
  );
}

export function useFarmContext() {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarmContext must be used within FarmProvider");
  return ctx;
}
