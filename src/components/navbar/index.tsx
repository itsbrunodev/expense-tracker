import { LogOutIcon, SettingsIcon, UserRoundIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import LocaleSwitcher from "../locale/locale-switcher";
import { Logo } from "../logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Routes } from "./routes";

export function Navbar({
  className,
  setup = false,
}: {
  className?: string;
  setup?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto mb-10 w-full max-w-4xl px-4 xl:px-0",
        setup && "absolute left-0 right-0 top-0",
        className
      )}
    >
      <nav className="relative flex items-center justify-between py-8">
        <Link className="transition-opacity hover:opacity-80" href="/">
          <Logo className="size-10" />
        </Link>
        {!setup && <Routes />}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {!setup && <NavbarUser />}
        </div>
      </nav>
    </div>
  );
}

function UserAvatar({
  className,
  url,
  username,
}: {
  className?: string;
  url: string;
  username: string;
}) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={url} alt={username} />
      <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

async function NavbarUser() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const t = await getTranslations();

  return (
    <DropdownMenu>
      {user ? (
        <DropdownMenuTrigger className="rounded-full">
          <UserAvatar
            url={user.user_metadata.avatar_url}
            username={user.user_metadata.user_name}
          />
        </DropdownMenuTrigger>
      ) : (
        <Button variant="secondary" size="sm" asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
      {user && (
        <DropdownMenuContent className="w-48" align="end" sideOffset={5}>
          <DropdownMenuLabel className="flex items-center gap-2">
            <UserAvatar
              className="size-9"
              url={user.user_metadata.avatar_url}
              username={user.user_metadata.user_name}
            />
            <div>
              <p className="font-semibold">{user.user_metadata.full_name}</p>
              <p className="text-xs font-normal text-zinc-800 dark:text-zinc-200">
                @{user.user_metadata.user_name}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserRoundIcon className="mr-2 size-4" /> {t("my-profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <SettingsIcon className="mr-2 size-4" />
              {t("settings")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <DropdownMenuItem
              className="w-full text-red-600 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500"
              asChild
            >
              <button>
                <LogOutIcon className="mr-2 size-4" />
                {t("sign-out")}
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
