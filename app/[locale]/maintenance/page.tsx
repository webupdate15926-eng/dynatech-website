import Image from "next/image";

import type { Locale } from "@/i18n/config";

export const metadata = { title: "Temporarily Offline" };

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isAr = locale === "ar";
  return <main dir={isAr ? "rtl" : "ltr"} className="flex min-h-screen items-center justify-center bg-[#080d20] px-5 py-12 text-white">
    <div className="w-full max-w-2xl text-center">
      <Image src="/logo-cropped.png" alt="DYNATECH Corporation" width={320} height={100} priority className="mx-auto h-auto w-56 object-contain md:w-72" />
      <div className="mx-auto mt-10 h-px w-20 bg-[#43becc]" />
      <h1 className="mt-8 text-4xl font-black uppercase leading-tight md:text-6xl">{isAr ? "الموقع متوقف مؤقتًا" : "Temporarily Offline"}</h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/60 md:text-lg">{isAr ? "نجري حاليًا بعض التحديثات على الموقع. سنعود للعمل قريبًا." : "We are currently making updates to the website. We will be back online shortly."}</p>
      <p className="mt-8 text-sm font-bold text-[#43becc]">info@dynatech-eg.com</p>
    </div>
  </main>;
}
