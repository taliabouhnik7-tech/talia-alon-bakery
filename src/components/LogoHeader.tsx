export function LogoHeader() {
  return (
    <section
      className="relative bg-surface stripes-bg flex flex-col items-center justify-center overflow-hidden h-[200px] lg:h-[440px]"
      aria-label="לוגו"
    >
      <h1 className="relative z-10 bg-themeBtn text-themeText font-logo flex items-center justify-center rounded-full border-[1.5px] border-[color:var(--c-text)] tracking-[-1px] min-w-[220px] px-8 py-3 lg:px-16 lg:py-6 lg:min-w-[320px] lg:shadow-[0_4px_24px_rgba(67,48,46,0.12)]">
        <span className="text-[48px] leading-[60px] lg:text-[72px] lg:leading-[84px]">
          טליה אלון
        </span>
      </h1>
    </section>
  );
}
