export function MilkTrendChart({
  data,
}: {
  data: { label: string; value: number; isToday?: boolean }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div>
      <div className="flex h-32 items-end gap-2">
        {data.map((d) => {
          const heightPct = (d.value / max) * 100;
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] font-medium text-pasture-700 tabular-nums">
                {d.isToday && d.value > 0 ? `${d.value.toFixed(1)}L` : " "}
              </span>
              <div className="flex h-24 w-full items-end">
                <div
                  className={`w-full rounded-t-[4px] ${d.isToday ? "bg-harvest-500" : "bg-pasture-300"}`}
                  style={{ height: `${Math.max(heightPct, d.value > 0 ? 6 : 0)}%` }}
                />
              </div>
              <span className="text-[11px] text-pasture-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
