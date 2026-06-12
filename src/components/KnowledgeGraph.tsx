import React, { useState, useRef, useEffect } from "react";
import { Search, ZoomIn, ZoomOut, Maximize2, Share2, Compass, Layers, Info, ArrowUpRight, HelpCircle } from "lucide-react";
import { Circle, LibraryBook, ResearchPaper, AcademicEvent } from "../types";

interface KnowledgeGraphProps {
  books: LibraryBook[];
  circles: Circle[];
  researchPapers: ResearchPaper[];
  conferences: AcademicEvent[];
  setSelectedBook: React.Dispatch<React.SetStateAction<LibraryBook | null>>;
  setSelectedCircle: React.Dispatch<React.SetStateAction<Circle | null>>;
  setActiveTab: (tab: any) => void;
  triggerNotification: (text: string) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: "book" | "circle" | "paper" | "event" | "author";
  details: string;
  x: number;
  y: number;
  color: string;
  weight: number;
  tags: string[];
}

interface GraphEdge {
  from: string;
  to: string;
  type: "relationship" | "author_of" | "discusses" | "origin";
}

export default function KnowledgeGraph({
  books,
  circles,
  researchPapers,
  conferences,
  setSelectedBook,
  setSelectedCircle,
  setActiveTab,
  triggerNotification
}: KnowledgeGraphProps) {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "book" | "circle" | "paper" | "event" | "author">("all");
  const [personalOnly, setPersonalOnly] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Pan and zoom states
  const [zoom, setZoom] = useState(0.85);
  const [panX, setPanX] = useState(60);
  const [panY, setPanY] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Generate Graph Nodes from real app data
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // 1. Authors (static esoteric historical roots)
  const authors = [
    { id: "auth_hermes", label: "Hermes Trismegistus", details: "Fundador mítico da tradição hermética arcaica.", x: 200, y: 150, color: "#C8A96B", tags: ["Hermetismo", "Iniciação"] },
    { id: "auth_shimon", label: "Shimon bar Yochai", details: "Rabino místico, autor creditado ao sagrado Tomo do Zohar.", x: 420, y: 190, color: "#be4ce8", tags: ["Cabala", "Misticismo"] },
    { id: "auth_levi", label: "Eliphas Levi", details: "Abade e ocultista francês, sintetizador dogmático do ritualismo.", x: 140, y: 380, color: "#e25c5c", tags: ["Ocultismo", "Símbolos"] },
    { id: "auth_3init", label: "Os Três Iniciados", details: "Autores anônimos do Caibalion no início do século XX.", x: 210, y: 290, color: "#4ca6e8", tags: ["Mentalismo", "Hermetismo"] }
  ];
  
  authors.forEach(auth => {
    nodes.push({
      ...auth,
      type: "author",
      weight: 12
    });
  });

  // 2. Books from dynamic database
  books.forEach((book, idx) => {
    // Distribute books in a radius around their category or author
    let rx = 100 + (idx * 160);
    let ry = book.category === "Cabala" ? 110 : book.category === "Hermetismo" ? 220 : 320;
    
    // Custom positions matching the universe
    if (book.id === "h1") { rx = 210; ry = 80; }
    if (book.id === "c1") { rx = 425; ry = 110; }
    if (book.id === "h2") { rx = 310; ry = 280; }
    if (book.id === "a1") { rx = 120; ry = 480; }

    nodes.push({
      id: book.id,
      label: book.title,
      type: "book",
      details: book.description,
      x: rx,
      y: ry,
      color: book.category === "Cabala" ? "#be4ce8" : book.category === "Hermetismo" ? "#C8A96B" : "#4ca6e8",
      weight: 10,
      tags: [book.category, book.difficulty]
    });

    // Auto-Connections (Edges) matching author names
    if (book.author.includes("Hermes")) edges.push({ from: book.id, to: "auth_hermes", type: "author_of" });
    if (book.author.includes("Shimon")) edges.push({ from: book.id, to: "auth_shimon", type: "author_of" });
    if (book.author.includes("Iniciados")) edges.push({ from: book.id, to: "auth_3init", type: "author_of" });
  });

  // 3. Study Circles
  circles.forEach((circle, idx) => {
    let cx = 100 + (idx * 210);
    let cy = 200 + (idx * 80);

    // Dynamic placements to avoid overlaps
    if (circle.id.includes("1")) { cx = 110; cy = 230; }
    if (circle.id.includes("2")) { cx = 490; cy = 300; }
    if (circle.id.includes("circ_")) { cx = 310; cy = 410; } // New circle instantiated

    nodes.push({
      id: circle.id,
      label: circle.name,
      type: "circle",
      details: circle.description,
      x: cx,
      y: cy,
      color: circle.color || "#4ce8b0",
      weight: 12,
      tags: circle.studies
    });

    // Link circles to books contained in circle's library list
    circle.libraryIds.forEach(bookId => {
      edges.push({ from: circle.id, to: bookId, type: "discusses" });
    });
  });

  // 4. Research Papers
  researchPapers.forEach((paper, idx) => {
    let px = 280;
    let py = 180 + (idx * 110);
    
    // Aesthetic scattering
    if (paper.id === "p1") { px = 320; py = 190; }
    if (paper.id === "p2") { px = 50; py = 320; }
    
    nodes.push({
      id: paper.id,
      label: `Tese: ${paper.title}`,
      type: "paper",
      details: paper.abstract,
      x: px,
      y: py,
      color: "#e25c5c",
      weight: 9,
      tags: paper.tags
    });

    // Link research to origin circle or author roots
    if (paper.circleId) {
      edges.push({ from: paper.id, to: paper.circleId, type: "origin" });
    }
    paper.tags.forEach(t => {
      if (t.includes("Cabala") || t.includes("Zohar")) edges.push({ from: paper.id, to: "auth_shimon", type: "relationship" });
      if (t.includes("Hermes") || t.includes("Hermetismo")) edges.push({ from: paper.id, to: "auth_hermes", type: "relationship" });
    });
  });

  // 5. Conferences
  conferences.forEach((conf, idx) => {
    nodes.push({
      id: conf.id,
      label: conf.title,
      type: "event",
      details: `Encontro síncrono agendado para ${conf.date} às ${conf.time}. Encontro via ${conf.type}.`,
      x: 520,
      y: 80 + (idx * 200),
      color: "#4ce8b0",
      weight: 8,
      tags: [conf.type, "Encontro"]
    });

    if (conf.circleId) {
      edges.push({ from: conf.id, to: conf.circleId, type: "relationship" });
    }
  });

  // Handle Dragging / Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panX, y: e.clientY - panY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.current.x);
    setPanY(e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom Controllers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.3));
  const handleCenter = () => {
    setZoom(0.85);
    setPanX(60);
    setPanY(40);
  };

  // Search filter matching nodes
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          node.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          node.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || node.type === filterType;
    
    // Personal state mock filter
    const matchesScope = !personalOnly || (node.type === "book" || node.type === "circle");
    
    return matchesSearch && matchesType && matchesScope;
  });

  // Connected node filters
  const getConnectedEdges = (nodeId: string) => {
    return edges.filter(e => e.from === nodeId || e.to === nodeId);
  };

  // Cross-linking handler for infinite context changes
  const handleJumpToEntity = (node: GraphNode) => {
    if (node.type === "book") {
      const parentBook = books.find(b => b.id === node.id);
      if (parentBook) {
        setSelectedBook(parentBook);
        setActiveTab("library");
        triggerNotification(`Navegação síncrona: focado no Tomo "${parentBook.title}"`);
      }
    } else if (node.type === "circle") {
      const parentCircle = circles.find(c => c.id === node.id);
      if (parentCircle) {
        setSelectedCircle(parentCircle);
        setActiveTab("circles");
        triggerNotification(`Navegação síncrona: adentrando o Círculo "${parentCircle.name}"`);
      }
    } else if (node.type === "paper") {
      setActiveTab("research");
      triggerNotification(`Roteando para a Cátedra de Pesquisas Acadêmicas.`);
    } else if (node.type === "event") {
      setActiveTab("conferences");
      triggerNotification(`Visualizando Conselho Acadêmico de Conferências.`);
    } else if (node.type === "author") {
      setActiveTab("library");
      setSearchTerm(node.label);
      triggerNotification(`Localizando manuscritos sobre o mestre ${node.label}...`);
    }
  };

  return (
    <div className="bg-[#030303]/40 border border-[#C8A96B]/15 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col justify-between overflow-hidden relative">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#C8A96B]/10 pb-4 mb-4 z-10">
        <div>
          <div className="flex items-center gap-2 text-[#C8A96B] mb-1">
            <Layers className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] uppercase font-mono-aeon tracking-wider">Visualizador Teosófico</span>
          </div>
          <h3 className="font-cinzel text-xl font-bold uppercase text-white tracking-widest">Knowledge Graph Dinâmico</h3>
          <p className="font-garamond text-xs text-stone-400 italic">Rede biológica de conexões entre acadêmicos, círculos iniciáticos, tomos arcanos e pesquisas.</p>
        </div>

        {/* Toolbar switches */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono-aeon">
          <button 
            onClick={() => {
              setPersonalOnly(!personalOnly);
              triggerNotification(personalOnly ? "Visualizando rede acadêmica total." : "Focado no seu mapa pessoal de consciência.");
            }}
            className={`px-3 py-1.5 border rounded-lg transition-all cursor-pointer font-bold ${personalOnly ? "bg-[#C8A96B]/15 border-[#C8A96B] text-white" : "border-stone-900 bg-stone-950/65 text-stone-400"}`}
          >
            {personalOnly ? "● MEU MAPA INDIVIDUAL" : "MAPA COLETIVO COMPACTO"}
          </button>
          
          <button
            onClick={() => {
              triggerNotification("Alinhamento e calibração das esferas intelectuais atualizada com IA.");
            }}
            className="px-3 py-1.5 border border-[#C8A96B]/20 bg-stone-950 hover:bg-[#C8A96B]/10 text-[#C8A96B] rounded-lg transition-all cursor-pointer font-bold"
          >
            SINCRO-IA ATIVA
          </button>
        </div>
      </div>

      {/* Control Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 z-10">
        
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar nós, conceitos, autores ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 bg-stone-950/80 border border-stone-850 focus:border-[#C8A96B] p-2 rounded-xl text-xs text-white focus:outline-none placeholder-stone-600"
          />
        </div>

        {/* Categories togglers */}
        <div className="md:col-span-8 flex flex-wrap gap-1.5 text-[9px] font-mono font-bold uppercase">
          {[
            { id: "all", label: "Tudo" },
            { id: "book", label: "Biblioteca" },
            { id: "circle", label: "Círculos" },
            { id: "paper", label: "Pesquisas" },
            { id: "event", label: "Eventos" },
            { id: "author", label: "Histórico" }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id as "all" | "book" | "circle" | "paper" | "event" | "author")}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${filterType === opt.id ? "bg-[#C8A96B]/15 border-[#C8A96B]/50 text-white" : "bg-black border-stone-900 text-stone-500 hover:border-stone-700"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-[500px]">
        
        {/* The Graph Canvas view column */}
        <div className="lg:col-span-8 bg-[#020202] border border-stone-900 rounded-3xl relative overflow-hidden flex flex-col justify-between"
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
        >
          {/* Zoom tool buttons floating */}
          <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 font-mono text-[10px] bg-stone-950/90 border border-stone-900 p-2 rounded-2xl shadow-xl pointer-events-auto">
            <button onClick={handleZoomIn} className="p-1.5 hover:text-[#C8A96B] transition-colors hover:bg-white/5 rounded" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleZoomOut} className="p-1.5 hover:text-[#C8A96B] transition-colors hover:bg-white/5 rounded" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={handleCenter} className="p-1.5 hover:text-[#C8A96B] transition-colors hover:bg-white/5 rounded" title="Centralizar Mapa">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-3 right-3 text-[9px] font-mono text-stone-500 italic bg-black/60 px-2 py-1 rounded border border-stone-950 z-20 pointer-events-none">
            Arraste para mover • Clique nos nós para detalhar
          </div>

          {/* SVG Canvas Area */}
          <svg className="w-full h-full flex-1 min-h-[440px] cursor-grab active:cursor-grabbing">
            {/* Master Transform group */}
            <g transform={`translate(${panX}, ${panY}) scale(${zoom})`} className="transition-transform duration-100 ease-out">
              
              {/* Connected Lines (Edges) */}
              <g>
                {edges.map((edge, idx) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  
                  if (!fromNode || !toNode) return null;

                  // Double check search matches to dim unhighlighted lines
                  const fromSelected = selectedNode && (selectedNode.id === fromNode.id || selectedNode.id === toNode.id);
                  const strokeCol = fromSelected ? "#C8A96B" : "rgba(100, 100, 100, 0.15)";
                  const strokeWidth = fromSelected ? "1.8" : "0.75";

                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={strokeCol}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.type === "discusses" ? "4,4" : "0"}
                      className="transition-all"
                    />
                  );
                })}
              </g>

              {/* Node points */}
              <g>
                {filteredNodes.map((node) => {
                  const isNodeSelected = selectedNode?.id === node.id;
                  let nodeShape = "circle";
                  if (node.type === "circle") nodeShape = "hexagon";
                  if (node.type === "event") nodeShape = "diamond";

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                    >
                      {/* Aura glowing circle behind */}
                      <circle
                        r={isNodeSelected ? "22" : "15"}
                        fill="none"
                        stroke={node.color}
                        strokeWidth={isNodeSelected ? "2.5" : "1"}
                        opacity={isNodeSelected ? "0.85" : "0.15"}
                        className="animate-pulse"
                      />

                      {/* Main node drawing container */}
                      {nodeShape === "hexagon" ? (
                        <polygon
                          points="-12,-7 0,-14 12,-7 12,7 0,14 -12,7"
                          fill="#090909"
                          stroke={node.color}
                          strokeWidth="2.2"
                          className="hover:scale-110 transition-transform"
                        />
                      ) : nodeShape === "diamond" ? (
                        <polygon
                          points="0,-13 13,0 0,13 -13,0"
                          fill="#090909"
                          stroke={node.color}
                          strokeWidth="1.8"
                          className="hover:scale-110 transition-transform"
                        />
                      ) : (
                        <circle
                          r="10"
                          fill="#090909"
                          stroke={node.color}
                          strokeWidth={isNodeSelected ? "2.5" : "1.8"}
                          className="hover:scale-110 transition-transform"
                        />
                      )}

                      {/* Core glowing dot for Active selections */}
                      {isNodeSelected && (
                        <circle r="4" fill={node.color} />
                      )}

                      {/* Node Label Text floating below */}
                      <text
                        y="23"
                        textAnchor="middle"
                        fill={isNodeSelected ? "#C8A96B" : "#f5f5f5"}
                        fontSize="8.5"
                        fontWeight={isNodeSelected ? "bold" : "normal"}
                        fontFamily="Cinzel, serif"
                        className="select-none tracking-wide text-[8.5px]"
                        style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.95)" }}
                      >
                        {node.label.length > 20 ? node.label.substring(0, 18) + "..." : node.label}
                      </text>
                    </g>
                  );
                })}
              </g>

            </g>
          </svg>
        </div>

        {/* Relationship details widget sidebar column */}
        <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
          
          {/* Node detailed board */}
          {selectedNode ? (
            <div className="p-5 bg-stone-950/80 border border-[#C8A96B]/20 rounded-3xl flex-1 flex flex-col justify-between animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-transparent via-[#C8A96B]/50 to-transparent"></div>
              
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <span className={`px-2 py-0.5 text-[8px] font-mono-aeon font-bold uppercase tracking-wider rounded border ${
                    selectedNode.type === "book" ? "bg-amber-950 border-amber-500 text-amber-200" :
                    selectedNode.type === "circle" ? "bg-emerald-950 border-emerald-500 text-emerald-200" :
                    selectedNode.type === "paper" ? "bg-red-950 border-red-500 text-red-200" :
                    selectedNode.type === "event" ? "bg-sky-950 border-sky-500 text-sky-200" :
                    "bg-[#be4ce8]/10 border-[#be4ce8]/30 text-[#be4ce8]"
                  }`}>
                    {selectedNode.type}
                  </span>
                  <span className="text-[8px] font-mono text-stone-500">Node ID: {selectedNode.id}</span>
                </div>

                <div>
                  <h4 className="font-cinzel text-[#F5F5F5] text-base font-bold tracking-widest">{selectedNode.label}</h4>
                  <p className="font-garamond text-xs text-stone-400 italic leading-relaxed mt-2.5 bg-black/40 p-3 border border-stone-900 rounded-xl">
                    "{selectedNode.details}"
                  </p>
                </div>

                {/* Relational associations list details */}
                <div className="border-t border-stone-900 pt-4 space-y-3">
                  <span className="text-[8px] uppercase tracking-wider text-stone-500 font-mono block">Conexões Germinadas (Egrégoras)</span>
                  
                  <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar pr-1">
                    {getConnectedEdges(selectedNode.id).length === 0 ? (
                      <p className="font-garamond text-[10px] text-stone-500 italic">As sementes deste nó estão amadurecendo espiritualmente. Conexões externas não localizadas no momento.</p>
                    ) : (
                      getConnectedEdges(selectedNode.id).map((edge, index) => {
                        const targetId = edge.from === selectedNode.id ? edge.to : edge.from;
                        const targetNode = nodes.find(n => n.id === targetId);
                        if (!targetNode) return null;
                        return (
                          <div 
                            key={index}
                            onClick={() => setSelectedNode(targetNode)}
                            className="p-2 border border-stone-900 bg-[#0d0d0d] hover:border-[#C8A96B]/30 hover:bg-stone-950 rounded-xl transition-all cursor-pointer flex justify-between items-center text-[10px] font-mono-aeon"
                          >
                            <span className="text-stone-400 font-bold truncate pr-3">{targetNode.label}</span>
                            <span className="text-[8px] text-[#C8A96B] font-bold uppercase tracking-wider">{edge.type}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Node Tags and categories metadata */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedNode.tags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 text-stone-400 text-[8px] font-mono rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Jump to Entity */}
              <div className="pt-4 mt-4 border-t border-stone-905">
                <button
                  onClick={() => handleJumpToEntity(selectedNode)}
                  className="w-full py-2.5 bg-[#C8A96B] hover:bg-[#F5F5F5] text-black font-mono-aeon font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  Continuar Fluxo Síncrono <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="p-6 bg-stone-950/40 border border-stone-900 rounded-3xl flex-1 flex flex-col justify-center items-center text-center p-8 text-stone-400">
              <Compass className="w-10 h-10 text-stone-600 mb-3 animate-spin duration-1000" style={{ animationDuration: "12s" }} />
              <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest text-[#F5F5F5] mb-1">Nenhum Ponto Sintonizado</h5>
              <p className="font-garamond text-xs italic text-stone-500 max-w-xs">
                Toque em qualquer nó do mapa conceitual de conhecimentos para carregar suas relações de sincronicidade esotéricas.
              </p>
            </div>
          )}

          {/* Quick info graph legend card */}
          <div className="p-4 bg-stone-950/20 border border-stone-900 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-[#C8A96B]/60 shrink-0 mt-0.5" />
            <div className="text-[10px] space-y-1">
              <span className="font-cinzel font-bold text-stone-300 uppercase tracking-wider block">Legenda dos Fluxos:</span>
              <div className="grid grid-cols-2 gap-2 text-[9px] text-stone-500 font-mono uppercase">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#C8A96B]"></span> Ouro (Hermético)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#be4ce8]"></span> Roxo (Cabala)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#e25c5c]"></span> Rubi (Pesquisas)</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-[#4ce8b0]"></span> Esmeralda (Eventos)</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
