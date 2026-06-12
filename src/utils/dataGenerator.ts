import { LibraryBook, ResearchPaper, AcademicStatus } from "../types";
import { INITIAL_BOOKS, INITIAL_RESEARCH } from "../data";

export function generateMegaBooks(count: number): LibraryBook[] {
  const result: LibraryBook[] = [...INITIAL_BOOKS];
  const startIdx = result.length;
  if (startIdx >= count) return result.slice(0, count);

  const categories = ["Hermetismo", "Cabala", "Rosacrucianismo", "Demonologia", "Grimórios", "Manuscritos Históricos", "Angelologia", "Alquimia", "Teosofia", "Gnosticismo"];
  const prefixes = [
    "Tratado sobre", "Códice Esotérico de", "O Mistério de", "As Chaves de",
    "Tabulae Animarum de", "Compêndio Hermético de", "Selo Sagrado de", "Liber de",
    "Análise Crítica de", "A Doutrina Oculta de", "O Discurso de", "A Revelação de"
  ];
  const subjects = [
    "Hermes Trismegistus", "Shimon bar Yochai", "Agrippa Von Nettesheim", "Dr. John Dee",
    "Nicolas Flamel", "Christian Rosenkreuz", "Helena Blavatsky", "Eliphas Levi",
    "Paracelsus", "Count Saint Germain", "Isaac Luria", "Abra-Melin o Mago"
  ];
  const suffixes = [
    "dos Sete Planetas", "na Alquimia Prática", "dos Portais de Malkuth",
    "e o Sagrado Anjo Guardião", "na Tradição do Oriente", "nas Dez Sephiroth",
    "e o Fogo Filosofal", "conforme Segredos Iniciáticos", "e a Geometria Sagrada",
    "do Templo de Salomão"
  ];
  const difficulties: ("Básico" | "Intermediário" | "Avançado" | "Arcano")[] = ["Básico", "Intermediário", "Avançado", "Arcano"];
  const statuses: ("Lido" | "Lendo" | "Não Iniciado")[] = ["Lido", "Lendo", "Não Iniciado"];

  for (let i = startIdx; i < count; i++) {
    const pref = prefixes[i % prefixes.length];
    const subj = subjects[(i + 3) % subjects.length];
    const suff = suffixes[(i * 7) % suffixes.length];
    const category = categories[(i + 2) % categories.length];
    const difficulty = difficulties[i % difficulties.length];
    const status = statuses[(i + 5) % statuses.length];
    
    const yearNum = 1100 + (i % 825);
    const pages = 120 + (i % 1080);
    const id = `mega-b-${i}`;
    
    result.push({
      id,
      title: `${pref} ${subj} ${suff} (Tomo ${Math.floor(i / 100) + 1})`,
      author: subj,
      year: yearNum.toString(),
      category,
      difficulty,
      coverUrl: "",
      pages,
      currentPage: status === "Lido" ? pages : (status === "Lendo" ? Math.floor(pages / 3) : 0),
      description: `Manuscrito hermenêutico indexado número ${i}. Este volumen desvela as interações arcanas da categoria de ${category}, oferecendo ao estudante uma visão detalhada sobre manuscritos antigos e as práticas divinas documentadas em ${yearNum}.`,
      fullText: `[REGISTRO MASSIVO AEON - DOCUMENTO INTEGRAL]\n\nEste é o tratado número ${i} de sabedoria oculta. A essência do Universo é o todo mental conforme os grandes filósofos de Alexandria de outrora...`,
      status
    });
  }

  return result;
}

export function generateMegaPapers(count: number): ResearchPaper[] {
  const result: ResearchPaper[] = [...INITIAL_RESEARCH];
  const startIdx = result.length;
  if (startIdx >= count) return result.slice(0, count);

  const statuses: ("Submetido" | "Em Revisão" | "Aprovado" | "Arquivado")[] = ["Submetido", "Em Revisão", "Aprovado", "Arquivado"];
  const authorStatuses = [
    AcademicStatus.ESTUDANTE, AcademicStatus.INICIADO, AcademicStatus.ADEPTO,
    AcademicStatus.PESQUISADOR, AcademicStatus.MENTOR, AcademicStatus.MESTRE
  ];
  const prefixes = [
    "A Investigação Filológica de", "Sobre a Transmutação de", "Análise de Variáveis em",
    "O Efeito Egrégora na", "Prolegômenos para uma Teologia de", "A Geometria dos Pentáculos em",
    "Interpretações Críticas sobre", "A Dialética da Verdade com"
  ];
  const subjects = [
    "Misticismo Comparado", "Ritos do Fogo Sagrado", "Angelologia Enoquiana",
    "A Cabala Luriânica", "Manuscritos do Mar Morto", "Alquimia Espiritual",
    "Hermetismo Renascentista", "Teosofia Prática"
  ];
  const suffixes = [
    "no Século XXI", "em Sistemas de Informação", "sob Abordagens Herméticas",
    "com Inteligência Artificial Sophia", "na Fenomenologia do Sagrado", "do Ponto de Vista Gnóstico",
    "como Modelo de Ordem Cósmica"
  ];

  for (let i = startIdx; i < count; i++) {
    const pref = prefixes[i % prefixes.length];
    const subj = subjects[(i + 4) % subjects.length];
    const suff = suffixes[(i * 3) % suffixes.length];
    const authorStatus = authorStatuses[i % authorStatuses.length];
    const status = statuses[(i + 1) % statuses.length];
    
    const day = 1 + (i % 28);
    const month = 1 + (i % 12);
    const dateStr = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/2026`;
    const tag1 = subj.split(" ")[0];
    const tag2 = suff.split(" ").slice(-1)[0];
    const id = `mega-p-${i}`;

    result.push({
      id,
      title: `${pref} ${subj} ${suff} (Doc #${i})`,
      author: `Iniciado Frater ${(i * 17) % 500}`,
      authorStatus,
      abstract: `Este trabalho propõe um modelo matemático-filosófico integrando ${subj} e ${suff.toLowerCase()}, avaliando a egrégora do círculo sagrado na era moderna.`,
      content: `Artigo científico do Aeon Journal de número ${i}. Todas as premissas analisam os desdobramentos lógicos do misticismo clássico em face das novas metodologias.`,
      date: dateStr,
      tags: [tag1, tag2].filter(Boolean),
      reviews: i % 2 === 0 ? [
        {
          reviewer: "Sophia Sábia IA",
          reviewerStatus: AcademicStatus.MESTRE,
          approved: true,
          comment: `Excelente contribuição científica sobre ${subj}. Metodologias sólidas e fundamentação textual exemplar.`,
          date: dateStr
        }
      ] : [],
      status,
      version: 1 + (i % 3)
    });
  }

  return result;
}
