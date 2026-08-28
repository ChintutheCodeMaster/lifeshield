import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(3, Math.min(100, value));
  return (
    <div
      className={cn(
        "relative h-2 w-full rounded-full bg-mint-100/70 overflow-hidden",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-mint-400 to-mint-600 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
