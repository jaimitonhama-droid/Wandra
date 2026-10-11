import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
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

export const metadata: Metadata = {
  title: "Sabedoria Digital | Livros, Cursos e E-books",
  description:
    "A sua plataforma de conhecimento em Moçambique. Aceda a livros digitais, vídeo-aulas e e-books de alta qualidade. Aprenda a qualquer hora, em qualquer lugar.",
  keywords: "livros digitais, cursos online, ebooks, Moçambique, aprendizagem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
