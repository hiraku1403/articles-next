import type { Metadata } from "next";
import Layout from "@/components/Layout/Layout";
import { fraunces, lora, dmSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title:       { default: "Revista — Blog de Ideias", template: "%s | Revista" },
  description: "Ensaios e reflexões sobre cultura, arte, filosofia e urbanismo.",
  openGraph:   { siteName: "Revista", type: "website", locale: "pt_BR" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // As classes das fontes aplicam as variáveis CSS globalmente,
    // sem nenhuma requisição de rede extra ao Google Fonts.
    <html lang="pt-BR" className={`${fraunces.variable} ${lora.variable} ${dmSans.variable}`}>
      <body><Layout>{children}</Layout></body>
    </html>
  );
}
