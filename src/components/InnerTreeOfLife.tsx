import React, { useState } from "react";
import { Sliders, Sparkles, AlertCircle, RefreshCw, Compass, BookOpen, GraduationCap, Users } from "lucide-react";
import { Member } from "../types";

interface InnerTreeOfLifeProps {
  member: Member;
  triggerNotification: (text: string) => void;
}

interface Sephira {
  id: string; // Malkuth to Kether
  name: string; // Hebrew name
  translation: string; // Meaning in Portuguese
  attribute: string; // Domain mapped
  description: string;
  cx: number; // SVG position
  cy: number;
}

const SEPHIROTH: Sephira[] = [
  { id: "1", name: "Kether", translation: "Coroa", attribute: "Espiritualidade filosófica", description: "O propósito primordial que transcende a matéria, a força de vontade criadora e a conexão com a unidade.", cx: 200, cy: 30 },
  { id: "2", name: "Chokmah", translation: "Sabedoria", attribute: "Pesquisa Avançada", description: "A centelha inicial do gênio intelectual, revelações intuitivas e a produção científica inovadora.", cx: 280, cy: 90 },
  { id: "3", name: "Binah", translation: "Entendimento", attribute: "Conhecimento estruturado", description: "A maturação do saber, exegese profunda de livros e metodologias rigorosas de catalogação.", cx: 120, cy: 90 },
  { id: "4", name: "Chesed", translation: "Misericórdia", attribute: "Liderança de Guilda", description: "A magnanimidade, expansão acadêmica e a capacidade de nutrir e ensinar outros irmãos iniciados.", cx: 280, cy: 170 },
  { id: "5", name: "Geburah", translation: "Severidade", attribute: "Disciplina de Estudos", description: "O rigor intelectual, capacidade de autocrítica, foco inabalável e discernimento lógico agudo.", cx: 120, cy: 170 },
  { id: "6", name: "Tiphereth", translation: "Beleza", attribute: "Consistência Prática", description: "O equilíbrio dos estudos, harmonia emocional e a consistência existencial de se manter focado no sendeiro.", cx: 200, cy: 230 },
  { id: "7", name: "Netzach", translation: "Vitória", attribute: "Comunicação na Ágora", description: "O florescer das ideias esotéricas, discursos de fórum que engajam e propagam debates saudáveis.", cx: 280, cy: 310 },
  { id: "8", name: "Hod", translation: "Glória", attribute: "Inteligência Emocional", description: "A organização analítica, controle psíquico e estabilização frente a questionamentos acadêmicos.", cx: 120, cy: 310 },
  { id: "9", name: "Yesod", translation: "Fundação", attribute: "Presença Comunitária", description: "A conexão direta com o egrégora coletivo, participação de sessões rituais síncronas e concílios.", cx: 200, cy: 370 },
  { id: "10", name: "Malkuth", translation: "Reino", attribute: "Realização de Atividades", description: "A manifestação do saber intelectual em ações concretas do dia a dia, ensaios publicados e leituras concluídas.", cx: 200, cy: 450 }
];

// Tree connections paths (22 paths)
const PATHS_OF_WISDOM = [
  { from: "h1", to: "h2", d: "M 200 30 L 280 90" }, // Kether-Chokmah
  { from: "h1", to: "h3", d: "M 200 30 L 120 90" }, // Kether-Binah
  { from: "h1", to: "h6", d: "M 200 30 L 200 230" }, // Kether-Tiphereth
  { from: "h2", to: "h3", d: "M 280 90 L 120 90" }, // Chokmah-Binah
  { from: "h2", to: "h4", d: "M 280 90 L 280 170" }, // Chokmah-Chesed
  { from: "h2", to: "h6", d: "M 280 90 L 200 230" }, // Chokmah-Tiphereth
  { from: "h3", to: "h5", d: "M 120 90 L 120 170" }, // Binah-Geburah
  { from: "h3", to: "h6", d: "M 120 90 L 200 230" }, // Binah-Tiphereth
  { from: "h4", to: "h5", d: "M 280 170 L 120 170" }, // Chesed-Geburah
  { from: "h4", to: "h6", d: "M 280 170 L 200 230" }, // Chesed-Tiphereth
  { from: "h4", to: "h7", d: "M 280 170 L 280 310" }, // Chesed-Netzach
  { from: "h5", to: "h6", d: "M 120 170 L 200 230" }, // Geburah-Tiphereth
  { from: "h5", to: "h8", d: "M 120 170 L 120 310" }, // Geburah-Hod
  { from: "h6", to: "h7", d: "M 200 230 L 280 310" }, // Tiphereth-Netzach
  { from: "h6", to: "h8", d: "M 200 230 L 120 310" }, // Tiphereth-Hod
  { from: "h6", to: "h9", d: "M 200 230 L 200 370" }, // Tiphereth-Yesod
  { from: "h7", to: "h8", d: "M 280 310 L 120 310" }, // Netzach-Hod
  { from: "h7", to: "h9", d: "M 280 310 L 200 370" }, // Netzach-Yesod
  { from: "h8", to: "h9", d: "M 120 310 L 200 370" }, // Hod-Yesod
  { from: "h9", to: "h10", d: "M 200 370 L 200 450" } // Yesod-Malkuth
];

export default function InnerTreeOfLife({ member, triggerNotification }: InnerTreeOfLifeProps) {
  // Map scores (1 to 10 scale)
  const [scores, setScores] = useState<Record<string, number>>({
    "1": 8, // Kether
    "2": 6, // Chokmah
    "3": 9, // Binah
    "4": 5, // Chesed
    "5": 7, // Geburah
    "6": 7, // Tiphereth
    "7": 6, // Netzach
    "8": 8, // Hod
    "9": 6, // Yesod
    "10": 8 // Malkuth
  });

  const [selectedSephira, setSelectedSephira] = useState<Sephira>(SEPHIROTH[0]);
  const [strengths, setStrengths] = useState("Investigação conceitual acadêmica, exegese rigorosa.");
  const [weaknesses, setWeaknesses] = useState("Baixa interação em discussões acaloradas de fóruns sociais.");
  const [futureGoals, setFutureGoals] = useState("Laurear uma tese esotérica oficial sobre alquimia mental integrada ao G-Classroom.");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleScoreChange = (sephiraId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [sephiraId]: value
    }));
  };

  const handleRequestAiTreeAnalysis = async () => {
    setLoadingAnalysis(true);
    triggerNotification("Sintonizando IA Aeon Sophia para sopesar sua Árvore Iniciática...");
    try {
      const res = await fetch("/api/inner-tree-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          scores,
          strengths,
          weaknesses,
          futureGoals,
          initiaticName: member.initiaticName,
          status: member.status
        })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis);
      triggerNotification("Concílio interno concluído! Recomendações egrégoras consolidadas.");
    } catch (err: any) {
      triggerNotification("Falha na interpretação astral: " + err.message);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Compute color based on score
  const getSubtleColor = (score: number, baseHex: string) => {
    if (score >= 8) return `rgba(200, 169, 107, ${score / 10})`; // Gold
    if (score >= 5) return `rgba(180, 150, 120, ${score / 10})`; // Bronze
    return `rgba(150, 100, 100, ${score / 10})`; // Dull copper
  };

  return (
    <div className="bg-[#040404]/30 border border-[#C8A96B]/15 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col justify-between">
      
      {/* Header section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#C8A96B]/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#C8A96B] mb-1">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] uppercase font-mono-aeon tracking-wider">Jornada Interior</span>
          </div>
          <h3 className="font-cinzel text-xl font-bold uppercase text-white tracking-widest">Árvore da Vida Pessoal</h3>
          <p className="font-garamond text-xs text-stone-400 italic">Mapeamento dinâmico do desenvolvimento intelectual, consistência espiritual e sabedoria aplicada.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-[#C8A96B]/5 border border-[#C8A96B]/25 rounded-xl text-[10px] text-zinc-300 font-mono-aeon flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#C8A96B]" /> Status: {member.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Interactive SVG Tree column */}
        <div className="xl:col-span-6 flex flex-col items-center justify-center bg-black/60 p-4 border border-[#C8A96B]/10 rounded-2xl relative min-h-[500px]">
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-stone-900 border border-stone-850 rounded text-[9px] text-[#C8A96B] font-mono-aeon">
            ESQUEMA INICIÁTICO ETZ CHAIM
          </div>

          <svg width="380" height="500" viewBox="0 0 400 500" className="max-w-full">
            {/* Draw Paths (conduits) */}
            <g>
              {PATHS_OF_WISDOM.map((path, idx) => {
                const fromScore = scores[path.from.replace("h", "")] || 5;
                const toScore = scores[path.to.replace("h", "")] || 5;
                const average = (fromScore + toScore) / 2;
                return (
                  <path
                    key={idx}
                    d={path.d}
                    fill="none"
                    stroke={average >= 7 ? "#C8A96B" : "#3d321c"}
                    strokeWidth={average >= 8 ? "2" : "1.2"}
                    opacity={average / 10}
                    className="transition-all duration-500"
                  />
                );
              })}
            </g>

            {/* Draw Sephira Spheres */}
            <g>
              {SEPHIROTH.map((se) => {
                const score = scores[se.id];
                const isSelected = selectedSephira.id === se.id;
                return (
                  <g 
                    key={se.id} 
                    transform={`translate(${se.cx}, ${se.cy})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedSephira(se)}
                  >
                    {/* Shadow / glow behind */}
                    <circle 
                      r={isSelected ? "25" : "18"} 
                      fill="none"
                      stroke={score >= 8 ? "#C8A96B" : "#8D6E3D"}
                      strokeWidth="1"
                      className="group-hover:scale-110 transition-transform duration-300 pointer-events-none"
                      opacity={isSelected ? "1" : "0.3"}
                    />
                    
                    {/* Core sphere */}
                    <circle 
                      r={isSelected ? "18" : "14"} 
                      fill={isSelected ? "#0d0d0d" : "#050505"}
                      stroke={isSelected ? "#C8A96B" : "rgba(200, 169, 107, 0.4)"}
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    {/* Numeric Score Tag */}
                    <circle
                      cx={isSelected ? "16" : "12"}
                      cy={isSelected ? "-16" : "-12"}
                      r="6.5"
                      fill="#C8A96B"
                      className="transition-all"
                    />
                    <text
                      x={isSelected ? "16" : "12"}
                      y={isSelected ? "-13.5" : "-9.5"}
                      textAnchor="middle"
                      fill="#000"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {score}
                    </text>

                    {/* Sphere Labels */}
                    <text
                      y="4"
                      textAnchor="middle"
                      fill={isSelected ? "#C8A96B" : "#999"}
                      fontSize="7"
                      fontFamily="Cinzel, serif"
                      className="font-bold pointer-events-none tracking-widest text-[7px]"
                    >
                      {se.name.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Selected Sephira detail & Self-Assessment Form column */}
        <div className="xl:col-span-6 space-y-6">
          
          {/* Selected Sephira Panel */}
          <div className="p-5 bg-[#0a0a0a]/90 border border-[#C8A96B]/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 bg-[#C8A96B]/10 rounded-bl-xl font-mono-aeon text-[#C8A96B] font-bold text-xs uppercase">
              Esfera n° {selectedSephira.id}
            </div>
            
            <span className="text-[#C8A96B] font-mono-aeon uppercase tracking-wider text-[9px] font-bold">SEPHIRAH SELECIONADA</span>
            <h4 className="font-cinzel text-xl text-white font-bold tracking-widest flex items-baseline gap-2 mt-1">
              {selectedSephira.name}
              <span className="font-garamond text-stone-400 italic text-sm font-normal">({selectedSephira.translation})</span>
            </h4>
            <div className="text-stone-300 text-[10px] font-mono-aeon uppercase tracking-widest mt-1 text-[#C8A96B] bg-stone-900 border border-stone-850 px-2 py-0.5 inline-block rounded">
              Domínio: {selectedSephira.attribute}
            </div>

            <p className="font-garamond text-stone-400 italic text-xs leading-relaxed mt-3 border-t border-stone-900 pt-3">
              "{selectedSephira.description}"
            </p>

            <div className="mt-4 pt-3 border-t border-stone-900 flex justify-between items-center text-xs">
              <span className="text-stone-400">Pontuação Atual:</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[#C8A96B] font-bold text-sm">{scores[selectedSephira.id]}/10</span>
                <span className="text-stone-500">({scores[selectedSephira.id] >= 8 ? "Excelência" : scores[selectedSephira.id] >= 5 ? "Equilíbrio" : "Sob Cuidado"})</span>
              </div>
            </div>
          </div>

          {/* SSliders adjusters */}
          <div className="p-5 bg-stone-950/60 border border-stone-900 rounded-2xl space-y-4">
            <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 text-[#C8A96B]">
              <Sliders className="w-4 h-4" /> Calibrar Graus Ocultos
            </h5>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
              {SEPHIROTH.map((se) => (
                <div key={se.id} className="p-2 border border-stone-900 bg-black/40 rounded-lg space-y-1.5 hover:border-[#C8A96B]/30 transition-all">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="font-bold">{se.name} ({se.id})</span>
                    <span className="text-[#C8A96B] font-bold">{scores[se.id]}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scores[se.id]}
                    onChange={(e) => handleScoreChange(se.id, parseInt(e.target.value))}
                    className="w-full accent-[#C8A96B]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Self-Assessment textual descriptors */}
          <div className="p-5 bg-stone-950/50 border border-stone-900 rounded-2xl space-y-3 font-mono text-[10px]">
            <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest text-[#C8A96B] flex items-center gap-2">
              <Compass className="w-4 h-4" /> Auto-Exame Analítico
            </h5>
            
            <div className="space-y-3">
              <div>
                <label className="block text-stone-400 uppercase font-bold mb-1">Meus Pontos Fortes em AEON:</label>
                <input
                  type="text"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-stone-850 rounded p-2 text-white focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-stone-400 uppercase font-bold mb-1">Lacunas de Aprendizagem / Áreas Negligenciadas:</label>
                <input
                  type="text"
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-stone-850 rounded p-2 text-white focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-stone-400 uppercase font-bold mb-1">Meus Objetivos Acadêmicos / Futuros:</label>
                <input
                  type="text"
                  value={futureGoals}
                  onChange={(e) => setFutureGoals(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-stone-850 rounded p-2 text-white focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <button
              onClick={handleRequestAiTreeAnalysis}
              disabled={loadingAnalysis}
              className="w-full mt-4 py-2 bg-[#C8A96B] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:brightness-110 rounded transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loadingAnalysis ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> SOPHIA ESTÁ PESANDO SEU SENDERO...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" /> PESAR MINHA ÁRVORE COM SOPHIA IA
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* AI Recommendation Board */}
      {aiAnalysis && (
        <div className="mt-8 p-6 bg-[#C8A96B]/5 border border-dashed border-[#C8A96B]/30 rounded-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-[#C8A96B]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2.5 text-[#C8A96B] mb-3 border-b border-[#C8A96B]/15 pb-2.5">
            <Sparkles className="w-5 h-5" />
            <span className="font-cinzel text-xs font-bold tracking-widest uppercase">ANÁLISE INICIÁTICA DA IA SENECA & SOPHIA</span>
          </div>

          <div className="font-garamond text-[#F5F5F5]/95 text-sm leading-relaxed whitespace-pre-wrap italic">
            {aiAnalysis}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-900 flex justify-between items-center text-[10px] text-stone-500 font-mono">
            <span>Sintonização: Sophia Oracle v3.5-flash</span>
            <span>Chancela Egrégora AEON</span>
          </div>
        </div>
      )}

    </div>
  );
}
