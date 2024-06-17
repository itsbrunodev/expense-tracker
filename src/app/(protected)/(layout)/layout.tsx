import { redirect } from "next/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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
   * If the user is not authenticated, redirect to the login page.
   */
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-4xl px-4 xl:px-0">{children}</div>
      <Footer />
    </>
  );
}
