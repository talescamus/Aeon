import React, { useState } from "react";
import { BookOpen, Sparkles, Scroll, Landmark, Globe, Award, ChevronRight, HelpCircle, FileText, MessagesSquare, BarChart3 } from "lucide-react";
import { LibraryBook, Circle, ResearchPaper } from "../types";

interface ExploreDiscoveriesProps {
  books: LibraryBook[];
  circles: Circle[];
  researchPapers: ResearchPaper[];
  setSelectedBook: React.Dispatch<React.SetStateAction<LibraryBook | null>>;
  setActiveTab: (tab: any) => void;
  triggerNotification: (text: string) => void;
}

interface RareManuscript {
  id: string;
  title: string;
  origin: string;
  century: string;
  excerpt: string;
  analysis: string;
}

const RARE_MANUSCRIPTS: RareManuscript[] = [
  {
    id: "m_emerald",
    title: "A Tábua de Esmeralda (Tabula Smaragdina)",
    origin: "Atribuído a Hermes Trismegistus",
    century: "Origem lendária / Árabe medieval",
    excerpt: "Verum, sine mendacio, certum et verissimum: Quod est inferius, est sicut quod est superius, et quod est superius, est sicut quod est inferius, ad penetranda miracula rei unius.",
    analysis: "O fundamento absoluto da Alquimia mental: a lei de correspondência universal. O micro Universo reflete perfeitamente as leis espirituais superiores do macro Universo."
  },
  {
    id: "m_nag_hammadi",
    title: "Códices de Nag Hammadi (Evangelho da Verdade)",
    origin: "Descoberto no Alto Egito",
    century: "Século IV AD",
    excerpt: "O conhecimento (Gnosis) destrói a ignorância; assim como a luz destrói as trevas corporais, e a verdade dissipa a ilusão do mundo.",
    analysis: "Estudo crítico sobre gnósticos antigos, mostrando que a iluminação espiritual reside na autodescoberta profunda e no Logos Cósmico, não apenas em dogmas dogmáticos externos."
  },
  {
    id: "m_zohar_sc",
    title: "Zohar: Sepher HaShamayim (Livro dos Céus)",
    origin: "Herança de Alexandria",
    century: "Século XIII",
    excerpt: "Sob o véu de cada palavra da escritura, brilha uma coroa invisível. A alma estuda a vestimenta, o sábio estuda o corpo interno, e o iniciado estuda a essência pura.",
    analysis: "Estratificação cabalística examinando como os mundos angelicais interagem com a intenção focalizada humana na oração meditativa."
  }
];

export default function ExploreDiscoveries({
  books,
  circles,
  researchPapers,
  setSelectedBook,
  setActiveTab,
  triggerNotification
}: ExploreDiscoveriesProps) {
  
  const [activeTheme, setActiveTheme] = useState<"all" | "rare" | "authors" | "trends">("all");
  const [selectedManuscript, setSelectedManuscript] = useState<RareManuscript | null>(null);

  // Stats indicators for trends
  const academicTrends = [
    { area: "Alquimia Mental e Prática", intensity: 92, activeResearchers: 14, class: "Hermetismo" },
    { area: "Teosofia Cabalística das Sephiroth", intensity: 88, activeResearchers: 19, class: "Cabala" },
    { area: "Gnosticismo Alexandrino e Símbolos", intensity: 74, activeResearchers: 8, class: "Gnose" },
    { area: "Filologia Comparada de Grimórios", intensity: 65, activeResearchers: 6, class: "Escrita" }
  ];

  // Classic historical authors portfolio
  const historicalAuthors = [
    { name: "Paracelso (Philippus Aureolus)", era: "1493 - 1541", contribution: "Alquimia médica e a união entre os reinos físico e hermético da consciência.", logo: "☿" },
    { name: "Albertus Magnus (Santo Alberto)", era: "1200 - 1280", contribution: "Erudito dominicano e doutor da igreja, tradutor de hermetismo natural e mineralogia oculta.", logo: "🜎" },
    { name: "Marsilio Ficino", era: "1433 - 1499", contribution: "Sacerdote que traduziu o Corpus Hermeticum do grego sob encomenda de Cosimo de' Medici.", logo: "🜂" }
  ];

  const handleOpenBook = (bookId: string) => {
    const targetBook = books.find(b => b.id === bookId);
    if (targetBook) {
      setSelectedBook(targetBook);
      setActiveTab("library");
      triggerNotification(`Estudo ativo: Tomo Hermético "${targetBook.title}" carregado.`);
    } else {
      triggerNotification("Tomo de estudos não localizado nesta egrégora.");
    }
  };

  return (
    <div className="bg-[#030303]/40 border border-[#C8A96B]/15 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col justify-between">
      
      {/* Header Banner */}
      <div className="border-b border-[#C8A96B]/10 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C8A96B] mb-1">
            <Landmark className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] uppercase font-mono-aeon tracking-wider">Centro de Descobertas Intelectuais</span>
          </div>
          <h3 className="font-cinzel text-xl font-bold uppercase text-white tracking-widest">Descobrir Conhecimento Puro</h3>
          <p className="font-garamond text-xs text-stone-400 italic">Uma curadoria esotérica livre de métricas de engajamento, curtidas vãs ou viralizações — focada apenas no Logos.</p>
        </div>

        {/* Filters bar */}
        <div className="flex gap-1.5 text-[9px] font-mono-aeon font-bold uppercase">
          {[
            { id: "all", label: "Geral" },
            { id: "rare", label: "Obras Raras" },
            { id: "authors", label: "Autores Arcanos" },
            { id: "trends", label: "Análise Termodinâmica" }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setActiveTheme(opt.id as "all" | "rare" | "authors" | "trends")}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${activeTheme === opt.id ? "bg-[#C8A96B]/15 border-[#C8A96B]/50 text-white" : "bg-black border-stone-900 text-stone-500 hover:border-stone-700"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left main area (Manuscripts / details) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Section 1: Rare Manuscripts Scroll simulator */}
          {(activeTheme === "all" || activeTheme === "rare") && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-[#C8A96B] uppercase tracking-widest flex items-center gap-2 border-b border-stone-900 pb-2">
                <Scroll className="w-4 h-4" /> Grimórios e Manuscritos Primordiais
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RARE_MANUSCRIPTS.map((man) => (
                  <div
                    key={man.id}
                    onClick={() => setSelectedManuscript(man)}
                    className="p-5 bg-gradient-to-b from-[#0a0a0a] to-[#040404] border border-[#C8A96B]/10 hover:border-[#C8A96B]/30 hover:bg-[#070707] rounded-2xl transition-all cursor-pointer relative overflow-hidden group"
                  >
                    <div className="absolute top-2 right-2 text-[#C8A96B]/20 text-xs italic font-mono font-bold">☤</div>
                    <span className="text-[8px] font-mono text-stone-500 uppercase font-bold tracking-widest block mb-1">{man.century}</span>
                    <h5 className="font-cinzel text-xs font-bold text-white tracking-wider group-hover:text-[#C8A96B] transition-colors">{man.title}</h5>
                    <p className="font-garamond text-[11px] text-stone-400 mt-2 line-clamp-3 italic">
                      "{man.excerpt}"
                    </p>
                    <div className="mt-3.5 flex items-center justify-between text-[8px] text-[#C8A96B] font-mono uppercase font-bold">
                      <span>Exegese Acadêmica</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed manuscript modal reader placeholder */}
          {selectedManuscript && (
            <div className="p-6 bg-gradient-to-r from-stone-950 to-neutral-950 border border-[#C8A96B]/20 rounded-2xl animate-fade-in relative">
              <button
                onClick={() => setSelectedManuscript(null)}
                className="absolute top-3 right-3 text-stone-600 hover:text-white font-mono text-xs cursor-pointer"
              >
                ⟵ FECHAR
              </button>
              
              <span className="text-[#C8A96B] font-mono uppercase text-[9px] font-bold">PERGAMINHO EXPANDIDO: {selectedManuscript.century}</span>
              <h5 className="font-cinzel text-lg text-white font-bold tracking-widest mt-1">{selectedManuscript.title}</h5>
              <div className="text-[9px] font-mono text-stone-500 mb-4 font-bold">Origem: {selectedManuscript.origin}</div>

              <div className="p-4 bg-black/60 border border-[#C8A96B]/10 rounded-xl mb-4 font-garamond italic text-sm text-[#F5F5F5] leading-relaxed relative">
                <span className="absolute top-1 left-2 text-[#C8A96B]/15 text-5xl">“</span>
                <p className="pl-6 pt-2">{selectedManuscript.excerpt}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-900 text-xs">
                <span className="font-mono-aeon text-[9px] text-[#C8A96B] uppercase font-bold tracking-wider block">Análise Hermética do Códice:</span>
                <p className="font-garamond text-stone-400 leading-relaxed italic">
                  {selectedManuscript.analysis}
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Historical authors bio */}
          {(activeTheme === "all" || activeTheme === "authors") && (
            <div className="space-y-4">
              <h4 className="font-cinzel text-xs font-bold text-[#C8A96B] uppercase tracking-widest flex items-center gap-2 border-b border-stone-900 pb-2">
                <Landmark className="w-4 h-4" /> Mestres Históricos de Consciência
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {historicalAuthors.map((author, idx) => (
                  <div key={idx} className="p-4 bg-stone-950 border border-stone-900 rounded-2xl flex items-start gap-3.5 hover:border-[#C8A96B]/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#C8A96B]/35 flex items-center justify-center font-cinzel text-[#C8A96B] text-[#C8A96B] font-bold shadow-lg shrink-0">
                      {author.logo}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-stone-500 uppercase block leading-none">{author.era}</span>
                      <h5 className="font-cinzel text-[11px] font-bold text-white tracking-widest">{author.name}</h5>
                      <p className="font-garamond text-[10px] text-stone-400 leading-relaxed italic">
                        {author.contribution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Recommended dynamic Books directly linked */}
          {activeTheme === "all" && (
            <div className="p-5 bg-[#C8A96B]/5 border border-dashed border-[#C8A96B]/25 rounded-2xl">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-cinzel text-xs font-bold text-[#C8A96B] uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Tomos Sob Investigação Síncrona
                </h5>
                <span className="text-[8.5px] font-mono text-stone-500">*Disponíveis na Biblioteca Iniciática</span>
              </div>

              <div className="space-y-2.5">
                {books.slice(0, 3).map((bk) => (
                  <div key={bk.id} className="p-3 bg-black/60 border border-stone-900 hover:border-[#C8A96B]/30 rounded-xl flex justify-between items-center transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-6.5 h-6.5 bg-[#111] border border-stone-850 rounded flex items-center justify-center text-[#C8A96B] font-mono text-[9px]">
                        🜁
                      </div>
                      <div>
                        <h6 className="text-[11px] font-mono-aeon font-bold text-white tracking-wide">{bk.title}</h6>
                        <span className="text-[9px] text-stone-400 font-garamond italic">Por {bk.author} ({bk.year})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenBook(bk.id)}
                      className="px-2.5 py-1 border border-[#C8A96B]/20 hover:bg-[#C8A96B] hover:text-black rounded text-[9px] font-mono uppercase font-bold transition-all text-[#C8A96B] cursor-pointer"
                    >
                      Acessar Tomo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right side area (Trends analytics / events timeline) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* SSection 4: Academy Study Trends indicator */}
          <div className="p-5 bg-stone-950/80 border border-stone-900 rounded-3xl space-y-4">
            <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#C8A96B]" /> Índice Termodinâmico de Estudos
            </h5>
            
            <p className="font-garamond text-[10px] text-stone-500 italic leading-relaxed">
              Mapeamento de densidade de sintonização baseada nas leituras ativas, anotações e teses publicadas pelos irmãos esta semana:
            </p>

            <div className="space-y-3.5 pt-1 text-[9px] font-mono font-bold uppercase transition-all">
              {academicTrends.map((trend, idx) => (
                <div key={idx} className="space-y-1.5 p-2 bg-black/40 rounded-xl border border-stone-950 hover:border-stone-850 transition-all">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-white text-[10px] tracking-wide">{trend.area}</span>
                    <span className="text-[#C8A96B]">{trend.intensity}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8D6E3D] to-[#C8A96B] rounded-full"
                      style={{ width: `${trend.intensity}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] text-stone-500">
                    <span>Sintonizadores: {trend.activeResearchers} Estudantes</span>
                    <span>Classificação: {trend.class}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Editorial highlights - no metrics */}
          <div className="p-5 bg-[#C8A96B]/5 border border-dashed border-[#C8A96B]/25 rounded-2xl space-y-3 font-mono text-[9px]">
            <span className="text-[#C8A96B] font-bold uppercase tracking-wider block">CHANCELA EDITORIAL SENECA</span>
            <p className="font-garamond text-[11px] text-stone-400 italic leading-relaxed">
              "Buscamos a sintonização do egrégora coletivo intelectual. A verdade hermética não é um ornamento para ser partilhado por aclamação das massas, mas sim lapidado em silêncio. Fomente novas teses de Alquimia Prática ou Cabala e submeta-as à Ágora para debates."
            </p>
            <div className="pt-2 border-t border-stone-900 flex justify-between items-center text-[8px] text-stone-600">
              <span>Chave: AEON-VERITAS-777</span>
              <span>Guardas do Templo</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
