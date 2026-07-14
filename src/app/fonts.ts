// ─────────────────────────────────────────────────────────────
// fonts.ts
// OTIMIZAÇÃO DE CLS #1 — next/font/google
//
// ANTES: as fontes eram carregadas via @import url(...) dentro do
// globals.css. Isso causa:
//   - Uma requisição de rede BLOQUEANTE antes do CSS terminar de parsear
//   - FOUT/FOIT: o texto renderiza com a fonte de fallback, depois
//     "pula" quando a fonte real chega — ESSA TROCA DE FONTE É UM DOS
//     MAIORES CAUSADORES DE CLS EM SITES DE CONTEÚDO
//
// DEPOIS: next/font faz self-hosting das fontes em build time,
// remove a requisição externa ao Google Fonts, define
// font-display: swap com métricas de fallback ajustadas
// automaticamente pelo Next.js — o que reduz drasticamente
// (ou elimina) o layout shift causado por troca de fonte.
// ─────────────────────────────────────────────────────────────
import { Fraunces, Lora, DM_Sans } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-corpo",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});
