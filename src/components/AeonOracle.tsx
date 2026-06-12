import React, { useState } from "react";
import { Sparkles, Calendar, BookOpen, FileText, Compass, HelpCircle, RefreshCw, Layers } from "lucide-react";
import { LibraryBook } from "../types";

interface AeonOracleProps {
  books: LibraryBook[];
  triggerNotification: (text: string) => void;
}

interface SyllabusItem {
  week: string;
  topic: string;
  readings: string[];
  exercises: string;
}

export default function AeonOracle({ books, triggerNotification }: AeonOracleProps) {
  const [focusArea, setFocusArea] = useState("Cabala e a exegese do Zohar");
  const [experienceLevel, setExperienceLevel] = useState("Intermediário");
  const [availableHours, setAvailableHours] = useState("4 horas semanais");
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState<SyllabusItem[] | null>(null);
  const [gapAnalysis, setGapAnalysis] = useState<string | null>(null);
  const [readingList, setReadingList] = useState<string[] | null>(null);

  const handleQueryOracle = async () => {
    setLoading(true);
    triggerNotification("Acessando os portais do Aeon Oracle para sintonizar seu plano...");
    try {
      const res = await fetch("/api/oracle-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          focusArea,
          experienceLevel,
          availableHours
        })
      });
      const data = await res.json();
      setSyllabus(data.syllabus);
      setGapAnalysis(data.gapAnalysis);
      setReadingList(data.readingList);
      triggerNotification("O Oráculo manifestou os conhecimentos sintonizados.");
    } catch (err: any) {
      triggerNotification("Falha no chamado ao Oráculo: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#030303]/40 border border-[#C8A96B]/15 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col justify-between">
      
      {/* Header Banner */}
      <div className="border-b border-[#C8A96B]/10 pb-4 mb-6">
        <div className="flex items-center gap-2 text-[#C8A96B] mb-1">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] uppercase font-mono-aeon tracking-wider">Metoria Virtual Avançada</span>
        </div>
        <h3 className="font-cinzel text-xl font-bold uppercase text-white tracking-widest">Mentor Digital: AEON ORACLE</h3>
        <p className="font-garamond text-xs text-stone-400 italic">Interaja com a consciência sintética de Aeon para formular cronogramas heráldicos, sugerir manuscritos e encontrar lacunas.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="xl:col-span-5 p-5 bg-[#0a0a0a]/90 border border-stone-900 rounded-3xl space-y-4">
          <h4 className="font-cinzel text-xs font-bold text-[#C8A96B] uppercase tracking-widest flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C8A96B]" /> Parâmetros de Meditação
          </h4>

          <div className="space-y-4 text-[10px] font-mono">
            <div>
              <label className="block text-stone-400 uppercase font-bold mb-1.5">Área / Tema de Estudo Focalizado:</label>
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="Ex: Alquimia Prática, Mentalismo do Caibalion..."
                className="w-full bg-[#0d0d0d] border border-stone-850 rounded-xl p-3 focus:outline-none focus:border-[#C8A96B] text-white"
              />
            </div>

            <div>
              <label className="block text-stone-400 uppercase font-bold mb-1.5">Grau Atual de Consciência (Nível):</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-stone-850 rounded-xl p-3 focus:outline-none focus:border-[#C8A96B] text-white cursor-pointer"
              >
                <option value="Aspirante (Iniciante)">Aspirante (Iniciante)</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Arcano (Mestre)">Arcano (Mestre)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-400 uppercase font-bold mb-1.5">Dedicação Temporal Estimada:</label>
              <input
                type="text"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                placeholder="Ex: 4 horas semanais, 1 hora diária..."
                className="w-full bg-[#0d0d0d] border border-stone-850 rounded-xl p-3 focus:outline-none focus:border-[#C8A96B] text-white"
              />
            </div>

            <button
              onClick={handleQueryOracle}
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#C8A96B] hover:bg-[#F5F5F5] text-black font-cinzel font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> ACESSANDO TEMPLO SINTÉTICO...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> INVOCAR ROTEIRO DO AEON ORACLE
                </>
              )}
            </button>
          </div>
          
          <div className="border-t border-stone-900 pt-4 text-[9px] font-mono text-stone-500 leading-relaxed">
            *O oráculo extrairá correlações diretas dos grimórios indexados no Corpus e na sua biblioteca privada.
          </div>
        </div>

        {/* Output Column (Dynamic or Fallback initial guidelines) */}
        <div className="xl:col-span-7">
          {syllabus ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Gap analysis summary */}
              {gapAnalysis && (
                <div className="p-4 bg-amber-950/25 border border-amber-900/40 rounded-2xl">
                  <span className="text-[9px] font-mono font-bold text-[#C8A96B] uppercase tracking-wider block mb-1">Mapeamento de Lacuna de Conhecimento</span>
                  <p className="font-garamond text-xs text-amber-200/90 leading-relaxed italic">
                    "{gapAnalysis}"
                  </p>
                </div>
              )}

              {/* Recommended Readings list */}
              {readingList && (
                <div className="bg-[#0a0a0a]/90 border border-stone-900 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-[#C8A96B] mb-3 border-b border-stone-900 pb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-cinzel text-[10px] font-bold uppercase tracking-wider">Tomos Recomendados Adicionais</span>
                  </div>
                  <ul className="text-[11px] font-mono-aeon text-stone-300 space-y-2">
                    {readingList.map((bookTitle, i) => (
                      <li key={i} className="flex items-start gap-1.5 pl-1 italic">
                        <span className="text-[#C8A96B] font-bold font-sans">✦</span> {bookTitle}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Cronograma study plan */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block font-bold">Plano de Estudos Sistemático</span>
                {syllabus.map((item, index) => (
                  <div key={index} className="p-5 bg-stone-950/70 border border-[#C8A96B]/15 hover:border-[#C8A96B]/30 rounded-2xl relative overflow-hidden group transition-all">
                    <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#C8A96B]/5 rounded-full group-hover:scale-125 transition-transform pointer-events-none"></div>
                    <span className="text-[8.5px] font-mono text-[#C8A96B] uppercase font-bold tracking-widest">{item.week}</span>
                    <h5 className="font-cinzel text-sm font-bold text-white tracking-widest mt-1 mb-2">{item.topic}</h5>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[9px] font-mono text-stone-500 uppercase block font-bold">Leituras Associadas:</span>
                        <div className="text-stone-300 font-garamond italic">{item.readings.join(", ")}</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-stone-500 uppercase block font-bold">Exercício ou Prática Mental:</span>
                        <p className="font-garamond text-stone-400 italic leading-relaxed mt-0.5">{item.exercises}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="p-8 border border-stone-900 border-dashed rounded-3xl text-center flex flex-col justify-center items-center py-16 text-stone-400 min-h-[400px]">
              <Layers className="w-12 h-12 text-[#C8A96B]/20 mb-4 animate-bounce" style={{ animationDuration: "5s" }} />
              <h4 className="font-cinzel text-sm font-bold text-white tracking-widest uppercase mb-1">Aguardando Solicitação Astral</h4>
              <p className="font-garamond text-xs italic text-stone-500 max-w-sm">
                Aponte o tema focal e envie os parâmetros de dedicação para que o Aeon Oracle materialize dinamicamente seu syllabus e analise suas virtudes.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
