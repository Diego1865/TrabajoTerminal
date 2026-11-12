import type { Metadata } from "next";
import { Andika, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Letra escolar para lo que lee el alumno: "a" y "g" de un solo trazo, como las que aprende a escribir
// en primaria, y b/d/p/q bien diferenciadas. Diseñada por SIL para lectores principiantes.
const andika = Andika({
  variable: "--font-escolar",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graf-IA",
  description: "Aplicación Web para la Ortografía y calidad de letra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${andika.variable} antialiased`}
        suppressHydrationWarning
      > 
        {children}
      </body>
    </html>
  );
}
