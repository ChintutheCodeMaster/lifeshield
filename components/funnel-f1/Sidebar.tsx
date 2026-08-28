import Link from "next/link";
import { groupsF1 } from "@/lib/funnel-mock/groups-f1";
import { cn } from "@/lib/utils";

export function SidebarF1({ activeSlug }: { activeSlug: string }) {
  const items = [
    { slug: "__start__", label: "Start", isMilestone: true },
    ...groupsF1.map((g) => ({ slug: g.slug, label: g.label, isMilestone: false })),
    { slug: "__results__", label: "Results", isMilestone: true },
  ];
  const activeIdx = items.findIndex((i) => i.slug === activeSlug);

  return (
    <aside className="hidden md:flex flex-col gap-0 shrink-0 w-40 pt-6 pl-2">
      <Link href="/" className="mb-10 flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-mint-800">Mint</span>
        <span className="text-2xl font-display font-light text-mint-500">Life</span>
      </Link>
      <ol className="relative flex flex-col gap-6">
        {items.map((item, i) => {
          const isActive = i === activeIdx;
          const isDone = activeIdx >= 0 && i < activeIdx;
          const showConnector = i < items.length - 1;
          return (
            <li key={item.slug} className="relative flex items-start gap-3">
              <div className="flex flex-col items-center">
                {item.isMilestone && i === 0 ? (
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] font-bold tracking-wider",
                      isDone || isActive
                        ? "bg-mint-500 text-white"
                        : "bg-mint-100 text-mint-700",
                    )}
                  >
                    START
                  </span>
                ) : (
                  <span
                    className={cn(
                      "block h-3 w-3 rounded-full border-2 transition-colors",
                      isActive
                        ? "border-mint-600 bg-mint-500"
                        : isDone
                          ? "border-mint-500 bg-mint-500"
                          : "border-ink-300 bg-white",
                    )}
                  />
                )}
                {showConnector && (
                  <span
                    className={cn(
                      "mt-1 w-px flex-1 min-h-[36px]",
                      isDone ? "bg-mint-400" : "bg-ink-300/60",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-wider uppercase mt-0.5",
                  isActive ? "text-mint-800" : isDone ? "text-mint-600" : "text-ink-500",
                )}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
