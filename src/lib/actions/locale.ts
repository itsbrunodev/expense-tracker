"use server";

import { cookies } from "next/headers";

export async function setLocale(locale: string) {
  cookies().set("locale", locale);
}
