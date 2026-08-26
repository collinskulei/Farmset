import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "w-fit rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
            dark
              ? "border-harvest-400/40 text-harvest-300"
              : "border-harvest-400/60 text-harvest-700",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "font-heading text-3xl font-semibold sm:text-4xl",
          dark ? "text-white" : "text-pasture-950",
        )}
      >
        {title}
      </h2>
      <span className="h-px w-16 bg-harvest-400" />
      {description ? (
        <p
          className={cn(
            "max-w-2xl",
            dark ? "text-pasture-100" : "text-pasture-700",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
