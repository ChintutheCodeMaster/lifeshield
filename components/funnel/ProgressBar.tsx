export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full bg-mint-100">
      <div
        className="h-full bg-mint-500 transition-all duration-500 ease-out"
        style={{ width: `${Math.max(3, Math.min(100, value))}%` }}
      />
    </div>
  );
}
