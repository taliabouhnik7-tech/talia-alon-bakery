export function LogoHeader() {
  return (
    <section
      className="relative bg-surface stripes-bg flex flex-col items-center justify-center overflow-hidden"
      style={{ height: 200 }}
      aria-label="לוגו"
    >
      <h1
        className="relative z-10 bg-themeBtn text-themeText font-logo flex items-center justify-center"
        style={{
          borderRadius: "9999px",
          border: "1.5px solid var(--c-text)",
          padding: "12px 32px",
          minWidth: 220,
          fontSize: 48,
          lineHeight: "60px",
          letterSpacing: "-1px",
        }}
      >
        טליה אלון
      </h1>
    </section>
  );
}
