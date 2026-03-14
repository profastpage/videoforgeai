import { getRequestLocale } from "@/lib/i18n/server-locale";
import { messages } from "@/lib/i18n/messages";

export async function getServerCopy() {
  const locale = await getRequestLocale();

  return {
    locale,
    copy: messages[locale],
  };
}
