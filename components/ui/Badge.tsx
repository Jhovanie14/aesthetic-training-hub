interface BadgeProps {
  variant: "premium";
}

export function Badge({ variant }: BadgeProps) {
  if (variant === "premium") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.18em] text-teal-300">
        <span className="h-1 w-1 bg-teal" aria-hidden="true" />
        Premium
      </span>
    );
  }

  return null;
}
