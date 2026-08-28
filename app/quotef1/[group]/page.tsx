import { notFound } from "next/navigation";
import {
  findGroupF1,
  groupIndexF1,
  groupStepsF1,
  groupsF1,
} from "@/lib/funnel-mock/groups-f1";
import { LayoutF1 } from "@/components/funnel-f1/Layout";
import { GroupForm } from "@/components/funnel-f1/GroupForm";

export default async function QuoteF1GroupPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group: slug } = await params;
  const group = findGroupF1(slug);
  if (!group) notFound();

  const idx = groupIndexF1(slug);
  const prev = idx > 0 ? groupsF1[idx - 1] : null;
  const backHref = prev ? `/quotef1/${prev.slug}` : "/";
  const steps = groupStepsF1(group);

  return (
    <LayoutF1 activeSlug={slug}>
      <GroupForm
        groupTitle={group.title}
        groupSubtitle={group.subtitle}
        steps={steps}
        next={group.next}
        backHref={backHref}
      />
    </LayoutF1>
  );
}
