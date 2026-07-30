"use client";

import { useEffect, useRef } from "react";

export function LogoHeader() {
  const bubbleRef = useRef<HTMLHeadingElement>(null);

  // Fade the logo bubble out as the page scrolls, so it never peeks below the
  // sticky header as a detached blue oval. rAF-throttled, passive listener.
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      // Fade gradually over a longer scroll distance (was 120px — too abrupt).
      const o = Math.max(0, 1 - window.scrollY / 280);
      el.style.opacity = String(o);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="relative bg-surface stripes-bg flex flex-col items-center justify-center overflow-hidden h-[200px] lg:h-[440px]"
      aria-label="לוגו"
    >
      <h1
        ref={bubbleRef}
        className="relative z-10 bg-themeBtn text-themeText font-logo flex items-center justify-center rounded-full border-[1.5px] border-[color:var(--c-text)] tracking-[-1px] min-w-[220px] px-8 py-3 lg:px-16 lg:py-6 lg:min-w-[320px] lg:shadow-[0_4px_24px_rgba(67,48,46,0.12)] will-change-[opacity]"
      >
        <span className="text-[48px] leading-[60px] lg:text-[72px] lg:leading-[84px]">
          טליה אלון
        </span>
      </h1>
    </section>
  );
}
