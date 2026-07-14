import Link from "next/link";
import Image from "next/image";
import type { Artigo } from "@/types/artigo";
import styles from "./ArticleCard.module.css";

interface Props {
  artigo: Artigo;
  destaque?: boolean;
  /**
   * OTIMIZAÇÃO — só a imagem do artigo em destaque (a maior, acima da
   * dobra) recebe `priority`. As demais usam lazy loading padrão do
   * next/image, evitando baixar imagens que o usuário pode nem rolar
   * até ver.
   */
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ArticleCard({ artigo, destaque = false }: Props) {
  return (
    <Link href={`/artigos/${artigo.slug}`}
      className={`${styles.card} ${destaque ? styles.cardDestaque : ""}`}>

      <div className={styles.corpo}>
        <div className={styles.meta}>
          <span className={styles.categoria}>{artigo.categoria}</span>
          <span className={styles.metaSep}>·</span>
          <span>{formatarData(artigo.dataPublicacao)}</span>
          <span className={styles.metaSep}>·</span>
          <span>{artigo.tempoLeitura} min de leitura</span>
        </div>
        <h2 className={styles.titulo}>{artigo.titulo}</h2>
        <p className={styles.resumo}>{artigo.resumo}</p>
        <div className={styles.rodape}>
          <span className={styles.autor}>{artigo.autor}</span>
          <span className={styles.lerMais}>Ler artigo →</span>
        </div>
      </div>

      <div className={styles.imagemWrap}>
        <Image
          src={artigo.imagemCapa}
          alt={artigo.titulo}
          fill
          className={styles.imagem}
          loading={destaque ? "eager" : "lazy"}
          priority={destaque}
          sizes={destaque
            ? "90vw"
            : "(max-width:700px) 90vw, (max-width:1100px) 30vw, 280px"}
        />
      </div>
    </Link>
  );
}
