export function InfoStrip() {
  return (
    <section
      className="bg-themeBg px-4 py-3 text-themeText font-heb flex flex-col items-center"
      aria-label="פרטי איסוף ושעות פתיחה"
    >
      <p className="flex items-center justify-center gap-2 t-caption font-semibold">
        <img src="/icons/location.svg" alt="" aria-hidden width={14} height={14} className="block shrink-0" />
        <span>איסוף עצמי: ששת הימים 19, חדרה</span>
      </p>
      <p className="flex items-center justify-center gap-2 pt-2 t-caption text-themeText2">
        <img src="/icons/clock.svg" alt="" aria-hidden width={14} height={14} className="block shrink-0" />
        <span>שישי 10:00–18:00 | הזמנות עד 16:30 ביום שישי</span>
      </p>
      <p className="flex items-center justify-center gap-2 pt-2 t-caption text-themeText2">
        <img src="/icons/sparkle.svg" alt="" aria-hidden width={12} height={12} className="block shrink-0" />
        <span>שומרת כשרות בבית</span>
        <img src="/icons/sparkle.svg" alt="" aria-hidden width={12} height={12} className="block shrink-0" />
      </p>
    </section>
  );
}
