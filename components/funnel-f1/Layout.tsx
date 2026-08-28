import { SidebarF1 } from "./Sidebar";

export function LayoutF1({
  activeSlug,
  children,
}: {
  activeSlug: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf7f0] text-ink-900">
      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-24">
        <div className="flex gap-10">
          <SidebarF1 activeSlug={activeSlug} />
          <main className="flex-1 min-w-0 pt-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
