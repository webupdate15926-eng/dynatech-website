"use client";

import { Children, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  children: ReactNode;
  className: string;
  locale: string;
  initialCount?: number;
};

export function ExpandableCollection({
  children,
  className,
  locale,
  initialCount = 8,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const hasMore = items.length > initialCount;
  const visibleItems = expanded ? items : items.slice(0, initialCount);
  const isAr = locale === "ar";

  return (
    <>
      <div className={className}>{visibleItems}</div>
      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex min-h-12 items-center gap-2 border border-[#008ED3] bg-[#008ED3] px-6 py-3 text-sm font-black uppercase text-white transition hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008ED3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d20]"
          >
            {expanded ? (isAr ? "عرض أقل" : "Show less") : (isAr ? "عرض المزيد" : "Show more")}
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      ) : null}
    </>
  );
}
