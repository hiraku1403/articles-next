export interface Artigo {
  slug: string;
  titulo: string;
  autor: string;
  autorBio: string;
  dataPublicacao: string;
  categoria: string;
  tempoLeitura: number;
  resumo: string;
  imagemCapa: string;
  tags: string[];
  conteudo: string;
}
