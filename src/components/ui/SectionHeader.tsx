import { FadeIn } from "@/lib/animations";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <FadeIn className={`max-w-3xl mb-16 ${alignClass}`}>
      {label && (
        <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase mb-4">
          {label}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-lg text-muted leading-relaxed">{description}</p>
      )}
    </FadeIn>
  );
}
