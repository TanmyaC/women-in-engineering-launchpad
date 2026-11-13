export function AuthorBadge({ initials, className = "" }: { initials?: string | null | undefined; className?: string }) {
  if (!initials) return null;
  return (
    <span
      title={`Added by ${initials}`}
      aria-label={`Added by ${initials}`}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage/25 font-display text-[11px] font-semibold text-forest ${className}`}
    >
      {initials}
    </span>
  );
}
