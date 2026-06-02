# Revista — Blog Next.js

Blog com App Router, data fetching, rotas dinâmicas e SEO.

## Tecnologias
React · Next.js 15 (App Router) · TypeScript · CSS Modules

## Estrutura
```
src/
├── app/
│   ├── layout.tsx                   ← Root layout + metadata base
│   ├── page.tsx                     ← / (force-static, SSG)
│   ├── artigos/
│   │   ├── page.tsx                 ← /artigos (force-static)
│   │   └── [slug]/
│   │       └── page.tsx             ← /artigos/:slug (generateStaticParams + generateMetadata)
├── components/
│   ├── Layout/                      ← Header + Footer (next/link, usePathname)
│   └── ArticleCard/                 ← Card de artigo reutilizável
├── data/
│   └── artigos.json                 ← 5 artigos com slug, título, autor, conteúdo
└── types/
    └── artigo.ts                    ← Interface Artigo
```

## Conceitos aplicados
| Conceito | Onde |
|---|---|
| Server Component async | Todas as page.tsx (leitura direta do JSON) |
| `force-static` | page.tsx e artigos/page.tsx |
| `generateStaticParams` | artigos/[slug]/page.tsx — SSG por slug |
| `generateMetadata` | SEO dinâmico por artigo (title, description, OG) |
| CSS Modules | Estilo isolado por componente |
| `next/link` | Toda navegação interna |
| `next/image` | Imagens otimizadas com `fill` + `sizes` |

## Como rodar
```bash
npm install && npm run dev
# http://localhost:3000
```

## Deploy no Vercel
```bash
npm install -g vercel
vercel
```
