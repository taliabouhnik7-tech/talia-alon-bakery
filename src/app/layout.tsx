import type { Metadata, Viewport } from "next";
import { Assistant, Fredoka } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { CartUiProvider } from "@/lib/cart-ui";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ThemeStyle } from "@/components/ThemeStyle";
import { CartDrawer } from "@/components/CartDrawer";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-assistant",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "טליה אלון — מאפייה ביתית",
  description: "עוגות ועוגיות ביתיות בהזמנה אישית מטליה אלון",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#D2E2EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${fredoka.variable}`}
    >
      <body>
        <ThemeStyle />
        <CartProvider>
          <CartUiProvider>
            <div className="app-shell">{children}</div>
            <CartDrawer />
            <PageViewTracker />
          </CartUiProvider>
        </CartProvider>
      </body>
    </html>
  );
}
