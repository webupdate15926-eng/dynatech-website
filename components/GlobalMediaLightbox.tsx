"use client";

import { Maximize2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type ActiveMedia = {
  src: string;
  type: "image" | "video";
  alt: string;
  poster?: string;
};

function isLightboxMedia(media: HTMLImageElement | HTMLVideoElement) {
  if (!media.closest("main")) return false;
  if (media.closest("a, button, [data-lightbox-ignore]")) return false;
  if (media.getAttribute("aria-hidden") === "true" || media.getAttribute("role") === "presentation") return false;

  if (media instanceof HTMLVideoElement) {
    return !(media.autoplay && media.loop && media.muted);
  }

  const alt = media.alt.toLowerCase();
  const src = media.currentSrc || media.src;
  if (alt.includes("logo") || src.toLowerCase().includes("logo")) return false;

  const rect = media.getBoundingClientRect();
  return rect.width >= 160 && rect.height >= 120;
}

function imageSource(image: HTMLImageElement) {
  const source = image.currentSrc || image.src;

  try {
    const url = new URL(source, window.location.origin);
    return url.searchParams.get("url") || source;
  } catch {
    return source;
  }
}

export function GlobalMediaLightbox() {
  const pathname = usePathname();
  const isAr = pathname.startsWith("/ar");
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null);

  useEffect(() => {
    const updateMediaCursors = () => {
      document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("main img, main video").forEach((media) => {
        media.classList.toggle("cursor-zoom-in", isLightboxMedia(media));
      });
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const media = target.closest<HTMLImageElement | HTMLVideoElement>("img, video");
      if (!media || !isLightboxMedia(media)) return;

      event.preventDefault();
      setActiveMedia(
        media instanceof HTMLVideoElement
          ? {
              src: media.currentSrc || media.querySelector("source")?.src || "",
              type: "video",
              alt: media.getAttribute("aria-label") || (isAr ? "معاينة فيديو" : "Video preview"),
              poster: media.poster || undefined,
            }
          : {
              src: imageSource(media),
              type: "image",
              alt: media.alt || (isAr ? "معاينة صورة" : "Image preview"),
            },
      );
    };

    updateMediaCursors();
    document.addEventListener("click", onClick);
    window.addEventListener("resize", updateMediaCursors);
    const observer = new MutationObserver(updateMediaCursors);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", updateMediaCursors);
      observer.disconnect();
    };
  }, [isAr]);

  useEffect(() => {
    if (!activeMedia) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMedia(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMedia]);

  if (!activeMedia) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/92 px-4 py-5 backdrop-blur-md md:px-8"
      role="dialog"
      aria-modal="true"
      aria-label={activeMedia.alt}
      onClick={() => setActiveMedia(null)}
    >
      <button
        type="button"
        onClick={() => setActiveMedia(null)}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-white/20 bg-white text-black transition hover:bg-[#008ED3] md:right-7 md:top-7"
        aria-label={isAr ? "إغلاق معاينة الوسائط" : "Close media preview"}
      >
        <X size={20} />
      </button>

      <div
        className="relative flex h-full max-h-[88vh] w-full max-w-7xl items-center justify-center overflow-hidden border border-white/12 bg-[#080d20] shadow-[0_30px_120px_rgba(0,0,0,0.68)]"
        onClick={(event) => event.stopPropagation()}
      >
        {activeMedia.type === "image" ? (
          // A native image is used because the source is discovered dynamically from rendered page media.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeMedia.src} alt={activeMedia.alt} className="max-h-full max-w-full object-contain" />
        ) : (
          <video
            key={activeMedia.src}
            className="h-full w-full bg-black object-contain"
            poster={activeMedia.poster}
            controls
            autoPlay
            playsInline
          >
            <source src={activeMedia.src} type="video/mp4" />
          </video>
        )}

        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 border border-white/15 bg-black/65 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur">
          <Maximize2 size={14} />
          {activeMedia.type === "video" ? (isAr ? "فيديو" : "Video") : (isAr ? "صورة" : "Image")}
        </div>
      </div>
    </div>
  );
}
