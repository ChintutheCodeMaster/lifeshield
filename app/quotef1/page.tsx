import { redirect } from "next/navigation";
import { groupsF1 } from "@/lib/funnel-mock/groups-f1";

export default function QuoteF1Entry() {
  redirect(`/quotef1/${groupsF1[0].slug}`);
}
