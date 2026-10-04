import { cookies } from "next/headers";

import { LOCALE_COOKIE, resolveLocale } from "./locale";
import type { TMessageBundle } from "./messages/define-messages";

export async function getLocale() {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function getMessages<T>(bundle: TMessageBundle<T>) {
  return bundle[await getLocale()];
}
