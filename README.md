# Revista — Blog de Ideias (Otimizado para Performance)

Blog editorial em Next.js 15 (App Router). Este README documenta a auditoria de
performance realizada e as otimizações aplicadas, com foco em **Cumulative
Layout Shift (CLS)**.

> Site em produção: https://articles-next-ecru.vercel.app/

---

## 1. Descrição do projeto

Blog de ensaios com listagem de artigos, página de detalhe por artigo
(rota dinâmica `/artigos/[slug]`) e SEO dinâmico via `generateMetadata`.
Stack: Next.js 15 (App Router) + TypeScript + CSS Modules.

---

## 2. Como gerar os relatórios (antes / depois)

Os prints do Lighthouse precisam ser capturados manualmente no navegador —
seguem os passos exatos usados para esta auditoria:

1. Abra o site em **aba anônima** do Chrome (evita interferência de extensões)
2. Abra o DevTools (`F12` ou `Ctrl+Shift+I`)
3. Vá na aba **Lighthouse**
4. Marque apenas a categoria **Performance**
5. Selecione o modo **Mobile** (é o mais exigente e o que o Google usa para ranking)
6. Clique em **Analyze page load**
7. Tire o print do relatório completo (scores + métricas Core Web Vitals)
8. Repita o processo após aplicar as otimizações e fazer o novo deploy

Salve os dois prints como `relatorio-antes.png` e `relatorio-depois.png`
(ou exporte como PDF pelo botão de download no canto do relatório).

---

## 3. Gargalos identificados no código original

Analisando o código-fonte do projeto em produção, foram identificados os
seguintes pontos como prováveis causadores de CLS e perda de performance:

| # | Gargalo | Onde | Por que afeta o CLS/performance |
|---|---|---|---|
| 1 | **Fontes carregadas via `@import`** no `globals.css` | `src/app/globals.css` | Requisição de rede bloqueante para `fonts.googleapis.com`; a página renderiza primeiro com a fonte fallback e depois **troca** para a fonte real (FOUT), fazendo o texto reflowar e empurrar o layout — **a causa mais comum de CLS em sites de conteúdo** |
| 2 | Imagens sem espaço de layout reservado | `ArticleCard`, hero da home e do artigo | Ao usar `next/image` com `fill`, se o container pai não tem `aspect-ratio` ou altura fixa definida via CSS, o espaço da imagem só é conhecido depois que ela carrega — o conteúdo abaixo "pula" |
| 3 | Todas as imagens carregando com a mesma prioridade | `ArticleCard.tsx` | Sem diferenciar imagem "acima da dobra" (LCP) das demais, o navegador competia por banda entre imagens que o usuário talvez nunca role até ver |
| 4 | Formato de imagem não otimizado | URLs do Unsplash sem parâmetros de formato/qualidade | Imagens JPEG grandes aumentam o tempo de download e o LCP |
| 5 | Header sem altura fixa | `Layout.module.css` | Header sem `height` definida pode mudar de tamanho conforme o conteúdo carrega, empurrando toda a página |

---

## 4. Otimizações aplicadas

### 4.1 — Fontes: `@import` → `next/font/google` (maior impacto no CLS)

**Antes** (`globals.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces...');
```

**Depois** (`src/app/fonts.ts`):
```ts
import { Fraunces, Lora, DM_Sans } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
```

**Por que isso reduz o CLS:** o `next/font` faz *self-hosting* das fontes —
elas são baixadas em build time e servidas pelo próprio domínio da
aplicação, eliminando a requisição externa ao Google Fonts. Além disso,
o Next.js calcula automaticamente métricas de fallback (`size-adjust`,
`ascent-override` etc.) para que a fonte de sistema já ocupe o mesmo
espaço da fonte final — **quando a fonte real chega, o texto não pula**.

### 4.2 — Imagens: espaço reservado com `aspect-ratio`

```css
/* ArticleCard.module.css */
.imagemWrap {
  position: relative;
  aspect-ratio: 4 / 3;       /* espaço reservado ANTES do load */
  background: var(--bg-alt); /* placeholder visual */
}
```

Como o container já tem proporção fixa definida via CSS, o navegador
reserva o espaço da imagem no layout desde o primeiro paint — a imagem
"preenche" um espaço que já existia, em vez de empurrar o conteúdo ao
carregar.

### 4.3 — Priorização de carregamento (`priority` + `loading`)

```tsx
<Image
  src={artigo.imagemCapa}
  fill
  loading={destaque ? "eager" : "lazy"}
  priority={destaque}   // só a imagem do artigo em destaque (LCP)
  sizes={...}
/>
```

Apenas a imagem do artigo em destaque (a maior, mais acima na página —
candidata a LCP) recebe `priority`. Todas as demais usam lazy loading
padrão do `next/image`, evitando competir por banda com o conteúdo
crítico da primeira dobra.

### 4.4 — Formatos de imagem modernos (AVIF/WebP)

```ts
// next.config.ts
images: {
  formats: ["image/avif", "image/webp"],
}
```

O `next/image` já converte e serve automaticamente a versão AVIF (ou
WebP como fallback) de cada imagem, redimensionada para o tamanho real
exibido em tela — sem necessidade de conversão manual de arquivos.

### 4.5 — Header com altura fixa

```css
.header {
  height: 4rem;   /* impede variação de altura no primeiro render */
}
```

### 4.6 — Minificação

A minificação de JS/CSS/HTML é feita **automaticamente** pelo
compilador SWC do Next.js durante `next build` — não é necessário (nem
recomendado) rodar um minificador manual separado. Isso já estava
correto no projeto original.

### 4.7 — Código morto e imports

- Removidas classes CSS não utilizadas (herdadas de versões anteriores dos componentes)
- Nenhuma biblioteca pesada de terceiros é usada (datas formatadas com `Intl`/`toLocaleDateString` nativo, sem `moment.js` ou `date-fns`)

---

## 5. Comparativo antes / depois

> ⚠️ Os valores desta seção devem ser preenchidos com os números reais
> obtidos nos dois relatórios do Lighthouse (ver seção 2). Substitua os
> placeholders abaixo pelos seus resultados.

| Métrica | Antes | Depois | Comentário |
|---|---|---|---|
| **Performance Score** | _preencher_ | _preencher_ | |
| **CLS** | _preencher_ | _preencher_ | Maior impacto esperado: eliminação do `@import` de fontes |
| **LCP** | _preencher_ | _preencher_ | Beneficiado pelo `priority` + AVIF/WebP |
| **FCP** | _preencher_ | _preencher_ | Beneficiado pela remoção da requisição bloqueante de fontes |
| **TBT** | _preencher_ | _preencher_ | |

**Resumo da maior melhoria esperada:** a troca do `@import` de fontes
por `next/font/google` deve ser a mudança de **maior impacto no CLS**,
pois elimina a causa raiz mais comum de layout shift em sites de
conteúdo (troca de fonte / FOUT). As otimizações de imagem (aspect-ratio
+ priority + AVIF) têm impacto direto no LCP e impacto secundário no
CLS (evitam que imagens sem dimensões reservadas empurrem o conteúdo).

---

## 6. Estrutura do projeto

```
src/
├── app/
│   ├── fonts.ts                 ← next/font/google (correção de CLS)
│   ├── layout.tsx                ← aplica as variáveis de fonte no <html>
│   ├── globals.css               ← sem @import externo
│   ├── page.tsx / page.module.css
│   └── artigos/
│       ├── page.tsx
│       └── [slug]/page.tsx       ← generateMetadata (SEO dinâmico)
├── components/
│   ├── Layout/                   ← header com altura fixa
│   └── ArticleCard/               ← aspect-ratio + priority condicional
├── data/artigos.json
└── types/artigo.ts
```

## 7. Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção (requer acesso à internet p/ baixar fontes)
```
