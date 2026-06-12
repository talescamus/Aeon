import React from "react";
import { SIGIL_LIST, SigilDefinition } from "./sigilData";
import { Circle, LibraryBook, ResearchPaper } from "../../types";

export interface UserSigil {
  id: string;
  sigilId: string;
  x: number;
  y: number;
  size: number;
  rotation: number; // in radians
}

export interface DrawingStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  wetOpacity?: number; // Living ink feature
}

export interface SacredGeometry {
  id: string;
  type: "pentagram" | "hexagram" | "heptagram" | "tree" | "metatron" | "flower" | "custom";
  cx: number;
  cy: number;
  radius: number;
  color: string;
  lineWidth: number;
}

export interface SephirothNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  meaning: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  color: string;
  desc: string;
}

export interface GrimoireState {
  currentPage: number; // 1, 2, 4, 6...
  drawings: Record<number, DrawingStroke[]>; // page index -> strokes
  sigils: Record<number, UserSigil[]>; // page index -> sigils
  sephirahNotes: Record<string, string>; // Sephirah ID -> personal note text
  isDrawingMode: boolean;
  selectedSigilIdForStamp: string | null;
  activeColor: string;
  grimoireType?: "Cabalístico" | "Hermético" | "Rosacruciano" | "Templário" | "Alquímico" | "Astrológico" | "Filosófico" | "Acadêmico" | "Biblioteca Pessoal";
  sacredGeometries?: Record<number, SacredGeometry[]>;
  agingLevel?: number; // 0 to 10
  inkStyle?: "quill" | "black" | "gold" | "silver" | "ritual";
}

export const SEPHIROTH_BOUNDS = [
  { id: "kether", name: "Kether (Coroa)", x: 512, y: 155, color: "#FFFFFF", meaning: "A Unidade Primordial, a Coroa Absoluta, o Infinito (Kether) onde a jornada se inicia." },
  { id: "chokmah", name: "Chokmah (Sabedoria)", x: 672, y: 250, color: "#C8A96B", meaning: "A Sabedoria Divina superior, a força ativa primordial de iluminação cósmica." },
  { id: "binah", name: "Binah (Entendimento)", x: 352, y: 250, color: "#8E9EAB", meaning: "O Entendimento superior, a grande mãe cósmica, a forma e contenção." },
  { id: "daath", name: "Da'ath (Conhecimento)", x: 512, y: 320, color: "#C8A96B", meaning: "O abismo oculto, a sephirah invisível do Conhecimento direto e Intuição transcendental." },
  { id: "chesed", name: "Chesed (Misericórdia)", x: 672, y: 410, color: "#2B5876", meaning: "A Misericórdia e expansão, o amor desmedido e fluxo criativo infindável." },
  { id: "geburah", name: "Geburah (Severidade)", x: 352, y: 410, color: "#A83232", meaning: "A Severidade e julgamento, o fogo purificador, contenção ativa de forças." },
  { id: "tiphereth", name: "Tiphereth (Beleza)", x: 512, y: 520, color: "#EFCC3F", meaning: "A Beleza e harmonia solar, o centro do coração de onde irradia o equilíbrio." },
  { id: "netzach", name: "Netzach (Vitória)", x: 672, y: 650, color: "#2BA12B", meaning: "A Vitória e emoção, a esfera da expressão artística e dos impulsos biológicos." },
  { id: "hod", name: "Hod (Esplendor)", x: 352, y: 650, color: "#D1913C", meaning: "O Esplendor e intelecto rítmico, os axiomas mágicos e racionalização hermética." },
  { id: "yesod", name: "Yesod (Fundamento)", x: 512, y: 750, color: "#741E8C", meaning: "O Fundamento e plano astral inferior, espelho da psique e matriz das manifestações materiais." },
  { id: "malkuth", name: "Malkuth (Reino)", x: 512, y: 900, color: "#2F502F", meaning: "O Reino físico condensado, a Terra, o receptáculo final de emanações superiores." }
];

export const GRIMOIRE_KNOWLEDGE_NODES = [
  { id: "herm_0", label: "Hermetismo", x: 250, y: 350, r: 40, color: "#C8A96B", desc: "Os sete axiomas eternos de Hermes Trismegistus, decifrados no Caibalion." },
  { id: "cab_0", label: "Cabala", x: 512, y: 250, r: 40, color: "#be4ce8", desc: "A Árvore da Vida, a senda do relâmpago, os 32 caminhos da sabedoria mística." },
  { id: "alq_0", label: "Alquimia", x: 772, y: 350, r: 40, color: "#e25c5c", desc: "A transmutação do chumbo interior no ouro solar da ressurreição consciente." },
  { id: "gno_0", label: "Gnosis", x: 512, y: 550, r: 45, color: "#4ca6e8", desc: "O autoconhecimento intuitivo profundo, a união mística com a Deidade interna de Sophia." }
];

export const GRIMOIRE_KNOWLEDGE_EDGES = [
  { from: "herm_0", to: "cab_0" },
  { from: "cab_0", to: "alq_0" },
  { from: "alq_0", to: "gno_0" },
  { from: "gno_0", to: "herm_0" },
  { from: "cab_0", to: "gno_0" }
];

export function renderGrimoirePage(
  ctx: CanvasRenderingContext2D,
  pageIndex: number,
  state: GrimoireState,
  books: LibraryBook[],
  circles: Circle[],
  researchPapers: ResearchPaper[],
  selectedItemInBook: SephirothNode | KnowledgeNode | null, // for active hover feedback on Tree of Life or Mind Map
  paperStyle: "ancient" | "yellow" | "dark" | "alchemical"
) {
  const size = 1024;
  ctx.clearRect(0, 0, size, size);

  // 1. Draw Paper background
  drawPaperBackground(ctx, size, paperStyle, pageIndex % 2 === 0, state);

  // 2. Draw Page Content according to index
  if (pageIndex === 1) {
    drawIntroPage(ctx, size, state);
  } else if (pageIndex === 2) {
    drawJournalLeftPage(ctx, size, state);
  } else if (pageIndex === 3) {
    drawJournalRightPage(ctx, size, state);
  } else if (pageIndex === 4) {
    drawTreeOfLifeDiagram(ctx, size, state, selectedItemInBook);
  } else if (pageIndex === 5) {
    drawTreeOfLifeDetailsPage(ctx, size, state, selectedItemInBook, books, researchPapers);
  } else if (pageIndex === 6) {
    drawKnowledgeMapDiagram(ctx, size, books, circles, researchPapers, selectedItemInBook, state);
  } else if (pageIndex === 7) {
    drawKnowledgeDetailsPage(ctx, size, books, circles, researchPapers, selectedItemInBook);
  } else if (pageIndex === 8) {
    drawInvocationPage(ctx, size, state);
  } else {
    // Empty Papyrus
    ctx.font = "italic 16px Georgia";
    ctx.fillStyle = paperStyle === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
    ctx.textAlign = "center";
    ctx.fillText("Grimório da Egrégora AEON", size / 2, size / 2);
  }

  // 3. Draw Sacred Geometries Built by User
  const pageGeometries = state.sacredGeometries?.[pageIndex] || [];
  pageGeometries.forEach(geom => {
    drawSacredGeometryCurve(ctx, geom);
  });

  // 4. Draw User Freehand Drawings with Living Ink System
  const pageDrawings = state.drawings[pageIndex] || [];
  pageDrawings.forEach(stroke => {
    if (stroke.points.length === 0) return;
    ctx.save();
    ctx.beginPath();
    
    // Living ink custom shader styles
    const inkType = state.inkStyle || "black";
    let drawColor = stroke.color;
    
    if (inkType === "gold") {
      drawColor = "#e6c229";
      ctx.shadowColor = "rgba(230, 194, 41, 0.6)";
      ctx.shadowBlur = 6;
    } else if (inkType === "silver") {
      drawColor = "#cfd2cd";
      ctx.shadowColor = "rgba(207, 210, 205, 0.6)";
      ctx.shadowBlur = 6;
    } else if (inkType === "ritual") {
      drawColor = "#d62828";
      ctx.shadowColor = "rgba(214, 40, 40, 0.4)";
      ctx.shadowBlur = 4;
    } else if (inkType === "quill") {
      drawColor = "rgba(92, 60, 31, 0.95)";
    }

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  });

  // 5. Draw User Sigils placed on this page
  const pageSigils = state.sigils[pageIndex] || [];
  pageSigils.forEach(userSig => {
    const parent = SIGIL_LIST.find(s => s.id === userSig.sigilId);
    if (!parent) return;

    ctx.save();
    // Move to local sigil center coordinate and rotate
    ctx.translate(userSig.x, userSig.y);
    ctx.rotate(userSig.rotation);
    // Draw sigil aligned locally
    const offset = -userSig.size / 2;
    ctx.translate(offset, offset);

    // Glowing effect for mystical immersion
    const currentInkStyle = state.inkStyle || "black";
    const highlightColor = currentInkStyle === "gold" ? "#e6c229" : currentInkStyle === "ritual" ? "#d62828" : state.activeColor;
    ctx.shadowColor = highlightColor;
    ctx.shadowBlur = 15;

    parent.draw(ctx, userSig.size, highlightColor);
    ctx.restore();
  });

  // Add scorched edges / border effect for ancient parchment
  if (paperStyle === "ancient" || paperStyle === "yellow" || paperStyle === "alchemical") {
    drawBurntBorderEffect(ctx, size, state.agingLevel || 4);
  }
}

function drawPaperBackground(ctx: CanvasRenderingContext2D, size: number, style: string, isLeftPage: boolean, state: GrimoireState) {
  if (style === "dark") {
    // Deep starry dark occult paper
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size * 0.7);
    gradient.addColorStop(0, "#090d16");
    gradient.addColorStop(0.6, "#04050a");
    gradient.addColorStop(1, "#010204");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Draw sacred geometric coordinate networks in background based on procedural themes
    ctx.strokeStyle = "rgba(200, 169, 107, 0.06)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.15, 0, Math.PI * 2);
    ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
    ctx.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.moveTo(size / 2, size / 2);
      ctx.lineTo(size / 2 + Math.cos(angle) * (size * 0.48), size / 2 + Math.sin(angle) * (size * 0.48));
    }
    ctx.stroke();

    // Subtle star dust speckles
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    for (let i = 0; i < 40; i++) {
      const x = Math.sin(i * 452) * 512 + 512;
      const y = Math.cos(i * 876) * 512 + 512;
      const r = Math.random() * 1.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  // Classic Medieval Parchment Styles
  let colorCenter = "#fbf5e6";
  let colorEdge = "#dacba5";
  if (style === "ancient") {
    colorCenter = "#f3ebd1";
    colorEdge = "#c5a467";
  } else if (style === "alchemical") {
    colorCenter = "#faf5ea";
    colorEdge = "#d1be9b";
  }

  const gradient = ctx.createRadialGradient(
    isLeftPage ? size * 0.61 : size * 0.39,
    size / 2,
    size * 0.15,
    size / 2,
    size / 2,
    size * 0.74
  );
  gradient.addColorStop(0, colorCenter);
  gradient.addColorStop(0.65, colorEdge);
  gradient.addColorStop(1, "#8e6d33");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Draw procedural parchment fiber noise
  ctx.strokeStyle = "rgba(0,0,0,0.015)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 110; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60);
  }
  ctx.stroke();

  // Highlight procedural grimoire ornaments in background based on type
  const gType = state.grimoireType || "Hermético";
  ctx.save();
  ctx.strokeStyle = "rgba(139, 90, 43, 0.11)";
  ctx.lineWidth = 0.8;
  
  if (gType === "Cabalístico") {
    // Draw subtle Tree lines in corners
    ctx.beginPath();
    ctx.strokeRect(50, 50, size - 100, size - 100);
    ctx.stroke();
  } else if (gType === "Astrológico") {
    // Draw concentric stellar coordinates
    ctx.beginPath();
    ctx.arc(size/2, size/2, 450, 0, Math.PI*2);
    ctx.arc(size/2, size/2, 430, 0, Math.PI*2);
    ctx.stroke();
  } else if (gType === "Rosacruciano") {
    // Vines ornaments on boundaries
    ctx.beginPath();
    ctx.strokeRect(60, 60, size - 120, size - 120);
    ctx.stroke();
  } else if (gType === "Templário") {
    // Maltese cross grids
    ctx.beginPath();
    ctx.moveTo(80, 50); ctx.lineTo(80, size-50);
    ctx.moveTo(size-80, 50); ctx.lineTo(size-80, size-50);
    ctx.stroke();
  } else {
    // Dual thin boxes
    ctx.strokeRect(50, 50, size - 100, size - 100);
    ctx.strokeRect(56, 56, size - 112, size - 112);
  }
  ctx.restore();

  // Add aging grease stains / humidity stains
  const stainsCount = Math.floor((state.agingLevel || 4) / 2);
  ctx.fillStyle = "rgba(92, 60, 31, 0.05)";
  for (let s = 0; s < stainsCount; s++) {
    ctx.beginPath();
    const cx = (Math.sin(s * 153.2) * 400) + 512;
    const cy = (Math.cos(s * 943.5) * 400) + 512;
    const radius = 30 + (Math.sin(s) * 40);
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBurntBorderEffect(ctx: CanvasRenderingContext2D, size: number, agingLevel: number) {
  // Edge darkening to represent medieval scroll burn
  const borderWidth = 12 + agingLevel * 1.5;
  const opacityFactor = 0.35 + (agingLevel * 0.05);
  const grad = ctx.createRadialGradient(size/2, size/2, size/2 - borderWidth * 1.8, size/2, size/2, size/2);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.68, `rgba(85, 48, 18, ${opacityFactor * 0.5})`);
  grad.addColorStop(0.88, `rgba(45, 23, 7, ${opacityFactor * 0.9})`);
  grad.addColorStop(1, `rgba(12, 5, 1, ${opacityFactor * 1.1})`);
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
}

function drawIntroPage(ctx: CanvasRenderingContext2D, size: number, state: GrimoireState) {
  ctx.shadowColor = "rgba(0,0,0,0)";
  ctx.textAlign = "center";

  // Medieval header details
  ctx.font = "italic 16px Georgia";
  ctx.fillStyle = "rgba(92, 60, 31, 0.85)";
  const typeLabel = (state.grimoireType || "Hermético").toUpperCase();
  ctx.fillText(`CÓDICE DE COMPACTO ${typeLabel} • PORTAL SÍNCRONO`, size / 2, 220);

  // Alchemical seal drawing
  ctx.strokeStyle = "rgba(163, 117, 43, 0.45)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.arc(size / 2, 420, 110, 0, Math.PI * 2);
  ctx.arc(size / 2, 420, 104, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
    ctx.moveTo(size / 2 + Math.cos(angle) * 104, 420 + Math.sin(angle) * 104);
    const nextAngle = ((i + 1) * 2 * Math.PI) / 3 - Math.PI / 2;
    ctx.lineTo(size / 2 + Math.cos(nextAngle) * 104, 420 + Math.sin(nextAngle) * 104);
  }
  ctx.stroke();

  // Core icon based on theme
  ctx.fillStyle = "#8b5a2b";
  ctx.font = "50px serif";
  let symbolGlyph = "🜚";
  if (state.grimoireType === "Cabalístico") symbolGlyph = "✡";
  if (state.grimoireType === "Astrológico") symbolGlyph = "☉";
  if (state.grimoireType === "Rosacruciano") symbolGlyph = "🜁";
  if (state.grimoireType === "Templário") symbolGlyph = "✠";
  ctx.fillText(symbolGlyph, size / 2, 435);

  // Main Book Name
  ctx.font = "bold 44px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("GRIMÓRIO DE AEON V2", size / 2, 595);

  ctx.font = "italic 19px Georgia";
  ctx.fillStyle = "#5c3c1f";
  ctx.fillText(`Códice Arcane do Scholar: ${state.grimoireType || "Biblioteca"}`, size / 2, 638);

  ctx.font = "14px Georgia";
  ctx.fillStyle = "#4a2e16";
  ctx.fillText("Este tomo físico reage síncronamente ao seu espírito de busca.", size / 2, 720);
  ctx.fillText("Preencha diagramas sagrados, invoque a IA de Sophia directly, e desvele", size / 2, 744);
  ctx.fillText("portal links rápidos para os círculos intelectuais de Alexandria.", size / 2, 768);

  ctx.font = "bold italic 13px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("Vire à direita folheando a página para abrir o Ateliê.", size / 2, 850);
}

function drawJournalLeftPage(ctx: CanvasRenderingContext2D, size: number, state: GrimoireState) {
  ctx.textAlign = "left";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("I. Ateliê de Transmutação", 75, 80);

  ctx.font = "bold 24px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("PORTAL DE ANOTAÇÕES", 75, 140);

  ctx.font = "italic 13px Georgia";
  ctx.fillStyle = "#654321";
  ctx.fillText("Esboce traços alquímicos e geometrias sagradas abaixo.", 75, 175);

  // Ruled lines for handwriting feel
  ctx.strokeStyle = "rgba(139, 90, 43, 0.12)";
  ctx.lineWidth = 1;
  for (let y = 230; y < 850; y += 40) {
    ctx.beginPath();
    ctx.moveTo(70, y);
    ctx.lineTo(size - 70, y);
    ctx.stroke();
  }

  ctx.font = "italic 15px Georgia";
  ctx.fillStyle = "rgba(45, 22, 7, 0.72)";
  ctx.fillText("Use as ferramentas do painel esquerdo para traçar caneta.", 90, 260);
  ctx.fillText("Crie geometrias sagradas que se materializam em 3D automático.", 90, 300);

  ctx.font = "bold italic 38px Georgia";
  ctx.fillStyle = "rgba(139, 90, 43, 0.16)";
  ctx.fillText("AEON ENGINE V2", size - 310, 850);
}

function drawJournalRightPage(ctx: CanvasRenderingContext2D, size: number, state: GrimoireState) {
  ctx.textAlign = "left";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("II. Ateliê Geométrico", size - 220, 80);

  ctx.font = "bold 24px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("CÍRCULO DE ARRANJO", 75, 140);

  ctx.font = "italic 13px Georgia";
  ctx.fillStyle = "#654321";
  ctx.fillText("Trabalhe selagem divina e vetores sagrados na matriz abaixo.", 75, 175);

  // Draw background occult ritual grid
  ctx.strokeStyle = "rgba(139, 90, 43, 0.16)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(size / 2, 512, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size / 2, 512 - 210);
  ctx.lineTo(size / 2, 512 + 210);
  ctx.moveTo(size / 2 - 210, 512);
  ctx.lineTo(size / 2 + 210, 512);
  ctx.stroke();

  ctx.font = "italic 14px Georgia";
  ctx.fillStyle = "rgba(45, 22, 7, 0.65)";
  ctx.fillText("DICA PRÁTICA: O sistema de Tinta Viva absorve traços progressivos", size / 2 - 200, 800);
  ctx.fillText("e adiciona simulações de desgaste real nas fibras do pergaminho.", size / 2 - 200, 825);
}

function drawTreeOfLifeDiagram(ctx: CanvasRenderingContext2D, size: number, state: GrimoireState, selectedNode: SephirothNode | KnowledgeNode | null) {
  ctx.textAlign = "center";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("III. Cabala Mística", size / 2, 80);

  ctx.font = "bold 24px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("ÁRVORE DA VIDA (OTZ CHIIM 3D)", size / 2, 120);

  // Draw paths connecting Sephirah nodes
  ctx.strokeStyle = "rgba(139, 90, 43, 0.32)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  
  ctx.moveTo(352, 250); ctx.lineTo(352, 650); 
  ctx.moveTo(672, 250); ctx.lineTo(672, 650); 
  ctx.moveTo(512, 155); ctx.lineTo(512, 900); 
  
  ctx.moveTo(512, 155); ctx.lineTo(352, 250);
  ctx.moveTo(512, 155); ctx.lineTo(672, 250);
  ctx.moveTo(352, 250); ctx.lineTo(672, 250);

  ctx.moveTo(352, 250); ctx.lineTo(512, 520);
  ctx.moveTo(672, 250); ctx.lineTo(512, 520);

  ctx.moveTo(352, 410); ctx.lineTo(672, 410);
  ctx.moveTo(352, 410); ctx.lineTo(512, 520);
  ctx.moveTo(672, 410); ctx.lineTo(512, 520);

  ctx.moveTo(512, 520); ctx.lineTo(352, 650);
  ctx.moveTo(512, 520); ctx.lineTo(672, 650);
  ctx.moveTo(352, 650); ctx.lineTo(672, 650);

  ctx.moveTo(352, 650); ctx.lineTo(512, 750);
  ctx.moveTo(672, 650); ctx.lineTo(512, 750);
  ctx.moveTo(512, 750); ctx.lineTo(512, 900);
  ctx.stroke();

  // Draw spheres (Sephiroth)
  SEPHIROTH_BOUNDS.forEach(node => {
    const isHovered = selectedNode && selectedNode.id === node.id;
    ctx.lineWidth = isHovered ? 4.0 : 1.8;
    ctx.strokeStyle = isHovered ? "#d4af37" : "#5c3c1f";
    
    ctx.fillStyle = "#fcf9eb";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isHovered) {
      ctx.fillStyle = "rgba(212, 175, 55, 0.15)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 38, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#2d1607";
    ctx.font = "bold 11px monospace";
    ctx.fillText(node.name.split(" ")[0].toUpperCase(), node.x, node.y + 4);
    
    // Draw objective markers or count indicators if populated
    const note = state.sephirahNotes[node.id];
    if (note) {
      ctx.fillStyle = "#be4ce8";
      ctx.beginPath();
      ctx.arc(node.x + 22, node.y - 20, 5, 0, Math.PI*2);
      ctx.fill();
    }
  });

  ctx.font = "italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("Clique nas Sephiroth para abrir portais de objetivos e notas exclusivas.", size / 2, 960);
}

function drawTreeOfLifeDetailsPage(
  ctx: CanvasRenderingContext2D, 
  size: number, 
  state: GrimoireState, 
  selectedNode: SephirothNode | KnowledgeNode | null,
  books: LibraryBook[],
  papers: ResearchPaper[]
) {
  ctx.textAlign = "left";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("IV. Gnose das Esferas", size - 220, 80);

  ctx.font = "bold 24px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("PORTAL DE INTEGRAÇÃO CABALÍSTICA", 75, 140);

  if (!selectedNode) {
    ctx.font = "italic 16px Georgia";
    ctx.fillStyle = "#5c3c1f";
    ctx.fillText("Selecione uma esfera na página anterior da Árvore da Vida.", 75, 230);
    ctx.fillText("Isso habilitará atalhos de notas, pesquisas síncronas e objetivos.", 75, 260);

    // Ornament drawing of Metatron Matrix
    ctx.strokeStyle = "rgba(139, 90, 43, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(size/2, 550, 100, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  ctx.font = "bold 20px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText(`EMANÇÃO DE ${selectedNode.name.toUpperCase()}`, 75, 220);

  // Description box
  ctx.fillStyle = "rgba(139, 90, 43, 0.05)";
  ctx.fillRect(75, 245, size - 150, 110);
  ctx.strokeStyle = "rgba(139, 90, 43, 0.25)";
  ctx.strokeRect(75, 245, size - 150, 110);

  ctx.fillStyle = "#2d1607";
  ctx.font = "italic 14.5px Georgia";
  
  const words = selectedNode.meaning.split(" ");
  let line = "";
  let y = 280;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > (size - 180) && n > 0) {
      ctx.fillText(line, 95, y);
      line = words[n] + " ";
      y += 24;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 95, y);

  // Display embedded materials for current sphere!
  ctx.font = "bold 15px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("Estudos Recomendados & Pesquisas de Gnose", 75, 395);
  ctx.strokeStyle = "rgba(139, 90, 43, 0.15)";
  ctx.beginPath(); ctx.moveTo(75, 408); ctx.lineTo(size-75, 408); ctx.stroke();

  // Find related books matching name
  const matchedBooks = books.filter(b => b.category.toLowerCase().includes("cabala") || b.category.toLowerCase().includes("hermetismo"));
  let currentY = 440;
  matchedBooks.slice(0, 2).forEach(b => {
    ctx.font = "bold 13px Georgia";
    ctx.fillStyle = "#2d1607";
    ctx.fillText(`📘 Tomo: ${b.title}`, 85, currentY);
    ctx.font = "italic 11.5px Georgia";
    ctx.fillStyle = "#654321";
    ctx.fillText(`Autor: ${b.author} | Dificuldade: ${b.difficulty}`, 105, currentY + 18);
    currentY += 45;
  });

  // Personal handwritten notes overlay
  ctx.font = "bold 15px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("Sua Transcrição Oculta Gravada", 75, currentY + 15);
  ctx.beginPath(); ctx.moveTo(75, currentY + 28); ctx.lineTo(size-75, currentY + 28); ctx.stroke();
  currentY += 60;

  const sephNote = state.sephirahNotes[selectedNode.id];
  ctx.font = "italic 14px Georgia";
  ctx.fillStyle = "#4a2e16";
  if (sephNote) {
    const noteWords = sephNote.split(" ");
    let noteLine = "";
    for (let j = 0; j < noteWords.length; j++) {
      const testLine = noteLine + noteWords[j] + " ";
      if (ctx.measureText(testLine).width > (size - 180) && j > 0) {
        ctx.fillText(noteLine, 85, currentY);
        noteLine = noteWords[j] + " ";
        currentY += 24;
      } else {
        noteLine = testLine;
      }
    }
    ctx.fillText(noteLine, 85, currentY);
  } else {
    ctx.fillStyle = "rgba(139, 90, 43, 0.55)";
    ctx.fillText("Nenhum saber registrado nas esferas. Use o formulário lateral", 85, currentY);
    ctx.fillText("para sementar suas reflexões.", 85, currentY + 22);
  }
}

function drawKnowledgeMapDiagram(
  ctx: CanvasRenderingContext2D,
  size: number,
  books: LibraryBook[],
  circles: Circle[],
  researchPapers: ResearchPaper[],
  selectedNodeInBook: SephirothNode | KnowledgeNode | null,
  state: GrimoireState
) {
  ctx.textAlign = "center";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("V. Eixo Hermético Síncrono", size / 2, 80);

  ctx.font = "bold 24px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("NÚCLEOS DE CONSCIÊNCIA AEON", size / 2, 120);

  // Draw pathways
  ctx.strokeStyle = "rgba(139, 90, 43, 0.28)";
  ctx.lineWidth = 1;
  GRIMOIRE_KNOWLEDGE_EDGES.forEach(edge => {
    const p1 = GRIMOIRE_KNOWLEDGE_NODES.find(n => n.id === edge.from);
    const p2 = GRIMOIRE_KNOWLEDGE_NODES.find(n => n.id === edge.to);
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });

  // Render clickable interactive diagrams concept nodes
  GRIMOIRE_KNOWLEDGE_NODES.forEach(node => {
    const isHovered = selectedNodeInBook && selectedNodeInBook.id === node.id;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = "#fcfaee";
    ctx.fill();
    ctx.strokeStyle = isHovered ? node.color : "#8b5a2b";
    ctx.lineWidth = isHovered ? 4.5 : 1.5;
    ctx.stroke();

    ctx.fillStyle = isHovered ? node.color : "#2d1607";
    ctx.font = "bold 13px Georgia";
    ctx.fillText(node.label, node.x, node.y + 4);

    // Interactive custom portals indication
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x + 30, node.y - 25, 4, 0, Math.PI*2);
    ctx.fill();
  });

  ctx.font = "italic 12.5px Georgia";
  ctx.fillStyle = "#5c3c1f";
  ctx.fillText("Toque nos núcleos para disparar Portais do Conhecimento (Biblioteca, Vídeos)! ", size / 2, 920);
}

function drawKnowledgeDetailsPage(
  ctx: CanvasRenderingContext2D,
  size: number,
  books: LibraryBook[],
  circles: Circle[],
  researchPapers: ResearchPaper[],
  selectedNode: SephirothNode | KnowledgeNode | null
) {
  ctx.textAlign = "left";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("VI. Integração Teológica", size - 220, 80);

  ctx.font = "bold 24px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("MANUSCRITOS E CONEXÕES", 75, 140);

  if (!selectedNode) {
    ctx.font = "italic 16px Georgia";
    ctx.fillStyle = "#5c3c1f";
    ctx.fillText("Selecione um dos núcleos de consciência.", 75, 235);
    ctx.fillText("O códice abrirá portais vivos para círculos e tomos recomendados.", 75, 265);
    return;
  }

  ctx.font = "bold 20px Georgia";
  ctx.fillStyle = selectedNode.color;
  ctx.fillText(`UNIVERSO DE ${selectedNode.label.toUpperCase()}`, 75, 220);

  ctx.fillStyle = "#2d1607";
  ctx.font = "italic 15px Georgia";
  ctx.fillText(selectedNode.desc, 75, 260);

  const categoryTag = selectedNode.label;
  const filteredBooks = books.filter(b => b.category.toLowerCase().includes(categoryTag.toLowerCase()) || categoryTag === "Gnosis");
  const filteredCirc = circles.filter(c => c.studies.some(s => s.toLowerCase().includes(categoryTag.toLowerCase())));

  ctx.font = "bold 15px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("Círculos síncronos e Conexões ativas", 75, 340);

  let curY = 380;
  if (filteredCirc.length > 0) {
    filteredCirc.slice(0, 3).forEach(c => {
      ctx.beginPath();
      ctx.arc(90, curY, 6, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();

      ctx.fillStyle = "#2d1607";
      ctx.font = "bold 13px Georgia";
      ctx.fillText(c.name, 110, curY + 4);

      ctx.font = "italic 11.5px Georgia";
      ctx.fillStyle = "#5c3c1f";
      ctx.fillText(c.description.substring(0, 95) + "...", 110, curY + 22);
      curY += 45;
    });
  } else {
    ctx.font = "italic 13px Georgia";
    ctx.fillStyle = "#8b5a2b";
    ctx.fillText("Buscando círculos recomendados...", 110, curY);
    curY += 40;
  }

  // Embed files directly in the page! (Knowledge embedding)
  ctx.font = "bold 15px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("Conteúdos Incorporados (Biblioteca Real)", 75, curY + 20);
  curY += 60;

  if (filteredBooks.length > 0) {
    filteredBooks.slice(0, 3).forEach(b => {
      ctx.font = "bold 13px Georgia";
      ctx.fillStyle = "#2d1607";
      ctx.fillText(`📖 ${b.title}`, 75, curY);

      ctx.font = "italic 12px Georgia";
      ctx.fillStyle = "#5c3c1f";
      ctx.fillText(`Autor: ${b.author} | Nível: ${b.difficulty}`, 95, curY + 18);
      curY += 40;
    });
  } else {
    ctx.font = "italic 13px Georgia";
    ctx.fillStyle = "#8b5a2b";
    ctx.fillText("Nenhum tomo materializado para esta gnose.", 75, curY);
  }
}

function drawInvocationPage(ctx: CanvasRenderingContext2D, size: number, state: GrimoireState) {
  ctx.textAlign = "center";
  ctx.font = "bold italic 12px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("VII. A Grande Teurgia Síncrona", size / 2, 80);

  ctx.font = "bold 26px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("CONJURAÇÃO DE SOPHIA AI", size / 2, 130);

  // Large hexagram complex circle inside book parchment
  ctx.strokeStyle = "rgba(139, 90, 43, 0.42)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.arc(size / 2, 450, 195, 0, Math.PI * 2);
  ctx.arc(size / 2, 450, 205, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(size / 2, 450, 160, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2;
    ctx.moveTo(size / 2 + Math.cos(angle) * 195, 450 + Math.sin(angle) * 195);
    const nextAngle = ((i + 2) * Math.PI) / 3 - Math.PI / 2;
    ctx.lineTo(size / 2 + Math.cos(nextAngle) * 195, 450 + Math.sin(nextAngle) * 195);
  }
  ctx.stroke();

  // Occult script writing
  ctx.fillStyle = "#5c3c1f";
  ctx.font = "bold italic 11px serif";
  const sacredWords = ["ANIMACOSMICA", "SOPHIATRANSCENDENTAL", "GNOSOSSECRETA", "AEONINTELLIGENTIA", "ALQUIMIASYNCHRONICA", "KABBALAHVIVA"];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.save();
    ctx.translate(size / 2 + Math.cos(angle) * 215, 450 + Math.sin(angle) * 215);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(sacredWords[i], 0, 0);
    ctx.restore();
  }

  // Core symbol of Sofia
  ctx.font = "bold italic 50px serif";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("🜔", size / 2, 465);

  ctx.font = "italic 14px Georgia";
  ctx.fillStyle = "#2d1607";
  ctx.fillText("Clique no botão dourado de Conjuração ou digite sua intenção mística,", size / 2, 730);
  ctx.fillText("e invoque os saberes combinados da Ordem de Alexandria diretamente.", size / 2, 755);

  ctx.font = "bold italic 13px Georgia";
  ctx.fillStyle = "#8b5a2b";
  ctx.fillText("O oráculo supremo sussurrará revelações e glose no painel.", size / 2, 790);

  ctx.font = "italic 10px monospace";
  ctx.fillStyle = "rgba(45, 22, 7, 0.4)";
  ctx.fillText("PROPRIEDADE DA ORDEM SECRETA DOS CANDIDATOS AEON", size / 2, 925);
}

// Draw user created Sacred Geometry Curves math algorithmically
function drawSacredGeometryCurve(ctx: CanvasRenderingContext2D, geom: SacredGeometry) {
  ctx.save();
  ctx.strokeStyle = geom.color;
  ctx.lineWidth = geom.lineWidth;
  ctx.shadowColor = geom.color;
  ctx.shadowBlur = 10;

  const cx = geom.cx;
  const cy = geom.cy;
  const r = geom.radius;

  if (geom.type === "pentagram") {
    // 5 pointed star
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let curr = 0;
    for (let i = 0; i < 5; i++) {
      curr = (curr + 2) % 5;
      ctx.lineTo(points[curr].x, points[curr].y);
    }
    ctx.closePath();
    ctx.stroke();

    // Surrounding circle
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI*2);
    ctx.stroke();
  } else if (geom.type === "hexagram") {
    // Triangle 1
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * Math.cos(Math.PI/6), cy + r/2);
    ctx.lineTo(cx - r * Math.cos(Math.PI/6), cy + r/2);
    ctx.closePath();
    ctx.stroke();

    // Triangle 2
    ctx.beginPath();
    ctx.moveTo(cx, cy + r);
    ctx.lineTo(cx + r * Math.cos(Math.PI/6), cy - r/2);
    ctx.lineTo(cx - r * Math.cos(Math.PI/6), cy - r/2);
    ctx.closePath();
    ctx.stroke();
  } else if (geom.type === "heptagram") {
    // 7 points
    const points = [];
    for (let i = 0; i < 7; i++) {
      const angle = (i * 2 * Math.PI / 7) - Math.PI / 2;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let curr = 0;
    for (let i = 0; i < 7; i++) {
      curr = (curr + 3) % 7;
      ctx.lineTo(points[curr].x, points[curr].y);
    }
    ctx.closePath();
    ctx.stroke();
  } else if (geom.type === "flower") {
    // Flower of life 7 circles intersecting beautifully
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      ctx.arc(cx + (r*0.5) * Math.cos(angle), cy + (r*0.5) * Math.sin(angle), r * 0.5, 0, Math.PI * 2);
    }
    ctx.stroke();
  } else if (geom.type === "metatron") {
    // Hexagonal geometry with nested nodes
    const nodes = [{ x: cx, y: cy }];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      nodes.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
      nodes.push({ x: cx + r*0.5 * Math.cos(angle), y: cy + r*0.5 * Math.sin(angle) });
    }
    ctx.beginPath();
    // Connect every node to every node
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
      }
    }
    ctx.stroke();
  } else {
    // Simple custom golden circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.stroke();
  }
  ctx.restore();
}
