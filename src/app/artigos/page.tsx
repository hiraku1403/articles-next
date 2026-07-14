import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import type { Artigo } from "@/types/artigo";
import artigosData from "@/data/artigos.json";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Todos os Artigos",
  description: "Todos os ensaios e artigos publicados na Revista.",
};

export const dynamic = "force-static";

export default async function ArtigosPage() {
  const artigos = artigosData as Artigo[];
  return (
    <>
      <div className={styles.banner}>
        <div className={styles.bannerInner}>
          <p className={styles.kicker}>Arquivo</p>
          <h1 className={styles.titulo}>Todos os Artigos</h1>
          <p className={styles.subtitulo}>Ensaios sobre o que importa pensar.</p>
        </div>
      </div>
      <div className={styles.conteudo}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitulo}>Publicações</span>
          <span className={styles.total}>{artigos.length} artigos</span>
        </div>
        {artigos.map((a) => <ArticleCard key={a.slug} artigo={a} />)}
      </div>
    </>
  );
}
