import { Container } from "@/components/site/container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-pasture-950 py-12 text-center text-white sm:py-16">
      <Container className="flex flex-col items-center gap-3">
        {eyebrow ? (
          <span className="rounded-full border border-harvest-400/60 px-3 py-1 text-xs font-semibold tracking-wide text-harvest-300 uppercase">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="font-heading text-3xl font-bold sm:text-5xl">{title}</h1>
        <span className="h-px w-16 bg-harvest-400" />
        {description ? (
          <p className="max-w-2xl text-pasture-100">{description}</p>
        ) : null}
      </Container>
    </div>
  );
}
