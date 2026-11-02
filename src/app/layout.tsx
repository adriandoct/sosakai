import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOSA KAI | Dojo & Dashboard",
  description: "Plataforma marcial y educativa SOSA KAI con gestión integral y formación para campeones.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="dark-theme">
        {children}
      </body>
    </html>
  );
}
