export function StepQuestion({
  index,
  title,
  subtitle,
  children,
}: {
  index?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-start gap-3 mb-2">
        {index != null && (
          <span className="mt-1.5 inline-flex items-center justify-center rounded-md bg-mint-500 text-white text-xs font-semibold h-6 w-6 shrink-0">
            {index}
          </span>
        )}
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-mint-900 leading-snug">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-ink-500 mb-8 ml-0 md:ml-9">
          {subtitle}
        </p>
      )}
      <div className="mt-6 md:ml-9">{children}</div>
    </div>
  );
}
