// app/artigos/[slug]/page.tsx
// Rota dinâmica com SSG, SEO dinâmico e Server Component async
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import type { Artigo } from "@/types/artigo";
import artigosData from "@/data/artigos.json";
import styles from "./page.module.css";

const artigos = artigosData as Artigo[];

// SSG: gera uma rota estática para cada slug
export function generateStaticParams() {
  return artigos.map((a) => ({ slug: a.slug }));
}

// SEO dinâmico — title e description únicos por artigo
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const artigo = artigos.find((a) => a.slug === slug);
  if (!artigo) return { title: "Artigo não encontrado" };

  return {
    title:       artigo.titulo,
    description: artigo.resumo,
    authors:     [{ name: artigo.autor }],
    keywords:    artigo.tags,
    openGraph: {
      title:       artigo.titulo,
      description: artigo.resumo,
      type:        "article",
      publishedTime: artigo.dataPublicacao,
      authors:     [artigo.autor],
      images:      [{ url: artigo.imagemCapa, alt: artigo.titulo }],
    },
  };
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

// Server Component async — busca dados no servidor
export default async function ArtigoPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const artigo = artigos.find((a) => a.slug === slug);
  if (!artigo) notFound();

  // Outros artigos para sugestão
  const outros = artigos.filter((a) => a.slug !== slug).slice(0, 2);

  // Converte parágrafos do conteúdo
  const paragrafos = artigo.conteudo.split("\n\n").filter(Boolean);

  return (
    <>
      {/* Hero com imagem de capa */}
      <section className={styles.hero}>
        <Image src={artigo.imagemCapa} alt={artigo.titulo} fill priority
          className={styles.heroImg} sizes="100vw" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Início</Link>
            <span className={styles.sep}>›</span>
            <Link href="/artigos">Artigos</Link>
            <span className={styles.sep}>›</span>
            <span>{artigo.titulo}</span>
          </nav>
          <div className={styles.meta}>
            <span className={styles.categoria}>{artigo.categoria}</span>
            <span className={styles.metaSep}>·</span>
            <span>{formatarData(artigo.dataPublicacao)}</span>
            <span className={styles.metaSep}>·</span>
            <span>{artigo.tempoLeitura} min</span>
          </div>
          <h1 className={styles.heroTitulo}>{artigo.titulo}</h1>
        </div>
      </section>

      {/* Corpo */}
      <div className={styles.artigo}>
        <article className={styles.corpo}>
          <p className={styles.resumo}>{artigo.resumo}</p>
          {/* Conteúdo renderizado em parágrafos */}
          <div className={styles.conteudo}>
            {paragrafos.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div>
              <p className={styles.sideSecao}>Autor</p>
              <p className={styles.autorNome}>{artigo.autor}</p>
              <p className={styles.autorBio}>{artigo.autorBio}</p>
            </div>
            <hr className={styles.divider} />
            <div>
              <p className={styles.sideSecao}>Tags</p>
              <div className={styles.tags}>
                {artigo.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
            <hr className={styles.divider} />
            <Link href="/artigos" className={styles.btnVoltar}>← Todos os artigos</Link>
          </div>
        </aside>
      </div>

      {/* Sugestão de leitura */}
      {outros.length > 0 && (
        <section className={styles.mais}>
          <div className={styles.maisInner}>
            <p className={styles.maisKicker}>Continue lendo</p>
            <h2 className={styles.maisTitulo}>Outros artigos</h2>
            <hr className={styles.maisDivider} />
            {outros.map((a) => <ArticleCard key={a.slug} artigo={a} />)}
          </div>
        </section>
      )}
    </>
  );
}
