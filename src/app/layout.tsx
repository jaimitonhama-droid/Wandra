import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import PwaRegister from "@/components/PwaRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#071326",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Sabedoria Digital | Livros, Cursos e E-books",
  description:
    "A sua plataforma de conhecimento em Moçambique. Aceda a livros digitais, vídeo-aulas e e-books de alta qualidade. Aprenda a qualquer hora, em qualquer lugar.",
  keywords: "livros digitais, cursos online, ebooks, Moçambique, aprendizagem",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sabedoria Digital",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}

