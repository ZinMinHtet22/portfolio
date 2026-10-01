import { cn } from "@/lib/utils";
import { RevealWords } from "@/components/ui/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  muted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  muted = true,
}: Props) {
  return (
    <div className={cn("mb-14 max-w-[900px]", className)}>
      {eyebrow ? (
        <p className="mb-6 text-sm text-white/40">{eyebrow}</p>
      ) : null}
      <RevealWords
        text={title}
        className={cn(
          "display text-[42px] md:text-[56px] xl:text-[72px]",
          muted ? "text-white/60" : "text-white",
        )}
      />
      {description ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
