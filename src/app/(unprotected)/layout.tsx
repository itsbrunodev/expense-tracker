import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * If the user is authenticated, redirect to the home page.
   */
  if (user) {
    return redirect("/home");
  }

  return <>{children}</>;
}
