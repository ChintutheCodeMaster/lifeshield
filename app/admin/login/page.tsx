import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import { brand } from "@/lib/brand";
import { LoginForm } from "./LoginForm";

export default async function AdminLogin() {
  const supabase = await createServer();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/admin");
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-ink-300/20 shadow-sm p-8">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-2xl font-display font-bold text-mint-800">{brand.wordmark.primary}</span>
          <span className="text-2xl font-display font-light text-mint-500">{brand.wordmark.secondary}</span>
          <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-ink-500">Admin</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-mint-900">Sign in</h1>
        <p className="mt-1 text-sm text-ink-500">Access the leads dashboard.</p>
        <LoginForm />
      </div>
    </div>
  );
}
