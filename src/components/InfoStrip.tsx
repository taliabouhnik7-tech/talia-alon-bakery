export function InfoStrip() {
  return (
    <section
      className="bg-themeBg text-themeText font-heb flex flex-col items-center px-4 py-3 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-x-10 lg:gap-y-2 lg:py-6 lg:max-w-4xl lg:mx-auto"
      aria-label="פרטי איסוף ושעות פתיחה"
    >
      <p className="flex items-center justify-center gap-2 t-caption font-semibold lg:font-normal lg:text-themeText2">
        <img src="/icons/location.svg" alt="" aria-hidden width={14} height={14} className="block shrink-0 lg:w-4 lg:h-4" />
        <span>איסוף עצמי: ששת הימים 19, חדרה</span>
      </p>
      <p className="flex items-center justify-center gap-2 pt-2 lg:pt-0 t-caption text-themeText2">
        <img src="/icons/clock.svg" alt="" aria-hidden width={14} height={14} className="block shrink-0 lg:w-4 lg:h-4" />
        <span>שישי 10:00–18:00 | הזמנות עד 16:30 ביום שישי</span>
      </p>
      <p className="flex items-center justify-center gap-2 pt-2 lg:pt-0 t-caption text-themeText2">
        <img src="/icons/sparkle.svg" alt="" aria-hidden width={12} height={12} className="block shrink-0" />
        <span>שומרת כשרות בבית</span>
      </p>
    </section>
  );
}
