import type { Metadata } from "next";
import Layout from "@/components/Layout/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title:       { default: "Revista — Blog de Ideias", template: "%s | Revista" },
  description: "Ensaios e reflexões sobre cultura, arte, filosofia e urbanismo.",
  openGraph:   { siteName: "Revista", type: "website", locale: "pt_BR" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body><Layout>{children}</Layout></body>
    </html>
  );
}
