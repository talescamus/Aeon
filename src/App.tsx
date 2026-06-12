import React, { useState, useEffect, useRef, useMemo } from "react";
import { jsPDF } from "jspdf";
import { 
  BookOpen, 
  Compass, 
  ShieldAlert, 
  Skull, 
  Flame, 
  Sparkles, 
  Sword, 
  Search, 
  MessageSquare, 
  Calendar, 
  User, 
  GraduationCap, 
  Award, 
  FileText, 
  Check, 
  Clock, 
  Plus, 
  X, 
  ChevronRight, 
  Send, 
  Cpu, 
  Download, 
  Video, 
  Globe, 
  Lock, 
  Settings, 
  Eye, 
  BookMarked, 
  NotebookPen, 
  Terminal, 
  Network, 
  Filter,
  CheckCircle2,
  RefreshCw,
  Heart,
  Share2,
  Repeat,
  Bookmark,
  Bell,
  ExternalLink,
  Volume2,
  VolumeX,
  Phone,
  Hash,
  BookCheck,
  CheckCircle,
  FileCheck,
  Map,
  BadgeAlert,
  ArrowRight,
  Layers
} from "lucide-react";
import IntegrationsHub from "./components/IntegrationsHub";
import InnerTreeOfLife from "./components/InnerTreeOfLife";
import KnowledgeGraph from "./components/KnowledgeGraph";
import AeonOracle from "./components/AeonOracle";
import ExploreDiscoveries from "./components/ExploreDiscoveries";
import KnowledgeSync from "./components/KnowledgeSync";
import GrimoireEngine from "./components/Grimoire/GrimoireEngine";
// @ts-ignore
import { List } from "react-window";
const VList = List as any;
import { generateMegaBooks, generateMegaPapers } from "./utils/dataGenerator";
import { AcademicStatus, Member, Circle, LibraryBook, ResearchPaper, AcademicEvent, PrivateNote, AgoraPost, PrivateChat, NotificationItem, AcademicCertificate, KnowledgeMapNode, KnowledgeMapEdge, CloudFunctionCircleResponse } from "./types";
import { 
  ACADEMIC_REQUIREMENTS, 
  INITIAL_BOOKS, 
  INITIAL_CIRCLES, 
  INITIAL_RESEARCH, 
  GENERAL_CONFERENCES,
  INITIAL_AGORA_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_CHATS
} from "./data";


// ----- Tab & State Type Aliases -----
type TabId = "dashboard" | "agora" | "library" | "circles" | "research" | "inbox" | "annotations" | "map" | "conferences" | "oracle" | "profile" | "integrations" | "grimoire";
type AgoraSubTab = "descobertas" | "biblioteca" | "pesquisas" | "debates" | "conferencias" | "manuscritos" | "ai_rec";
type MeetType = "Zoom" | "Google Meet" | "Teams";
// ------------------------------------

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginEmail, setLoginEmail] = useState("tales.dbsk12@gmail.com");
  const [initiateName, setInitiateName] = useState("Frater Tales de Alexandria");
  const [authError, setAuthError] = useState("");

  // Base Academic States
  const [member, setMember] = useState<Member>({
    id: "AEON-777-IX",
    initiaticName: "Frater Tales de Alexandria",
    avatarUrl: "",
    ingressDate: "11 de Junho de 2024",
    status: AcademicStatus.PESQUISADOR,
    circles: ["cabala", "hermetismo", "rosacruz"],
    personalLibrary: ["h1", "c1", "h2", "a1"],
    academicHistory: [
      { title: "Selo de Aspirante Outorgado", date: "2024-06-11", description: "O candidato transpôs o portal de Alexandria" },
      { title: "Elevação a Iniciado", date: "2025-01-15", description: "Consolação e defesa ritual dos axiomas cabalísticos" },
      { title: "Pesquisador Credenciado", date: "2026-06-11", description: "Consagração acadêmica de investigações sincréticas" }
    ],
    certifications: ["Pesquisador da Cabala", "Curador da Biblioteca", "Arquivista AEON"],
    annotations: []
  });

  // Global Context state loaders
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [circles, setCircles] = useState<Circle[]>(INITIAL_CIRCLES);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>(INITIAL_RESEARCH);
  const [conferences, setConferences] = useState<AcademicEvent[]>(GENERAL_CONFERENCES);

  // Scalable enterprise-grade database state (toggles 100,000 entities)
  const [dataScale, setDataScale] = useState<"standard" | "mega">("standard");

  const activeBooksList = useMemo(() => {
    if (dataScale === "mega") {
      return generateMegaBooks(100000);
    }
    return books;
  }, [dataScale, books]);

  const activePapersList = useMemo(() => {
    if (dataScale === "mega") {
      return generateMegaPapers(100000);
    }
    return researchPapers;
  }, [dataScale, researchPapers]);

  // Track responsive column width for virtualized grid
  const [cols, setCols] = useState(typeof window !== "undefined" ? (window.innerWidth >= 640 ? 2 : 1) : 2);
  useEffect(() => {
    const handleResize = () => {
      setCols(window.innerWidth >= 640 ? 2 : 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "agora" | "library" | "circles" | "research" | "inbox" | "annotations" | "map" | "conferences" | "oracle" | "profile" | "integrations" | "grimoire">("dashboard");

  // Phase 2 Advanced States
  const [agoraPosts, setAgoraPosts] = useState<AgoraPost[]>(INITIAL_AGORA_POSTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [chats, setChats] = useState<PrivateChat[]>(INITIAL_CHATS);
  const [certificates, setCertificates] = useState<AcademicCertificate[]>(INITIAL_CERTIFICATES);
  const [activeChatId, setActiveChatId] = useState<string>("chat-aurelius");
  const [chatInputText, setChatInputText] = useState("");
  const [showMeetCalendar, setShowMeetCalendar] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(2);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Mobile menu control state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Agora post text states
  const [newPostText, setNewPostText] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [newPostBookId, setNewPostBookId] = useState("");
  const [newPostCircleId, setNewPostCircleId] = useState("");
  const [selectedAgoraTag, setSelectedAgoraTag] = useState<string>("Todos");

  // Simulated Voice/Video Call states
  const [activeCallContact, setActiveCallContact] = useState<string | null>(null);
  const [isCallVideo, setIsCallVideo] = useState(false);
  const [callStatus, setCallStatus] = useState<"dialing" | "connected" | "ended" | null>(null);
  const [isCallMuted, setIsCallMuted] = useState(false);

  // Digital cert viewer
  const [selectedCert, setSelectedCert] = useState<AcademicCertificate | null>(null);

  // Phase 3 Navigation Sub-tabs and mode sintonizers
  const [dashboardMode, setDashboardMode] = useState<"executive" | "tree">("executive");
  const [oracleMode, setOracleMode] = useState<"terminal" | "planner">("terminal");
  const [agoraFeedSubTab, setAgoraFeedSubTab] = useState<"descobertas" | "biblioteca" | "pesquisas" | "debates" | "conferencias" | "manuscritos" | "ai_rec">("debates");


  // Selection states
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(INITIAL_BOOKS[0]);
  const [selectedCircle, setSelectedCircle] = useState<Circle>(INITIAL_CIRCLES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [libraryFilter, setLibraryFilter] = useState("Todos");

  // AI Assistant States (Sophia)
  const [sophiaChat, setSophiaChat] = useState<{ sender: "sophia" | "member"; text: string; time: string }[]>([
    { sender: "sophia", text: "Saudações, Frater Tales de Alexandria. Sinto a sintonia do seu selo de Pesquisador nos egrégoras de AEON. Deseja decifrar as passagens do Corpus Hermeticum, consultar ementas da Gematria medieval ou planejar suas teses hoje?", time: "08:58" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSophiaTyping, setIsSophiaTyping] = useState(false);

  // AI Knowledge Map States
  const [mapTopic, setMapTopic] = useState("Grande Obra Alquímica");
  const [knowledgeMap, setKnowledgeMap] = useState<{ nodes: KnowledgeMapNode[]; edges: KnowledgeMapEdge[]; description: string } | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [selectedMapNode, setSelectedMapNode] = useState<KnowledgeMapNode | null>(null);

  // AI Scholar Commentary State
  const [aiCommentary, setAiCommentary] = useState("");
  const [isCommentaryLoading, setIsCommentaryLoading] = useState(false);
  const [selectedTextSnippet, setSelectedTextSnippet] = useState("");

  // Circle Chat interaction State
  const [circleChatInput, setCircleChatInput] = useState("");

  // New Forum Topic State
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  // New Research State
  const [newResearchTitle, setNewResearchTitle] = useState("");
  const [newResearchAbstract, setNewResearchAbstract] = useState("");
  const [newResearchContent, setNewResearchContent] = useState("");
  const [newResearchCategory, setNewResearchCategory] = useState("Hermetismo");
  const [isEvaluatingPaper, setIsEvaluatingPaper] = useState(false);
  const [focusedResearch, setFocusedResearch] = useState<ResearchPaper | null>(INITIAL_RESEARCH[0]);

  // Meeting Maker State
  const [showMeetForm, setShowMeetForm] = useState(false);
  const [meetTitle, setMeetTitle] = useState("");
  const [meetTime, setMeetTime] = useState("20:00");
  const [meetDate, setMeetDate] = useState("2026-06-15");
  const [meetType, setMeetType] = useState<"Zoom" | "Google Meet" | "Teams">("Zoom");
  const [meetCircleId, setMeetCircleId] = useState("cabala");

  // Private notes editor inside profile state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteTagsStr, setNoteTagsStr] = useState("");

  // Create Circle & Google Classroom Cloud Function state triggers
  const [showCreateCircleModal, setShowCreateCircleModal] = useState(false);
  const [newCircleFormName, setNewCircleFormName] = useState("");
  const [newCircleFormDesc, setNewCircleFormDesc] = useState("");
  const [newCircleMentorName, setNewCircleMentorName] = useState("Frater Tales de Alexandria");
  const [newCircleMentorEmail, setNewCircleMentorEmail] = useState("tales.dbsk12@gmail.com");
  const [selectedCircleBgColor, setSelectedCircleBgColor] = useState("#C8A96B");
  const [selectedStudentsList, setSelectedStudentsList] = useState<Array<{ name: string, email: string }>>([
    { name: "Irmão Samuel", email: "samuel.zohar@gmail.com" },
    { name: "Irmã Deborah", email: "deborah.hod@gmail.com" }
  ]);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [createdCircleResultLogs, setCreatedCircleResultLogs] = useState<string[]>([]);
  const [showFunctionLogsModal, setShowFunctionLogsModal] = useState(false);
  const [cloudFunctionResponse, setCloudFunctionResponse] = useState<CloudFunctionCircleResponse | null>(null);

  const handleToggleStudentInList = (memberItem: { name: string, email: string }) => {
    setSelectedStudentsList(prev => {
      const exists = prev.some(m => m.email === memberItem.email);
      if (exists) {
        return prev.filter(m => m.email !== memberItem.email);
      } else {
        return [...prev, memberItem];
      }
    });
  };

  const handleCreateNewCircleWithClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleFormName.trim()) {
      triggerNotification("O nome do Círculo Iniciático é de outorga sagrada obrigatória.");
      return;
    }

    setIsCreatingCircle(true);
    setCreatedCircleResultLogs(["[Iniciando...] Estabelecendo conexão hermética com a malha GCP Cloud Functions..."]);
    setShowFunctionLogsModal(true);

    try {
      const res = await fetch("/api/cloud-functions/on-create-circle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer tales-active-oauth-token-alexandria"
        },
        body: JSON.stringify({
          name: newCircleFormName,
          description: newCircleFormDesc,
          mentor: {
            name: newCircleMentorName,
            email: newCircleMentorEmail
          },
          members: selectedStudentsList
        })
      });

      const data = await res.json();
      if (data.success) {
        // Appending logs step by step with typewriter feel
        let index = 0;
        setCreatedCircleResultLogs([data.logs[0]]);
        const interval = setInterval(() => {
          index++;
          if (index < data.logs.length) {
            setCreatedCircleResultLogs(prev => [...prev, data.logs[index]]);
          } else {
            clearInterval(interval);
            setIsCreatingCircle(false);
            setCloudFunctionResponse(data);
          }
        }, 300);

        // Add the Circle to local State with custom color presets
        const r = Math.floor(Math.random() * 50) + 180;
        const g = Math.floor(Math.random() * 50) + 150;
        const b = Math.floor(Math.random() * 50) + 100;
        
        const newCircle: Circle = {
          id: "circ_" + Math.random().toString(36).substring(2, 9),
          name: newCircleFormName,
          icon: "Hexagon",
          description: newCircleFormDesc || "Círculo centrado nos mistérios da autotransmutação mental e cósmica.",
          color: selectedCircleBgColor,
          bgTexture: `rgba(${r}, ${g}, ${b}, 0.05)`,
          studies: ["Doutrinas de Cátedra", "Teses e Exegese Prática", "Roster Classroom Sincró"],
          libraryIds: ["h1"],
          forum: [
            {
              id: "welcome-forum-post",
              author: "Soror Sophia de Alexandria",
              authorStatus: AcademicStatus.INICIADO,
              title: "Tópico de Alinhamento: Conexão com Google Classroom Ativada",
              content: `Parabéns aos Fratres e Sorors por inaugurarem o ${newCircleFormName}. Nossas investigações esotéricas síncronas estão integradas ao Classroom de forma remota. Encorajamos o mentor ${newCircleMentorName} a introduzir as ementas e leituras rituais do círculo.`,
              date: new Date().toISOString().split("T")[0],
              replies: []
            }
          ],
          events: [],
          chat: [
            {
              id: "welcome-ch",
              sender: "Soror Sophia de Alexandria",
              senderStatus: AcademicStatus.INICIADO,
              content: `A Cátedra virtual foi instanciada! Código de inscrição Classroom correspondente: ${data.enrollmentCode || "cab991"}.`,
              timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
            }
          ],
          files: []
        };

        setCircles(prev => [...prev, newCircle]);
        setSelectedCircle(newCircle);
        triggerNotification(`Sucesso! Círculo '${newCircleFormName}' criado e Classroom instanciado!`);
        
        // Reset states
        setNewCircleFormName("");
        setNewCircleFormDesc("");
        setShowCreateCircleModal(false);
      } else {
        setIsCreatingCircle(false);
        triggerNotification("Falha no provisionamento: " + (data.error || "Erro desconhecido"));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setIsCreatingCircle(false);
      triggerNotification("Falha ao invocar a Cloud Function: " + msg);
      setCreatedCircleResultLogs(prev => [...prev, `[ERRO] Detalhes da exceção: ${msg}`]);
    }
  };

  // Global notifications list
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Status explanation focus state
  const [focusedStatus, setFocusedStatus] = useState<AcademicStatus>(AcademicStatus.PESQUISADOR);

  // Live Conference Room simulator
  const [activeConferenceRoom, setActiveConferenceRoom] = useState<AcademicEvent | null>(null);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Automatic scrolling for chat helper
  const sophiaEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    sophiaEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sophiaChat]);

  // Temporary message alert helper
  const triggerNotification = (msg: string) => {
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 4000);
  };

  // Export approved monograph as a beautifully styled institutional AEON PDF Codex
  const handleExportAsCodice = (paper: ResearchPaper) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // institutional color space matching AEON
      const GOLD_ACCENT = [141, 110, 61]; // #8D6E3D
      const GOLD_LIGHT = [200, 169, 107]; // #C8A96B
      const STONE_BLACK = [5, 5, 5];
      const CHARCOAL = [30, 30, 30];

      let currentPage = 1;

      const drawPageDecoration = (docInstance: jsPDF, isFirstPage: boolean) => {
        // Soft fine parchment tint
        docInstance.setFillColor(252, 251, 248);
        docInstance.rect(0, 0, 210, 297, "F");

        // Double border frames
        docInstance.setDrawColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
        docInstance.setLineWidth(0.8);
        docInstance.rect(10, 10, 190, 277);

        docInstance.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
        docInstance.setLineWidth(0.3);
        docInstance.rect(12, 12, 186, 273);

        // Corner ritual seals (geometric marks)
        const corners = [
          [12, 12], [198, 12], [12, 285], [198, 285]
        ];
        docInstance.setDrawColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
        docInstance.setLineWidth(0.5);
        corners.forEach(([cx, cy]) => {
          docInstance.line(cx - 3, cy, cx + 3, cy);
          docInstance.line(cx, cy - 3, cx, cy + 3);
        });

        docInstance.setFont("times", "normal");
        if (isFirstPage) {
          // Central logo emblem shield
          docInstance.setDrawColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
          docInstance.setLineWidth(0.4);
          docInstance.ellipse(105, 22, 6, 6);
          
          docInstance.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
          docInstance.setFont("times", "bold");
          docInstance.setFontSize(10);
          docInstance.text("AEON", 105, 23.5, { align: "center" });

          // Header captions
          docInstance.setFont("times", "bold");
          docInstance.setFontSize(8);
          docInstance.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
          docInstance.text("ECCLESIA DE ALEXANDRIA • CODEX ACADEMICUS", 105, 33, { align: "center" });
          docInstance.setFont("times", "italic");
          docInstance.setFontSize(6);
          docInstance.setTextColor(115, 115, 115);
          docInstance.text('"QUOD EST SUPERIUS EST SICUT QUOD EST INFERIUS"', 105, 36, { align: "center" });

          // Separator line
          docInstance.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
          docInstance.setLineWidth(0.4);
          docInstance.line(20, 39, 190, 39);
        } else {
          // Compact generic page running header
          docInstance.setFont("times", "italic");
          docInstance.setFontSize(8);
          docInstance.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
          docInstance.text("CÓDICE INTERNO AEON: " + paper.title.toUpperCase(), 20, 18);
          docInstance.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
          docInstance.setLineWidth(0.2);
          docInstance.line(20, 20, 190, 20);
        }

        // Running footers
        docInstance.setFont("times", "normal");
        docInstance.setFontSize(8);
        docInstance.setTextColor(120, 120, 120);
        docInstance.text(`Página ${currentPage}`, 105, 281, { align: "center" });
        
        docInstance.setFont("courier", "normal");
        docInstance.setFontSize(6);
        docInstance.text(`SEAL-ID: ${paper.id}-${paper.version}/IX-AEON`, 20, 281);
        docInstance.text(`DATA: ${paper.date}`, 190, 281, { align: "right" });
      };

      // Page 1 Initialization
      drawPageDecoration(doc, true);

      let y = 48;

      // Class Title
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
      doc.text("MONOGRAFIA ACADÊMICA CREDENCIADA", 105, y, { align: "center" });
      y += 8;

      // Core Monography Title text lines
      doc.setFont("times", "bold");
      doc.setFontSize(15);
      doc.setTextColor(STONE_BLACK[0], STONE_BLACK[1], STONE_BLACK[2]);
      const titleLines = doc.splitTextToSize(paper.title.toUpperCase(), 160);
      titleLines.forEach((tLine: string) => {
        doc.text(tLine, 105, y, { align: "center" });
        y += 6.5;
      });
      y += 2;

      // Decorative divider
      doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
      doc.setLineWidth(0.2);
      doc.line(70, y, 140, y);
      y += 6;

      // Metadata elegant cream block
      doc.setFillColor(248, 246, 240);
      doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
      doc.setLineWidth(0.2);
      doc.rect(20, y, 170, 24, "FD");

      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);

      doc.setFont("times", "bold");
      doc.text("AUTOR:", 24, y + 6);
      doc.setFont("times", "normal");
      doc.text(paper.author.toUpperCase(), 45, y + 6);

      doc.setFont("times", "bold");
      doc.text("GRAU ACADÊMICO:", 24, y + 11);
      doc.setFont("times", "normal");
      doc.text(paper.authorStatus.toUpperCase(), 61, y + 11);

      doc.setFont("times", "bold");
      doc.text("EGRÉGORA/CÍRCULO:", 24, y + 16);
      doc.setFont("times", "normal");
      doc.text((paper.circleId || "Geral").toUpperCase(), 64, y + 16);

      doc.setFont("times", "bold");
      doc.text("REGISTRO:", 115, y + 6);
      doc.setFont("times", "normal");
      doc.text(paper.id, 137, y + 6);

      doc.setFont("times", "bold");
      doc.text("VERSÃO ARQUIVO:", 115, y + 11);
      doc.setFont("times", "normal");
      doc.text(`${paper.version}.0 (Estável)`, 149, y + 11);

      doc.setFont("times", "bold");
      doc.text("CHANCELA DE IA:", 115, y + 16);
      doc.setFont("times", "bold");
      doc.setTextColor(22, 101, 52); // Sábio green badge
      doc.text("REVISADO & APROVADO", 146, y + 16);

      y += 31;

      // Section 1: Abstract
      doc.setFont("times", "bolditalic");
      doc.setFontSize(11);
      doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
      doc.text("I. SUMÁRIO DA INVESTIGAÇÃO (ABSTRACT)", 20, y);
      y += 5.5;

      doc.setFont("times", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(70, 70, 70);
      const abstractLines = doc.splitTextToSize(`"${paper.abstract}"`, 170);
      abstractLines.forEach((aLine: string) => {
        doc.text(aLine, 20, y);
        y += 5;
      });
      y += 6;

      // Section 2: Full Content
      doc.setFont("times", "bold");
      doc.setFontSize(11);
      doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
      doc.text("II. SUBSTÂNCIA DA TESE FILOSÓFICA", 20, y);
      y += 6;

      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);

      const paragraphs = paper.content.split("\n\n");
      paragraphs.forEach((paragraph) => {
        const pLines = doc.splitTextToSize(paragraph.trim(), 170);
        pLines.forEach((pLine: string) => {
          if (y > 265) {
            doc.addPage();
            currentPage++;
            drawPageDecoration(doc, false);
            y = 30;
          }
          doc.text(pLine, 20, y);
          y += 5;
        });
        y += 3.5;
      });

      y += 3;

      // Section 3: AI Peer Review / Sophia Commentary
      if (paper.reviews && paper.reviews.length > 0) {
        if (y > 210) {
          doc.addPage();
          currentPage++;
          drawPageDecoration(doc, false);
          y = 30;
        } else {
          y += 5;
        }

        doc.setDrawColor(GOLD_LIGHT[0], GOLD_LIGHT[1], GOLD_LIGHT[2]);
        doc.setLineWidth(0.4);
        doc.line(20, y, 190, y);
        y += 6;

        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 118, 110); // Sophia unique color
        doc.text("III. PARECER HERMENÊUTICO DA SÁBIA DE IA SOPHIA", 20, y);
        y += 6;

        doc.setFillColor(242, 248, 248);
        doc.setDrawColor(15, 118, 110);
        doc.setLineWidth(0.25);
        
        const reviewLines = doc.splitTextToSize(paper.reviews[0].comment, 160);
        const reviewHeight = (reviewLines.length * 4.8) + 12;
        doc.rect(20, y, 170, reviewHeight, "FD");

        doc.setFont("times", "italic");
        doc.setFontSize(9);
        doc.setTextColor(45, 45, 45);

        let ry = y + 6;
        reviewLines.forEach((rLine: string) => {
          doc.text(rLine, 25, ry);
          ry += 4.8;
        });

        // Stamp
        const stampY = y + reviewHeight - 12;
        const stampX = 162;
        
        doc.setDrawColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
        doc.setLineWidth(0.3);
        doc.circle(stampX, stampY, 9);
        doc.circle(stampX, stampY, 8.2);

        doc.setFont("times", "bold");
        doc.setFontSize(5);
        doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
        doc.text("Æ ALEXANDRIA", stampX, stampY - 3.5, { align: "center" });

        doc.setFont("times", "bold");
        doc.setFontSize(7);
        doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
        doc.text("SOPHIA AI", stampX, stampY + 0.5, { align: "center" });

        doc.setFont("times", "normal");
        doc.setFontSize(4);
        doc.text("REVISADO & CHANCELADO", stampX, stampY + 4, { align: "center" });
        doc.text("* AD AEON *", stampX, stampY + 6, { align: "center" });

        y += reviewHeight + 8;
      }

      // Final signature blocks
      if (y > 240) {
        doc.addPage();
        currentPage++;
        drawPageDecoration(doc, false);
        y = 30;
      }

      y += 10;
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.2);
      
      // Left sign
      doc.line(30, y + 15, 90, y + 15);
      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Membro Investigador", 60, y + 19, { align: "center" });
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
      doc.text(paper.author, 60, y + 13, { align: "center" });

      // Right sign
      doc.line(120, y + 15, 180, y + 15);
      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Oráculo da Cátedra AEON", 150, y + 19, { align: "center" });
      doc.setFont("times", "bolditalic");
      doc.setFontSize(9);
      doc.setTextColor(GOLD_ACCENT[0], GOLD_ACCENT[1], GOLD_ACCENT[2]);
      doc.text("Sophia AI Hermeneutics", 150, y + 13, { align: "center" });

      // Build safe clean name
      const cleanLabel = paper.title.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30);
      doc.save(`aeon_codex_${paper.id}_${cleanLabel}.pdf`);
      triggerNotification(`Sucesso! O Códice de Investigação de "${paper.title}" foi exportado de modo seguro.`);
    } catch (err: unknown) {
      console.error(err);
      triggerNotification("Ocorreu um erro material durante a compilação do Códice científico.");
    }
  };

  // Phase 2 Social Agora interaction handlers
  const handleLikePost = (postId: string) => {
    setAgoraPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = !p.likedByMe;
        return {
          ...p,
          likedByMe: liked,
          likes: liked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
    triggerNotification("Pulsação harmônica registrada nesta reflexão.");
  };

  const handleRepostPost = (postId: string) => {
    setAgoraPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const reposted = !p.repostedByMe;
        return {
          ...p,
          repostedByMe: reposted,
          reposts: reposted ? p.reposts + 1 : p.reposts - 1
        };
      }
      return p;
    }));
    triggerNotification("Reflexão reverberada nos seus anais sociais.");
  };

  const handleCommentPost = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `comment-${Date.now()}`,
      author: member.initiaticName,
      authorStatus: member.status,
      content: commentText,
      date: "Agora mesmo"
    };

    setAgoraPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
    triggerNotification("Comentário selado na ágora acadêmica.");
  };

  const handleCreateAgoraPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const tagsArr = newPostTags
      ? newPostTags.split(",").map(t => t.trim().replace("#", ""))
      : ["Hermetismo"];

    const newPost: AgoraPost = {
      id: `ap-${Date.now()}`,
      author: member.initiaticName,
      authorUsername: `@${member.initiaticName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      authorStatus: member.status,
      content: newPostText,
      date: "Agora mesmo",
      likes: 0,
      likedByMe: false,
      reposts: 0,
      comments: [],
      tags: tagsArr,
      bookReferenceId: newPostBookId || undefined,
      circleId: newPostCircleId || undefined
    };

    setAgoraPosts(prev => [newPost, ...prev]);
    setNewPostText("");
    setNewPostTags("");
    setNewPostBookId("");
    setNewPostCircleId("");
    triggerNotification("Sucesso! Sua reflexão foi compartilhada na Ágora.");
  };

  // Chat messaging handles
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const myMessage = {
      id: `msg-${Date.now()}`,
      sender: "me" as const,
      content: chatInputText,
      timestamp: "Agora"
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, myMessage]
        };
      }
      return c;
    }));

    const messageToSend = chatInputText;
    setChatInputText("");

    // Simulate WebSocket response from other members
    setTimeout(() => {
      let responseText = "Saudações fraternais! Li sua indicação e me parece extremamente alinhada aos meus estudos atuais. Vamos debater isto no próximo concílio global do templo.";
      if (activeChatId === "chat-aurelius") {
        responseText = `Interessante colocação, Frater. As chaves herméticas nos ensinam que a paciência é a virtude d'ouro. Mantenha os ritmos e leia o capítulo II do Corpus Hermeticum.`;
      } else if (activeChatId === "chat-deborah") {
        responseText = `Maravilha. Baixei o arquivo que você recomendou na biblioteca. A geometria hermética dos pentáculos possui de fato vibrações sincréticas formidáveis!`;
      }

      const companionResponse = {
        id: `msg-resp-${Date.now()}`,
        sender: "them" as const,
        content: responseText,
        timestamp: "Agora há pouco"
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, companionResponse]
          };
        }
        return c;
      }));

      // Trigger user notification check
      const companion = activeChatId === "chat-aurelius" ? "Mestre Aurelius" : "Irmã Deborah";
      triggerNotification(`Nova mensagem recebida de ${companion}`);

      // Append notification
      const newNotif = {
        id: `not-chat-${Date.now()}`,
        type: "mention" as const,
        title: `Nova mensagem de ${companion}`,
        description: responseText.slice(0, 80) + "...",
        date: "Agora mesmo",
        read: false,
        senderName: companion
      };
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadNotifsCount(n => n + 1);
    }, 1800);
  };

  const handleStartSimulatedCall = (recipientName: string, isVideo: boolean) => {
    setActiveCallContact(recipientName);
    setIsCallVideo(isVideo);
    setCallStatus("dialing");
    
    setTimeout(() => {
      setCallStatus("connected");
      triggerNotification(`Chamada síncrona criptografada de voz via WebSockets estabelecida com ${recipientName}.`);
    }, 2000);
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      setActiveCallContact(null);
      setCallStatus(null);
    }, 1000);
    triggerNotification("Conexão egrégora encerrada com segurança.");
  };

  // RSVP handles
  const handleRSVPEvent = (eventId: string) => {
    setConferences(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const hasCount = ev.attendanceCount || 0;
        const attending = ev.attendingByMe;
        return {
          ...ev,
          attendingByMe: !attending,
          attendanceCount: attending ? hasCount - 1 : hasCount + 1
        };
      }
      return ev;
    }));
    triggerNotification("Presença no Concílio Global atualizada com sucesso.");
  };

  // Generate verifiable digital credentials
  const handleGenerateAwardCertificate = (title: string, type: "Conclusão de Estudos" | "Serviço Editorial" | "Liderança de Círculo" | "Tese Laureada", circleName?: string) => {
    const newCert: AcademicCertificate = {
      id: `cert-gen-${Date.now().toString().slice(-4)}`,
      title,
      recipientName: member.initiaticName,
      type,
      issueDate: "Hoje mesmo",
      circleName,
      verifiableHash: `SHA-256/VERIFIED-AEON-${Math.random().toString(16).slice(2,10).toUpperCase()}-SECURE`,
      signers: ["Oráculo Autônomo Sophia AI", "Conselho Superior AEON de Alexandria"]
    };

    setCertificates(prev => [newCert, ...prev]);
    // Save to historical records
    setMember(prev => ({
      ...prev,
      academicHistory: [
        ...prev.academicHistory,
        {
          title: `Chancela de Certificado: ${title}`,
          date: new Date().toISOString().split('T')[0],
          description: `Outorgada distinção institucional de nível ${type}`
        }
      ]
    }));
    triggerNotification(`Distinção honorífica outorgada: "${title}" foi chancelada e guardada no seu Perfil.`);
  };

  // Perform login action
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Assinatura ritualesca de autenticação é obrigatória.");
      return;
    }
    // Update active member state names based on inputs
    setMember(prev => ({
      ...prev,
      initiaticName: initiateName || "Frater Tales de Alexandria"
    }));
    setIsLoggedIn(true);
    triggerNotification(`Portal aberto. Bem-vindo, ${initiateName || "Frater Tales de Alexandria"}.`);
  };

  // Connect to Sophia AI Chat API
  const handleSophiaSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const message = userInput;
    setUserInput("");
    
    // Add user message to local state
    const updatedChat = [...sophiaChat, { sender: "member" as const, text: message, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }];
    setSophiaChat(updatedChat);
    setIsSophiaTyping(true);

    try {
      const response = await fetch("/api/chat-sophia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: updatedChat })
      });
      const data = await response.json();
      setSophiaChat(prev => [...prev, { sender: "sophia", text: data.text || "Os mistérios continuam em silêncio.", time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setSophiaChat(prev => [...prev, { sender: "sophia", text: "Meus egrégoras foram temporariamente obscurecidos. Todavia, medite sobre os segredos herméticos e sintonize seu foco.", time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]);
    } finally {
      setIsSophiaTyping(false);
    }
  };

  // Interpret / summarize selected book fragment via Sophia AI
  const handleInterpretFragment = async (textSnippet?: string) => {
    const fragmentText = textSnippet || selectedTextSnippet;
    if (!fragmentText || !selectedBook) {
      triggerNotification("Selecione um fragmento de texto no tomo primeiro para traduzir ou interpretar.");
      return;
    }

    setIsCommentaryLoading(true);
    setAiCommentary("");

    try {
      const response = await fetch("/api/summarize-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: selectedBook.title, 
          author: selectedBook.author, 
          highlight: fragmentText 
        })
      });
      const data = await response.json();
      setAiCommentary(data.summary || "Não foi possível formular um comentário hermético para esta estrofe.");
    } catch {
      setAiCommentary("Fracasso na sintonização superior. Reintroduza o incenso da atenção e tente novamente.");
    } finally {
      setIsCommentaryLoading(false);
    }
  };

  // Submit Paper to Sophia AI evaluation (peer review tool)
  const handleEvaluatePaper = async (paperId: string) => {
    const targetPaper = researchPapers.find(p => p.id === paperId);
    if (!targetPaper) return;

    setIsEvaluatingPaper(true);
    triggerNotification("Enviando manuscrito para comissão de sábios da IA Sophia...");

    try {
      const response = await fetch("/api/evaluate-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: targetPaper.title,
          abstract: targetPaper.abstract,
          content: targetPaper.content,
          category: targetPaper.circleId || "Geral"
        })
      });
      const data = await response.json();

      // Update paper review response in state
      setResearchPapers(prev => prev.map(p => {
        if (p.id === paperId) {
          return {
            ...p,
            status: "Aprovado",
            version: p.version + 1,
            reviews: [
              ...p.reviews,
              {
                reviewer: "Sophia AI Hermeneutics",
                reviewerStatus: AcademicStatus.MESTRE,
                approved: true,
                comment: data.review || "Monografia aprovada formalmente.",
                date: new Date().toISOString().split("T")[0]
              }
            ]
          };
        }
        return p;
      }));

      // Update local focus
      const updatedPaper = researchPapers.find(p => p.id === paperId);
      if (updatedPaper) {
        setFocusedResearch({
          ...updatedPaper,
          status: "Aprovado",
          version: updatedPaper.version + 1,
          reviews: [
            ...updatedPaper.reviews,
            {
              reviewer: "Sophia AI Hermeneutics",
              reviewerStatus: AcademicStatus.MESTRE,
              approved: true,
              comment: data.review || "Monografia aprovada formalmente.",
              date: new Date().toISOString().split("T")[0]
            }
          ]
        });
      }

      // Elevate Member Academic Status dynamically if they publish an approved paper!
      if (member.status === AcademicStatus.PESQUISADOR) {
        setMember(prev => ({
          ...prev,
          status: AcademicStatus.MENTOR,
          certifications: [...prev.certifications, `Laureado de Sophia: ${targetPaper.title}`],
          academicHistory: [
            ...prev.academicHistory,
            { 
              title: "Consagração a Mentor", 
              date: new Date().toISOString().split("T")[0], 
              description: `Tese defendida eletronicamente e laureada pelo oráculo: "${targetPaper.title}"` 
            }
          ]
        }));
        triggerNotification("Consagração mística concedida: Você foi elevado a MENTOR de AEON!");
      } else {
        triggerNotification("Pesquisa devidamente revisada, indexada e chancelada para os arquivos históricos.");
      }

    } catch (err: unknown) {
      triggerNotification("Falha na comissão examinadora de IA.");
    } finally {
      setIsEvaluatingPaper(false);
    }
  };

  // Generate interactive knowledge map via Sophia AI API
  const handleGenerateKnowledgeMap = async () => {
    if (!mapTopic.trim()) return;

    setIsMapLoading(true);
    setKnowledgeMap(null);
    setSelectedMapNode(null);

    try {
      const response = await fetch("/api/generate-knowledge-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: mapTopic })
      });
      const data = await response.json();
      setKnowledgeMap(data);
    } catch {
      triggerNotification("Nuvens no plano astral impediram a geração do mapa hermético.");
    } finally {
      setIsMapLoading(false);
    }
  };

  // Write new notes inside Personal library/Notebook
  const handleAddPrivateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) {
      triggerNotification("Preencha título e substância da anotação de estudos.");
      return;
    }

    const newNote: PrivateNote = {
      id: "note_" + Math.random().toString(36).substr(2, 9),
      title: noteTitle,
      content: noteContent,
      date: new Date().toISOString().split("T")[0],
      tags: noteTagsStr ? noteTagsStr.split(",").map(t => t.trim()) : ["Geral"]
    };

    setMember(prev => ({
      ...prev,
      annotations: [newNote, ...prev.annotations]
    }));

    setNoteTitle("");
    setNoteContent("");
    setNoteTagsStr("");
    triggerNotification("Selo de anotação de estudo guardado em seu diário oculto.");
  };

  // Manage Book Personal library inclusion
  const togglePersonalBook = (bookId: string) => {
    const exists = member.personalLibrary.includes(bookId);
    setMember(prev => {
      const updatedLib = exists 
        ? prev.personalLibrary.filter(id => id !== bookId)
        : [...prev.personalLibrary, bookId];
      return { ...prev, personalLibrary: updatedLib };
    });
    triggerNotification(exists ? "Tomo removido do seu grimório portátil." : "Tomo anexado à sua biblioteca particular.");
  };

  // Send message inside Círculos Live Chat
  const handleSendCircleChatMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleChatInput.trim()) return;

    const newMsg = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      sender: member.initiaticName,
      senderStatus: member.status,
      content: circleChatInput,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };

    setCircles(prev => prev.map(c => {
      if (c.id === selectedCircle.id) {
        return {
          ...c,
          chat: [...c.chat, newMsg]
        };
      }
      return c;
    }));

    // Local state sync
    setSelectedCircle(prev => ({
      ...prev,
      chat: [...prev.chat, newMsg]
    }));

    setCircleChatInput("");

    // Simulate other initiates subtle feedback to make chat functional & alive
    setTimeout(() => {
      const answers = [
        "A harmonia desse postulado ressoa totalmente com meus diários.",
        "Solve et coagula. Excelente colocação, Frater.",
        "Vou consultar minhas traduções da Biblioteca sobre esse tema específico.",
        "Tivemos uma monografia submetida sobre isso na Cátedra ontem."
      ];
      const botMsg = {
        id: "msg_bot_" + Math.random().toString(36).substr(2, 9),
        sender: "Soror Sophia de Alexandria",
        senderStatus: AcademicStatus.INICIADO,
        content: answers[Math.floor(Math.random() * answers.length)],
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      };
      setCircles(prev => prev.map(c => {
        if (c.id === selectedCircle.id) {
          return { ...c, chat: [...c.chat, botMsg] };
        }
        return c;
      }));
      setSelectedCircle(prev => ({ ...prev, chat: [...prev.chat, botMsg] }));
    }, 1500);
  };

  // Compose new Thread/Topic in Circle Forum
  const handleCreateForumTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      triggerNotification("Título e argumento são requeridos para proclamar novo tema.");
      return;
    }

    const newTopic = {
      id: "post_" + Math.random().toString(36).substr(2, 9),
      author: member.initiaticName,
      authorStatus: member.status,
      title: newTopicTitle,
      content: newTopicContent,
      date: new Date().toISOString().split("T")[0],
      replies: []
    };

    setCircles(prev => prev.map(c => {
      if (c.id === selectedCircle.id) {
        return {
          ...c,
          forum: [newTopic, ...c.forum]
        };
      }
      return c;
    }));

    setSelectedCircle(prev => ({
      ...prev,
      forum: [newTopic, ...prev.forum]
    }));

    setNewTopicTitle("");
    setNewTopicContent("");
    setShowNewTopicForm(false);
    triggerNotification("Tese proclamada no tribunal de fóruns acadêmicos do círculo.");
  };

  // Compose new Academic Research Paper submission
  const handleAddResearchPaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResearchTitle.trim() || !newResearchAbstract.trim() || !newResearchContent.trim()) {
      triggerNotification("Preencha título, resumo e redação completa do estudo científico.");
      return;
    }

    const newPaper: ResearchPaper = {
      id: "paper_" + Math.random().toString(36).substr(2, 9),
      title: newResearchTitle,
      author: member.initiaticName,
      authorStatus: member.status,
      circleId: newResearchCategory.toLowerCase(),
      abstract: newResearchAbstract,
      content: newResearchContent,
      date: new Date().toISOString().split("T")[0],
      tags: [newResearchCategory, "Estudo Acadêmico", "Códice AEON"],
      reviews: [],
      status: "Submetido",
      version: 1
    };

    setResearchPapers(prev => [newPaper, ...prev]);
    setFocusedResearch(newPaper);

    setNewResearchTitle("");
    setNewResearchAbstract("");
    setNewResearchContent("");
    triggerNotification("Monografia adicionada à Cátedra de Pesquisas. Submeta à Sophia IA para revisão imediata.");
  };

  // Arrange & Schedule a brand new Conference/Meeting 
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetTitle.trim()) {
      triggerNotification("Título do concílio é imprenscindível.");
      return;
    }

    const platforms = {
      Zoom: "https://zoom.us/j/" + Math.floor(10000000000 + Math.random() * 90000000000),
      "Google Meet": "https://meet.google.com/" + Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 4) + "-" + Math.random().toString(36).substr(2, 3),
      Teams: "https://teams.microsoft.com/l/meetup-join/" + Math.random().toString(36).substr(2, 10)
    };

    const newMeeting: AcademicEvent = {
      id: "meet_" + Math.random().toString(36).substr(2, 9),
      title: meetTitle,
      date: meetDate,
      time: meetTime,
      circleId: meetCircleId,
      type: meetType,
      zoomUrl: meetType === "Zoom" ? platforms.Zoom : undefined,
      meetUrl: meetType === "Google Meet" ? platforms["Google Meet"] : undefined,
      teamsUrl: meetType === "Teams" ? platforms.Teams : undefined,
      attendanceCount: 1
    };

    setConferences(prev => [newMeeting, ...prev]);
    setMeetTitle("");
    setShowMeetForm(false);
    triggerNotification(`Conferência Virtual de elite agendada via ${meetType}. Notificações disparadas.`);
  };

  // Simulating downloading files from Circle's Crypt Vault
  const handleDownloadFile = (fileName: string) => {
    triggerNotification(`Decriptografando e transferindo ${fileName} através do canal ritual seguro...`);
  };

  // Filter books matching search or category
  const filteredBooks = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const isCatAll = libraryFilter === "Todos";
    return activeBooksList.filter(b => {
      const matchesSearch = !query || 
                            b.title.toLowerCase().includes(query) || 
                            b.author.toLowerCase().includes(query) ||
                            b.category.toLowerCase().includes(query);
      const matchesCat = isCatAll || b.category === libraryFilter;
      return matchesSearch && matchesCat;
    });
  }, [activeBooksList, searchQuery, libraryFilter]);

  // Filter research papers matching scale (with optional future search criteria)
  const filteredPapers = useMemo(() => {
    return activePapersList;
  }, [activePapersList]);

  // Extract static list of categories
  const categoriesList = ["Todos", "Hermetismo", "Cabala", "Rosacrucianismo", "Demonologia", "Grimórios", "Manuscritos Históricos", "Angelologia", "Alquimia", "Teosofia", "Gnosticismo"];

  // Authenticate render view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col items-center justify-center relative p-4 overflow-y-auto font-sans">
        {/* Ambient occult cosmic atmosphere shadows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-[#0F172A] blur-[150px] opacity-60"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] rounded-full bg-[#8D6E3D] blur-[180px] opacity-20"></div>
        </div>

        {/* Dynamic Glowing Aureola Seal */}
        <div className="relative z-10 w-full max-w-lg glow-gold text-center py-12 px-8 rounded-3xl border border-[#C8A96B]/20 bg-[#0a0a0a]/90 backdrop-blur-3xl animate-fade-in">
          
          {/* Vatican-Style Sacred Geometry Design Emblem */}
          <div className="mx-auto w-20 h-20 rounded-full border-2 border-dashed border-[#C8A96B] flex items-center justify-center mb-6 ring-8 ring-[#C8A96B]/5">
            <span className="font-cinzel text-3xl text-[#C8A96B] font-bold tracking-wider">Æ</span>
          </div>

          <h1 className="font-cinzel text-4xl font-bold tracking-[0.25em] text-[#C8A96B] uppercase mb-2">AEON</h1>
          <p className="font-garamond text-xl italic text-[#F5F5F5]/60 mb-8 select-none">
            "Quod est superius est sicut quod est inferius"
          </p>

          <span className="inline-block mb-8 text-[11px] uppercase tracking-[0.3em] text-[#C8A96B] border border-[#C8A96B]/30 px-4 py-1 bg-[#C8A96B]/5 rounded-full">
            Templo Acadêmico & Biblioteca Digital Privada
          </span>

          <form onSubmit={handleLogin} className="space-y-6 text-left max-w-sm mx-auto">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C8A96B] font-semibold mb-2">
                Nome Iniciático do Membro
              </label>
              <input 
                type="text" 
                value={initiateName}
                onChange={(e) => setInitiateName(e.target.value)}
                placeholder="Ex: Frater Lux de Alexandria"
                className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg py-3 px-4 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] placeholder-stone-700 transition-all font-mono-aeon"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C8A96B] font-semibold mb-2">
                E-mail Arquivado na Ordem
              </label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Exestudios@aeon.org"
                className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg py-3 px-4 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] placeholder-stone-700 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#C8A96B] font-semibold mb-2">
                Assinatura Digital de Acesso (Passcode)
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg py-3 px-4 pl-10 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] placeholder-stone-700 transition-all font-mono-aeon"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#C8A96B]/40" />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-mono-aeon leading-relaxed mt-2 bg-red-950/40 p-2 border border-red-900/30 rounded">
                ⚠️ {authError}
              </p>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-[#8D6E3D] via-[#C8A96B] to-[#8D6E3D] text-[#050505] font-cinzel font-bold text-xs uppercase tracking-[0.25em] rounded-lg hover:from-[#F5F5F5] hover:to-[#F5F5F5] transition-all glow-gold duration-300 transform hover:-translate-y-0.5 cursor-pointer mt-4"
            >
              Invocar Portal de Alexandria
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#C8A96B]/10 text-[10px] text-[#F5F5F5]/40 leading-relaxed font-mono-aeon max-w-sm mx-auto">
            <p>CONEXÃO PROTEGIDA POR CRIPTOGRAFIA DE SELO DUPLO.</p>
            <p className="mt-1 text-[#C8A96B]/60">ACESSO EXCLUSIVO A PESQUISADORES E CURADORES CHANCELADOS AD-AEON.</p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="h-screen bg-[#050505] text-[#F5F5F5] font-sans flex overflow-hidden relative select-none">
      {/* Background Atmosphere and glowing shadows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-[#0F172A] blur-[150px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-[#8D6E3D] blur-[150px] opacity-15"></div>
      </div>

      {/* Global state notification badge pop-up */}
      {activeAlert && (
        <div className="fixed top-6 right-6 z-50 animate-bounce max-w-sm glass-dark-strong p-4 rounded-xl border-l-4 border-l-[#C8A96B] shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#C8A96B] animate-ping"></div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#C8A96B] font-bold">Conselho AEON Sophia</p>
              <p className="text-xs font-garamond text-[#F5F5F5] italic mt-0.5">{activeAlert}</p>
            </div>
          </div>
        </div>
      )}

      {/* ARC SIDE NAV - RAIL PLATFORM BAR (HIDDEN ON MOBILE, ADAPTIVE) */}
      <nav className="hidden md:flex w-20 lg:w-24 h-full bg-[#060606]/95 backdrop-blur-2xl border-r border-[#C8A96B]/10 flex-col items-center py-6 justify-between z-20 relative flex-shrink-0">
        <div className="flex flex-col items-center w-full overflow-y-auto scrollbar-none h-[calc(100%-80px)]">
          {/* Logo Brand Emblem */}
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="w-12 h-12 border border-[#C8A96B]/40 hover:border-[#C8A96B] flex items-center justify-center mb-6 bg-[#0a0a0a] ring-4 ring-[#C8A96B]/5 transition-colors cursor-pointer group flex-shrink-0"
          >
            <span className="font-cinzel text-xl text-[#C8A96B] font-bold group-hover:scale-115 transition-transform">Æ</span>
          </button>

          {/* Navigation Items - Scrollable Column */}
          <div className="flex flex-col gap-4 w-full px-2">
            {[
              { id: "dashboard", label: "Início", icon: Compass },
              { id: "grimoire", label: "Grimório", icon: Sparkles },
              { id: "agora", label: "Ágora", icon: Hash },
              { id: "library", label: "Templo", icon: BookOpen },
              { id: "circles", label: "Círculos", icon: Globe },
              { id: "research", label: "Cátedra", icon: FileText },
              { id: "inbox", label: "Inbox", icon: MessageSquare },
              { id: "annotations", label: "Notas", icon: NotebookPen },
              { id: "map", label: "Mapa", icon: Network },
              { id: "conferences", label: "Concílios", icon: Calendar },
              { id: "oracle", label: "Sophia", icon: Cpu },
              { id: "integrations", label: "Conexões", icon: Layers },
              { id: "profile", label: "Membro", icon: User }
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabId);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group relative ${
                    isActive 
                      ? "bg-[#C8A96B]/10 text-[#C8A96B] border border-[#C8A96B]/30" 
                      : "text-[#F5F5F5]/40 hover:text-[#C8A96B] hover:bg-white/5"
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-5 h-5 mb-0.5 group-hover:scale-105 transition-transform" />
                  <span className="text-[7.5px] uppercase tracking-widest leading-none scale-90 text-center font-mono-aeon truncate w-full px-1">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/4 w-1 h-1/2 bg-[#C8A96B] rounded-l-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* User Badge Profile and settings */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-px h-4 bg-[#C8A96B]/20"></div>
          <button 
            onClick={() => setActiveTab("profile")}
            className="w-10 h-10 rounded-full border border-[#C8A96B]/30 bg-gradient-to-tr from-[#0F172A] to-[#8D6E3D] hover:border-[#C8A96B] transition-colors overflow-hidden flex items-center justify-center cursor-pointer font-cinzel text-xs text-[#C8A96B] font-bold"
          >
            {member.initiaticName ? member.initiaticName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "AE"}
          </button>
        </div>
      </nav>

      {/* PREMIUM MOBILE SLIDEOUT DRAWER / SIDEBAR (MOBILE FRIENDLY) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#020202]/80 backdrop-blur-md z-50 flex md:hidden animate-fade-in">
          <div className="w-64 h-full bg-[#070707] border-r border-[#C8A96B]/20 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border border-[#C8A96B] flex items-center justify-center bg-black">
                    <span className="font-cinzel text-[#C8A96B] font-bold">Æ</span>
                  </div>
                  <span className="font-cinzel tracking-widest text-[#C8A96B] font-bold text-sm">AEON NAVIGATOR</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 hover:bg-white/5 rounded text-[#F5F5F5]/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin">
                {[
                  { id: "dashboard", label: "Painel Início", icon: Compass },
                  { id: "grimoire", label: "Grimório Realista 3D", icon: Sparkles },
                  { id: "agora", label: "Ágora Social", icon: Hash },
                  { id: "library", label: "Templo Biblioteca", icon: BookOpen },
                  { id: "circles", label: "Círculos Sagrados", icon: Globe },
                  { id: "research", label: "Cátedra Pesquisas", icon: FileText },
                  { id: "inbox", label: "Inbox Mensagens", icon: MessageSquare },
                  { id: "annotations", label: "Anotações / Notion", icon: NotebookPen },
                  { id: "map", label: "Mapa de Conexões", icon: Network },
                  { id: "conferences", label: "Agenda Concílios", icon: Calendar },
                  { id: "oracle", label: "Oráculo Sophia AI", icon: Cpu },
                  { id: "integrations", label: "Conexões Enterprise", icon: Layers },
                  { id: "profile", label: "Perfil & Títulos", icon: User }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as TabId);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-all text-left font-mono-aeon uppercase tracking-wider text-xs ${
                        isActive 
                          ? "bg-[#C8A96B]/20 text-[#C8A96B] border border-[#C8A96B]/30" 
                          : "text-[#F5F5F5]/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#C8A96B]/10 pt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C8A96B]/20 border border-[#C8A96B]/30 flex items-center justify-center font-cinzel text-xs text-[#C8A96B]">
                TL
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono-aeon text-[#C8A96B] leading-none">Tales</p>
                <p className="text-[8px] text-[#F5F5F5]/40 mt-1 font-mono">{member.id}</p>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden z-10 w-full">
        
        {/* PREMIUM UPPER HEADER (HIGH-FIDELITY, MOBILE-FRIENDLY & NOTIFICATION WIDGET) */}
        <header className="h-20 border-b border-[#C8A96B]/10 flex items-center justify-between px-4 sm:px-6 lg:px-10 bg-[#050505]/60 backdrop-blur-md flex-shrink-0 z-30 relative w-full">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 bg-[#C8A96B]/10 rounded border border-[#C8A96B]/20 text-[#C8A96B] active:scale-95 transition-transform"
            >
              <Compass className="w-5 h-5" />
            </button>

            <h2 
              className="font-cinzel text-lg sm:text-2xl tracking-[0.25em] text-[#C8A96B] uppercase font-bold select-none cursor-pointer" 
              onClick={() => setActiveTab("dashboard")}
            >
              AEON
            </h2>
            <div className="h-5 w-[1px] bg-[#C8A96B]/20 hidden xs:block"></div>
            <span className="text-[9px] hidden sm:inline uppercase tracking-[0.18em] text-[#F5F5F5]/50 font-mono-aeon font-medium truncate">
              Egrégora Intelectual Privado
            </span>
          </div>

          {/* Quick Context Details & Alert Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Interactive Bell notification widget */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setUnreadNotifsCount(0); // Mark all as read conceptually
                }}
                className="p-2 bg-[#C8A96B]/5 hover:bg-[#C8A96B]/15 border border-[#C8A96B]/20 hover:border-[#C8A96B]/55 rounded-lg text-[#C8A96B] transition-all relative cursor-pointer"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown box */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-[#070707]/95 border border-[#C8A96B]/30 rounded-xl shadow-2xl backdrop-blur-xl p-4 z-50 animate-fade-in text-left">
                  <div className="flex items-center justify-between border-b border-[#C8A96B]/10 pb-2 mb-2">
                    <span className="text-[10px] font-mono-aeon text-[#C8A96B] font-bold uppercase tracking-wider">Central de Notificações</span>
                    <button 
                      onClick={() => setShowNotifDropdown(false)}
                      className="text-[#F5F5F5]/40 hover:text-[#C8A96B] text-[10px] uppercase font-mono"
                    >
                      fechar
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-white/30 py-4 italic font-garamond">Silêncio cósmico... Nenhuma notificação.</p>
                    ) : (
                      notifications.map(not => (
                        <div key={not.id} className={`p-2 rounded border transition-all text-xs ${not.read ? "bg-white/5 border-white/5" : "bg-[#C8A96B]/10 border-[#C8A96B]/20"}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#C8A96B] uppercase text-[9px] font-mono-aeon flex items-center gap-1">
                              • {not.title}
                            </span>
                            <span className="text-[8px] text-[#F5F5F5]/40">{not.date}</span>
                          </div>
                          <p className="text-[#F5F5F5]/80 text-[10px] leading-tight">{not.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end hidden xs:flex">
              <span className="text-[7.5px] text-[#C8A96B] uppercase tracking-widest font-mono-aeon truncate max-w-[80px]">Selo Ativo</span>
              <span className="text-[10px] font-semibold uppercase">{member.status}</span>
            </div>
            <div className="w-px h-8 bg-[#C8A96B]/20 hidden xs:block"></div>
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[7.5px] text-[#F5F5F5]/40 uppercase font-mono-aeon">Assinatura Digital</span>
              <span className="text-[10px] font-mono text-[#F5F5F5]/80 font-bold">{member.id}</span>
            </div>
          </div>
        </header>

        {/* ACTIVE SIMULATED VOICE/VIDEO CALL OVERLAY WIDGET */}
        {activeCallContact && (
          <div className="bg-[#0f172a]/90 backdrop-blur-lg border border-[#C8A96B]/30 p-4 m-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 z-40 relative animate-bounce animate-once">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
              <div>
                <p className="text-[10px] font-mono-aeon text-[#C8A96B] font-bold uppercase tracking-wider">
                  Chamada {isCallVideo ? "de Vídeo" : "de Voz"} Criptografada (E2EE)
                </p>
                <p className="text-sm font-bold text-white mt-0.5">Conexão com {activeCallContact}</p>
                <p className="text-[9px] font-mono text-emerald-400 mt-1 uppercase">SOCKET.IO STATUS: Conectado (Banda larga segura AEON)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`p-2 rounded-lg text-xs font-bold uppercase font-mono flex items-center gap-1 border transition-all ${
                  isCallMuted ? "bg-red-950/40 border-red-900 text-red-400" : "bg-white/5 border-white/10 text-white"
                }`}
              >
                {isCallMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isCallMuted ? "Silenciado" : "Falar"}
              </button>
              <button 
                onClick={handleEndCall}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-lg cursor-pointer"
              >
                Desconectar
              </button>
            </div>
          </div>
        )}


        {/* TAB WORKSPACE ROUTER */}
        <div className="flex-1 p-6 overflow-y-auto min-h-0">
          
          {/* TAB: AEON 3D GRIMOIRE */}
          {activeTab === "grimoire" && (
            <GrimoireEngine 
              books={books}
              circles={circles}
              researchPapers={researchPapers}
              setSelectedBook={setSelectedBook}
              setSelectedCircle={setSelectedCircle}
              setActiveTab={setActiveTab}
              triggerNotification={triggerNotification}
            />
          )}
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 pb-8">
              {/* Dashboard Layout Header Switches */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/60 border border-stone-900 p-4 rounded-2xl animate-fade-in">
                <div>
                  <span className="text-[9px] text-[#C8A96B] uppercase font-mono-aeon tracking-wider">Membro: {member.initiaticName}</span>
                  <h3 className="font-cinzel text-lg font-bold text-white tracking-widest mt-0.5">DASHBOARD COGNITIVO INTEGRADO</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDashboardMode("executive")}
                    className={`px-4 py-2 font-cinzel text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer ${dashboardMode === "executive" ? "bg-[#C8A96B]/15 text-[#C8A96B] border border-[#C8A96B]/30" : "text-stone-300 hover:text-white bg-black border border-stone-850"}`}
                  >
                    Painel Executivo
                  </button>
                  <button
                    onClick={() => setDashboardMode("tree")}
                    className={`px-4 py-2 font-cinzel text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer ${dashboardMode === "tree" ? "bg-[#C8A96B]/15 text-[#C8A96B] border border-[#C8A96B]/30" : "text-stone-300 hover:text-white bg-black border border-stone-850"}`}
                  >
                    Jornada Interior (Árvore da Vida)
                  </button>
                </div>
              </div>

              {dashboardMode === "tree" ? (
                <InnerTreeOfLife member={member} triggerNotification={triggerNotification} />
              ) : (
                <div className="grid grid-cols-12 gap-6 animate-fade-in">
              
              {/* Feature Hero Area - Antique Vatican Book */}
              <div className="col-span-12 lg:col-span-8 bg-[#0a0a0a] border border-[#C8A96B]/20 rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between group h-auto lg:h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-[-40px] right-[-40px] w-96 h-96 bg-[#8D6E3D] rounded-full blur-[160px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"></div>
                
                <div className="relative z-20">
                  <span className="inline-block px-3 py-1 bg-[#C8A96B]/10 border border-[#C8A96B]/30 text-[#C8A96B] text-[9px] uppercase tracking-[0.2em] rounded-full mb-4 font-mono-aeon">
                    Axioma de Destaque Místico
                  </span>
                  <h3 className="font-cinzel text-3xl lg:text-5xl font-light leading-tight mb-4 max-w-2xl text-[#F5F5F5]">
                    O Corpus Hermeticum: <br />
                    <span className="italic text-[#C8A96B] font-semibold">Traduções e Teosofia do Oriente</span>
                  </h3>
                  <p className="font-garamond text-base lg:text-lg text-[#F5F5F5]/70 max-w-xl leading-relaxed mb-6">
                    Aceda à nova edição com comentários expandidos da IA Aeon Sophia e sementes filológicas em grego alexandrino sobre o desabrochar das esferas.
                  </p>
                </div>

                <div className="relative z-20 flex flex-wrap gap-4 mt-4">
                  <button 
                    onClick={() => {
                      const book = books.find(b => b.id === "h1") || books[0];
                      setSelectedBook(book);
                      setActiveTab("library");
                    }}
                    className="px-6 py-3 bg-[#C8A96B] hover:bg-[#F5F5F5] text-[#050505] font-cinzel font-bold text-xs uppercase tracking-widest transition-colors duration-300 cursor-pointer"
                  >
                    Abrir Tomo Sagrado
                  </button>
                  <button 
                    onClick={() => {
                      setMapTopic("Criação das Sete Esferas Herméticas");
                      setActiveTab("oracle");
                      handleGenerateKnowledgeMap();
                    }}
                    className="px-6 py-3 border border-[#C8A96B]/30 bg-black/60 hover:bg-[#C8A96B]/10 text-[#C8A96B] font-cinzel font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Gerar Mapa Filosófico
                  </button>
                </div>
              </div>

              {/* Study Circles Sidebar widgets */}
              <div className="col-span-12 lg:col-span-4 bg-[#0a0a0a]/55 border border-[#C8A96B]/15 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#C8A96B] font-bold">Círculos de Estudo Activos</h4>
                    <span className="text-[10px] text-[#F5F5F5]/40 underline cursor-pointer hover:text-[#C8A96B]" onClick={() => setActiveTab("circles")}>Navegar por Todos</span>
                  </div>
                  
                  <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                    {circles.slice(0, 3).map((c) => (
                      <div 
                        key={c.id} 
                        onClick={() => {
                          setSelectedCircle(c);
                          setActiveTab("circles");
                        }}
                        className="p-3 bg-white/5 hover:bg-[#C8A96B]/5 border border-[#C8A96B]/10 hover:border-[#C8A96B]/40 rounded-xl transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#111] border border-[#C8A96B]/25 flex items-center justify-center text-[#C8A96B]">
                            ✡
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold tracking-wide text-[#F5F5F5]">{c.name}</h5>
                            <p className="text-[9px] text-[#F5F5F5]/40 uppercase tracking-wider">{c.studies.length} Linhas de Investigação</p>
                          </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-[#C8A96B]/50" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#C8A96B]/10">
                  <div className="bg-[#C8A96B]/5 border border-dashed border-[#C8A96B]/25 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-mono-aeon text-[#C8A96B] uppercase font-bold tracking-widest">Próxima Sessão Virtual</span>
                      <span className="text-[9px] bg-red-950/80 border border-red-900/50 text-red-200 px-2 py-0.5 rounded-full font-mono-aeon scale-90">LIVE AD-AEON</span>
                    </div>
                    <p className="text-xs font-semibold mb-1">Zohar: A Luz Espiritual das Esferas</p>
                    <p className="text-[10px] text-[#F5F5F5]/60 font-garamond italic">Host: Mestre Aurelius • Reunião via Zoom</p>
                    <button 
                      onClick={() => {
                        const evt = conferences.find(e => e.id === "ev1") || conferences[0];
                        setActiveConferenceRoom(evt);
                      }}
                      className="w-full mt-3 py-2 bg-[#F5F5F5] text-[#050505] text-[10px] font-cinzel font-bold uppercase tracking-widest rounded transition-colors hover:bg-[#C8A96B] cursor-pointer"
                    >
                      Acessar Templo de Vídeo
                    </button>
                  </div>
                </div>
              </div>

              {/* Central Monument Stats Row */}
              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a]/50 border border-[#C8A96B]/10 rounded-2xl p-6">
                <h4 className="text-[9px] font-mono-aeon uppercase tracking-[0.25em] text-[#F5F5F5]/40 mb-2">Biblioteca Monumental</h4>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-light font-mono text-[#F5F5F5]">128.490</span>
                  <span className="text-xs text-[#C8A96B] mb-1 font-mono-aeon">Títulos Selados</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-[#151515] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#C8A96B] to-[#8D6E3D] w-[80%]"></div>
                </div>
                <p className="text-[9px] text-[#F5F5F5]/40 mt-3 font-mono-aeon">
                  +420 manuscritos originais catalogados esta semana.
                </p>
              </div>

              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a]/50 border border-[#C8A96B]/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-[9px] font-mono-aeon uppercase tracking-[0.25em] text-[#F5F5F5]/40 mb-3">Pesquisas Recentes</h4>
                  <div className="space-y-3">
                    {researchPapers.slice(0, 2).map(p => (
                      <div key={p.id} className="pb-2 border-b border-[#C8A96B]/5 last:border-none">
                        <p className="text-xs font-semibold text-[#F5F5F5] truncate hover:text-[#C8A96B] cursor-pointer" onClick={() => { setFocusedResearch(p); setActiveTab("research"); }}>
                          {p.title}
                        </p>
                        <p className="text-[9px] text-[#C8A96B] font-mono-aeon mt-0.5 uppercase tracking-wide">
                          Por: {p.author} • {p.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bloomberg Styled Terminal Assistant Node widget */}
              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a]/80 border border-[#C8A96B]/25 rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C8A96B]"></div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C8A96B] animate-pulse"></div>
                    <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#C8A96B] font-bold">Conselho Sophia</h4>
                  </div>
                  <p className="text-xs font-garamond italic text-[#F5F5F5]/80 leading-relaxed">
                    "Como Pesquisador de Alexandria, recomendo examinar o manuscrito do Zohar na aba Biblioteca para contextualizar sua tese mística no círculo da Cabala."
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Inquirir Inteligência..."
                    className="flex-1 bg-[#151515] border border-[#C8A96B]/20 rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-[#C8A96B] text-[#F5F5F5] font-mono-aeon"
                    onKeyDown={(e) => { if (e.key === 'Enter') { setActiveTab("oracle"); handleSophiaSend(e); } }}
                  />
                  <button 
                    onClick={(e) => { setActiveTab("oracle"); handleSophiaSend(e); }}
                    className="px-3 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border border-[#C8A96B]/40 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Online researchers network bar */}
              <div className="col-span-12 border-t border-[#C8A96B]/15 pt-6 flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-mono-aeon text-[#F5F5F5]/40 tracking-[0.2em]">Pesquisadores no Aethyr</span>
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-stone-800 border border-[#050505] flex items-center justify-center font-mono text-[7px] text-stone-300">FR</div>
                    <div className="w-6 h-6 rounded-full bg-stone-700 border border-[#050505] flex items-center justify-center font-mono text-[7px] text-stone-300">SR</div>
                    <div className="w-6 h-6 rounded-full bg-[#8D6E3D] border border-[#050505] flex items-center justify-center font-mono text-[7px] text-[#F5F5F5]">MD</div>
                    <div className="w-6 h-6 rounded-full bg-[#C8A96B] border border-[#050505] flex items-center justify-center font-mono text-[7px] text-[#050505] font-semibold">+14</div>
                  </div>
                  <span className="text-[10px] text-[#C8A96B] font-garamond italic">17 Mestres sintonizados no portal agora.</span>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-[#F5F5F5]/40 font-mono-aeon">
                  <span>Versão do Sistema: 4.0.12-Initiatic</span>
                  <span className="px-2.5 py-0.5 border border-[#C8A96B]/30 text-[#C8A96B] rounded bg-[#C8A96B]/5">SESSÃO CRIPTOGRAFADA</span>
                </div>
              </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 2: CENTRAL LIBRARY */}
          {activeTab === "library" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px]">
              
              {/* Sidebar with Categories and Search */}
              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a]/70 border border-[#C8A96B]/15 rounded-2xl p-6 flex flex-col gap-6">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#C8A96B] mb-1">Biblioteca Monumental</h3>
                  <p className="font-garamond text-sm italic text-[#F5F5F5]/50">Pesquisa Avançada no Selo de Alexandria</p>
                </div>

                {/* Scale Switch Controller */}
                <div className="bg-[#111]/90 border border-[#C8A96B]/30 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono-aeon text-[#C8A96B] tracking-wider font-semibold">Tamanho da Biblioteca</span>
                    <span className="text-[9px] font-mono text-stone-500 bg-stone-950 px-2 py-0.5 rounded border border-white/5">
                      {dataScale === "mega" ? "100.000 Obras" : "Padrão (Finito)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => {
                        setDataScale("standard");
                        triggerNotification("Selo Hermético Padrão reativado.");
                      }}
                      className={`py-1.5 px-2 rounded font-mono text-[9px] font-bold uppercase transition-all cursor-pointer ${
                        dataScale === "standard"
                          ? "bg-[#C8A96B] text-black border border-[#C8A96B]"
                          : "bg-transparent text-stone-400 hover:text-white border border-stone-850"
                      }`}
                    >
                      Padrão
                    </button>
                    <button
                      onClick={() => {
                        setDataScale("mega");
                        triggerNotification("Selo de Alexandria: Carregando 100.000 pergaminhos na egrégora virtualizada react-window.");
                      }}
                      className={`py-1.5 px-2 rounded font-mono text-[9px] font-semibold uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        dataScale === "mega"
                          ? "bg-[#C8A96B] text-black border border-[#C8A96B] shadow-[0_0_10px_rgba(200,169,107,0.3)] animate-pulse"
                          : "bg-transparent text-stone-400 hover:text-white border border-stone-850 hover:border-[#C8A96B]/40"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#C8A96B]" /> Alexandria (100k)
                    </button>
                  </div>
                  <p className="text-[9px] text-[#F5F5F5]/40 leading-normal italic font-garamond mt-1">
                    *Alimentado por virtualizadores de renderização react-window enterprise de alto desempenho.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar autor, tomo, heráldica..."
                    className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#C8A96B]/40" />
                </div>

                {/* Traditional Filters */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-2">Categorias Filosóficas</label>
                  <div className="flex flex-col gap-2">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setLibraryFilter(cat)}
                        className={`text-left text-xs py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                          libraryFilter === cat 
                            ? "bg-[#C8A96B]/15 text-[#C8A96B] font-semibold border-l-2 border-[#C8A96B]" 
                            : "text-[#F5F5F5]/60 hover:text-[#C8A96B] hover:bg-white/5"
                        }`}
                      >
                        <span>{cat}</span>
                        {libraryFilter === cat && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Library Checklist */}
                <div className="mt-auto pt-6 border-t border-[#C8A96B]/10">
                  <h4 className="text-[10px] uppercase font-mono-aeon text-[#C8A96B] tracking-wider mb-2">Seu Grimório Portátil</h4>
                  <div className="space-y-2">
                    {books.filter(b => member.personalLibrary.includes(b.id)).map(b => (
                      <div key={b.id} className="flex justify-between items-center bg-[#111] p-2 rounded border border-white/5 text-[11px]">
                        <span className="truncate max-w-[150px] font-semibold">{b.title}</span>
                        <button onClick={() => setSelectedBook(b)} className="text-[#C8A96B] font-mono-aeon underline hover:text-white cursor-pointer">Ler</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Books Shelf View or Book Reader */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                
                {/* Book list grid */}
                {!selectedBook ? (
                  <div className="bg-[#0a0a0a]/30 border border-[#C8A96B]/10 rounded-2xl p-6 flex-1 flex flex-col min-h-[550px]">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C8A96B]">Prateleira Geral</h4>
                      <span className="text-[9px] font-mono text-stone-500">
                        Exibindo {filteredBooks.length.toLocaleString()} tomos
                      </span>
                    </div>

                    {filteredBooks.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center py-12">
                        <p className="font-garamond text-stone-500 italic">Nenhum manuscrito encontrado sob esta assinatura ou filtro.</p>
                      </div>
                    ) : (
                      <div className="flex-1 w-full" style={{ minHeight: "480px" }}>
                        <VList
                          height={500}
                          itemCount={Math.ceil(filteredBooks.length / cols)}
                          itemSize={230}
                          width="100%"
                          style={{ overflowX: "hidden" }}
                        >
                          {(({ index, style }) => {
                            const startIndex = index * cols;
                            const rowBooks = filteredBooks.slice(startIndex, startIndex + cols);

                            return (
                              <div style={style} className="flex gap-4 pr-1 pb-4">
                                {rowBooks.map((book) => (
                                  <div 
                                    key={book.id}
                                    style={{ width: cols === 1 ? "100%" : "50%" }}
                                    className="bg-[#0c0c0c] border border-[#C8A96B]/15 hover:border-[#C8A96B]/60 p-5 rounded-xl transition-all cursor-pointer flex flex-col justify-between group h-[214px]"
                                    onClick={() => setSelectedBook(book)}
                                  >
                                    <div>
                                      <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-[9px] uppercase tracking-wider bg-[#C8A96B]/10 text-[#C8A96B] px-2 py-0.5 rounded">
                                          {book.category}
                                        </span>
                                        <span className="text-[9px] text-[#F5F5F5]/40 font-mono-aeon">{book.difficulty}</span>
                                      </div>
                                      <h5 className="text-sm font-bold font-cinzel text-[#F5F5F5] group-hover:text-[#C8A96B] transition-colors line-clamp-1">{book.title}</h5>
                                      <p className="text-xs text-[#F5F5F5]/50 italic mt-0.5">{book.author} — {book.year}</p>
                                      <p className="text-xs text-[#F5F5F5]/60 font-garamond mt-2 line-clamp-2 leading-relaxed">{book.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[#C8A96B]/10 pt-3 mt-auto">
                                      <span className="text-[10px] font-mono-aeon text-[#F5F5F5]/40">Status: {book.status}</span>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); togglePersonalBook(book.id); }}
                                        className={`text-[10px] font-mono-aeon uppercase tracking-wider px-2 py-1 rounded border cursor-pointer ${
                                          member.personalLibrary.includes(book.id) 
                                            ? "bg-[#C8A96B]/10 text-[#C8A96B] border-[#C8A96B]/30" 
                                            : "bg-transparent text-[#F5F5F5]/40 border-white/10 hover:border-[#C8A96B]"
                                        }`}
                                      >
                                        {member.personalLibrary.includes(book.id) ? "No Grimório" : "+ Anexar"}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                {rowBooks.length < cols && cols === 2 && (
                                  <div style={{ width: "50%" }} className="invisible" />
                                )}
                              </div>
                            );
                          }) as any}
                        </VList>
                      </div>
                    )}
                  </div>
                ) : (
                  // HIGH FIDELITY MANUSCRIPT READER
                  <div className="bg-[#0a0a0a] border border-[#C8A96B]/30 rounded-2xl p-6 flex-1 flex flex-col">
                    
                    {/* Header Controls */}
                    <div className="flex justify-between items-center pb-4 border-b border-[#C8A96B]/20 mb-4">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setSelectedBook(null)}
                          className="bg-[#111] hover:bg-[#222] border border-white/10 text-[#F5F5F5]/80 py-1.5 px-3 rounded text-xs transition-colors cursor-pointer"
                        >
                          ← Voltar à Prateleira
                        </button>
                        <div>
                          <h4 className="text-sm font-bold font-cinzel text-[#C8A96B] leading-none">{selectedBook.title}</h4>
                          <p className="text-[10px] text-[#F5F5F5]/40 italic mt-1 font-mono-aeon uppercase">{selectedBook.author} • {selectedBook.year}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#F5F5F5]/50 font-mono-aeon">Membro Lendo: Pag. {selectedBook.currentPage}/{selectedBook.pages}</span>
                        <button
                          onClick={() => togglePersonalBook(selectedBook.id)}
                          className="bg-[#C8A96B]/15 hover:bg-[#C8A96B] hover:text-black py-1.5 px-3 border border-[#C8A96B]/30 text-[#C8A96B] text-[10px] uppercase font-mono-aeon font-bold tracking-wider rounded cursor-pointer transition-all"
                        >
                          {member.personalLibrary.includes(selectedBook.id) ? "Grimório ✔" : "Anexar Grimório"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                      
                      {/* Parchment Display Text Content */}
                      <div className="lg:col-span-8 bg-[#fffffa]/5 border border-[#C8A96B]/20 p-6 rounded-xl overflow-y-auto max-h-[350px] lg:max-h-[500px] select-text">
                        <div className="text-[#C8A96B] text-center italic font-mono-aeon text-[11px] uppercase tracking-widest border-b border-[#C8A96B]/15 pb-3 mb-4 select-none">
                          Códice Sagrado AEON — Tradução Crítica Autorizada
                        </div>
                        
                        {/* Selected text trigger notification */}
                        <div className="bg-[#111] p-3 border border-[#C8A96B]/30 rounded-lg mb-4 text-xs select-none">
                          <p className="text-[#C8A96B] font-semibold text-[10px] uppercase tracking-wider mb-1">💡 Ferramenta de OCR & IA Sophia</p>
                          <p className="text-[#F5F5F5]/70 text-[11px] leading-relaxed">
                            Escreva no campo abaixo ou clique no botão para que a inteligência faça uma tradução erudita ou análise hermética do tomo atual.
                          </p>
                        </div>

                        <div className="font-garamond text-base lg:text-lg text-amber-100/90 leading-relaxed whitespace-pre-wrap select-text selection:bg-[#C8A96B]/40">
                          {selectedBook.fullText}
                        </div>
                      </div>

                      {/* Right Panel: AI Sophia Commentary */}
                      <div className="lg:col-span-4 bg-[#0a0a0a]/90 rounded-xl border border-[#C8A96B]/20 p-4 flex flex-col justify-between">
                        <div>
                          <h5 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 animate-pulse" />
                            Sophia Interpretadora
                          </h5>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[9px] uppercase tracking-widest text-[#F5F5F5]/40 mb-1">
                                Anotação ou Snippet de Texto
                              </label>
                              <textarea 
                                value={selectedTextSnippet}
                                onChange={(e) => setSelectedTextSnippet(e.target.value)}
                                placeholder="Cole ou digite aqui um trecho para obter hermenêutica superior e tradução arcaica analítica..."
                                className="w-full bg-[#111] border border-[#C8A96B]/20 rounded p-2 text-xs text-[#F5F5F5] h-20 focus:outline-none focus:border-[#C8A96B]"
                              />
                            </div>

                            <button
                              onClick={() => handleInterpretFragment()}
                              disabled={isCommentaryLoading}
                              className="w-full py-2 bg-[#C8A96B] hover:bg-[#F5F5F5] text-black font-cinzel text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {isCommentaryLoading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  Canalizando Sophia...
                                </>
                              ) : "Hermenêutica por IA"}
                            </button>
                          </div>
                        </div>

                        {/* Summary / Interpretation display */}
                        <div className="mt-4 flex-1 bg-[#121212] border border-[#C8A96B]/10 p-3 rounded overflow-y-auto max-h-[180px] text-xs leading-relaxed text-[#F5F5F5]/80">
                          {aiCommentary ? (
                            <div className="prose prose-invert prose-stone">
                              <p className="font-sans text-[10px] text-[#C8A96B] uppercase font-bold tracking-wider mb-2">Comentário Recebido:</p>
                              <div className="font-garamond italic text-sm">{aiCommentary}</div>
                            </div>
                          ) : (
                            <p className="text-stone-600 italic text-center pt-8">O oráculo aguarda o envio do snippet hermético.</p>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 3: STUDY CIRCLES */}
          {activeTab === "circles" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px]">
              
              {/* Left Column: Circles Navigation */}
              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a]/70 border border-[#C8A96B]/15 rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#C8A96B] mb-1">Círculos de Estudo</h3>
                  <p className="font-garamond text-sm italic text-[#F5F5F5]/50">Membros, Fórum Privado e Arquivos Lacre</p>
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                  {circles.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCircle(c)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedCircle.id === c.id 
                          ? "bg-[#C8A96B]/10 border-[#C8A96B]/40 text-[#C8A96B] glow-gold" 
                          : "bg-[#050505] border-[#C8A96B]/10 text-[#F5F5F5]/60 hover:text-white hover:border-[#C8A96B]/30"
                      }`}
                    >
                      <h5 className="text-xs font-bold uppercase tracking-wider">{c.name}</h5>
                      <p className="text-[10px] text-[#F5F5F5]/50 mt-1 line-clamp-1">{c.description}</p>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewCircleFormName("");
                    setNewCircleFormDesc("");
                    setCloudFunctionResponse(null);
                    setShowCreateCircleModal(true);
                  }}
                  className="w-full py-2.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black hover:font-bold border border-[#C8A96B]/30 hover:border-[#C8A96B] rounded-xl text-[10px] uppercase font-mono-aeon tracking-widest text-center transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4.5 h-4.5" /> Criar Círculo Iniciático
                </button>
              </div>

              {/* Right Column: Selected Circle Workspace */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                
                {/* Circle Header display */}
                <div className="bg-[#0c0c0c] border border-[#C8A96B]/20 p-6 rounded-2xl" style={{ backgroundColor: selectedCircle.bgTexture }}>
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono-aeon tracking-widest text-[#C8A96B]">Círculo Iniciático Ativo</span>
                      <h3 className="font-cinzel text-xl lg:text-2xl font-bold mt-1 text-[#F5F5F5]">{selectedCircle.name}</h3>
                      <p className="font-garamond text-base text-[#F5F5F5]/70 italic mt-1 max-w-xl">{selectedCircle.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedCircle.studies.map((std, i) => (
                        <span key={i} className="text-[8px] uppercase tracking-wider bg-black/60 border border-[#C8A96B]/20 text-[#C8A96B] px-2 py-1 rounded-full">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub Tab selection (Forum vs Vault vs Chat) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                  
                  {/* Local Forum Topics and replies */}
                  <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-4 flex flex-col justify-between max-h-[400px]">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-cinzel text-xs text-[#C8A96B] uppercase font-bold">Fórum Privado de Teses</h4>
                        <button 
                          onClick={() => setShowNewTopicForm(!showNewTopicForm)}
                          className="bg-[#C8A96B]/10 hover:bg-[#C8A96B] hover:text-black hover:font-bold border border-[#C8A96B]/30 text-xs px-2 py-1 flex items-center gap-1 transition-all cursor-pointer font-mono-aeon uppercase tracking-wider"
                        >
                          {showNewTopicForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} Nova Tese
                        </button>
                      </div>

                      {showNewTopicForm ? (
                        <form onSubmit={handleCreateForumTopic} className="space-y-3 bg-[#111] p-3 border border-[#C8A96B]/20 rounded-lg">
                          <div>
                            <input 
                              type="text" 
                              value={newTopicTitle}
                              onChange={(e) => setNewTopicTitle(e.target.value)}
                              placeholder="Título da Tese..."
                              className="w-full bg-[#151515] text-xs p-2 rounded border border-[#C8A96B]/30 focus:outline-none focus:border-[#C8A96B]"
                            />
                          </div>
                          <div>
                            <textarea 
                              value={newTopicContent}
                              onChange={(e) => setNewTopicContent(e.target.value)}
                              placeholder="Dissertação acadêmica..."
                              className="w-full bg-[#151515] text-xs p-2 rounded border border-[#C8A96B]/30 h-20 focus:outline-none focus:border-[#C8A96B]"
                            />
                          </div>
                          <button type="submit" className="w-full py-1.5 bg-[#C8A96B] text-black rounded text-[10px] font-mono-aeon uppercase tracking-widest font-bold cursor-pointer">
                            Publicar Tese
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-3 overflow-y-auto max-h-[280px]">
                          {selectedCircle.forum.length === 0 ? (
                            <p className="text-xs italic text-stone-600 text-center py-10">Nenhum debate cadastrado de forma formal.</p>
                          ) : (
                            selectedCircle.forum.map((post) => (
                              <div key={post.id} className="bg-white/5 border border-white/5 hover:border-[#C8A96B]/30 p-3 rounded-xl transition-all">
                                <h5 className="font-semibold text-xs text-[#F5F5F5]">{post.title}</h5>
                                <p className="text-[10px] text-[#C8A96B]/70 font-mono-aeon mt-0.5">
                                  Por: {post.author} ({post.authorStatus}) • {post.date}
                                </p>
                                <p className="text-xs font-garamond text-[#F5F5F5]/80 mt-2 leading-relaxed italic">
                                  "{post.content}"
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vault and Direct Chat */}
                  <div className="lg:col-span-5 flex flex-col gap-4 max-h-[400px]">
                    
                    {/* Sealed Files Vault section */}
                    <div className="bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-4 flex-1 overflow-y-auto scrollbar">
                      <h4 className="font-cinzel text-xs text-[#C8A96B] uppercase font-bold mb-3 flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Cofre Lacre
                      </h4>
                      <div className="space-y-2">
                        {selectedCircle.files.length === 0 ? (
                          <p className="text-[10px] font-garamond italic text-stone-600 text-center py-6">Nenhum manuscrito decodificado no cofre ainda.</p>
                        ) : (
                          selectedCircle.files.map((f) => (
                            <div key={f.id} className="p-2.5 bg-black border border-[#C8A96B]/15 hover:border-[#C8A96B] rounded-lg transition-colors flex justify-between items-center text-[11px] font-mono-aeon">
                              <div className="truncate max-w-[130px]" title={f.name}>
                                <p className="text-xs text-[#F5F5F5]/95 truncate">{f.name}</p>
                                <p className="text-[9px] text-stone-500">{f.size} • Upload por Mestre</p>
                              </div>
                              <button 
                                onClick={() => handleDownloadFile(f.name)}
                                className="text-[#C8A96B] hover:text-[#F5F5F5] cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Simulating direct Interactive Chat with Sophia & initiated members */}
                    <div className="bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-4 flex-1 flex flex-col justify-between max-h-[220px]">
                      <h4 className="font-cinzel text-xs text-[#C8A96B] uppercase font-bold mb-2 flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5" /> Chat Interno
                      </h4>
                      
                      <div className="flex-1 overflow-y-auto py-1 pr-1 space-y-2 text-[10px] scrollbar">
                        {selectedCircle.chat.length === 0 ? (
                          <p className="text-[#F5F5F5]/40 italic text-center pt-8">O canal silencioso aguarda invocação.</p>
                        ) : (
                          selectedCircle.chat.map((m) => (
                            <div key={m.id} className="bg-white/5 p-2 rounded-lg leading-relaxed">
                              <span className="font-bold text-[#C8A96B] font-mono-aeon truncate">{m.sender}: </span>
                              <span className="text-[#F5F5F5]/80">{m.content}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleSendCircleChatMsg} className="mt-2 flex gap-1">
                        <input 
                          type="text" 
                          value={circleChatInput}
                          onChange={(e) => setCircleChatInput(e.target.value)}
                          placeholder="Digite ao egrégora..."
                          className="flex-1 bg-[#111] p-1.5 border border-[#C8A96B]/20 text-[10px] text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                        />
                        <button 
                          type="submit" 
                          className="px-2 bg-[#C8A96B] text-black font-mono-aeon text-[10px] font-bold cursor-pointer"
                        >
                          Enviar
                        </button>
                      </form>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 4: RESEARCH & PEER REVIEW */}
          {activeTab === "research" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px]">
              
              {/* Left Column: Register monographs */}
              <div className="col-span-12 md:col-span-5 bg-[#0a0a0a]/70 border border-[#C8A96B]/15 rounded-2xl p-6 flex flex-col gap-5">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#C8A96B] mb-1">Cátedra de Pesquisas</h3>
                  <p className="font-garamond text-sm italic text-[#F5F5F5]/50">Submissão Oficial, Revisão de Sábios e Versões</p>
                </div>

                <form onSubmit={handleAddResearchPaper} className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Título do Artigo / Monografia</label>
                    <input 
                      type="text" 
                      value={newResearchTitle}
                      onChange={(e) => setNewResearchTitle(e.target.value)}
                      placeholder="Ex: A Geometria Hermética das Áreas Planas"
                      className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Categoria de Investigação</label>
                    <select 
                      value={newResearchCategory}
                      onChange={(e) => setNewResearchCategory(e.target.value)}
                      className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
                    >
                      <option value="Hermetismo">Hermetismo</option>
                      <option value="Cabala">Cabala</option>
                      <option value="Angelologia">Angelologia</option>
                      <option value="Demonologia">Demonologia</option>
                      <option value="Rosacrucianismo">Rosacrucianismo</option>
                      <option value="Teosofia">Teosofia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Resumo (Abstract)</label>
                    <textarea 
                      value={newResearchAbstract}
                      onChange={(e) => setNewResearchAbstract(e.target.value)}
                      placeholder="Resumo sumário de premissas teológicas e acadêmicas..."
                      className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2 text-xs text-[#F5F5F5] h-16 focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Substância Completa (Tese)</label>
                    <textarea 
                      value={newResearchContent}
                      onChange={(e) => setNewResearchContent(e.target.value)}
                      placeholder="Redija extensivamente seu argumento místico erudito..."
                      className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2 text-xs text-[#F5F5F5] h-28 focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-transparent border border-[#C8A96B] text-[#C8A96B] hover:bg-[#C8A96B] hover:text-black font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                  >
                    Registrar Trabalho Acadêmico
                  </button>
                </form>
              </div>

              {/* Right Column: Active Submissions list and Sophia automated peer review tool */}
              <div className="col-span-12 md:col-span-7 flex flex-col gap-6">
                <div className="bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C8A96B]">Investigações Cadastradas</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-stone-500 bg-[#111] px-2 py-0.5 rounded border border-white/5">
                        Escala: {dataScale === "mega" ? "100k Artigos" : "Padrão"}
                      </span>
                      <button
                        onClick={() => {
                          setDataScale(dataScale === "mega" ? "standard" : "mega");
                          triggerNotification(
                            dataScale === "mega" 
                              ? "Retornando ao acervo resumido de submissões." 
                              : "Selo de Alexandria: Ativando 100.000 teses científicas virtualizadas via react-window!"
                          );
                        }}
                        className="px-2 py-1 border border-[#C8A96B]/30 hover:border-[#C8A96B] bg-transparent hover:bg-[#C8A96B]/10 text-[#C8A96B] rounded transition-all cursor-pointer font-mono text-[9px] uppercase flex items-center gap-1.5"
                        title="Alternar tamanho da base de teses entre standard e 100k"
                      >
                        <Sparkles className="w-3 h-3 text-[#C8A96B]" /> {dataScale === "mega" ? "Reduzir p/ Padrão" : "Multiplicar (100k)"}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full min-h-[460px] mb-4">
                    <VList
                      height={460}
                      itemCount={filteredPapers.length}
                      itemSize={240}
                      width="100%"
                      style={{ overflowX: "hidden" }}
                    >
                      {(({ index, style }) => {
                        const paper = filteredPapers[index];
                        const isFocused = focusedResearch?.id === paper.id;
                        return (
                          <div style={style} className="pr-1 pb-4">
                            <div 
                              className={`p-4 rounded-xl border transition-all h-[224px] overflow-hidden flex flex-col justify-between cursor-pointer ${
                                isFocused
                                  ? "bg-white/5 border-[#C8A96B]"
                                  : "bg-[#080808] border-white/5 hover:border-[#C8A96B]/30"
                              }`}
                              onClick={() => setFocusedResearch(paper)}
                            >
                              <div>
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-mono-aeon text-[#C8A96B] uppercase tracking-wider">
                                    Versão {paper.version} • {paper.status}
                                  </span>
                                  <span className="text-[9px] text-[#F5F5F5]/40">{paper.date}</span>
                                </div>
                                
                                <h5 className="font-cinzel text-sm font-bold text-[#F5F5F5] mt-1 hover:text-[#C8A96B] line-clamp-1">
                                  {paper.title}
                                </h5>
                                <p className="text-[10px] text-[#F5F5F5]/60 mt-0.5">Autor: {paper.author} ({paper.authorStatus})</p>
                                
                                <p className="text-xs font-garamond text-[#F5F5F5]/70 italic mt-2.5 border-l border-[#C8A96B]/30 pl-3 leading-relaxed line-clamp-2">
                                  "{paper.abstract}"
                                </p>
                              </div>

                              <div className="mt-auto flex justify-between items-center border-t border-[#C8A96B]/15 pt-2">
                                <div className="flex gap-1">
                                  {paper.tags.slice(0, 2).map((tg, i) => (
                                    <span key={i} className="text-[8px] uppercase tracking-wider bg-[#111] text-stone-400 px-2 py-0.5 border border-white/5 rounded-full">
                                      {tg}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  {paper.reviews.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] text-green-400 font-mono-aeon flex items-center gap-1 bg-green-950/20 px-2 py-1 rounded border border-green-900/30">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> REVISADO
                                      </span>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleExportAsCodice(paper); }}
                                        className="px-2.5 py-0.5 bg-[#C8A96B]/20 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border border-[#C8A96B]/30 hover:border-[#C8A96B] font-mono-aeon text-[9px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all flex items-center gap-1"
                                        title="Exportar Monografia Oficial como Códice PDF"
                                      >
                                        <Download className="w-3 h-3" /> Exportar
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleEvaluatePaper(paper.id); }}
                                      disabled={isEvaluatingPaper}
                                      className="px-2.5 py-1 bg-[#C8A96B]/15 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-mono-aeon text-[9px] font-bold uppercase tracking-wider border border-[#C8A96B]/30 rounded cursor-pointer transition-colors"
                                    >
                                      Revisão IA
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }) as any}
                    </VList>
                  </div>

                  <div className="hidden">
                    <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto max-h-[450px]">
                    {researchPapers.map((paper) => (
                      <div 
                        key={paper.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          focusedResearch?.id === paper.id
                            ? "bg-white/5 border-[#C8A96B]"
                            : "bg-[#080808] border-white/5"
                        }`}
                        onClick={() => setFocusedResearch(paper)}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono-aeon text-[#C8A96B] uppercase tracking-wider">
                            Versão {paper.version} • {paper.status}
                          </span>
                          <span className="text-[9px] text-[#F5F5F5]/40">{paper.date}</span>
                        </div>
                        
                        <h5 className="font-cinzel text-sm font-bold text-[#F5F5F5] mt-1 hover:text-[#C8A96B] cursor-pointer">
                          {paper.title}
                        </h5>
                        <p className="text-[10px] text-[#F5F5F5]/60 mt-0.5">Autor: {paper.author} ({paper.authorStatus})</p>
                        
                        <p className="text-xs font-garamond text-[#F5F5F5]/70 italic mt-3 border-l border-[#C8A96B]/30 pl-3 leading-relaxed">
                          "{paper.abstract}"
                        </p>

                        {/* Sophia Peer Review Trigger Action */}
                        <div className="mt-4 flex justify-between items-center border-t border-[#C8A96B]/15 pt-3">
                          <div className="flex gap-1">
                            {paper.tags.slice(0, 3).map((tg, i) => (
                              <span key={i} className="text-[8px] uppercase tracking-wider bg-[#111] text-stone-400 px-2 py-0.5 border border-white/5 rounded-full">
                                {tg}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            {paper.reviews.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-green-400 font-mono-aeon flex items-center gap-1 bg-green-950/20 px-2 py-1 rounded border border-green-900/30">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> REVISADO POR IA
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleExportAsCodice(paper); }}
                                  className="px-3 py-1 bg-[#C8A96B]/20 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border border-[#C8A96B]/30 hover:border-[#C8A96B] font-mono-aeon text-[10px] font-bold uppercase tracking-wider rounded cursor-pointer transition-all flex items-center gap-1.5"
                                  title="Exportar Monografia Oficial como Códice PDF"
                                >
                                  <Download className="w-3.5 h-3.5" /> Exportar como Códice
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEvaluatePaper(paper.id); }}
                                disabled={isEvaluatingPaper}
                                className="px-3 py-1.5 bg-[#C8A96B]/15 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-mono-aeon text-[10px] font-bold uppercase tracking-wider border border-[#C8A96B]/30 rounded cursor-pointer transition-colors"
                              >
                                Solicitar Revisão IA
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Reviews detail display */}
                        {paper.reviews.length > 0 && (
                          <div className="mt-4 p-3 bg-black/60 border border-green-950/40 rounded-lg">
                            <p className="text-[10px] text-green-400 font-mono-aeon uppercase tracking-wider mb-1">Parecer Crítico do Templo:</p>
                            <p className="text-xs font-garamond text-[#F5F5F5]/80 leading-relaxed italic whitespace-pre-line">
                              {paper.reviews[0].comment}
                            </p>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 5: SOPHIA ORACLE (SISTEMAS DE IA) */}
          {activeTab === "oracle" && (
            <div className="space-y-6 pb-8">
              {/* Oracle Sub-Tab Menu */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/60 border border-stone-900 p-4 rounded-2xl animate-fade-in">
                <div>
                  <span className="text-[9px] text-[#C8A96B] uppercase font-mono-aeon tracking-wider">Mapeamento e Mentoria Cognitiva</span>
                  <h3 className="font-cinzel text-lg font-bold text-white tracking-widest mt-0.5">CENTRO DE INTELIGÊNCIA ARTIFICIAL</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOracleMode("terminal")}
                    className={`px-4 py-2 font-cinzel text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer ${oracleMode === "terminal" ? "bg-[#C8A96B]/15 text-[#C8A96B] border border-[#C8A96B]/30" : "text-stone-300 hover:text-white bg-black border border-stone-850"}`}
                  >
                    Terminal Sophia IA
                  </button>
                  <button
                    onClick={() => setOracleMode("planner")}
                    className={`px-4 py-2 font-cinzel text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer ${oracleMode === "planner" ? "bg-[#C8A96B]/15 text-[#C8A96B] border border-[#C8A96B]/30" : "text-stone-300 hover:text-white bg-black border border-stone-850"}`}
                  >
                    Consultar AEON ORACLE
                  </button>
                </div>
              </div>

              {oracleMode === "planner" ? (
                <AeonOracle books={books} triggerNotification={triggerNotification} />
              ) : (
                <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px]">
              
              {/* Oracle Conversational Terminal */}
              <div className="col-span-12 lg:col-span-7 bg-[#0a0a0a] border border-[#C8A96B]/25 rounded-2xl p-6 flex flex-col justify-between h-[500px]">
                
                {/* Header Information */}
                <div>
                  <div className="flex items-center gap-3 border-b border-[#C8A96B]/15 pb-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#C8A96B] animate-ping"></div>
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-[#C8A96B] uppercase tracking-widest leading-none">Sophia Oráculo IA</h4>
                      <p className="font-mono-aeon text-[9px] text-[#F5F5F5]/40 mt-1 uppercase">Sintonização Direta no Egrégora Cósmico</p>
                    </div>
                  </div>
                </div>

                {/* Simulated conversations list */}
                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar">
                  {sophiaChat.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col ${
                        msg.sender === "member" ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[8px] font-mono-aeon text-stone-500 mb-1">{msg.sender === "sophia" ? "Sophia Intel" : member.initiaticName} ({msg.time})</span>
                      <div 
                        className={`p-3 max-w-sm font-garamond leading-relaxed rounded-xl text-base ${
                          msg.sender === "member" 
                            ? "bg-[#C8A96B]/10 border border-[#C8A96B]/30 text-[#F5F5F5]" 
                            : "bg-[#111] border border-white/5 text-[#F5F5F5]/90 italic"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isSophiaTyping && (
                    <div className="flex items-center gap-2 text-stone-500 italic text-xs pl-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-[#C8A96B] rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-[#C8A96B] rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-[#C8A96B] rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span>Canalizando sabedoria milenar de Alexandria...</span>
                    </div>
                  )}

                  <div ref={sophiaEndRef} />
                </div>

                {/* Form sender */}
                <form onSubmit={handleSophiaSend} className="flex gap-2 border-t border-[#C8A96B]/15 pt-4">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Faça uma inquisição à Sophia, solicite referências ou relate conceitos..."
                    className="flex-1 bg-[#111] border border-[#C8A96B]/20 rounded-lg p-3 text-xs focus:outline-none focus:border-[#C8A96B]"
                  />
                  <button 
                    type="submit" 
                    className="px-5 bg-[#C8A96B] hover:bg-[#F5F5F5] text-[#050505] font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
                  >
                    Inquirir
                  </button>
                </form>

              </div>

              {/* Oracle Interactive Concept Maps Generator */}
              <div className="col-span-12 lg:col-span-5 bg-[#0a0a0a]/70 border border-[#C8A96B]/15 rounded-2xl p-6 flex flex-col justify-between h-[500px]">
                <div>
                  <h3 className="font-cinzel text-sm font-bold text-[#C8A96B] mb-1">Mapa de Consciência Hermético</h3>
                  <p className="font-mono-aeon text-[9px] text-[#F5F5F5]/40 uppercase mb-4">Interrelação de Obras e Conceitos Bíblicos por IA</p>
                  
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={mapTopic}
                      onChange={(e) => setMapTopic(e.target.value)}
                      placeholder="Ex: Cabala ou Alquimia"
                      className="flex-1 bg-[#111] border border-[#C8A96B]/20 rounded p-2 text-xs focus:outline-none focus:border-[#C8A96B]"
                    />
                    <button 
                      onClick={handleGenerateKnowledgeMap}
                      disabled={isMapLoading}
                      className="px-3 bg-transparent border border-[#C8A96B] hover:bg-[#C8A96B] hover:text-black rounded text-[10px] font-mono-aeon uppercase tracking-wider font-bold cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isMapLoading ? "Gerando..." : "Mapear"}
                    </button>
                  </div>
                </div>

                {/* SVG MAP CONTAINER */}
                <div className="flex-1 bg-black border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                  {knowledgeMap ? (
                    <div className="w-full h-full p-4 flex flex-col justify-between">
                      <svg className="w-full h-[180px]" viewBox="0 0 350 180">
                        {/* Render Links */}
                        {knowledgeMap.edges.map((edge, i) => {
                          const fromNode = knowledgeMap.nodes.find((n) => n.id === edge.from);
                          const toNode = knowledgeMap.nodes.find((n) => n.id === edge.to);
                          if (!fromNode || !toNode) return null;
                          return (
                            <line
                              key={i}
                              x1={30 + (parseInt(fromNode.id) * 60)}
                              y1={30 + (parseInt(fromNode.id) % 2 * 60)}
                              x2={30 + (parseInt(toNode.id) * 60)}
                              y2={30 + (parseInt(toNode.id) % 2 * 60)}
                              stroke="#C8A96B"
                              strokeWidth="1.5"
                              strokeDasharray="4"
                              opacity="0.4"
                            />
                          );
                        })}

                        {/* Render Nodes */}
                        {knowledgeMap.nodes.map((node) => (
                          <g
                            key={node.id}
                            transform={`translate(${30 + (parseInt(node.id) * 60)}, ${30 + (parseInt(node.id) % 2 * 60)})`}
                            className="cursor-pointer"
                            onClick={() => setSelectedMapNode(node)}
                          >
                            <circle
                              r="15"
                              fill={selectedMapNode?.id === node.id ? "#C8A96B" : "#111"}
                              stroke="#C8A96B"
                              strokeWidth="2"
                            />
                            <text
                              y="25"
                              textAnchor="middle"
                              fill="#F5F5F5"
                              fontSize="8"
                              fontFamily="sans-serif"
                              fontWeight="bold"
                            >
                              {node.label.slice(0, 10)}...
                            </text>
                          </g>
                        ))}
                      </svg>

                      {/* Detail area */}
                      <div className="bg-[#121212] p-3 rounded-lg border border-[#C8A96B]/20 max-h-[140px] overflow-y-auto mt-2">
                        {selectedMapNode ? (
                          <>
                            <p className="text-xs text-[#C8A96B] font-bold uppercase">{selectedMapNode.label}</p>
                            <p className="text-[11px] font-garamond italic mt-1 leading-relaxed text-[#F5F5F5]/80">
                              {selectedMapNode.detail}
                            </p>
                          </>
                        ) : (
                          <p className="text-[10px] text-center italic text-stone-600 pt-3">
                            Clique em algum nó celeste para inspecionar axiomas relacionados.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 text-stone-600">
                      <Network className="w-12 h-12 stroke-1 mx-auto text-[#C8A96B]/20 mb-3" />
                      <p className="text-xs italic font-garamond">{isMapLoading ? "Invocando de egrégoras cósmicos..." : "Nenhum mapa gerado. Introduza um tema no painel acadêmico acima."}</p>
                    </div>
                  )}
                </div>

                {knowledgeMap && (
                  <p className="text-[9px] text-[#C8A96B] italic font-garamond leading-relaxed text-center mt-3">
                    {knowledgeMap.description}
                  </p>
                )}
              </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 6: CONFERENCES & REUNIÕES */}
          {activeTab === "conferences" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px]">
              
              {/* Virtual room layout */}
              {activeConferenceRoom ? (
                <div className="col-span-12 bg-black border border-[#C8A96B]/30 rounded-2xl p-6 flex flex-col justify-between h-[500px] relative">
                  
                  {/* Top indicators */}
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div>
                      <span className="text-[9px] text-[#C8A96B] uppercase font-mono-aeon tracking-widest">{activeConferenceRoom.type} Virtual Temple</span>
                      <h3 className="font-cinzel text-base font-bold text-white tracking-wide mt-1">{activeConferenceRoom.title}</h3>
                    </div>
                    <button 
                      onClick={() => setActiveConferenceRoom(null)}
                      className="px-3 py-1 bg-red-950 font-mono-aeon text-[10px] uppercase text-red-200 border border-red-900 rounded cursor-pointer"
                    >
                      Encerrar Participação
                    </button>
                  </div>

                  {/* Video Simulacrum Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
                    {/* Member Feed */}
                    <div className="bg-[#111] border border-[#C8A96B]/10 rounded-xl relative overflow-hidden flex items-center justify-center">
                      {isCamOn ? (
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] to-[#1e140d] flex flex-col items-center justify-center p-4">
                          <div className="w-16 h-16 rounded-full bg-[#C8A96B] flex items-center justify-center font-cinzel text-lg text-black font-bold">
                            FT
                          </div>
                          <span className="mt-4 text-xs font-mono-aeon text-stone-200">Você ({member.initiaticName})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-600 font-mono-aeon">Sua Câmera Ocultada</span>
                      )}
                      
                      <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono-aeon border border-white/5">
                        Transmissão Estável • {isMicOn ? "🎤 Mutado Off" : "🔇 Mutado On"}
                      </div>
                    </div>

                    {/* Mentor Moderator Feed */}
                    <div className="bg-[#111] border border-[#C8A96B]/10 rounded-xl relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#12161A] to-[#2B2318] flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-[#C8A96B] flex items-center justify-center font-cinzel text-lg text-[#C8A96B] font-bold">
                          MA
                        </div>
                        <span className="mt-4 text-xs font-mono-aeon text-[#C8A96B] font-semibold">Mestre Aurelius (Mentor Moderator)</span>
                      </div>
                      
                      <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[8px] font-mono-aeon border border-white/5 text-[#C8A96B]">
                        Chancela de Host Ativo
                      </div>
                    </div>
                  </div>

                  {/* Feed Controls */}
                  <div className="flex justify-center gap-4 border-t border-white/10 pt-4">
                    <button 
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`px-4 py-2 text-xs font-mono-aeon rounded cursor-pointer ${
                        isMicOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-red-950 text-red-200 border border-red-900"
                      }`}
                    >
                      {isMicOn ? "Mudar Microfone Off" : "Ativar Microfone On"}
                    </button>
                    <button 
                      onClick={() => setIsCamOn(!isCamOn)}
                      className={`px-4 py-2 text-xs font-mono-aeon rounded cursor-pointer ${
                        isCamOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-stone-900 text-stone-400"
                      }`}
                    >
                      {isCamOn ? "Ocultear Câmera" : "Sintonizar Câmera"}
                    </button>
                  </div>

                </div>
              ) : (
                <>
                  {/* Left: Meeting Schedule Form */}
                  <div className="col-span-12 md:col-span-5 bg-[#0a0a0a]/70 border border-[#C8A96B]/15 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-[#C8A96B] mb-1">Templo de Concílios</h3>
                      <p className="font-garamond text-sm italic text-[#F5F5F5]/50 mb-6">Integração Digital de Agenda e Eventos Coletivos</p>

                      <form onSubmit={handleCreateMeeting} className="space-y-4">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Título do Concílio Sagrado</label>
                          <input 
                            type="text" 
                            value={meetTitle}
                            onChange={(e) => setMeetTitle(e.target.value)}
                            placeholder="Ex: Debate sobre o Terceiro Lacre do Zohar"
                            className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Data Celeste</label>
                            <input 
                              type="date" 
                              value={meetDate}
                              onChange={(e) => setMeetDate(e.target.value)}
                              className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Horário (Hora Local)</label>
                            <input 
                              type="time" 
                              value={meetTime}
                              onChange={(e) => setMeetTime(e.target.value)}
                              className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Plataforma de Videoconferência</label>
                          <select 
                            value={meetType}
                            onChange={(e) => setMeetType(e.target.value as MeetType)}
                            className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
                          >
                            <option value="Zoom">Zoom Meeting API</option>
                            <option value="Google Meet">Google Meet Integration</option>
                            <option value="Teams">Microsoft Teams Portal</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Associar a Círculo</label>
                          <select 
                            value={meetCircleId}
                            onChange={(e) => setMeetCircleId(e.target.value)}
                            className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
                          >
                            {circles.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full py-3 bg-[#C8A96B] text-black font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#F5F5F5] cursor-pointer transition-colors"
                        >
                          Agendar Concílio Coletivo
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right: Conferences Lists & Recorded Events */}
                  <div className="col-span-12 md:col-span-7 bg-[#0a0a0a]/40 border border-[#C8A96B]/10 rounded-2xl p-6">
                    <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C8A96B] mb-4">Agenda Consolidada de Estudos</h4>
                    
                    <div className="space-y-4 overflow-y-auto max-h-[430px]">
                      {conferences.map((conf) => (
                        <div key={conf.id} className="p-4 bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-xl flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase tracking-wider bg-[#C8A96B]/10 text-[#C8A96B] px-2 py-0.5 border border-[#C8A96B]/30 rounded">
                                {conf.type}
                              </span>
                              <span className="text-[9px] text-[#F5F5F5]/40 font-mono-aeon">{conf.date} às {conf.time}</span>
                            </div>
                            <h5 className="font-cinzel text-sm font-bold text-white mt-1 hover:text-[#C8A96B] cursor-pointer">
                              {conf.title}
                            </h5>
                            {conf.recordingUrl && (
                              <p className="text-[10px] text-[#C8A96B] italic mt-1 font-garamond">Conferência gravada disposta na biblioteca.</p>
                            )}
                          </div>

                          <div>
                            {conf.recordingUrl ? (
                              <a 
                                href={conf.recordingUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#C8A96B] text-[10px] uppercase font-mono-aeon rounded cursor-pointer transition-all inline-block"
                              >
                                Assistir Gravação
                              </a>
                            ) : (
                              <button 
                                onClick={() => setActiveConferenceRoom(conf)}
                                className="px-3 py-1.5 bg-[#C8A96B] hover:bg-[#F5F5F5] text-[#050505] font-mono-aeon text-[10px] font-bold uppercase rounded cursor-pointer transition-all"
                              >
                                {conf.id === "ev1" ? "Entrar ao Vivo" : "Sintonizar Reunião"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </>
              )}

            </div>
          )}

          {/* TAB 12: AGORA SOCIAL FEED */}
          {activeTab === "agora" && (
            <div className="space-y-6 pb-8">
              
              {/* Agora Sub-navigation horizontal bar */}
              <div className="bg-black/60 border border-[#C8A96B]/15 rounded-2xl p-4 gap-3 flex flex-wrap md:flex-nowrap justify-between items-center text-center">
                <div className="text-left">
                  <span className="text-[8.5px] text-[#C8A96B] uppercase font-mono-aeon tracking-wider">Tribunal Literário Síncrono</span>
                  <h3 className="font-cinzel text-base font-bold text-white tracking-widest mt-0.5">ÁGORA EXCLUSIVA DE AEON</h3>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-end">
                  {[
                    { id: "descobertas", label: "Descobertas" },
                    { id: "biblioteca", label: "Biblioteca Viva" },
                    { id: "pesquisas", label: "Pesquisas" },
                    { id: "debates", label: "Debates" },
                    { id: "conferencias", label: "Conferências" },
                    { id: "manuscritos", label: "Arquivos Raros" },
                    { id: "ai_rec", label: "Recomendações IA" }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setAgoraFeedSubTab(sub.id as AgoraSubTab)}
                      className={`px-3 py-1.5 font-cinzel text-[9px] uppercase tracking-widest rounded-lg border transition-all cursor-pointer ${
                        agoraFeedSubTab === sub.id
                          ? "bg-[#C8A96B]/15 border-[#C8A96B]/50 text-white shadow-md shadow-[#C8A96B]/5"
                          : "bg-[#050505] border-stone-900 text-stone-500 hover:text-stone-300 hover:border-stone-800"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Content Rendering according to Sub-tab */}
              {agoraFeedSubTab === "descobertas" ? (
                <ExploreDiscoveries
                  books={books}
                  circles={circles}
                  researchPapers={researchPapers}
                  setSelectedBook={setSelectedBook}
                  setActiveTab={setActiveTab}
                  triggerNotification={triggerNotification}
                />
              ) : agoraFeedSubTab === "manuscritos" ? (
                <ExploreDiscoveries
                  books={books}
                  circles={circles}
                  researchPapers={researchPapers}
                  setSelectedBook={setSelectedBook}
                  setActiveTab={setActiveTab}
                  triggerNotification={triggerNotification}
                />
              ) : agoraFeedSubTab === "ai_rec" ? (
                <AeonOracle books={books} triggerNotification={triggerNotification} />
              ) : agoraFeedSubTab === "biblioteca" ? (
                <div className="animate-fade-in p-6 bg-black/60 border border-[#C8A96B]/15 rounded-2xl">
                  <h4 className="font-cinzel text-sm font-bold text-[#C8A96B] uppercase tracking-widest mb-4">Biblioteca Viva & Status de Tomos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {books.map((bk) => (
                      <div key={bk.id} className="p-4 bg-stone-950 border border-stone-850 rounded-xl relative group hover:border-[#C8A96B]/30 transition-all">
                        <span className="absolute top-2 right-2 text-[8px] font-mono text-stone-500 uppercase tracking-widest bg-stone-900 px-1.5 py-0.5 rounded">
                          {bk.id.startsWith("bk-") ? "Lendo" : "Lido"}
                        </span>
                        <h5 className="font-cinzel text-xs font-bold text-white mb-1">{bk.title}</h5>
                        <p className="font-garamond text-stone-400 italic text-[11px] mb-3">"{bk.description}"</p>
                        <button
                          onClick={() => {
                            setSelectedBook(bk);
                            setActiveTab("library");
                            triggerNotification(`Carregando estudo de "${bk.title}" na biblioteca.`);
                          }}
                          className="text-[9px] font-mono text-[#C8A96B] hover:text-white uppercase font-bold"
                        >
                          Abrir Tomo Completo ⟶
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : agoraFeedSubTab === "pesquisas" ? (
                <div className="animate-fade-in p-6 bg-black/60 border border-[#C8A96B]/15 rounded-2xl">
                  <h4 className="font-cinzel text-sm font-bold text-[#C8A96B] uppercase tracking-widest mb-4">Investigações Monográficas Ativas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {researchPapers.map((paper) => (
                      <div key={paper.id} className="p-4 bg-stone-950 border border-stone-850 rounded-xl">
                        <span className="text-[7.5px] font-mono px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded uppercase font-bold text-stone-400 block w-max mb-1.5">{paper.status}</span>
                        <h5 className="font-cinzel text-xs font-bold text-white mb-1 tracking-wide">{paper.title}</h5>
                        <div className="text-[9.5px] text-stone-500 font-mono mb-2">Editor: {paper.author}</div>
                        <p className="font-garamond text-[#F5F5F5]/70 italic text-[11px] mb-3 line-clamp-2">"{paper.abstract}"</p>
                        <button
                          onClick={() => {
                            setActiveTab("research");
                            triggerNotification(`Direcionando para Cátedra científica do paper "${paper.title}".`);
                          }}
                          className="text-[9px] font-mono text-[#C8A96B] hover:text-white uppercase font-bold"
                        >
                          Ir para Cátedra de Pesquisas ⟶
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : agoraFeedSubTab === "conferencias" ? (
                <div className="animate-fade-in p-6 bg-black/60 border border-[#C8A96B]/15 rounded-2xl">
                  <h4 className="font-cinzel text-sm font-bold text-[#C8A96B] uppercase tracking-widest mb-4">Concílios e Conferências Síncronas</h4>
                  <div className="space-y-3">
                    {conferences.map((conf) => (
                      <div key={conf.id} className="p-4 bg-stone-950 border border-stone-850 hover:border-[#C8A96B]/20 rounded-xl flex items-center justify-between transition-all">
                        <div>
                          <span className="text-[8px] font-mono text-[#C8A96B] font-bold uppercase tracking-wider block mb-1">{conf.date} às {conf.time}</span>
                          <h5 className="font-cinzel text-xs font-bold text-white tracking-widest">{conf.title}</h5>
                          <span className="font-garamond text-stone-500 italic text-[11px]">Salão: {conf.type}</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab("conferences");
                            triggerNotification(`Encaminhado para mesa do Concílio "${conf.title}".`);
                          }}
                          className="px-3 py-1.5 border border-[#C8A96B]/30 hover:bg-[#C8A96B] hover:text-black rounded text-[9.5px] font-mono font-bold uppercase text-[#C8A96B] transition-all cursor-pointer"
                        >
                          Participar ⟶
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px] pb-8">
              {/* Left Column: Post Composer & Feed */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                
                {/* Publish reflexao Card */}
                <div className="bg-[#0a0a0a]/80 border border-[#C8A96B]/20 rounded-2xl p-5 backdrop-blur-md">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F172A] to-[#8D6E3D] border border-[#C8A96B]/30 flex items-center justify-center font-cinzel text-xs text-[#C8A96B] font-bold">
                       TL
                    </div>
                    <form onSubmit={handleCreateAgoraPost} className="flex-1 space-y-3">
                      <textarea
                        value={newPostText}
                        onChange={(e) => setNewPostText(e.target.value)}
                        placeholder="Consagre uma nova tese ou reflexão acadêmica na Ágora síncrona..."
                        className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#F5F5F5]/30 focus:outline-none resize-none h-20"
                      />
                      <div className="flex flex-wrap gap-4 items-center justify-between border-t border-[#C8A96B]/10 pt-3">
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="text"
                            value={newPostTags}
                            onChange={(e) => setNewPostTags(e.target.value)}
                            placeholder="Tags (ex: #Cabala, #Gnose)"
                            className="bg-[#111] border border-[#C8A96B]/20 rounded px-2 py-1 text-xs text-white placeholder-stone-600 focus:outline-none"
                          />
                          <select
                            value={newPostBookId}
                            onChange={(e) => setNewPostBookId(e.target.value)}
                            className="bg-[#111] border border-[#C8A96B]/20 rounded px-2 py-1 text-[10px] text-stone-300 focus:outline-none max-w-[120px] cursor-pointer"
                          >
                            <option value="">Anexar Livro...</option>
                            {books.map(b => (
                              <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-1.5 bg-[#C8A96B] hover:bg-[#F5F5F5] text-[#050505] text-[11px] font-mono-aeon font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                        >
                          Proclamar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Visual filter bar or active tag */}
                {selectedAgoraTag !== "Todos" && (
                  <div className="flex items-center justify-between bg-[#C8A96B]/10 border border-[#C8A96B]/30 p-3.5 rounded-2xl animate-fade-in text-xs">
                    <span className="text-[#C8A96B] font-mono-aeon uppercase font-bold flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 animate-pulse" /> Sintonização Ativa: #{selectedAgoraTag}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedAgoraTag("Todos");
                        triggerNotification("Retornando ao fluxo universal da Ágora.");
                      }}
                      className="px-2.5 py-1 bg-[#C8A96B]/20 border border-[#C8A96B]/40 hover:bg-[#C8A96B] hover:text-black text-[9.5px] font-mono-aeon font-bold rounded uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Restaurar Fluxo Geral
                    </button>
                  </div>
                )}

                {/* Agora Posts Stream */}
                <div className="space-y-4">
                  {agoraPosts
                    .filter((post) => {
                      if (selectedAgoraTag === "Todos") return true;
                      const filterLower = selectedAgoraTag.toLowerCase();
                      return post.tags.some((tg: string) => 
                        tg.toLowerCase().includes(filterLower) || filterLower.includes(tg.toLowerCase())
                      );
                    })
                    .map((post) => (
                    <div key={post.id} className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 hover:border-[#C8A96B]/30 rounded-2xl p-5 hover:bg-[#0a0a0a]/80 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-900 border border-[#C8A96B]/30 flex items-center justify-center font-cinzel text-xs text-[#C8A96B] font-bold">
                            {post.author.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-cinzel text-xs font-bold text-white leading-none">{post.author}</h4>
                              <span className="text-[8px] bg-[#C8A96B]/10 border border-[#C8A96B]/30 text-[#C8A96B] px-1.5 py-0.2 rounded uppercase tracking-wider font-bold">
                                {post.authorStatus}
                              </span>
                            </div>
                            <span className="text-[9px] text-[#F5F5F5]/40 block mt-1 font-mono">{post.authorUsername} • {post.date}</span>
                          </div>
                        </div>
                        <button className="text-[#C8A96B]/60 hover:text-[#C8A96B] text-[10px] font-mono-aeon uppercase tracking-wider">
                          Seguir
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-garamond text-[#F5F5F5]/90 leading-relaxed mb-4 italic whitespace-pre-wrap">
                        "{post.content}"
                      </p>

                      {/* Associated entities (Book/Circle tags) */}
                      {(post.bookReferenceId || post.tags) && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {post.bookReferenceId && (
                            <span className="text-[9.5px] uppercase font-mono-aeon bg-[#C8A96B]/20 border border-[#C8A96B]/40 text-[#C8A96B] px-2.5 py-0.5 rounded flex items-center gap-1">
                              📖 Codex: {books.find(b => b.id === post.bookReferenceId)?.title || "Obra Hermética"}
                            </span>
                          )}
                          {post.tags?.map((tg: string) => (
                            <span 
                              key={tg} 
                              onClick={() => {
                                setSelectedAgoraTag(tg);
                                triggerNotification(`Filtrando posts com a tag #${tg}`);
                              }}
                              className="text-[9.5px] font-mono-aeon text-[#F5F5F5]/40 hover:text-[#C8A96B] hover:border-[#C8A96B]/30 mr-1 bg-neutral-900/40 px-2 py-0.5 rounded border border-white/5 transition-colors cursor-pointer"
                            >
                              #{tg}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Micro interaction bar */}
                      <div className="flex items-center gap-6 border-t border-white/5 pt-3">
                        <button 
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${post.likedByMe ? "text-[#C8A96B] font-bold" : "text-stone-500 hover:text-[#C8A96B]"}`}
                        >
                          <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-[#C8A96B]" : ""}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button 
                          onClick={() => handleRepostPost(post.id)}
                          className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${post.repostedByMe ? "text-amber-500 font-bold" : "text-stone-500 hover:text-amber-500"}`}
                        >
                          <Repeat className="w-4 h-4" />
                          <span>{post.reposts}</span>
                        </button>
                        <button 
                          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-white cursor-pointer"
                          onClick={() => {
                            const comm = prompt("Insira seu argumento de objeção ou apoiológico intelectual:");
                            if(comm) handleCommentPost(post.id, comm);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments?.length || 0}</span>
                        </button>
                      </div>

                      {/* Comments Subsection inline */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 pl-4 border-l border-[#C8A96B]/20">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="text-xs">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="font-bold text-[#C8A96B] text-[11px] font-cinzel">{comment.author}</span>
                                <span className="text-[8px] bg-white/5 px-1 font-mono-aeon text-stone-500 rounded uppercase">{comment.authorStatus}</span>
                                <span className="text-[8px] text-stone-500 ml-auto">{comment.date}</span>
                              </div>
                              <p className="text-[#F5F5F5]/80 font-garamond italic">"{comment.content}"</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Infinite Scroll / Skeleton mockup for Premium Feel */}
                  <div className="border border-dashed border-white/5 rounded-2xl p-5 text-center bg-black/20">
                    <p className="text-[10px] uppercase tracking-widest text-[#F5F5F5]/30 font-mono-aeon animate-pulse">
                      ✵ Carregamento progressivo sínclero ativo... Fim do manuscrito da Ágora ✵
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Emerging Topics & Recommendations */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-5">
                  <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C8A96B] mb-4 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Emergências Herméticas (Top 5)
                  </h4>
                  <div className="space-y-4">
                    {[
                      { tag: "CabalaHermetica", count: "34 teses", desc: "Debates agudos acerca do terceiro lóbulo sefirótico" },
                      { tag: "AlquimiaFisica", count: "28 posts", desc: "Estudos laboratoriais sincréticos síncronos" },
                      { tag: "ZoharVaticano", count: "21 teses", desc: "Análise filológica de manuscritos confiscados" },
                      { tag: "TabuaEsmeralda", count: "19 posts", desc: "Traduções sinceras conduzidas sob regras rituais" },
                      { tag: "EgrégoraAlexandria", count: "15 posts", desc: "Conexões em tempo real de membros internacionais" }
                    ].map((top) => (
                      <div key={top.tag} className="flex justify-between items-start border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                        <div>
                          <p 
                            onClick={() => {
                              setSelectedAgoraTag(top.tag);
                              triggerNotification(`Sintonizando feed com a Egrégora #${top.tag}`);
                            }}
                            className="text-xs font-mono-aeon font-bold text-white hover:text-[#C8A96B] cursor-pointer transition-colors"
                          >
                            #{top.tag}
                          </p>
                          <p className="text-[10px] text-[#F5F5F5]/50 mt-1">{top.desc}</p>
                        </div>
                        <span className="text-[9px] bg-[#C8A96B]/10 text-[#C8A96B] px-1.5 py-0.5 rounded font-mono flex-shrink-0">{top.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0a0a0a]/60 border border-[#C8A96B]/10 rounded-2xl p-5">
                  <h4 className="font-cinzel text-xs uppercase tracking-widest text-stone-400 mb-3">Recomendação IA Sophia</h4>
                  <p className="text-xs font-garamond italic text-[#F5F5F5]/70 leading-relaxed">
                    "Identifiquei um nó de sinergia entre suas buscas por Cabala e a monografia de Mestre Aurelius sobre o Esplendor sefirótico. Recomendo estabelecer conexão direta via Inbox."
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab("inbox");
                      setActiveChatId("chat-aurelius");
                    }}
                    className="w-full mt-4 py-2 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black rounded text-[10px] font-mono-aeon font-bold uppercase tracking-wider transition-colors border border-[#C8A96B]/20 cursor-pointer"
                  >
                    Iniciar Chat Seguro
                  </button>
                </div>
              </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 13: PRIVATE INBOX SECURE CHATS */}
          {activeTab === "inbox" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px] pb-8">
              {/* Chat List Sidebar (Left) */}
              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-4 flex flex-col gap-4">
                <div className="border-b border-[#C8A96B]/10 pb-3">
                  <span className="text-[10px] font-mono-aeon uppercase tracking-widest text-[#C8A96B] font-bold block">Mensageiro Criptografado</span>
                  <span className="text-[9px] text-[#F5F5F5]/40 font-mono mt-1 block">Roteamento Privado AEON-Net</span>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-[360px] scrollbar-thin">
                  {chats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        activeChatId === c.id 
                          ? "bg-[#C8A96B]/15 border-[#C8A96B]" 
                          : "bg-black/40 border-white/5 hover:border-[#C8A96B]/30"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-cinzel text-xs font-bold text-white leading-none truncate">{c.recipientName}</h4>
                        <span className="text-[8px] bg-[#C8A96B]/10 text-[#C8A96B] px-1 rounded uppercase font-mono-aeon inline-block mt-1">{c.companionStatus}</span>
                        <p className="text-[10px] text-[#F5F5F5]/40 mt-1 truncate font-garamond italic">
                          {c.messages[c.messages.length - 1]?.content || "Inicie o diálogo..."}
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-orange-500 shadow animate-pulse flex-shrink-0"></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat View (Right) */}
              <div className="col-span-12 md:col-span-8 bg-[#0a0a0a]/80 border border-[#C8A96B]/15 rounded-2xl p-4 flex flex-col justify-between min-h-[460px]">
                {/* Active Chat Target Header */}
                {(() => {
                  const currentChat = chats.find(c => c.id === activeChatId);
                  if (!currentChat) return <p className="text-center text-xs text-stone-500 py-12">Selecione canal de gnose seguro...</p>;
                  return (
                    <div className="flex flex-col h-full justify-between gap-4">
                      <div className="flex items-center justify-between border-b border-[#C8A96B]/10 pb-3">
                        <div>
                          <h3 className="font-cinzel text-sm font-bold text-white">{currentChat.recipientName}</h3>
                          <p className="text-[8px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mt-0.5">ESTADO DA CONEXÃO: CRIPTOGRAFADA E2EE</p>
                        </div>
                        {/* Audio & Video Call Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleStartSimulatedCall(currentChat.recipientName, false)}
                            className="p-1.5 bg-neutral-900 border border-white/5 hover:bg-neutral-800 rounded text-[#C8A96B] cursor-pointer transition-colors"
                            title="Chamada de Áudio"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleStartSimulatedCall(currentChat.recipientName, true)}
                            className="p-1.5 bg-neutral-900 border border-white/5 hover:bg-neutral-800 rounded text-[#C8A96B] cursor-pointer transition-all"
                            title="Chamada de Vídeo"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Messages Flow Area */}
                      <div className="flex-1 space-y-4 overflow-y-auto max-h-[280px] p-2 bg-black/40 rounded-xl border border-white/5 scrollbar-thin flex flex-col gap-3">
                        {currentChat.messages.map((m) => {
                          const isMe = m.sender === "me";
                          return (
                            <div key={m.id} className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}>
                              <span className="text-[8px] text-[#F5F5F5]/30 mb-0.5 font-mono">{isMe ? "Você" : currentChat.recipientName}</span>
                              <div className={`p-3 rounded-2xl text-xs font-garamond leading-relaxed ${isMe ? "bg-[#C8A96B]/20 text-[#F5F5F5] border border-[#C8A96B]/30 rounded-tr-none" : "bg-neutral-900 text-[#F5F5F5]/90 border border-white/5 rounded-tl-none"}`}>
                                {m.content}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* TextInput send bar */}
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          placeholder="Codifique mensagem acadêmica segura..."
                          className="flex-1 bg-[#111] border border-[#C8A96B]/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96B]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-[#C8A96B] hover:bg-[#F5F5F5] text-black font-mono-aeon text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 14: ANNOTATIONS / OBSIDIAN NOTION PORTAL */}
          {activeTab === "annotations" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px] pb-8">
              {/* Notebook Editor (Left) */}
              <div className="col-span-12 lg:col-span-8 bg-[#0a0a0a]/80 border border-[#C8A96B]/15 rounded-2xl p-6">
                <h3 className="font-cinzel text-lg font-bold text-[#C8A96B] mb-2 uppercase tracking-wide">Compilador de Conclusões Herméticas</h3>
                <p className="font-garamond text-xs italic text-[#F5F5F5]/40 mb-4">Sincronização offline-first com criptografia simétrica local</p>

                <form onSubmit={handleAddPrivateNote} className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Título do Ensaio / Insight</label>
                    <input 
                      type="text" 
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Ex: Teorema Sefirótico da Criação Alquímica"
                      className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Argumento / Roteiro de Leitura</label>
                    <textarea 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Redija aqui suas impressões reflexivas em formato Markdown. Sophia AI correlacionará seus termos automaticamente."
                      className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-3 text-xs text-[#F5F5F5] focus:outline-none focus:border-[#C8A96B] h-48 focus:ring-1 focus:ring-[#C8A96B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-[#C8A96B] font-mono-aeon mb-1">Palavras-Chave de Backlink (separar por vírgula)</label>
                      <input 
                        type="text" 
                        value={noteTagsStr}
                        onChange={(e) => setNoteTagsStr(e.target.value)}
                        placeholder="Zohar, Cabala, Alquimia, Hermetismo"
                        className="w-full bg-[#111] border border-[#C8A96B]/20 rounded-lg p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        type="submit" 
                        className="w-full py-2.5 bg-[#C8A96B] text-[#050505] font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#F5F5F5] cursor-pointer transition-colors border border-black"
                      >
                        Arquivar Ensaios No Diário
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Backlinks panel (Right) */}
              <div className="col-span-12 lg:col-span-4 bg-[#0a0a0a]/50 border border-[#C8A96B]/10 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C8A96B] mb-3">Backlinks Estrutuados (Obsidian View)</h4>
                  <p className="text-[10px] text-[#F5F5F5]/40 font-mono-aeon mb-4 uppercase">Relações semânticas síncronas</p>

                  <div className="space-y-3">
                    <div className="p-2.5 bg-[#111]/80 rounded border border-dashed border-[#C8A96B]/30 text-xs">
                      <p className="font-bold text-[#C8A96B] font-mono mb-1">&#91;&#91;Cabala&#93;&#93; &harr; &#91;&#91;Gnosis&#93;&#93;</p>
                      <p className="text-[10px] text-[#F5F5F5]/60 italic">Identificado correspondência em 4 de seus ensaios arquivados.</p>
                    </div>
                    <div className="p-2.5 bg-[#111]/80 rounded border border-dashed border-[#C8A96B]/30 text-xs">
                      <p className="font-bold text-[#C8A96B] font-mono mb-1">&#91;&#91;Hermetismo&#93;&#93; &harr; &#91;&#91;Zohar&#93;&#93;</p>
                      <p className="text-[10px] text-[#F5F5F5]/60 italic">Cruzamentos com a bibliografia indicada do Templo.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/60 p-4 rounded-xl border border-[#C8A96B]/15 mt-4">
                  <p className="text-[10px] font-mono-aeon text-[#C8A96B] uppercase font-bold tracking-wider mb-1">Mapeador Automático</p>
                  <p className="text-xs text-stone-400 font-garamond italic">"Cada anotação anotada serve para fertilizar o mapa mental de conexões dinâmicas do plano astral superior."</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: KNOWLEDGE MAP OBSIDIAN STYLE */}
          {activeTab === "map" && (
            <div className="animate-fade-in h-full min-h-[500px] pb-8">
              <KnowledgeGraph
                books={books}
                circles={circles}
                researchPapers={researchPapers}
                conferences={conferences}
                setSelectedBook={setSelectedBook}
                setSelectedCircle={setSelectedCircle}
                setActiveTab={setActiveTab}
                triggerNotification={triggerNotification}
              />
            </div>
          )}

          {/* TAB 7: PROFILE & REGISTRY CARGOS */}
          {activeTab === "profile" && (
            <div className="animate-fade-in grid grid-cols-12 gap-6 h-full min-h-[500px]">
              
              {/* Profile Details Sheet */}
              <div className="col-span-12 md:col-span-4 bg-[#0a0a0a]/70 border border-[#C8A96B]/15 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-center pb-6 border-b border-[#C8A96B]/15">
                    {/* Visual Stamp Frame */}
                    <div className="mx-auto w-24 h-24 rounded-full border border-[#C8A96B]/40 bg-gradient-to-tr from-[#0F172A] via-black to-[#8D6E3D] flex items-center justify-center font-cinzel text-2xl text-[#C8A96B] font-bold animate-pulse mb-4">
                      {member.initiaticName.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-[#C8A96B]">{member.initiaticName}</h3>
                    <p className="font-mono-aeon text-[10px] text-stone-500 uppercase mt-1">Selo Membro: {member.id}</p>
                    <p className="font-garamond text-xs italic text-[#F5F5F5]/60 mt-2">Dedicado a estudos profundos desde {member.ingressDate}</p>
                  </div>

                  {/* Certifications and achievements list */}
                  <div className="py-4">
                    <h4 className="text-[10px] uppercase font-mono-aeon tracking-wider text-[#C8A96B] mb-2">Conquistas e Certificações</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.certifications.map((cert, idx) => (
                        <span key={idx} className="text-[9px] uppercase tracking-wider bg-[#C8A96B]/15 border border-[#C8A96B]/30 text-[#C8A96B] px-2.5 py-0.5 rounded-full font-mono-aeon font-bold">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verifiable High-Fidelity Digital Badges Area */}
                  <div className="py-4 border-t border-[#C8A96B]/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] uppercase font-mono-aeon tracking-wider text-[#C8A96B] font-bold">Códices Digitais Criptografados</h4>
                      <button 
                        onClick={() => {
                          const title = prompt("Digite o Título da sua pesquisa / tese a ser laureada:");
                          if (title) handleGenerateAwardCertificate(title, "Tese Laureada", "Cabala Hermética");
                        }}
                        className="text-[9px] text-[#C8A96B] hover:underline font-mono uppercase bg-[#C8A96B]/10 px-1 rounded border border-[#C8A96B]/30"
                      >
                        + Laurear Tese
                      </button>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                      {certificates.map(c => (
                        <div 
                          key={c.id} 
                          onClick={() => setSelectedCert(c)}
                          className="p-2 bg-black/50 border border-white/5 hover:border-[#C8A96B]/40 rounded-lg cursor-pointer transition-all flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-semibold text-white truncate">{c.title}</p>
                            <p className="text-[8px] text-[#C8A96B] font-mono mt-0.5 uppercase tracking-widest">{c.type}</p>
                            <p className="text-[8px] text-[#F5F5F5]/30 font-mono mt-0.5 truncate">{c.verifiableHash}</p>
                          </div>
                          <Award className="w-5 h-5 text-[#C8A96B] flex-shrink-0 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Quality Interactive Verifiable Certificate modal backdrop */}
                  {selectedCert && (
                    <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                      <div className="bg-[#070707] border-2 border-[#C8A96B] max-w-md w-full rounded-2xl p-6 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-[#C8A96B]/5 rounded-full blur-3xl pointer-events-none"></div>
                        <button 
                          onClick={() => setSelectedCert(null)}
                          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/5 text-white/50 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="text-center space-y-4 border border-[#C8A96B]/40 p-4 rounded-xl relative">
                          <div className="mx-auto w-12 h-12 rounded-full border border-[#C8A96B]/40 bg-[#0a0a0a] flex items-center justify-center text-[#C8A96B] font-cinzel text-xl font-bold">
                            Æ
                          </div>
                          
                          <div>
                            <span className="text-[7px] uppercase tracking-[0.3em] font-mono text-stone-500 block">CHANCELA VERIFICADA EM BLOCKCHAIN PRIVADA</span>
                            <h3 className="font-cinzel text-base font-bold text-[#C8A96B] tracking-widest mt-1">AEON DE ALEXANDRIA</h3>
                            <p className="text-[9px] uppercase tracking-wider text-white mt-1">CÁTEDRA DE GRAUS INICIÁTICOS</p>
                          </div>

                          <div className="w-24 h-px bg-[#C8A96B]/30 mx-auto"></div>

                          <p className="text-xs font-garamond text-[#F5F5F5]/90 italic leading-relaxed">
                            "Outorga-se a presente láurea de <span className="font-bold text-white uppercase not-italic">{selectedCert.type}</span> ao portador registrado <span className="font-bold text-[#C8A96B] uppercase not-italic">{selectedCert.recipientName}</span> sob conformidade acadêmica com as teses de {selectedCert.circleName || "Estudos Ocultos Gerais"}."
                          </p>

                          <div className="text-[9px] font-mono text-stone-500 space-y-1">
                            <p>Assinado por: {selectedCert.signers.join(" & ")}</p>
                            <p className="text-red-400 font-bold tracking-widest mt-2">{selectedCert.verifiableHash}</p>
                            <p className="text-[8px] text-green-400 mt-1">&#x2714; SELO DE INTEGRIDADE HISTÓRICA VALIDADO PELO TEMPLO</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Private diary of notes editor */}
                  <div className="py-4 border-t border-[#C8A96B]/10">
                    <h4 className="text-[10px] uppercase font-mono-aeon tracking-wider text-[#C8A96B] mb-2">Diário de Estudos Herméticos</h4>
                    
                    <form onSubmit={handleAddPrivateNote} className="space-y-3">
                      <input 
                        type="text" 
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Título da Insight..."
                        className="w-full bg-[#111] text-xs p-2 rounded border border-white/5 focus:outline-none focus:border-[#C8A96B]"
                      />
                      <textarea 
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Redija conclusões da meditação ou leitura..."
                        className="w-full bg-[#111] text-xs p-2 rounded border border-white/5 h-20 focus:outline-none focus:border-[#C8A96B]"
                      />
                      <input 
                        type="text" 
                        value={noteTagsStr}
                        onChange={(e) => setNoteTagsStr(e.target.value)}
                        placeholder="Tags separadas por vírgula (ex: Cabala, Gnosis)..."
                        className="w-full bg-[#111] text-[10px] p-2 rounded border border-white/5 focus:outline-none"
                      />
                      <button type="submit" className="w-full py-1.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black rounded text-[10px] font-mono-aeon font-bold uppercase tracking-widest cursor-pointer transition-colors border border-[#C8A96B]/30">
                        Guardar no Diário
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Status Path Ranks & Diary Notes Listing */}
              <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                
                {/* Cargos / Status Path Grid */}
                <div className="bg-[#0a0a0a] border border-[#C8A96B]/15 rounded-2xl p-6">
                  <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#C8A96B] mb-4">Cargos e Graus Iniciáticos do Templo</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.values(AcademicStatus).map((status) => {
                      const isActive = member.status === status;
                      const isFocused = focusedStatus === status;
                      return (
                        <div 
                          key={status}
                          onClick={() => setFocusedStatus(status)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            isFocused 
                              ? "bg-[#C8A96B]/15 border-[#C8A96B]" 
                              : isActive 
                                ? "bg-[#C8A96B]/5 border-[#C8A96B]/40"
                                : "bg-[#080808] border-white/5 hover:border-[#C8A96B]/20"
                          }`}
                        >
                          <span className={`text-[9px] uppercase font-mono-aeon tracking-wider block font-bold ${isActive ? "text-[#C8A96B]" : "text-stone-400"}`}>
                            {status}
                          </span>
                          {isActive && <span className="text-[7px] text-green-400 font-mono-aeon uppercase tracking-wider font-bold">Grau Atual</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Requirements details focused cargo card */}
                  <div className="mt-4 p-4 bg-black/60 rounded-xl border border-[#C8A96B]/25">
                    <p className="text-[10px] text-[#C8A96B] font-mono-aeon uppercase tracking-widest mb-2 font-bold">
                      Requisitos & Atribuições: {focusedStatus}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-garamond">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Requisitos de Ascensão</p>
                        <p className="italic text-stone-200">{ACADEMIC_REQUIREMENTS[focusedStatus].requirements}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Produção Acadêmica</p>
                        <p className="italic text-stone-200">{ACADEMIC_REQUIREMENTS[focusedStatus].production}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold mb-1">Permissões de Acesso</p>
                        <p className="italic text-stone-200">{ACADEMIC_REQUIREMENTS[focusedStatus].access}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sincronização de Conhecimento Area */}
                <KnowledgeSync 
                  member={member} 
                  circles={circles} 
                  triggerNotification={triggerNotification} 
                />

                {/* Submissions of Private diary list */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/10 rounded-2xl p-6 flex-1 overflow-y-auto max-h-[220px]">
                  <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#F5F5F5]/60 mb-2">Anotações Arquivadas</h4>
                  
                  {member.annotations.length === 0 ? (
                    <p className="text-xs italic text-stone-600 text-center py-8">Nenhuma anotação compilada ainda. Faça rascunhos no formulário de diário.</p>
                  ) : (
                    <div className="space-y-3">
                      {member.annotations.map(n => (
                        <div key={n.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-[#C8A96B] font-cinzel">{n.title}</span>
                            <span className="text-[9px] text-stone-500">{n.date}</span>
                          </div>
                          <p className="text-xs font-garamond text-amber-100/80 leading-relaxed italic">
                            "{n.content}"
                          </p>
                          <div className="flex gap-1.5 mt-2">
                            {n.tags.map((tg, i) => (
                              <span key={i} className="text-[8px] bg-white/5 px-2 py-0.5 text-stone-400 font-mono-aeon rounded">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {activeTab === "integrations" && (
            <IntegrationsHub
              member={member}
              setMember={setMember}
              circles={circles}
              conferences={conferences}
              setConferences={setConferences}
              books={books}
              triggerNotification={triggerNotification}
            />
          )}

          {/* MODAL 1: CRIAR NOVO CÍRCULO INICIÁTICO & INSTANCIAR CLASSROOM */}
          {showCreateCircleModal && (
            <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-[#070707] border border-[#C8A96B]/30 max-w-lg w-full rounded-2xl p-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#C8A96B] to-amber-700"></div>
                
                <button 
                  onClick={() => setShowCreateCircleModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-4">
                  <div className="flex items-center gap-2 text-[#C8A96B] mb-1">
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-[10px] uppercase font-mono-aeon tracking-wider">AEON Cloud Microservice</span>
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-widest text-[#F5F5F5]">Inaugurar Novo Círculo</h3>
                  <p className="font-garamond text-xs text-stone-400 italic">Dispara uma GCP Cloud Function interna que cria a turma síncrona no Google Classroom</p>
                </div>

                <form onSubmit={handleCreateNewCircleWithClassroom} className="space-y-4 text-xs font-mono-aeon">
                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">NOME DO CÍRCULO INICIÁTICO *</label>
                    <input 
                      type="text"
                      required
                      value={newCircleFormName}
                      onChange={(e) => setNewCircleFormName(e.target.value)}
                      placeholder="Ex: Círculo de Alquimia Prática, Círculo de Geometria Sagrada"
                      className="w-full bg-[#0d0d0d] border border-[#C8A96B]/20 focus:border-[#C8A96B] p-2.5 rounded-lg text-white placeholder-stone-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-bold">DESCRIÇÃO E EMENTA DO CURSO</label>
                    <textarea 
                      value={newCircleFormDesc}
                      onChange={(e) => setNewCircleFormDesc(e.target.value)}
                      placeholder="Especifique os mistérios, leituras rituais e experimentos práticos deste templo de aprendizagem..."
                      className="w-full h-20 bg-[#0d0d0d] border border-[#C8A96B]/20 focus:border-[#C8A96B] p-2.5 rounded-lg text-white placeholder-stone-600 focus:outline-none resize-none font-garamond text-xs leading-relaxed"
                    />
                  </div>

                  {/* Mentor setup */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1 font-bold">MENTOR (TEACHER ROLE)</label>
                      <input 
                        type="text"
                        disabled
                        value={newCircleMentorName}
                        className="w-full bg-[#111111]/80 border border-stone-805 p-2 rounded-lg text-stone-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1 font-bold">E-MAIL DO MENTOR</label>
                      <input 
                        type="email"
                        disabled
                        value={newCircleMentorEmail}
                        className="w-full bg-[#111111]/80 border border-stone-805 p-2 rounded-lg text-stone-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Colors preference */}
                  <div>
                    <label className="block text-stone-400 mb-2 font-bold">INSÍGNIA DE BRILHO (EGRÉGORA COLOR)</label>
                    <div className="flex gap-3">
                      {[
                        { hex: "#C8A96B", label: "Ouro" },
                        { hex: "#e25c5c", label: "Fogo" },
                        { hex: "#4ca6e8", label: "Éter" },
                        { hex: "#4ce8b0", label: "Verde" },
                        { hex: "#be4ce8", label: "Cabalístico" }
                      ].map((col) => (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setSelectedCircleBgColor(col.hex)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer overflow-hidden flex items-center justify-center ${selectedCircleBgColor === col.hex ? "border-[#C8A96B] scale-110" : "border-transparent"}`}
                          style={{ backgroundColor: col.hex }}
                          title={col.label}
                        >
                          {selectedCircleBgColor === col.hex && <Check className="w-4 h-4 text-black font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student checklist */}
                  <div>
                    <span className="block text-stone-400 mb-2 font-bold uppercase">MATRICULAR MEMBROS AUTOMATICAMENTE (STUDENT SERVICES)</span>
                    <p className="text-[10px] text-stone-500 italic mb-2">Selecione os iniciados que serão matriculados síncronamente na turma do Classroom via roster link:</p>
                    <div className="grid grid-cols-2 gap-2 bg-[#0a0a0a] p-3 border border-stone-900 rounded-xl max-h-[140px] overflow-y-auto scrollbar">
                      {[
                        { name: "Irmão Samuel", email: "samuel.zohar@gmail.com" },
                        { name: "Irmã Deborah", email: "deborah.hod@gmail.com" },
                        { name: "Mestre Aurelius", email: "aurelius.egregora@gmail.com" },
                        { name: "Soror Sophia de Alexandria", email: "sophia.iniciada@gmail.com" }
                      ].map((item) => {
                        const isSelected = selectedStudentsList.some(m => m.email === item.email);
                        return (
                          <div 
                            key={item.email}
                            onClick={() => handleToggleStudentInList(item)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-2 text-[10px] ${
                              isSelected 
                                ? "bg-[#C8A96B]/5 border-[#C8A96B]/30 text-white" 
                                : "bg-[#040404] border-stone-900 text-stone-500"
                            }`}
                          >
                            <span className={`w-3 h-3 rounded flex items-center justify-center text-[8px] font-bold ${isSelected ? "bg-[#C8A96B] text-black" : "border border-stone-888 bg-black"}`}>
                              {isSelected && "✓"}
                            </span>
                            <div className="truncate">
                              <p className="font-bold truncate">{item.name}</p>
                              <p className="text-[8px] text-stone-500 truncate">{item.email}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-950 flex justify-end gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowCreateCircleModal(false)}
                      className="px-4 py-2 border border-stone-900 text-stone-400 rounded-lg hover:bg-white/5 cursor-pointer font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingCircle}
                      className="px-5 py-2.5 bg-[#C8A96B] text-black font-mono-aeon font-bold uppercase rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      Instanciar Cátedra Virtual
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: GCLOUD CONSOLE LOGS & PROVISIONING DE TURMAS GCLASSROOM */}
          {showFunctionLogsModal && (
            <div className="fixed inset-0 bg-[#020202]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-[#0a0a0a] border-2 border-[#C8A96B]/40 max-w-xl w-full rounded-2xl relative shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Header of Logs */}
                <div className="bg-zinc-950 w-full px-6 py-4 border-b border-[#C8A96B]/20 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div>
                      <span className="text-[8px] font-mono tracking-widest text-[#C8A96B] uppercase block">GCP MONITORING SERVICES</span>
                      <h4 className="font-cinzel text-xs font-bold text-white tracking-widest">Execução: onCircleCreateClassroom.js</h4>
                    </div>
                  </div>
                  {!isCreatingCircle && (
                    <button 
                      onClick={() => setShowFunctionLogsModal(false)}
                      className="text-stone-400 hover:text-white hover:bg-white/5 rounded-full p-1 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Console view */}
                <div className="p-5 flex-1 overflow-y-auto bg-[#030303] text-[10px] font-mono-aeon text-stone-300 space-y-1.5 scrollbar min-h-[220px]">
                  {createdCircleResultLogs.map((log, idx) => {
                    let textClass = "text-stone-400";
                    if (log.includes("✅")) textClass = "text-emerald-400 font-bold";
                    if (log.includes("❌") || log.includes("[ERRO]")) textClass = "text-rose-400 font-bold";
                    if (log.includes("🚀") || log.includes("🎯")) textClass = "text-[#C8A96B] font-bold";
                    if (log.includes("🔑")) textClass = "text-amber-400 font-bold";
                    return (
                      <p key={idx} className={`${textClass} leading-relaxed break-all`}>
                        {log}
                      </p>
                    );
                  })}
                  {isCreatingCircle && (
                    <div className="flex items-center gap-2 text-[#C8A96B] pt-4 italic font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C8A96B]" />
                      <span>Processando gatilho do banco de dados no Google Cloud...</span>
                    </div>
                  )}
                </div>

                {/* Success View at the bottom */}
                {!isCreatingCircle && cloudFunctionResponse && (
                  <div className="p-5 bg-[#070707] border-t border-[#C8A96B]/20 space-y-4">
                    <div className="p-4 bg-[#C8A96B]/5 border border-[#C8A96B]/25 rounded-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-[#C8A96B] block font-mono">STATUS DO PROVISIONAMENTO</span>
                          <h5 className="font-mono text-xs font-bold text-[#F5F5F5]">Vínculo Google Classroom Estabelecido!</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold font-mono rounded-full">
                          CONECTADO
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-[#F5F5F5]/70">
                        <div>
                          <p className="text-stone-500 text-[8px] uppercase font-mono">SALA DO CLASSROOM</p>
                          <p className="font-bold text-[#C8A96B] truncate">{cloudFunctionResponse.circle?.name} (AEON)</p>
                        </div>
                        <div>
                          <p className="text-stone-500 text-[8px] uppercase font-mono font-bold">CÓDIGO DE INSCRIÇÃO</p>
                          <p className="font-bold text-white tracking-widest bg-stone-900 px-2 py-0.5 rounded text-center">{cloudFunctionResponse.enrollmentCode || "cab991"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-stone-500 text-[8px] uppercase font-mono">LIGAÇÃO DE ROSTER</p>
                          <p className="truncate text-white">Professor: {cloudFunctionResponse.circle?.mentor?.name} | {cloudFunctionResponse.circle?.members?.length || 0} Alunos Matriculados</p>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center text-[9px] text-[#C8A96B] underline border-t border-white/5">
                        <a 
                          href="https://classroom.google.com" 
                          target="_blank" 
                          rel="noreferrer" 
                          onClick={() => triggerNotification("Direcionando para o Console Google Classroom...")}
                          className="hover:text-white inline-flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Abrir seu Classroom corporativo
                        </a>
                        <span className="text-stone-600 font-mono italic">AEON Integrations Engine</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 text-xs">
                      <button
                        onClick={() => setShowFunctionLogsModal(false)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#C8A96B] hover:bg-[#F5F5F5] text-black font-mono-aeon font-bold uppercase rounded-lg shadow-lg cursor-pointer text-center"
                      >
                        Ir para o Círculo Iniciado
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
