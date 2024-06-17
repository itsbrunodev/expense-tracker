import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/actions/auth";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="space-y-6 text-center">
        <Link href="/">
          <Logo className="mx-auto size-12" />
        </Link>
        <div className="text-center">
          <p className="text-xl font-medium">Expense Tracker</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-200">
            Log in to your account to continue
          </p>
        </div>
        <form
          className="flex min-w-80 flex-col gap-6 rounded-xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900"
          action={signIn}
        >
          {/* <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Input placeholder="name@example.com" />
              <Input placeholder="••••••" />
            </div>
            <div></div>
          </div> */}
          <div className="flex flex-col gap-2">
            {/* <Button variant="secondary" name="google">
              Continue with Google
            </Button> */}
            <Button variant="default" name="github">
              Continue with GitHub
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
