"use client";

import { usePathname, useRouter } from "next/navigation";

export function LocaleSwitcher({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);
  const currentLocale = parts[0] === "ar" ? "ar" : "en";
  const nextLocale = currentLocale === "ar" ? "en" : "ar";

  const rest = parts.slice(1).join("/");
  const nextPath = rest ? `/${nextLocale}/${rest}` : `/${nextLocale}`;

  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-[#008ED3]/50 hover:bg-black/[.04] hover:text-[#008ED3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ED3]/60 dark:border-white/[.145] dark:hover:bg-white/[.06] ${
        className ?? ""
      }`}
      onClick={() => {
        onNavigate?.();
        router.push(nextPath);
      }}
    >
      {nextLocale === "ar" ? "عربي" : "EN"}
    </button>
  );
}
