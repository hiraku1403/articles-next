import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // OTIMIZAÇÃO — next/image gera automaticamente AVIF (menor) e
    // faz fallback para WebP quando o navegador não suporta AVIF.
    // Isso substitui a necessidade de converter manualmente os
    // arquivos de imagem para .webp/.avif.
    formats: ["image/avif", "image/webp"],
  },

  // Minificação de HTML/CSS/JS é feita automaticamente pelo
  // compilador SWC do Next.js em `next build` (produção) — não é
  // necessário nenhum passo manual de minificação.
  compress: true,

  // React Strict Mode ajuda a identificar código com efeitos
  // colaterais indevidos durante o desenvolvimento.
  reactStrictMode: true,
};

export default nextConfig;
