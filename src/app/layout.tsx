import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import InteractionProvider from "@/components/InteractionProvider";
import SmoothScroll from "@/components/SmoothScroll";
import RealtimeSync from "@/components/RealtimeSync";
import CustomCursor from "@/components/CustomCursor";
import NaviAssistant from "@/components/NaviAssistant";
import CookieBanner from "@/components/CookieBanner";
import GarazePopup from "@/components/GarazePopup";
import ChromeGate from "@/components/ChromeGate";
import { createServerClient } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | CSAD Rýmařov',
    default: 'CSAD Rýmařov | Logistický areál a služby',
  },
  description: 'Komplexní služby v Rýmařově: Čerpací stanice NONSTOP, parkování TIR, hudební klub Proxy a další.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CSAD Rýmařov',
  },
};

export const viewport = {
  themeColor: '#040814',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch global settings server-side
  const sb = createServerClient();
  const { data: nastaveni } = await sb.from("nastaveni").select("*").single();

  return (
    <html lang="cs" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {/* Obal webu — na samostatných stránkách (údržba) se nevykresluje */}
        <ChromeGate>
          <CustomCursor />
          <SmoothScroll />
          <InteractionProvider />
          <NaviAssistant />
          <CookieBanner />
          <GarazePopup />
          <RealtimeSync tables={['web_status', 'ceny', 'napoje', 'sklad', 'garaze', 'akce']} />
          <div className="film-grain" aria-hidden="true" />
          {nastaveni?.oznameni_aktivni && nastaveni.oznameni_text && (
            <AnnouncementBar text={nastaveni.oznameni_text} />
          )}
          <Navbar />
        </ChromeGate>

        <main>{children}</main>

        <ChromeGate>
          <Footer
            telefon={nastaveni?.telefon_dispecink ?? "+420 601 223 344"}
            email={nastaveni?.email_info ?? "info@csad-rymarov.cz"}
          />
        </ChromeGate>
      </body>
    </html>
  );
}
