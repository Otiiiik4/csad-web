import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
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
    default: "Logistický areál CSAD Rýmařov",
    template: "%s | CSAD Rýmařov",
  },
  description:
    "Centrum služeb, podnikání a zábavy v Rýmařově. Digitální tisk, čerpací stanice NONSTOP, parkování TIR, hudební klub Proxy a mnoho dalšího.",
  keywords: ["CSAD", "Rýmařov", "logistický areál", "digitální tisk", "čerpací stanice", "parkování TIR"],
  openGraph: {
    siteName: "CSAD Rýmařov",
    locale: "cs_CZ",
  },
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
        <div className="film-grain" aria-hidden="true" />
        {nastaveni?.oznameni_aktivni && nastaveni.oznameni_text && (
          <AnnouncementBar text={nastaveni.oznameni_text} />
        )}
        <Navbar />
        <main>{children}</main>
        <Footer
          telefon={nastaveni?.telefon_dispecink ?? "+420 601 223 344"}
          email={nastaveni?.email_info ?? "info@csad-rymarov.cz"}
        />
      </body>
    </html>
  );
}
