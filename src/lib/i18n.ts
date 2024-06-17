import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale =
    cookies().get("locale")?.value ||
    headers().get("accept-language")?.split(",")[1].substring(0, 2) ||
    "en";

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
