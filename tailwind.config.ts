import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        beige: "#F7EEE6",
        cream: "#FAF7F2",
        surface: "#FFFFFF",
        skyblue: "#D2E2EB",
        sand: "#EBDA9A",
        // Text
        ink: "#43302E",
        inkHead: "#33261A",
        inkPrice: "#4D4033",
        inkSecondary: "#66594D",
        inkPlaceholder: "#8C8073",
        // Borders
        borderBlue: "#D2E2EB",
        borderDivider: "#D9D1C7",
        // Feedback
        danger: "#B00020",
        // Themeable tokens (driven by CSS variables from the live theme editor)
        themeBg: "var(--c-bg)",
        themeText: "var(--c-text)",
        themeText2: "var(--c-text2)",
        themeBtn: "var(--c-btn)",
        themeBtnText: "var(--c-btn-text)",
        themeBorder: "var(--c-border)",
        badgeParve: "var(--c-badge-parve)",
        badgeDairy: "var(--c-badge-dairy)",
        addIdleBg: "var(--c-add-idle-bg)",
        addIdleIcon: "var(--c-add-idle-icon)",
        addCountBg: "var(--c-add-count-bg)",
        addCountText: "var(--c-add-count-text)",
        addStepBtn: "var(--c-add-step-btn)",
        countStroke: "var(--c-count-stroke)",
        countText: "var(--c-count-text)",
        accentPill: "var(--c-accent-pill)",
      },
      fontFamily: {
        // Logo (Latin display face)
        logo: ["var(--font-fredoka)", "sans-serif"],
        // All UI text (Hebrew-first)
        heb: ["var(--font-assistant)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Themeable radii (driven by CSS variables from the live theme editor)
        card: "var(--r-card)",
        pill: "var(--r-pill)",
        input: "var(--r-input)",
        wa: "var(--r-button)",
        chip: "20px",
      },
      maxWidth: {
        mobile: "448px",
      },
      boxShadow: {
        card: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
