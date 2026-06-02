// app/page.tsx — Página inicial
// Server Component com async data fetching
import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import type { Artigo } from "@/types/artigo";
import artigosData from "@/data/artigos.json";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Revista — Blog de Ideias",
  description: "Ensaios e reflexões sobre cultura, arte, filosofia e urbanismo.",
};

// SSG: página estática pré-renderizada (force-static)
export const dynamic = "force-static";

export default async function HomePage() {
  // Simula async data fetching com JSON local
  const artigos = artigosData as Artigo[];
  const destaque = artigos[0];
  const demais   = artigos.slice(1, 4);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>Blog de ideias</p>
          <h1 className={styles.heroTitulo}>
            Ensaios que<br /><em>provocam</em> o pensamento
          </h1>
          <p className={styles.heroSub}>
            Reflexões sobre cultura, filosofia, arte e urbanismo — escritas com cuidado
            para quem ainda acredita no poder das ideias.
          </p>
        </div>
      </section>

      <div className={styles.conteudo}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitulo}>Artigo em destaque</span>
        </div>
        {/* Server Component renderiza direto — sem useEffect */}
        <ArticleCard artigo={destaque} destaque />

        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitulo}>Últimos artigos</span>
          <Link href="/artigos" className={styles.linkTodos}>Ver todos →</Link>
        </div>
        {demais.map((a) => <ArticleCard key={a.slug} artigo={a} />)}
      </div>
    </>
  );
}
