// lib/storage.ts
// Camada de dados local — tudo no localStorage do navegador
// Quando migrarmos pra Supabase, só trocamos esta camada

export type Produtor = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  cidade?: string;
  estado: "RS" | "SC" | "PR";
  cpfCnpj?: string;
  observacoes?: string;
  createdAt: string;
};

export type Propriedade = {
  id: string;
  produtorId: string;
  nome: string;
  cidade: string;
  estado: "RS" | "SC" | "PR";
  areaTotalHa: number;
  latitude?: number;
  longitude?: number;
  observacoes?: string;
  createdAt: string;
};

export type Talhao = {
  id: string;
  propriedadeId: string;
  nome: string;
  areaHa: number;
  culturaAtual?: string;
  variedade?: string;
  dataPlantio?: string;
  produtividadeEsperada?: number;
  produtividadeUnidade?: string;
  observacoes?: string;
  createdAt: string;
};

export type AnaliseSolo = {
  id: string;
  talhaoId: string;
  data: string; // ISO date
  laboratorio?: string;
  // dados da análise
  ph: number;
  ca: number;
  mg: number;
  k: number;
  al: number;
  hAl: number;
  p: number;
  mo: number;
  argila: number;
  // resultados calculados
  v: number;
  m: number;
  cultura: string;
  produtividadeEsperada: number;
  recomendacaoCalagem?: number;
  tipoCalcario?: string;
  recomendacaoGesso?: number;
  recomendacaoN?: number;
  recomendacaoP2O5?: number;
  recomendacaoK2O?: number;
  observacoes?: string;
  createdAt: string;
};

// ============ HELPERS ============

const KEYS = {
  produtores: "bazo:produtores",
  propriedades: "bazo:propriedades",
  talhoes: "bazo:talhoes",
  analises: "bazo:analises",
};

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function write<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function now(): string {
  return new Date().toISOString();
}

// ============ PRODUTORES ============

export const produtoresDb = {
  list: (): Produtor[] => read<Produtor>(KEYS.produtores).sort((a, b) => a.nome.localeCompare(b.nome)),
  get: (id: string): Produtor | null => read<Produtor>(KEYS.produtores).find(p => p.id === id) || null,
  create: (data: Omit<Produtor, "id" | "createdAt">): Produtor => {
    const all = read<Produtor>(KEYS.produtores);
    const novo = { ...data, id: uuid(), createdAt: now() };
    all.push(novo);
    write(KEYS.produtores, all);
    return novo;
  },
  update: (id: string, data: Partial<Produtor>): void => {
    const all = read<Produtor>(KEYS.produtores);
    const idx = all.findIndex(p => p.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data };
      write(KEYS.produtores, all);
    }
  },
  remove: (id: string): void => {
    write(KEYS.produtores, read<Produtor>(KEYS.produtores).filter(p => p.id !== id));
    // remover propriedades em cascata
    const props = read<Propriedade>(KEYS.propriedades).filter(p => p.produtorId !== id);
    write(KEYS.propriedades, props);
  },
};

// ============ PROPRIEDADES ============

export const propriedadesDb = {
  list: (): Propriedade[] => read<Propriedade>(KEYS.propriedades).sort((a, b) => a.nome.localeCompare(b.nome)),
  listByProdutor: (produtorId: string): Propriedade[] =>
    read<Propriedade>(KEYS.propriedades).filter(p => p.produtorId === produtorId),
  get: (id: string): Propriedade | null => read<Propriedade>(KEYS.propriedades).find(p => p.id === id) || null,
  create: (data: Omit<Propriedade, "id" | "createdAt">): Propriedade => {
    const all = read<Propriedade>(KEYS.propriedades);
    const novo = { ...data, id: uuid(), createdAt: now() };
    all.push(novo);
    write(KEYS.propriedades, all);
    return novo;
  },
  update: (id: string, data: Partial<Propriedade>): void => {
    const all = read<Propriedade>(KEYS.propriedades);
    const idx = all.findIndex(p => p.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data };
      write(KEYS.propriedades, all);
    }
  },
  remove: (id: string): void => {
    write(KEYS.propriedades, read<Propriedade>(KEYS.propriedades).filter(p => p.id !== id));
    const talhoes = read<Talhao>(KEYS.talhoes).filter(t => t.propriedadeId !== id);
    write(KEYS.talhoes, talhoes);
  },
};

// ============ TALHÕES ============

export const talhoesDb = {
  list: (): Talhao[] => read<Talhao>(KEYS.talhoes).sort((a, b) => a.nome.localeCompare(b.nome)),
  listByPropriedade: (propriedadeId: string): Talhao[] =>
    read<Talhao>(KEYS.talhoes).filter(t => t.propriedadeId === propriedadeId),
  get: (id: string): Talhao | null => read<Talhao>(KEYS.talhoes).find(t => t.id === id) || null,
  create: (data: Omit<Talhao, "id" | "createdAt">): Talhao => {
    const all = read<Talhao>(KEYS.talhoes);
    const novo = { ...data, id: uuid(), createdAt: now() };
    all.push(novo);
    write(KEYS.talhoes, all);
    return novo;
  },
  update: (id: string, data: Partial<Talhao>): void => {
    const all = read<Talhao>(KEYS.talhoes);
    const idx = all.findIndex(t => t.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data };
      write(KEYS.talhoes, all);
    }
  },
  remove: (id: string): void => {
    write(KEYS.talhoes, read<Talhao>(KEYS.talhoes).filter(t => t.id !== id));
    const analises = read<AnaliseSolo>(KEYS.analises).filter(a => a.talhaoId !== id);
    write(KEYS.analises, analises);
  },
};

// ============ ANÁLISES DE SOLO ============

export const analisesDb = {
  list: (): AnaliseSolo[] => read<AnaliseSolo>(KEYS.analises).sort((a, b) => b.data.localeCompare(a.data)),
  listByTalhao: (talhaoId: string): AnaliseSolo[] =>
    read<AnaliseSolo>(KEYS.analises)
      .filter(a => a.talhaoId === talhaoId)
      .sort((a, b) => b.data.localeCompare(a.data)),
  get: (id: string): AnaliseSolo | null => read<AnaliseSolo>(KEYS.analises).find(a => a.id === id) || null,
  create: (data: Omit<AnaliseSolo, "id" | "createdAt">): AnaliseSolo => {
    const all = read<AnaliseSolo>(KEYS.analises);
    const novo = { ...data, id: uuid(), createdAt: now() };
    all.push(novo);
    write(KEYS.analises, all);
    return novo;
  },
  remove: (id: string): void => {
    write(KEYS.analises, read<AnaliseSolo>(KEYS.analises).filter(a => a.id !== id));
  },
};

// ============ COTAÇÕES MANUAIS (uva, maçã, preço local) ============

export type CotacaoManual = {
  id: string;
  produto: string;
  preco: number;
  unidade: string;
  fonte?: string;
  data: string;
  observacoes?: string;
  createdAt: string;
};

const COTACOES_KEY = "bazo:cotacoes-manuais";

export const cotacoesManuaisDb = {
  list: (): CotacaoManual[] => read<CotacaoManual>(COTACOES_KEY).sort((a, b) => b.data.localeCompare(a.data)),
  get: (id: string): CotacaoManual | null => read<CotacaoManual>(COTACOES_KEY).find(c => c.id === id) || null,
  create: (data: Omit<CotacaoManual, "id" | "createdAt">): CotacaoManual => {
    const all = read<CotacaoManual>(COTACOES_KEY);
    const novo = { ...data, id: uuid(), createdAt: now() };
    all.push(novo);
    write(COTACOES_KEY, all);
    return novo;
  },
  update: (id: string, data: Partial<CotacaoManual>): void => {
    const all = read<CotacaoManual>(COTACOES_KEY);
    const idx = all.findIndex(c => c.id === id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...data };
      write(COTACOES_KEY, all);
    }
  },
  remove: (id: string): void => {
    write(COTACOES_KEY, read<CotacaoManual>(COTACOES_KEY).filter(c => c.id !== id));
  },
};

// ============ EXPORT/IMPORT (backup) ============

export function exportAll(): string {
  return JSON.stringify({
    produtores: read(KEYS.produtores),
    propriedades: read(KEYS.propriedades),
    talhoes: read(KEYS.talhoes),
    analises: read(KEYS.analises),
    cotacoesManuais: read(COTACOES_KEY),
    exportedAt: now(),
    version: 2,
  }, null, 2);
}

export function importAll(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.produtores) write(KEYS.produtores, data.produtores);
    if (data.propriedades) write(KEYS.propriedades, data.propriedades);
    if (data.talhoes) write(KEYS.talhoes, data.talhoes);
    if (data.analises) write(KEYS.analises, data.analises);
    if (data.cotacoesManuais) write(COTACOES_KEY, data.cotacoesManuais);
    return true;
  } catch {
    return false;
  }
}
