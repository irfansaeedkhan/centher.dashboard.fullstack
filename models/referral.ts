export interface Genealogy {
  id: number;
  level: string;
  percent: number;
  people: number;
  generatedBUSD: number;
  generatedNTR: number;
  generatedBNB: number;
  children: GenealogyChild[];
}

export interface GenealogyChild {
  id: number;
  level: string;
  user: string;
  people: number;
  generatedBUSD: number;
  generatedNTR: number;
  generatedBNB: number;
}
