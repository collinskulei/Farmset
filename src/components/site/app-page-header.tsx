import { cn } from "@/lib/utils";
import { Container } from "@/components/site/container";

export function AppPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-pasture-100 bg-pasture-50/60", className)}>
      <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-pasture-950 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-pasture-700">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </Container>
    </div>
  );
}
