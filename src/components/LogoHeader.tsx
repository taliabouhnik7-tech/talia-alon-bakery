type Props = {
  // A custom header asset (raster or SVG) that replaces the ENTIRE default
  // header (stripes + logo oval). When set, it IS the header.
  imageUrl?: string | null;
};

export function LogoHeader({ imageUrl = null }: Props) {
  // Custom uploaded header: the asset fills the same fixed-height band as the
  // default header. object-cover keeps it full-bleed (no letterboxing) and never
  // breaks layout; it may crop at the edges when the asset's aspect differs from
  // the band (see /admin/site for the recommended dimensions). Plain <img> (not
  // next/image) so both raster AND svg work without extra config.
  if (imageUrl) {
    return (
      <section
        className="relative bg-surface overflow-hidden h-[200px] lg:h-[440px]"
        aria-label="לוגו"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="טליה אלון"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </section>
    );
  }

  // Default header: striped background + logo oval (theme-token colors).
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
