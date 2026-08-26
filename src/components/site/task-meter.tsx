export function TaskMeter({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-pasture-700">
          {done} of {total} tasks done
        </span>
        <span className="font-heading text-lg font-semibold text-pasture-950 tabular-nums">
          {pct}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-pasture-100">
        <div
          className="h-full rounded-full bg-pasture-600 transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
