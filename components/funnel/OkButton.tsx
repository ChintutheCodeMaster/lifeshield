import { cn } from "@/lib/utils";

export function OkButton({
  label = "OK",
  disabled,
  loading,
  showEnterHint = true,
  className,
}: {
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  showEnterHint?: boolean;
  className?: string;
}) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <button
        type="submit"
        disabled={disabled || loading}
        className={cn(
          "rounded-md bg-mint-500 hover:bg-mint-600 text-white font-semibold px-6 py-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm",
          className,
        )}
      >
        {loading ? "…" : label}
      </button>
      {showEnterHint && !disabled && (
        <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-ink-500">
          press <kbd className="rounded bg-ink-300/30 px-1.5 py-0.5 font-medium">Enter ↵</kbd>
        </span>
      )}
    </div>
  );
}
