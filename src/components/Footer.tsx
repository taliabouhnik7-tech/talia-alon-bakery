const PHONE_DISPLAY = "058-666-6623";
const PHONE_INTL = "972586666623"; // Israel, no leading 0

type Social = { label: string; href: string; icon: React.ReactNode };

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const,
};

const socials: Social[] = [
  {
    label: "אינסטגרם",
    href: "https://www.instagram.com/talia_alon_1/",
    icon: (
      <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "טיקטוק",
    href: "https://www.tiktok.com/@talia_alon_",
    icon: (
      <svg {...iconProps}>
        <path d="M16.5 3c.35 2.05 1.55 3.6 3.5 3.9v2.45c-1.28 0-2.5-.32-3.5-1v6.15A5.2 5.2 0 1 1 11.3 9.3c.3 0 .6.03.9.08v2.55a2.7 2.7 0 1 0 1.9 2.57V3h2.4z" />
      </svg>
    ),
  },
  {
    label: "יוטיוב",
    href: "https://www.youtube.com/@טליהאלון1/shorts",
    icon: (
      <svg {...iconProps}>
        <path d="M23 12s0-3-.38-4.44a2.5 2.5 0 0 0-1.77-1.77C19.4 5.4 12 5.4 12 5.4s-7.4 0-8.85.39A2.5 2.5 0 0 0 1.38 7.56C1 9 1 12 1 12s0 3 .38 4.44a2.5 2.5 0 0 0 1.77 1.77C4.6 18.6 12 18.6 12 18.6s7.4 0 8.85-.39a2.5 2.5 0 0 0 1.77-1.77C23 15 23 12 23 12zM9.8 15.3V8.7l6 3.3-6 3.3z" />
      </svg>
    ),
  },
  {
    label: "פייסבוק",
    href: "https://www.facebook.com/TaliaAlon1/",
    icon: (
      <svg {...iconProps}>
        <path d="M13.5 22v-8h2.6l.4-3h-3V9c0-.86.24-1.45 1.47-1.45H16.6V4.9c-.28-.04-1.23-.12-2.33-.12-2.3 0-3.88 1.4-3.88 4v2.22H7.8v3h2.6v8h3.1z" />
      </svg>
    ),
  },
];

const WhatsAppIcon = (
  <svg {...iconProps}>
    <path d="M12 2a10 10 0 0 0-8.53 15.2L2 22l4.9-1.28A10 10 0 1 0 12 2zm0 1.9a8.1 8.1 0 1 1-4.15 15.05l-.3-.18-2.9.76.78-2.83-.2-.3A8.1 8.1 0 0 1 12 3.9zm4.3 10.6c-.23-.12-1.37-.68-1.58-.76-.21-.08-.37-.12-.52.12-.15.23-.6.75-.73.9-.13.15-.27.17-.5.06a6.5 6.5 0 0 1-1.9-1.18 7.2 7.2 0 0 1-1.32-1.64c-.14-.24 0-.36.1-.48.1-.1.23-.27.35-.4.11-.14.15-.24.23-.4.08-.16.04-.3-.02-.42-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45c-.15 0-.4.06-.6.3-.21.24-.8.78-.8 1.9s.82 2.2.94 2.36c.11.15 1.6 2.45 3.9 3.44.54.24.97.38 1.3.48.55.18 1.05.15 1.44.09.44-.06 1.37-.56 1.56-1.1.19-.54.19-1 .13-1.1-.05-.1-.2-.16-.43-.28z" />
  </svg>
);

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center w-11 h-11 rounded-full text-themeText transition hover:brightness-95 active:brightness-90"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-themeBtn text-themeText" aria-label="כותרת תחתונה">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 flex flex-col items-center gap-5 text-center lg:flex-row lg:items-start lg:justify-between lg:text-right lg:gap-8">
        {/* Business info */}
        <div className="flex flex-col gap-1">
          <p className="font-logo text-[22px] leading-none">טליה אלון</p>
          <p className="t-caption">מאפייה ביתית</p>
          <p className="t-caption text-themeText2 mt-1 max-w-xs mx-auto lg:mx-0">
            איסוף עצמי: ששת הימים 19, חדרה · שישי 10:00–18:00
          </p>
        </div>

        {/* Contact + socials */}
        <div className="flex flex-col items-center gap-3 lg:items-end">
          <div className="flex items-center gap-2">
            <a
              href={`tel:+${PHONE_INTL}`}
              className="font-heb font-semibold t-body hover:underline"
              dir="ltr"
            >
              {PHONE_DISPLAY}
            </a>
            <IconLink href={`https://wa.me/${PHONE_INTL}`} label="שליחת הודעה בוואטסאפ">
              {WhatsAppIcon}
            </IconLink>
          </div>
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <IconLink key={s.label} href={s.href} label={s.label}>
                {s.icon}
              </IconLink>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <p className="mx-auto w-full max-w-6xl px-4 py-3 t-caption text-themeText2 text-center">
          © {year} טליה אלון · כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
}
