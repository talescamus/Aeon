import React, { useState, useEffect, useRef } from "react";
import { 
  Database, 
  Cpu, 
  Calendar, 
  Video, 
  FileText, 
  FolderOpen, 
  Table, 
  MessageSquare, 
  Activity, 
  Bell, 
  Settings, 
  Layers, 
  Lock, 
  Shield, 
  CheckCircle, 
  RefreshCw, 
  AlertTriangle, 
  Link, 
  Link2, 
  Unlink, 
  UserCheck, 
  BarChart3, 
  CloudLightning, 
  Code, 
  Terminal,
  Plus,
  Trash2,
  FileSpreadsheet,
  Network,
  Download,
  Upload,
  Layers2,
  History,
  GraduationCap,
  X,
  CheckCircle2,
  LockKeyhole,
  Info,
  Server,
  Play,
  Volume2,
  Compass,
  TrendingUp,
  Languages,
  Check,
  CheckSquare,
  Search,
  Bot
} from "lucide-react";
import { AcademicEvent, LibraryBook, Circle, Member } from "../types";

interface YoutubeVideo {
  id: string;
  title: string;
  circle: string;
  date: string;
  duration: string;
  status: string;
  visibility: string;
  viewUrl: string;
  playlist: string;
  autoRecord: boolean;
  autoUpload: boolean;
  isTranscribing: boolean;
  transcript: string;
  summary: string;
  topics: string[];
  timeline: { time: string; desc: string }[];
}

interface VideoSearchResult {
  videoId: string;
  videoTitle: string;
  time: string;
  text: string;
  speaker: string;
  score: string;
}

interface IntegrationsHubProps {
  member: Member;
  setMember: React.Dispatch<React.SetStateAction<Member>>;
  circles: Circle[];
  conferences: AcademicEvent[];
  setConferences: React.Dispatch<React.SetStateAction<AcademicEvent[]>>;
  books: LibraryBook[];
  triggerNotification: (text: string) => void;
}

export default function IntegrationsHub({
  member,
  setMember,
  circles,
  conferences,
  setConferences,
  books,
  triggerNotification
}: IntegrationsHubProps) {
  // Navigation tabs of internal integration panel
  const [internalTab, setInternalTab] = useState<"workspace" | "youtube" | "nvidia" | "firebase" | "admin" | "logs">("workspace");

  // --- YOUTUBE INTEGRATION HUB STATES ---
  const [youtubeChannels, setYoutubeChannels] = useState([
    { id: "ch-1", name: "Canal Principal AEON (Estudos Gerais)", subCount: "42.5K inscritos", videoCount: 182, isDefault: true, status: "Connected" },
    { id: "ch-2", name: "Canal Institucional AEON (Chancela)", subCount: "12.8K inscritos", videoCount: 64, isDefault: false, status: "Connected" },
    { id: "ch-3", name: "Canal Círculo Cabala (Iniciação)", subCount: "8.4K inscritos", videoCount: 39, isDefault: false, status: "Connected" },
    { id: "ch-4", name: "Canal Círculo Alquimia (Prática)", subCount: "5.1K inscritos", videoCount: 22, isDefault: false, status: "Connected" },
    { id: "ch-5", name: "Frater Tales (Selo Docente)", subCount: "1.2K inscritos", videoCount: 9, isDefault: false, status: "Connected" }
  ]);

  const [youtubeVideos, setYoutubeVideos] = useState([
    {
      id: "yt-1",
      title: "Debate Dialético do Zohar e a Esfera de Daath",
      circle: "Cabala Sagrada",
      date: "2026-06-12",
      duration: "01:24:32",
      status: "Pronto",
      visibility: "Público",
      viewUrl: "https://youtube.com/watch?v=aeon_zohar",
      playlist: "Zohar Semiótico",
      autoRecord: true,
      autoUpload: true,
      isTranscribing: false,
      transcript: "No princípio era o Verbo, e o Verbo era sintonizado às dez emanações sefiróticas. Ao analisarmos o Zohar, percebemos que Daath figura como a esfera do conhecimento sínclero, intangível e unificador na busca cabalística. Esta emanação invisível consolida os saberes cósmicos mais sagrados.",
      summary: "Este debate aborda as conexões semióticas do Zohar, com foco de exegese nas três Sephiroth superiores e a revelação de Daath como portão de sabedoria oculta na egrégora de Alexandria.",
      topics: ["Exegese do Zohar", "Sefirot Superiores", "Mistério de Daath", "Nexo Filológico de Agripa"],
      timeline: [
        { time: "00:00", desc: "Abertura Ritual e Alinhamento do Logos" },
        { time: "18:30", desc: "Exegese de Daath: A Esfera Oculta" },
        { time: "45:10", desc: "O Ouro Psíquico: Alquimia e Gnosis" },
        { time: "01:15:00", desc: "Espelho Macro-Micro: Solução de Dúvidas" }
      ]
    },
    {
      id: "yt-2",
      title: "Hermetismo Prático e os Princípios do Caibalion",
      circle: "Hermetismo Egípcio",
      date: "2026-06-11",
      duration: "58:15",
      status: "Pronto",
      visibility: "Não Listado",
      viewUrl: "https://youtube.com/watch?v=aeon_hermetismo",
      playlist: "Filosofia Hermética",
      autoRecord: true,
      autoUpload: false,
      isTranscribing: false,
      transcript: "O Caibalion postula sete grandes axiomas do Universo. O primeiro deles é o mentalismo, significando que o Universo é mental. Solve et coagula é o processo que possibilita transmutar as vibrações do intelecto na Grande Obra clássica.",
      summary: "Estudo aprofundado dos sete princípios herméticos descritos no Caibalion, focando em aplicações espirituais e correspondências teológicas no cotidiano dos aspirantes.",
      topics: ["Sete Princípios Cósmicos", "Axioma do Mentalismo", "Solve et Coagula", "Transmutação Mental"],
      timeline: [
        { time: "00:00", desc: "Introdução ao Corpus Hermeticum" },
        { time: "12:15", desc: "O Axioma do Mentalismo e Correspondência" },
        { time: "32:40", desc: "Trabalhos Alquímicos Práticos" },
        { time: "50:00", desc: "Encerramento e Recomendações Herméticas" }
      ]
    }
  ]);

  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null);
  const [uploadVideoProgress, setUploadVideoProgress] = useState(0);
  const [selectedYtVideoForDetails, setSelectedYtVideoForDetails] = useState<string>("yt-1");
  const [videoSearchQuery, setVideoSearchQuery] = useState("");
  const [videoSearchResults, setVideoSearchResults] = useState<VideoSearchResult[] | null>(null);
  const [activeWatchVideo, setActiveWatchVideo] = useState<(YoutubeVideo & { activeTimestamp?: string }) | null>(null);

  // --- NVIDIA AI INTEGRATION STATES ---
  const [nvidiaModel, setNvidiaModel] = useState("meta/llama-3-70b-instruct");
  const [nvidiaTemperature, setNvidiaTemperature] = useState(0.7);
  const [nvidiaMaxTokens, setNvidiaMaxTokens] = useState(2048);
  const [nvidiaRagEnabled, setNvidiaRagEnabled] = useState(true);
  const [nvidiaGuardrailsEnabled, setNvidiaGuardrailsEnabled] = useState(true);

  // Interactive AI Chat Custom Simulation
  const [aiContext, setAiContext] = useState("global"); // global, book, research, event, tree
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: "user" | "oracle", text: string, timestamp: string, context?: string }>>([
    { sender: "oracle", text: "Saudações, acadêmico do Templo AEON. Sou o AEON ORACLE de próxima geração, alimentado pelo ecossistema NVIDIA AI (NIM, NeMo e RAG). Estou sintonizado com sua egrégora atual. Como seu mentor, posso responder dúvidas, explicar conceitos herméticos, analisar pesquisas ou gerar roteiros. Pergunte-me qualquer mistério.", timestamp: "10:00" }
  ]);
  const [newAiChatInput, setNewAiChatInput] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [audioVoiceActive, setAudioVoiceActive] = useState(false);
  const [currentNarratingText, setCurrentNarratingText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Hermético Solene");
  const [selectedLanguage, setSelectedLanguage] = useState("pt");

  // RAG Source status database
  const [ragSources, setRagSources] = useState([
    { id: "rag-1", name: "Biblioteca Central AEON (Tomos Inteiros)", type: "Biblioteca", tokens: "4.1M tokens", status: "Indexed", lastIndexed: "Há 1 dia" },
    { id: "rag-2", name: "Monografias & Pesquisas de Membros (Aprovadas)", type: "Pesquisas", tokens: "890K tokens", status: "Indexed", lastIndexed: "Há 4 horas" },
    { id: "rag-3", name: "Transcrições Google Meet / YouTube", type: "Vídeos", tokens: "150K tokens", status: "Indexed", lastIndexed: "Agora mesmo" },
    { id: "rag-4", name: "Anotações Pessoais de Diários", type: "Notas", tokens: "25K tokens", status: "Indexed", lastIndexed: "Há 2 horas" }
  ]);
  const [isIndexingSources, setIsIndexingSources] = useState(false);

  // Video AI Generation Tools State
  const [selectedVideoForAiTools, setSelectedVideoForAiTools] = useState("yt-1");
  const [aiVideoFlippedCardIndex, setAiVideoFlippedCardIndex] = useState<number | null>(null);
  const [aiVideoExerciseChoice, setAiVideoExerciseChoice] = useState<number | null>(null);
  const [aiVideoExerciseCompleted, setAiVideoExerciseCompleted] = useState(false);
  const [aiVideoExerciseCorrect, setAiVideoExerciseCorrect] = useState<boolean | null>(null);

  // AI Peer Review evaluator
  const [aiReviewTargetResearch, setAiReviewTargetResearch] = useState("Gematria e Cosmologia no Século XXI");
  const [aiReviewResult, setAiReviewResult] = useState<string | null>(null);
  const [isAiReviewing, setIsAiReviewing] = useState(false);

  // AI Tree of Life customized guidance
  const [isGuidanceGenerating, setIsGuidanceGenerating] = useState(false);
  const [aiGuidanceResult, setAiGuidanceResult] = useState<string | null>(null);

  // AI Mind Map interactive active concept links
  const [hoveredConceptNode, setHoveredConceptNode] = useState<string | null>(null);
  const [selectedConceptNode, setSelectedConceptNode] = useState<string | null>(null);

  // Metrics database
  const [aiMetrics, setAiMetrics] = useState({
    activeNimPods: 4,
    totalTokens: 1428512,
    totalQueries: 512,
    avgLatency: "12ms",
    cacheHitRate: "94.2%",
    totalCost: "$12.45"
  });

  // Google OAuth connection states
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [linkedAccounts, setLinkedAccounts] = useState<Array<{ email: string, name: string, type: "Google Workspace" | "Gmail" }>>([
    { email: "tales.dbsk12@gmail.com", name: "Frater Tales de Alexandria", type: "Gmail" }
  ]);
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  // Google Meet Simulated states
  const [meetSessions, setMeetSessions] = useState<Array<{ id: string, title: string, code: string, circle: string, date: string, time: string, attendance: number, isRecording: boolean }>>([
    { id: "meet-1", title: "Debate Dialético do Zohar", code: "meet.google.com/hrc-aeon-gns", circle: "Cabala Sagrada", date: "2026-06-12", time: "18:00", attendance: 24, isRecording: true },
    { id: "meet-2", title: "Hermetismo Prático e Alquimia", code: "meet.google.com/vxp-alkm-her", circle: "Hermetismo Egípcio", date: "2026-06-15", time: "20:00", attendance: 15, isRecording: false }
  ]);
  const [newMeetTitle, setNewMeetTitle] = useState("");
  const [newMeetCircle, setNewMeetCircle] = useState(circles[0]?.name || "Trabalho Geral");

  // Google Calendar synced status
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);

  // Google Classroom integration states
  const [classroomCohorts, setClassroomCohorts] = useState<Array<{ id: string, name: string, enrollmentCode: string, assignmentsCount: number, materialsCount: number, status: "Active" | "Synced" }>>([
    { id: "class-1", name: "Cátedra Hermética: Introdução ao Corpus", enrollmentCode: "x4ae7d", assignmentsCount: 5, materialsCount: 12, status: "Synced" },
    { id: "class-2", name: "Zohar Semiótico e Conhecimento Sefirótico", enrollmentCode: "cab991", assignmentsCount: 3, materialsCount: 8, status: "Active" }
  ]);

  // Google Drive Simulation states
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string, name: string, size: string, extension: "pdf" | "docs" | "sheets" | "zip", date: string, type: string, version: number }>>([
    { id: "file-1", name: "A_Tabula_de_Esmeralda_Estudos_Criticos.pdf", size: "4.2 MB", extension: "pdf", date: "2026-06-11", type: "Monografia", version: 1 },
    { id: "file-2", name: "Gematria_Aplicada_Calculos_Universais.sheets", size: "124 KB", extension: "sheets", date: "2026-06-10", type: "Estatísticas", version: 2 },
    { id: "file-3", name: "Compilacao_Teses_Cabala_Hermetica.docs", size: "890 KB", extension: "docs", date: "2026-06-08", type: "Pesquisa Colaborativa", version: 4 }
  ]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Google Docs Cooperative Sandbox
  const [docsContent, setDocsContent] = useState<string>(
    "O Teorema da Unicidade do Hermetismo postula que o micro-universo reflete em escala e ressonância as vibrações do macro-universo ('O que está embaixo é como o que está em cima'). Neste códice analítico, examinamos..."
  );
  const [coAuthorActive, setCoAuthorActive] = useState(false);
  const [commentsList, setCommentsList] = useState<Array<{ id: string, author: string, content: string, date: string }>>([
    { id: "comm-1", author: "Mestre Aurelius", content: "Excelente tese. Recomendo citar explicitamente o terceiro axioma da Tábua de Esmeralda.", date: "2026-06-11 10:12" }
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [docsRevHistory, setDocsRevHistory] = useState<Array<{ version: number, author: string, date: string, desc: string }>>([
    { version: 1, author: "Tales", date: "2026-06-11 09:00", desc: "Esboço inicial da tese" },
    { version: 2, author: "Mestre Aurelius", date: "2026-06-11 10:25", desc: "Anotação metodológica do axioma" }
  ]);

  // Google Sheets integration simulation
  const [sheetsData, setSheetsData] = useState<Array<{ id: string, title: string, circle: string, submissions: number, score: number }>>([
    { id: "s-1", title: "Aurelius - Monografia Sefirótica", circle: "Cabala Sagrada", submissions: 4, score: 9.8 },
    { id: "s-2", title: "Tales - Estudos da Tábua", circle: "Hermetismo Egípcio", submissions: 3, score: 9.5 },
    { id: "s-3", title: "Soror Vesta - Hermenêutica Zohar", circle: "Cabala Sagrada", submissions: 2, score: 10.0 }
  ]);

  // Firebase configurations
  const [firebaseMetrics, setFirebaseMetrics] = useState({
    firestoreReads: 48512,
    firestoreWrites: 12401,
    storageSize: "2.4 GB",
    activeSessions: 147,
    avgLatency: "45 ms"
  });
  const [remoteConfigs, setRemoteConfigs] = useState({
    enableOraculoSophia: true,
    compactAgoraLayout: false,
    alphaIntegrations: true,
    maintenanceMode: false
  });
  const [cloudMessagingTitle, setCloudMessagingTitle] = useState("");
  const [cloudMessagingBody, setCloudMessagingBody] = useState("");

  // Live synchronizing log pipeline
  const [syncLogs, setSyncLogs] = useState<Array<{ id: string, timestamp: string, service: string, message: string, type: "success" | "info" | "warning" }>>([
    { id: "log-1", timestamp: "09:20:15", service: "Google Auth", message: "Conexão estabelecida com tales.dbsk12@gmail.com", type: "success" },
    { id: "log-2", timestamp: "09:22:40", service: "Firebase Auth", message: "Sessão validada via OpenID Connect (AES-256)", type: "success" },
    { id: "log-3", timestamp: "09:25:01", service: "Cloud Pub/Sub", message: "Topic 'event_schedule' registrado síncronamente", type: "info" }
  ]);

  // Simulate remote AI co-author typing in Google Docs
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (coAuthorActive) {
      let step = 0;
      const expressions = [
        " Além disso, o terceiro postulado hermético indica que 'nada está parado; tudo se move; tudo vibra'.",
        " Consequentemente, as conexões semânticas entre Cabala e Zohar tornam-se nítidas sob este prisma.",
        " Esta congruência é de fundamental importância para os concílios iniciáticos ativos em Alexandria."
      ];
      timer = setInterval(() => {
        if (step < expressions.length) {
          setDocsContent(prev => prev + expressions[step]);
          setDocsRevHistory(prev => [
            { version: prev.length + 1, author: "Sophia AI (Collaborative)", date: new Date().toLocaleTimeString(), desc: "Assessoramento semiótico automático" },
            ...prev
          ]);
          triggerNotification("Sophia AI está colaborando no seu Google Doc agora!");
          setSyncLogs(logs => [
            { id: "doc-sync-" + step, timestamp: new Date().toTimeString().split(" ")[0], service: "Google Docs API", message: "Colaboração cooperativa Sophia AI sincronizada", type: "success" },
            ...logs
          ]);
          step++;
        } else {
          setCoAuthorActive(false);
        }
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [coAuthorActive]);

  // Action: Add Sync Logs
  const addLog = (service: string, message: string, type: "success" | "info" | "warning" = "info") => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    setSyncLogs(prev => [
      { id: Math.random().toString(), timestamp: timeStr, service, message, type },
      ...prev
    ]);
  };

  const handleVideoConceptsSearch = () => {
    if (!videoSearchQuery) return;
    triggerNotification(`Buscando termo "${videoSearchQuery}" nas gravações de vídeo...`);
    
    // Scan youtubeVideos and find matching elements
    const results: VideoSearchResult[] = [];
    youtubeVideos.forEach(v => {
      const regex = new RegExp(videoSearchQuery, "i");
      if (v.transcript.match(regex)) {
        results.push({
          videoId: v.id,
          videoTitle: v.title,
          time: "02:15",
          text: `"...${v.transcript.substring(Math.max(0, v.transcript.indexOf(videoSearchQuery) - 40), Math.min(v.transcript.length, v.transcript.indexOf(videoSearchQuery) + videoSearchQuery.length + 50))}..."`,
          speaker: "Mestre Aurelius",
          score: "98.4%"
        });
      }
    });

    if (results.length === 0) {
      results.push({
        videoId: "yt-1",
        videoTitle: youtubeVideos[0].title,
        time: "12:15",
        text: `"...não encontramos correspondência exata, exibindo trecho relevante sobre [${videoSearchQuery}] nas Sephiroth..."`,
        speaker: "Sophia AI Hermete",
        score: "85%"
      });
    }

    setVideoSearchResults(results);
  };

  // Google Auth login simulated action with pop-up success
  const handleGoogleConnectToggle = () => {
    if (isGoogleConnected) {
      if (confirm("Deseja realmente desvincular sua conta Google Workspace principal? Suas integrações síncronas serão pausadas.")) {
        setIsGoogleConnected(false);
        setLinkedAccounts([]);
        triggerNotification("Conectividade Google desativada.");
        addLog("Google Auth", "Desconexão de serviços autorizados pelo usuário", "warning");
      }
    } else {
      triggerNotification("Sintonizando gateway Google Account...");
      setTimeout(() => {
        setIsGoogleConnected(true);
        setLinkedAccounts([
          { email: "tales.dbsk12@gmail.com", name: "Frater Tales de Alexandria", type: "Gmail" }
        ]);
        triggerNotification("Conexão estabelecida com sua conta Google!");
        addLog("Google Auth", "Autorização OAuth 2.0 concedida pelo usuário tales.dbsk12@gmail.com", "success");
      }, 1000);
    }
  };

  const handleAddMultipleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountEmail || !newAccountName) return;

    setLinkedAccounts(prev => [
      ...prev,
      { email: newAccountEmail, name: newAccountName, type: "Google Workspace" }
    ]);
    setShowAddAccountModal(false);
    triggerNotification(`Conta corporativa ${newAccountEmail} vinculada à egrégora AEON!`);
    addLog("Google Auth", `Múltiplas contas: Workspace vinculada - ${newAccountEmail}`, "success");
    setNewAccountEmail("");
    setNewAccountName("");
  };

  // Action: Simulate creating a Google Meet Session
  const handleCreateMeet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetTitle) return;

    const code = "meet.google.com/" + Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
    const newSession = {
      id: "meet-" + Date.now(),
      title: newMeetTitle,
      code,
      circle: newMeetCircle,
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
      time: "19:00",
      attendance: 0,
      isRecording: false
    };

    setMeetSessions(prev => [newSession, ...prev]);

    // Bidirectional sync with Conferences Tab is essential
    const newConference: AcademicEvent = {
      id: "meet-sync-" + Date.now(),
      title: `[INTEGRAÇÃO WORKSPACE] ${newMeetTitle}`,
      date: newSession.date,
      time: newSession.time,
      circleId: circles.find(c => c.name === newMeetCircle)?.id || "geral",
      meetUrl: "https://" + code,
      type: "Google Meet",
      attendanceCount: 0
    };
    setConferences(prev => [newConference, ...prev]);

    triggerNotification("Google Meet e Calendar sincronizados com o Concílio AEON!");
    addLog("Google Meet API", `Reunião '${newMeetTitle}' agendada. Link gerado: ${code}`, "success");
    addLog("Google Calendar", `Convites enviados para ${circles.find(c => c.name === newMeetCircle)?.studies.length || 10} participantes do círculo`, "success");
    setNewMeetTitle("");
  };

  // Action: Sync Calendar
  const handleSyncAllCalendar = () => {
    setIsSyncingCalendar(true);
    triggerNotification("Iniciando varredura bidirecional de agendas...");
    setTimeout(() => {
      setIsSyncingCalendar(false);
      triggerNotification("Calendários perfeitamente sincronizados com o Google Calendar!");
      addLog("Google Calendar API", `Sucesso na sincronização de ${conferences.length} eventos acadêmicos`, "success");
    }, 1500);
  };

  // Action: Sync Classroom Cohorts
  const handleSyncClassroom = (id: string, name: string) => {
    setClassroomCohorts(prev => prev.map(c => c.id === id ? { ...c, status: "Synced" } : c));
    triggerNotification(`Ambiente educasional do Classroom '${name}' sincronizado!`);
    addLog("Classroom API", `Relação de turmas e notas atualizadas para a turma de ${name}`, "success");
  };

  // Action: Reset/Create automatic classroom cohort for circles
  const handleCreateCohort = (circleName: string) => {
    const code = Math.random().toString(36).substring(2, 8);
    const newCohort = {
      id: "class-" + Date.now(),
      name: `Círculo Sagrado: ${circleName}`,
      enrollmentCode: code,
      assignmentsCount: 2,
      materialsCount: 4,
      status: "Synced" as const
    };
    setClassroomCohorts(prev => [...prev, newCohort]);
    triggerNotification(`Turma vinculada criada para o círculo ${circleName}!`);
    addLog("Classroom API", `Criada nova turma virtual para o círculo ${circleName}. Código: ${code}`, "success");
  };

  // Action: File upload to Google Drive Simulation
  const handleDriveUploadMock = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(p => {
          if (p === null) return null;
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(null);
              const rawExt = file.name.split(".").pop() ?? "pdf";
              const validExts = ["pdf", "docs", "sheets", "zip"] as const;
              type DriveExt = typeof validExts[number];
              const extension: DriveExt = (validExts as readonly string[]).includes(rawExt) ? rawExt as DriveExt : "pdf";
              const friendlySize = (file.size / (1024 * 1024)).toFixed(1) + " MB";
              const newDriveFile = {
                id: "drive-" + Date.now(),
                name: file.name,
                size: friendlySize,
                extension,
                date: new Date().toISOString().split("T")[0],
                type: "Upload Externo",
                version: 1
              };
              setDriveFiles(prev => [newDriveFile, ...prev]);
              triggerNotification(`Documento ${file.name} integrado com segurança ao Google Drive!`);
              addLog("Google Drive API", `Backup automático realizado: ${file.name} (${friendlySize})`, "success");
            }, 300);
            return 100;
          }
          return p + 30;
        });
      }, 200);
    };
    fileInput.click();
  };

  // Action: Google Docs comments
  const handleAddDocComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText) return;

    setCommentsList(prev => [
      ...prev,
      {
        id: "comm-" + Date.now(),
        author: "Iniciador Tales (Você)",
        content: newCommentText,
        date: new Date().toISOString().replace("T", " ").substring(0, 16)
      }
    ]);
    triggerNotification("Comentário adicionado ao Google Doc colaborativo.");
    addLog("Google Docs API", "Novo comentário indexado no documento acadêmico", "info");
    setNewCommentText("");
  };

  // Action: Export statistical sheet to Google Sheets
  const handleExportToSheets = () => {
    triggerNotification("Construindo matriz de exportação...");
    setTimeout(() => {
      // Add a simulated record representing compilation
      setSheetsData(prev => [
        { id: "s-" + Date.now(), title: "Tales - Teorema Sincronizado", circle: "Cabala Sagrada", submissions: 6, score: 9.9 },
        ...prev
      ]);
      triggerNotification("Dashboard administrativo sincronizado com Google Sheets!");
      addLog("Google Sheets API", "Matriz estatística exportada com sucesso como linhas no Sheets corporativo", "success");
    }, 1000);
  };

  // Remote Config Toggle handler
  const handleRemoteConfigToggle = (field: keyof typeof remoteConfigs) => {
    setRemoteConfigs(prev => {
      const updated = { ...prev, [field]: !prev[field] };
      triggerNotification(`Configuração Remota [${String(field)}] alterada para ${updated[field] ? "ATIVADA" : "DESATIVADA"}`);
      addLog("Remote Config", `Parâmetro '${String(field)}' atualizado remotamente para ${updated[field]}`, "info");
      return updated;
    });
  };

  // Cloud Messaging send simulation
  const handleSendPushNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudMessagingTitle || !cloudMessagingBody) return;

    triggerNotification("Disparando notificações push FCM para membros do Templo...");
    setTimeout(() => {
      triggerNotification("Notificações enviadas para Web/Android/iOS via FCM!");
      addLog("Firebase FCM", `Disparo push enviado para 147 receptores. Título: '${cloudMessagingTitle}'`, "success");
      setCloudMessagingTitle("");
      setCloudMessagingBody("");
    }, 1000);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full pb-10">
      
      {/* Header Panel representing AEON Integrations Hub */}
      <div className="bg-[#0a0a0a]/80 border border-[#C8A96B]/20 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] text-[#C8A96B] font-mono-aeon uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-[#C8A96B] animate-pulse" /> Ecossistema Corporativo de Alexandria
          </span>
          <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-white tracking-widest uppercase">
            AEON Integrations Hub
          </h2>
          <p className="font-garamond text-xs text-[#F5F5F5]/60 mt-1 italic">
            Conselho Sínclero de APIs • Integração Nativa Google Workspace & Firebase Engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end text-right">
            <span className="text-[9px] uppercase font-mono-aeon text-stone-400">SAÚDE GERAL DA EGRÉGORA</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-green-400">ATIVO & ONLINE</span>
            </div>
          </div>
          <button 
            onClick={() => {
              triggerNotification("Processando auditoria completa das chaves AES-256...");
              addLog("Sincronizador", "Forçado re-sync de segurança em toda a malha", "info");
            }}
            className="p-2.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B] hover:text-black text-[#C8A96B] border border-[#C8A96B]/30 rounded-xl transition-all cursor-pointer"
            title="Recarregar Integrações"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid containing central hub menu and configuration panels */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Left Column Navigation (Hub Categories) */}
        <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
          {[
            { id: "workspace", label: "Google Workspace", icon: FolderOpen, desc: "Meet, Docs, Drive, Calendar, Classroom" },
            { id: "youtube", label: "YouTube Broadcast", icon: Video, desc: "Canais, Aulas, Transcrições, Indexação" },
            { id: "nvidia", label: "NVIDIA AI Cognitive", icon: Cpu, desc: "Oracle, RAG, NIM, NeMo, Performance" },
            { id: "firebase", label: "Firebase Platform", icon: Database, desc: "Firestore, FCM, Remote Config, Storage" },
            { id: "admin", label: "Controle & Saúde", icon: Settings, desc: "Acessos, Rate Limits, Webhooks" },
            { id: "logs", label: "Logs de Auditoria", icon: Terminal, desc: "Monitoramento de Eventos e APIs" }
          ].map(it => {
            const Icon = it.icon;
            const isSel = internalTab === it.id;
            return (
              <button
                key={it.id}
                onClick={() => setInternalTab(it.id as "workspace" | "youtube" | "nvidia" | "firebase" | "admin" | "logs")}
                className={`flex-1 md:flex-none text-left p-4 rounded-2xl border transition-all cursor-pointer min-w-[160px] md:min-w-0 ${
                  isSel
                    ? "bg-[#C8A96B]/15 border-[#C8A96B] text-[#C8A96B]"
                    : "bg-[#050505]/60 hover:bg-[#0a0a0a]/80 border-white/5 text-stone-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-mono-aeon uppercase tracking-wider font-bold leading-tight">{it.label}</p>
                    <p className="hidden md:block text-[10px] text-stone-500 mt-0.5 leading-tight">{it.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column (Dynamic Workspace & Platform Panel rendering) */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-6">

          {/* TAB 1: GOOGLE WORKSPACE */}
          {internalTab === "workspace" && (
            <div className="space-y-6">
              
              {/* Top: Google Auth Integration Row */}
              <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-cinzel text-xl font-bold flex-shrink-0">
                    G
                  </div>
                  <div>
                    <h3 className="text-sm font-cinzel font-bold text-white tracking-widest uppercase">G-Suite OAuth 2.0 Credenciais</h3>
                    <p className="text-xs font-garamond text-stone-400 italic mt-0.5">Sincronização de biografia, foto e conformidade de Workspace de Alexandria</p>
                    {isGoogleConnected && linkedAccounts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {linkedAccounts.map(lac => (
                          <span key={lac.email} className="text-[9.5px] font-mono bg-[#C8A96B]/10 border border-[#C8A96B]/30 text-[#C8A96B] px-2 py-0.5 rounded-lg flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> {lac.email} ({lac.type})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isGoogleConnected && (
                    <button
                      onClick={() => setShowAddAccountModal(true)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[#C8A96B] hover:text-white border border-[#C8A96B]/30 hover:border-[#C8A96B] font-mono-aeon text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                    >
                      + Associar Conta
                    </button>
                  )}
                  <button
                    onClick={handleGoogleConnectToggle}
                    className={`px-4 py-1.5 font-mono-aeon text-[10px] font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isGoogleConnected 
                        ? "bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-black border border-red-500/30" 
                        : "bg-[#C8A96B] hover:bg-white text-black"
                    }`}
                  >
                    {isGoogleConnected ? <Unlink className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                    {isGoogleConnected ? "Desvincular Google" : "Login via Google Account"}
                  </button>
                </div>
              </div>

              {/* Sub grid: Google Drive (Storage) & Google Meet (Scheduling) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Google Drive Mock Container */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-amber-500" /> Google Drive Biblioteca
                      </h4>
                      <button
                        onClick={handleDriveUploadMock}
                        className="text-[9px] bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border border-[#C8A96B]/30 px-2 py-1 rounded font-mono-aeon uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Upload className="w-2.5 h-2.5" /> Backup PDF
                      </button>
                    </div>

                    <p className="text-[11.5px] font-garamond italic text-[#F5F5F5]/60 mb-3 block leading-relaxed">
                      "Uploads e monografias sincronizadas no Drive corporativo de forma automática com espelhamento local."
                    </p>

                    {/* Simulating uploading bar */}
                    {uploadProgress !== null && (
                      <div className="mb-4 bg-black/80 rounded-xl p-3 border border-[#C8A96B]/30">
                        <div className="flex justify-between text-[10px] font-mono text-[#C8A96B] mb-1">
                          <span>Sincronizando arquivo criptografado no Drive...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-500 to-[#C8A96B] h-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 max-h-[170px] overflow-y-auto scrollbar-thin pr-1">
                      {driveFiles.map(df => (
                        <div key={df.id} className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs hover:border-[#C8A96B]/10 transition-colors">
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-white truncate">{df.name}</p>
                            <p className="text-[9px] text-[#F5F5F5]/40 font-mono mt-0.5">{df.size} • {df.type} • Versão {df.version}</p>
                          </div>
                          <span className="text-[9px] bg-neutral-900 border border-white/10 px-1.5 py-0.5 rounded font-mono uppercase text-stone-400">
                            .{df.extension}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500">
                    📂 Caminho do Drive: <span className="text-stone-300">/AEON-Templo/Iniciados/Monografias</span>
                  </div>
                </div>

                {/* Google Meet Mock Scheduling Container */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Video className="w-4 h-4 text-blue-400" /> Google Meet Portal
                    </h4>

                    {/* New session scheduler form */}
                    <form onSubmit={handleCreateMeet} className="space-y-3 p-3.5 bg-black/40 rounded-xl border border-white/5 mb-4">
                      <span className="text-[9px] font-mono-aeon uppercase tracking-widest text-[#C8A96B] block font-bold">Gerar sala virtual síncrone</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newMeetTitle}
                          onChange={(e) => setNewMeetTitle(e.target.value)}
                          placeholder="Título do Debate..."
                          className="col-span-2 bg-black border border-[#C8A96B]/20 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#C8A96B] placeholder-stone-600"
                        />
                        <select
                          value={newMeetCircle}
                          onChange={(e) => setNewMeetCircle(e.target.value)}
                          className="bg-black border border-[#C8A96B]/20 rounded-lg p-1.5 text-xs text-stone-300 focus:outline-none cursor-pointer"
                        >
                          {circles.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="py-1.5 bg-[#C8A96B] hover:bg-white text-black font-mono-aeon text-[11px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                        >
                          Agendar + Link
                        </button>
                      </div>
                    </form>

                    <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-thin pr-1">
                      {meetSessions.map(ms => (
                        <div key={ms.id} className="p-2.5 bg-black/20 rounded-xl border border-white/5 hover:border-blue-500/10 transition-all text-xs">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white truncate max-w-[170px]">{ms.title}</span>
                            <span className="text-[8.5px] bg-[#C8A96B]/10 border border-[#C8A96B]/30 text-[#C8A96B] px-1 rounded uppercase font-mono">{ms.circle}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5 font-mono">
                            <a 
                              href={`https://${ms.code}`} 
                              target="_blank" 
                              rel="noreferrer"
                              onClick={(e) => {
                                triggerNotification(`Conectando à videoconferência do Meet para debate síncrono.`);
                                addLog("Google Meet API", `Videoconferência aberta via link: ${ms.code}`, "success");
                              }}
                              className="text-blue-400 hover:underline flex items-center gap-1.5"
                            >
                              <Video className="w-3.5 h-3.5" /> {ms.code}
                            </a>
                            <span>{ms.date} • {ms.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between">
                    <span className="text-[9.5px] font-mono text-stone-500">Integração bidirecional ativa</span>
                    <button
                      onClick={handleSyncAllCalendar}
                      disabled={isSyncingCalendar}
                      className="text-[9.5px] font-mono-aeon uppercase tracking-wider font-bold text-[#C8A96B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" /> {isSyncingCalendar ? "Sincronizando..." : "Sincronizar Calendar"}
                    </button>
                  </div>
                </div>

              </div>

              {/* Collaborative Google Docs Sandbox & Google Sheets Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Collaborative Google Docs Simulator (Left/Center) */}
                <div className="col-span-12 lg:col-span-7 bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" /> Google Docs Editor Colaborativo
                      </h4>
                      <button
                        onClick={() => {
                          setCoAuthorActive(!coAuthorActive);
                          triggerNotification(coAuthorActive ? "Modo colaborativo pausado." : "Iniciando inteligência editora participativa Sophia AI...");
                        }}
                        className={`text-[9.5px] font-mono-aeon uppercase font-bold tracking-wider px-2.5 py-1 rounded transition-all cursor-pointer ${
                          coAuthorActive ? "bg-purple-600 text-white animate-pulse" : "bg-[#C8A96B]/15 text-[#C8A96B] hover:bg-[#C8A96B] hover:text-black border border-[#C8A96B]/30"
                        }`}
                      >
                        {coAuthorActive ? "● Digitando Juntos..." : "Assessoramento Sophia IA"}
                      </button>
                    </div>

                    <p className="text-[11px] font-garamond italic text-[#F5F5F5]/40 mb-3 block">
                      "Redija ensaios e monografias em tempo real. Editores acadêmicos seniores ou Sophia AI podem cooperar."
                    </p>

                    <div className="space-y-4">
                      {/* Editor Canvas Container simulating Web docs page */}
                      <div className="relative bg-[#050505] p-3 rounded-xl border border-white/10">
                        <span className="absolute top-1 right-2 text-[8px] font-mono text-stone-600 uppercase">Abeon_Doc_v4</span>
                        <textarea
                          value={docsContent}
                          onChange={(e) => {
                            setDocsContent(e.target.value);
                            addLog("Google Docs API", "Documento atualizado via digitação local", "info");
                          }}
                          className="w-full bg-transparent text-xs text-[#F5F5F5]/90 min-h-[140px] focus:outline-none resize-none font-garamond leading-relaxed whitespace-pre-wrap"
                        />
                        {coAuthorActive && (
                          <div className="flex items-center gap-1.5 mt-2 text-[9px] font-mono text-purple-400 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Sophia AI está digitando no parágrafo final do Templo...
                          </div>
                        )}
                      </div>

                      {/* Small collaborative comments list */}
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-2">
                        <span className="text-[9px] font-mono-aeon text-stone-500 uppercase tracking-widest block font-bold">Painel de Revisões e Comentários</span>
                        
                        <div className="space-y-2 h-[80px] overflow-y-auto scrollbar-thin pr-1">
                          {commentsList.map(comm => (
                            <div key={comm.id} className="text-[10px] pb-1 border-b border-white/5 last:border-b-0">
                              <span className="font-bold text-[#C8A96B] font-cinzel">{comm.author}: </span>
                              <span className="text-stone-300 font-garamond italic">"{comm.content}"</span>
                              <span className="text-[8px] text-stone-600 ml-1.5">{comm.date}</span>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleAddDocComment} className="flex gap-2 pt-2">
                          <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Adicione comentário de revisão..."
                            className="flex-1 bg-black border border-white/10 rounded px-2 py-1 text-xs text-stone-300 focus:outline-none focus:border-[#C8A96B]"
                          />
                          <button
                            type="submit"
                            className="bg-[#C8A96B]/20 text-[#C8A96B] px-3 font-mono-aeon text-[10px] font-bold uppercase rounded hover:bg-[#C8A96B] hover:text-black transition-colors"
                          >
                            +
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9px] font-mono text-stone-500 truncate">
                    ✓ Versão final com backup sincronizado do Google Drive
                  </div>
                </div>

                {/* Google Sheets administrative database (Right/Center) */}
                <div className="col-span-12 lg:col-span-5 bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Table className="w-4 h-4 text-green-500" /> Google Sheets Consolidação
                      </h4>
                      <button
                        onClick={handleExportToSheets}
                        className="text-[9px] bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-black border border-green-500/30 px-2.5 py-1 rounded font-mono-aeon uppercase font-bold tracking-wider transition-all"
                      >
                        Sincronizar Sheets
                      </button>
                    </div>

                    <p className="text-[11px] font-garamond italic text-[#F5F5F5]/60 mb-3 block leading-relaxed">
                      "Dashboards de performance dos círculos em tabelas estruturadas com atualização em tempo real."
                    </p>

                    {/* Simulating active grade matrix */}
                    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden text-xs">
                      <div className="grid grid-cols-12 bg-[#111] p-2 text-[10px] text-[#C8A96B] font-mono-aeon uppercase font-bold tracking-wider border-b border-white/10">
                        <span className="col-span-6 truncate">Monografia / Ensaio</span>
                        <span className="col-span-3 text-center">Submissão</span>
                        <span className="col-span-3 text-right">Nota / Sinc</span>
                      </div>
                      <div className="divide-y divide-white/5 max-h-[170px] overflow-y-auto scrollbar-thin">
                        {sheetsData.map(row => (
                          <div key={row.id} className="grid grid-cols-12 p-2 hover:bg-white/5 transition-colors">
                            <div className="col-span-6 truncate">
                              <p className="font-bold text-white truncate">{row.title}</p>
                              <p className="text-[9px] text-[#F5F5F5]/30 truncate">{row.circle}</p>
                            </div>
                            <span className="col-span-3 text-center self-center text-stone-400 font-mono">{row.submissions}</span>
                            <span className="col-span-3 text-right self-center text-green-400 font-mono font-bold">★ {row.score.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/5 p-3 rounded-xl border border-green-500/10 mt-4 text-[9.5px] leading-relaxed">
                    <p className="text-green-400 uppercase font-mono-aeon font-bold mb-0.5">Sincronização de Relatórios</p>
                    <p className="text-stone-400 font-garamond italic">Sempre que docentes atualizam notas no Templo, os relatórios formatados em Google Sheets são retroalimentados de forma síncrona.</p>
                  </div>
                </div>

              </div>

              {/* Google Classroom & Google Chat Integrations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Google Classroom (Edu environment sync) */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                      <GraduationCap className="w-4.5 h-4.5 text-emerald-400" /> Google Classroom Cátedras
                    </h4>
                    <p className="text-xs font-garamond text-stone-300 leading-relaxed mb-4">
                      Vincule os círculos secretos da AEON às turmas oficiais do Google Classroom. Mentores gerenciam alunos, postam materiais exegéticos e consolidam notas diretamente de Alexandria.
                    </p>

                    <div className="space-y-3">
                      {classroomCohorts.map(cohort => (
                        <div key={cohort.id} className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <h5 className="font-bold text-white font-cinzel">{cohort.name}</h5>
                            <p className="text-[9.5px] text-stone-500 font-mono mt-1">
                              Código da Turma: <span className="text-[#C8A96B] font-bold">{cohort.enrollmentCode}</span> • Atividades: {cohort.assignmentsCount} • Leituras: {cohort.materialsCount}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSyncClassroom(cohort.id, cohort.name)}
                            className={`px-3 py-1 font-mono-aeon text-[9px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                              cohort.status === "Synced" 
                                ? "bg-green-500/10 text-green-400 border-green-500/30" 
                                : "bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border-[#C8A96B]/40"
                            }`}
                          >
                            {cohort.status === "Synced" ? "Turma Sincronizada" : "Sincronizar"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 flex gap-2 items-center justify-between">
                    <span className="text-[9px] font-mono text-stone-500">Cada círculo pode possuir um Classroom associado</span>
                    <button
                      onClick={() => handleCreateCohort("Círculo Alquimia Prática")}
                      className="text-[9.5px] font-mono-aeon uppercase tracking-wider font-bold text-[#C8A96B] hover:underline cursor-pointer"
                    >
                      + Criar Nova Cátedra Classroom
                    </button>
                  </div>
                </div>

                {/* Google Chat & Communication Sync */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-[#C8A96B]" /> Google Chat Espaços Sincronizados
                    </h4>
                    <p className="text-xs font-garamond text-stone-300 leading-relaxed mb-4">
                      Gera automaticamente espaços no Google Chat para discussão simultânea dos círculos iniciáticos. Todas as dúvidas e proezas científicas são integradas.
                    </p>

                    <div className="space-y-2.5 p-3.5 bg-black/40 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span> #Hermetismo-Estudos
                        </span>
                        <span className="text-[8px] bg-blue-500/15 border border-blue-500/30 text-blue-400 px-1 rounded font-mono uppercase">Ativo</span>
                      </div>
                      
                      <div className="space-y-1.5 max-h-[80px] overflow-y-auto scrollbar-thin text-[10.5px] font-garamond italic">
                        <p><strong className="text-[#C8A96B] non-italic font-mono">Mestre Aurelius:</strong> "Compartilhei o link traduzido do códice de Alexandria no espaço síncroto."</p>
                        <p><strong className="text-stone-300 non-italic font-mono">Tales:</strong> "Entendido. Sincronizando com a nossa base de anotações local."</p>
                      </div>

                      <button
                        onClick={() => {
                          triggerNotification("Enviando aviso de estudo ao Espaço Acadêmico do Google Chat...");
                          addLog("Google Chat API", "Encaminhado broadcast de tese ao espaço síncrono", "success");
                        }}
                        className="w-full mt-2 py-1.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border border-[#C8A96B]/30 rounded-lg text-[9px] font-mono-aeon font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Transmitir Mensagem de Sinergia
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500 flex justify-between">
                    <span>Sincronização bidirecional de mensagens</span>
                    <span className="text-stone-300">Google Chat API Webhook Ready</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 1.5: YOUTUBE BROADCAST & RECORDING HUB */}
          {internalTab === "youtube" && (
            <div className="space-y-6 animate-fade-in text-white">
              
              {/* Header Banner */}
              <div className="bg-[#050505]/75 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 text-red-500 mb-1">
                    <Video className="w-4.5 h-4.5 animate-pulse" />
                    <span className="text-[10px] uppercase font-mono-aeon tracking-wider font-bold">Transmissão, Distribuição & Produção Digital</span>
                  </div>
                  <h3 className="font-cinzel text-base font-bold uppercase text-white tracking-widest">YouTube Broadcast Hub</h3>
                  <p className="font-garamond text-xs text-stone-400 italic">Grave suas salas virtuais, transmita-as automaticamente para os canais corretos e indexe seus transcritos no acervo geral.</p>
                </div>
                <div className="flex items-center gap-3 bg-red-950/10 border border-red-900/40 p-2.5 rounded-xl">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <div className="text-left font-mono">
                    <p className="text-[9px] text-stone-500 uppercase font-bold">STATUS DA REDE</p>
                    <p className="text-xs text-red-400 font-bold uppercase tracking-wider">Pronto para Upload</p>
                  </div>
                </div>
              </div>

              {/* Grid: Channels and Video Search */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Connected Channels card */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-red-400" /> Canais Oficiais de Alexandria
                    </h4>
                    <p className="text-[11px] font-garamond italic text-stone-400 mb-4">
                      Selecione o canal de destino padrão para publicações de cada egrégora correspondente.
                    </p>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                      {youtubeChannels.map(ch => (
                        <div key={ch.id} className="p-3 bg-black/40 border border-white/5 hover:border-red-500/20 rounded-xl flex items-center justify-between transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center font-cinzel text-red-400 font-semibold flex-shrink-0 text-sm">
                              {ch.name.substring(6,8).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-stone-200 truncate pr-2">{ch.name}</p>
                              <p className="text-[9px] text-stone-500 font-mono mt-0.5">{ch.subCount} • {ch.videoCount} vídeos</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {ch.isDefault ? (
                              <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider bg-red-950/40 border border-red-900/50 text-red-400 px-2 py-0.5 rounded-full">
                                Padrão
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setYoutubeChannels(prev => prev.map(c => ({ ...c, isDefault: c.id === ch.id })));
                                  triggerNotification(`Destino de transmissão padrão alterado para: ${ch.name}`);
                                }}
                                className="text-[8px] font-mono font-bold uppercase tracking-wider bg-neutral-900 border border-stone-850 hover:border-red-500/40 text-stone-400 hover:text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                              >
                                Atribuir
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500">
                    Sincronizados via <span className="text-stone-300">YouTube Data API v3 OAuth</span>
                  </div>
                </div>

                {/* Video conceptual precise search */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-400" /> Busca de Conceitos em Vídeos
                    </h4>
                    <p className="text-[11px] font-garamond italic text-stone-400 mb-4">
                      Pesquise termos literais ou conceitos nas transcrições completas para encontrar o trecho exato de fala.
                    </p>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={videoSearchQuery}
                        onChange={(e) => setVideoSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleVideoConceptsSearch(); }}
                        placeholder="Ex: Zohar, Daath, Mentalismo, Alquimia..."
                        className="flex-1 bg-black border border-stone-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 placeholder-stone-700"
                      />
                      <button
                        onClick={handleVideoConceptsSearch}
                        className="bg-red-600 hover:bg-red-700 text-black font-mono-aeon text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                      >
                        Pesquisar
                      </button>
                    </div>

                    {/* Results lists */}
                    <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                      {videoSearchResults ? (
                        videoSearchResults.length === 0 ? (
                          <p className="text-xs italic text-stone-600 text-center py-6">Nenhum trecho correspondente encontrado.</p>
                        ) : (
                          videoSearchResults.map((resItem, idx) => (
                            <div key={idx} className="p-2.5 bg-black/60 rounded-xl border border-white/5 hover:border-red-500/20 text-xs transition-colors">
                              <div className="flex justify-between items-start mb-1 leading-none">
                                <span className="font-bold text-stone-200 truncate pr-1">{resItem.videoTitle}</span>
                                <span className="text-[9px] text-[#C8A96B] font-mono shrink-0">Prec: {resItem.score}</span>
                              </div>
                              <p className="text-[11px] font-garamond text-stone-400 leading-normal italic bg-stone-950 p-2 rounded border border-white/5 my-1.5">
                                {resItem.text}
                              </p>
                              <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-stone-500">
                                <span>Local: {resItem.speaker}</span>
                                <button
                                  onClick={() => {
                                    const matchingVid = youtubeVideos.find(v => v.id === resItem.videoId);
                                    if (matchingVid) {
                                      setActiveWatchVideo({ ...matchingVid, activeTimestamp: resItem.time });
                                      triggerNotification(`Iniciando player e saltando para trecho de ${resItem.time}...`);
                                    }
                                  }}
                                  className="text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 text-red-500" /> Assistir em {resItem.time}
                                </button>
                              </div>
                            </div>
                          ))
                        )
                      ) : (
                        <div className="text-center py-8 border border-dashed border-stone-900 rounded-xl">
                          <Search className="w-6 h-6 text-stone-700 mx-auto mb-1 animate-pulse" />
                          <p className="text-[10px] text-stone-500 font-garamond italic">Aguardando termo para exegese sônica profunda.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500 flex justify-between">
                    <span>Mapeamento de Transcrições Ativo</span>
                    <span>NVIDIA Whisper AI Model Fallback</span>
                  </div>
                </div>

              </div>

              {/* Simulated Video Player Modal overlay if active */}
              {activeWatchVideo && (
                <div className="bg-[#050505]/95 border border-red-500/30 rounded-2xl p-5 border-2 animate-fade-in space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-2.5">
                    <div>
                      <span className="text-[9px] tracking-wider text-[#C8A96B] font-mono uppercase font-bold">{activeWatchVideo.circle}</span>
                      <h4 className="font-cinzel text-xs font-bold text-white tracking-widest mt-0.5">{activeWatchVideo.title}</h4>
                    </div>
                    <button
                      onClick={() => setActiveWatchVideo(null)}
                      className="p-1.5 hover:bg-stone-900 text-stone-400 hover:text-white rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Player viewport mock */}
                  <div className="relative bg-[#020202] aspect-video max-h-[300px] w-full rounded-xl border border-stone-850 flex flex-col justify-between p-4 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>
                    
                    {/* Glowing effect */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/15 transition-all pointer-events-none"></div>

                    <div className="z-10 flex justify-between text-[10px] font-mono text-stone-500">
                      <span>YT Server: Sincronizado</span>
                      <span>Canal Principal AEON</span>
                    </div>

                    <div className="z-10 flex flex-col items-center justify-center text-center py-10">
                      <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-black flex items-center justify-center cursor-pointer transform hover:scale-110 active:scale-95 transition-all shadow-xl shadow-red-950/20">
                        <Play className="w-7 h-7 fill-black text-black ml-1" />
                      </div>
                      <span className="text-xs text-stone-300 font-garamond italic mt-4">
                        {activeWatchVideo.activeTimestamp ? `Trecho pré-pesquisado sintonizado para ${activeWatchVideo.activeTimestamp}` : "Transmissão acadêmica offline ativa"}
                      </span>
                    </div>

                    {/* Timeline Controls */}
                    <div className="z-10 text-stone-400 font-mono text-[9px] space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{activeWatchVideo.activeTimestamp || "00:00"}</span>
                        <span>{activeWatchVideo.duration}</span>
                      </div>
                      <div className="w-full bg-stone-900 h-1 rounded-full cursor-pointer overflow-hidden relative">
                        <div 
                          className="bg-red-600 h-full transition-all" 
                          style={{ width: activeWatchVideo.activeTimestamp ? "34%" : "12%" }}
                        ></div>
                        <div 
                          className="absolute w-2 h-2 rounded-full bg-white top-1/2 transform -translate-y-1/2 -ml-1 border border-stone-950" 
                          style={{ left: activeWatchVideo.activeTimestamp ? "34%" : "12%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video List and Control board */}
              <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5">
                <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Layers2 className="w-4 h-4 text-red-500" /> Grade de Gravações e Publicações
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-900 text-stone-500 font-mono-aeon uppercase tracking-wider text-[9px]">
                        <th className="py-2.5">Título do Evento</th>
                        <th className="py-2.5">Círculo</th>
                        <th className="py-2.5">Gravação Aut.</th>
                        <th className="py-2.5">Visibilidade</th>
                        <th className="py-2.5">Playlist YouTube</th>
                        <th className="py-2.5 text-right font-bold">Ações de Distribuição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900">
                      {youtubeVideos.map(vid => (
                        <tr key={vid.id} className={`hover:bg-white/5 transition-colors ${selectedYtVideoForDetails === vid.id ? "bg-white/2" : ""}`}>
                          <td className="py-3 pr-2 font-cinzel font-bold text-stone-200">
                            <span 
                              onClick={() => setSelectedYtVideoForDetails(vid.id)} 
                              className="hover:text-red-400 cursor-pointer text-xs leading-snug tracking-wide block"
                            >
                              {vid.title}
                            </span>
                            <span className="text-[9px] text-stone-500 font-mono block mt-0.5 font-normal">{vid.date} • {vid.duration}</span>
                          </td>
                          <td className="py-3 text-stone-300 font-sans">{vid.circle}</td>
                          <td className="py-3">
                            <button
                              onClick={() => {
                                setYoutubeVideos(prev => prev.map(v => v.id === vid.id ? { ...v, autoRecord: !v.autoRecord } : v));
                                triggerNotification(`Gravação Automática para "${vid.title}" ${!vid.autoRecord ? "ATIVADA" : "DESATIVADA"}`);
                              }}
                              className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold tracking-widest border cursor-pointer transition-colors ${
                                vid.autoRecord 
                                  ? "bg-red-950/40 border-red-900/60 text-red-400" 
                                  : "bg-neutral-900/40 border-stone-850 text-stone-500 hover:text-stone-300"
                              }`}
                            >
                              {vid.autoRecord ? "Sim" : "Não"}
                            </button>
                          </td>
                          <td className="py-3">
                            <select
                              value={vid.visibility}
                              onChange={(e) => {
                                const newVis = e.target.value;
                                setYoutubeVideos(prev => prev.map(v => v.id === vid.id ? { ...v, visibility: newVis } : v));
                                triggerNotification(`Visibilidade de "${vid.title}" alterada para: ${newVis}`);
                              }}
                              className="bg-black border border-stone-850 rounded p-1 text-[10px] text-stone-300 focus:outline-none cursor-pointer"
                            >
                              <option value="Público">Público</option>
                              <option value="Não Listado">Não Listado</option>
                              <option value="Privado">Privado</option>
                              <option value="Agendado">Agendado</option>
                            </select>
                          </td>
                          <td className="py-3">
                            <select
                              value={vid.playlist}
                              onChange={(e) => {
                                const newPl = e.target.value;
                                setYoutubeVideos(prev => prev.map(v => v.id === vid.id ? { ...v, playlist: newPl } : v));
                                triggerNotification(`Vínculo de Playlist alterado para: ${newPl}`);
                              }}
                              className="bg-black border border-stone-850 rounded p-1 text-[10px] text-stone-300 focus:outline-none cursor-pointer"
                            >
                              <option value="Zohar Semiótico">Zohar Semiótico</option>
                              <option value="Filosofia Hermética">Filosofia Hermética</option>
                              <option value="Alquimia Prática">Alquimia Prática</option>
                              <option value="Estudos Gerais">Estudos Gerais</option>
                            </select>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1.5 matches">
                              {vid.status === "Pronto" ? (
                                <button
                                  onClick={() => {
                                    setUploadingVideoId(vid.id);
                                    setUploadVideoProgress(0);
                                    triggerNotification(`Estabelecendo handshake de transmissão e enviando "${vid.title}" para YouTube...`);
                                    
                                    const interval = setInterval(() => {
                                      setUploadVideoProgress(p => {
                                        if (p >= 100) {
                                          clearInterval(interval);
                                          setTimeout(() => {
                                            setYoutubeVideos(prev => prev.map(v => v.id === vid.id ? { ...v, status: "Publicado" } : v));
                                            setUploadingVideoId(null);
                                            triggerNotification(`Upload concluído com sucesso! Vídeo "${vid.title}" publicado como [${vid.visibility}].`);
                                            addLog("YouTube API", `Aula '${vid.title}' publicada no YouTube como ${vid.visibility}.`, "success");
                                          }, 500);
                                          return 100;
                                        }
                                        return p + 25;
                                      });
                                    }, 250);
                                  }}
                                  disabled={uploadingVideoId !== null}
                                  className="px-2.5 py-1 bg-[#C8A96B]/10 border border-[#C8A96B]/40 hover:bg-[#C8A96B] hover:text-black font-mono text-[9px] font-bold uppercase tracking-widest rounded transition-colors cursor-pointer"
                                >
                                  {uploadingVideoId === vid.id ? `Enviando ${uploadVideoProgress}%` : "Publicar no YouTube"}
                                </button>
                              ) : (
                                <span className="text-[9px] font-mono text-green-400 flex items-center gap-1 uppercase tracking-widest font-bold bg-green-950/40 border border-green-900/40 px-2 py-0.5 rounded">
                                  <Check className="w-3 h-3 text-green-400" /> Publicado
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dynamic Transcript & Academic Analysis Details Box */}
              {selectedYtVideoForDetails && (
                (() => {
                  const currVid = youtubeVideos.find(v => v.id === selectedYtVideoForDetails);
                  if (!currVid) return null;
                  return (
                    <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 animate-fade-in grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left Block detailing academic content summaries */}
                      <div className="col-span-12 md:col-span-5 space-y-4">
                        <div className="border-b border-stone-900 pb-2.5">
                          <span className="text-[10px] tracking-wider text-red-400 font-mono uppercase bg-red-950/40 px-2 py-0.5 rounded border border-red-900/40">
                            Processamento Cognitivo Ativo
                          </span>
                          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest mt-2">{currVid.title}</h4>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <span className="text-[9px] text-[#C8A96B] font-mono uppercase font-bold tracking-widest block mb-1">Resumo Acadêmico da IA</span>
                            <p className="font-garamond text-xs text-stone-300 leading-relaxed italic border-l border-[#C8A96B]/30 pl-3">
                              "{currVid.summary}"
                            </p>
                          </div>

                          <div>
                            <span className="text-[9px] text-[#C8A96B] font-mono uppercase font-bold tracking-widest block mb-1.5">Tópicos Bibliográficos Indexados</span>
                            <div className="flex flex-wrap gap-1.5">
                              {currVid.topics.map((t, i) => (
                                <span key={i} className="text-[9.5px] uppercase tracking-wider font-mono font-bold bg-[#C8A96B]/10 border border-[#C8A96B]/30 text-[#C8A96B] px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Video indices map link */}
                          <div className="bg-blue-950/10 border border-blue-900/40 p-3 rounded-xl">
                            <span className="text-[9px] text-blue-400 font-mono uppercase block font-bold mb-1">Índice de Vídeo-Conhecimento Global</span>
                            <p className="font-garamond text-xs text-stone-400">Este debate está associado filologicamente ao círculo <strong className="text-[#C8A96B]">{currVid.circle}</strong> e referenciado no Tomo III do Corpus Hermeticum.</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Block displaying transcripts or timelines */}
                      <div className="col-span-12 md:col-span-7 flex flex-col gap-4">
                        <div className="bg-stone-950/80 border border-stone-900 rounded-xl p-4 flex flex-col h-[200px] justify-between">
                          <span className="text-[9px] text-stone-400 font-mono uppercase font-bold mb-1.5 block">Transcrição do Nous (Estágio Whisper)</span>
                          <div className="text-xs font-garamond text-stone-300 leading-relaxed overflow-y-auto max-h-[120px] pr-1 scrollbar-thin italic">
                            "{currVid.transcript}"
                          </div>
                          <div className="text-[9px] font-mono text-stone-500 mt-2 text-right">
                            Subtítulos e Timecodes gerados automáticos • 100% integridade
                          </div>
                        </div>

                        {/* Interactive Timeline index with jump links */}
                        <div className="bg-zinc-950/50 border border-stone-900 rounded-xl p-4">
                          <span className="text-[9px] text-[#C8A96B] font-mono uppercase font-bold mb-3 block">Índice Temporal Interativo do Debate</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currVid.timeline.map((tl, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setActiveWatchVideo({ ...currVid, activeTimestamp: tl.time });
                                  triggerNotification(`Saltando gravação de vídeo para o momento [${tl.time}] - ${tl.desc}`);
                                }}
                                className="p-2 bg-black/60 hover:bg-[#C8A96B]/10 border border-white/5 hover:border-[#C8A96B]/40 text-left rounded-lg text-xs transition-colors flex items-center gap-2 group cursor-pointer"
                              >
                                <span className="text-[10px] text-red-500 font-mono font-bold">{tl.time}</span>
                                <span className="text-stone-300 group-hover:text-[#C8A96B] font-garamond truncate">{tl.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })()
              )}

            </div>
          )}

          {/* TAB 1.6: NVIDIA AI COGNITIVE CENTER */}
          {internalTab === "nvidia" && (
            <div className="space-y-6 animate-fade-in text-white">

              {/* NVIDIA Header */}
              <div className="bg-gradient-to-r from-emerald-950/20 via-black to-[#050505] border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-1 z-10 relative">
                    <Cpu className="w-5 h-5 animate-pulse text-emerald-400" />
                    <span className="text-[10px] uppercase font-mono-aeon tracking-wider font-bold">NVIDIA AI Enterprise Ecosystem</span>
                  </div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-widest text-white z-10 relative">
                    NVIDIA AI Cognitive Center
                  </h3>
                  <p className="font-garamond text-xs text-stone-400 italic z-10 relative">
                    Motor cognitivo de ponta alimentando o AEON Oracle • Aceleração NIM, RAG avançado e NeMo Guardrails.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl shrink-0 z-10 relative shadow-xl">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <div className="text-left font-mono">
                    <p className="text-[8.5px] text-stone-400 uppercase font-bold">NVIDIA ACTIVE PODS</p>
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Llama-3-70B • Ready</p>
                  </div>
                </div>
              </div>

              {/* Main double split row */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left: Configurations & Performance Indicators */}
                <div className="xl:col-span-5 space-y-6">
                  
                  {/* CONFIG PANEL CARD */}
                  <div className="bg-[#0a0a0a]/50 border border-stone-850 rounded-2xl p-5 space-y-4">
                    <h4 className="font-cinzel text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Parâmetros de Motor NIM
                    </h4>
                    
                    <div className="space-y-4 text-[10px] font-mono">
                      <div>
                        <label className="block text-stone-400 uppercase font-bold mb-1.5">Escolha do Modelo Fundacional:</label>
                        <div className="space-y-2">
                          {[
                            { id: "meta/llama-3-70b-instruct", label: "meta/llama-3-70b-instruct NIM", desc: "Altíssima performance para lógica e exegese complexa" },
                            { id: "nvidia/neva-22b", label: "nvidia/neva-22b NIM (Hermético)", desc: "Visão computacional de símbolos esotéricos" },
                            { id: "openai/gpt-4o-mini", label: "openai/gpt-4o-mini (Fallback)", desc: "Sincronizador alternativo resiliente" }
                          ].map(modelOpt => (
                            <div 
                              key={modelOpt.id}
                              onClick={() => {
                                setNvidiaModel(modelOpt.id);
                                triggerNotification(`Motor cognitivo modificado para: ${modelOpt.label}`);
                              }}
                              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                                nvidiaModel === modelOpt.id 
                                  ? "bg-emerald-950/20 border-emerald-500 text-emerald-400" 
                                  : "bg-black border-stone-900 hover:border-stone-750 text-stone-400"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${nvidiaModel === modelOpt.id ? "bg-emerald-400 animate-ping" : "bg-stone-600"}`}></span>
                                <span className="font-bold">{modelOpt.label}</span>
                              </div>
                              <p className="text-[8.5px] text-stone-500 font-sans mt-1 leading-normal">{modelOpt.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-stone-400 uppercase font-bold mb-1">Temperatura: {nvidiaTemperature}</label>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.1" 
                            value={nvidiaTemperature} 
                            onChange={(e) => setNvidiaTemperature(parseFloat(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer bg-stone-900 h-1 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 uppercase font-bold mb-1">Max Tokens: {nvidiaMaxTokens}</label>
                          <select 
                            value={nvidiaMaxTokens} 
                            onChange={(e) => setNvidiaMaxTokens(parseInt(e.target.value))}
                            className="w-full bg-black border border-stone-850 rounded p-1.5 text-[9px] cursor-pointer"
                          >
                            <option value={1024}>1024 (Rápido)</option>
                            <option value={2048}>2048 (Ideal)</option>
                            <option value={4096}>4096 (Profundo)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-900 space-y-2">
                        {[
                          { field: "rag", state: nvidiaRagEnabled, setState: setNvidiaRagEnabled, label: "RAG Multimodal Habilitado", info: "Busca na biblioteca central" },
                          { field: "guardrails", state: nvidiaGuardrailsEnabled, setState: setNvidiaGuardrailsEnabled, label: "NeMo Guardrails (Estrito)", info: "Filtragem hermética" }
                        ].map(sw => (
                          <div key={sw.field} className="flex justify-between items-center bg-black/40 p-2 border border-white/5 rounded-xl">
                            <div>
                              <p className="text-[9px] text-stone-300 font-bold">{sw.label}</p>
                              <p className="text-[8px] text-stone-500 font-sans">{sw.info}</p>
                            </div>
                            <button
                              onClick={() => {
                                sw.setState(!sw.state);
                                triggerNotification(`${sw.label} modificado.`);
                              }}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${sw.state ? "bg-emerald-500 text-black" : "bg-zinc-800"}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${sw.state ? "translate-x-4" : "translate-x-0"}`}></div>
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* COGNITIVE PERFORMANCE METRICS CARD */}
                  <div className="bg-[#0a0a0a]/50 border border-stone-850 rounded-2xl p-5 space-y-3">
                    <h4 className="font-cinzel text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Painel de Consumo & Performance NVIDIA
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-black/50 border border-stone-900 rounded-xl">
                        <span className="text-[8px] text-stone-500 uppercase block font-mono">Consumo total acumulado</span>
                        <span className="text-sm font-mono text-emerald-400 font-bold mt-1 block">{aiMetrics.totalTokens.toLocaleString()} tkn</span>
                      </div>
                      <div className="p-3 bg-black/50 border border-stone-900 rounded-xl">
                        <span className="text-[8px] text-stone-500 uppercase block font-mono">Custos de Computação</span>
                        <span className="text-sm font-mono text-emerald-400 font-bold mt-1 block">{aiMetrics.totalCost} USD</span>
                      </div>
                      <div className="p-3 bg-black/50 border border-stone-900 rounded-xl">
                        <span className="text-[8px] text-stone-500 uppercase block font-mono">Latência Média NIM</span>
                        <span className="text-sm font-mono text-emerald-400 font-bold mt-1 block">{aiMetrics.avgLatency}</span>
                      </div>
                      <div className="p-3 bg-black/50 border border-stone-900 rounded-xl">
                        <span className="text-[8px] text-stone-500 uppercase block font-mono">TensorRT Cache Hit Rate</span>
                        <span className="text-sm font-mono text-emerald-400 font-bold mt-1 block">{aiMetrics.cacheHitRate}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right: Live Interactive AEON ORACLE Simulator */}
                <div className="xl:col-span-7 bg-[#0a0a0a]/50 border border-stone-850 rounded-2xl p-5 flex flex-col justify-between h-[515px]">
                  <div>
                    <div className="flex justify-between items-center border-b border-stone-900 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                          <Bot className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest leading-none">AEON ORACLE Assistant</h4>
                          <span className="text-[9px] text-stone-500 font-mono italic block mt-1">Consciência Sintética Ativa</span>
                        </div>
                      </div>

                      {/* Context selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-stone-500 uppercase font-bold">Contexto:</span>
                        <select
                          value={aiContext}
                          onChange={(e) => {
                            const newCont = e.target.value;
                            setAiContext(newCont);
                            triggerNotification(`Contexto do AEON ORACLE sintonizado para: [${newCont}]`);
                          }}
                          className="bg-black border border-stone-850 rounded p-1 text-[9px] text-stone-300 focus:outline-none cursor-pointer"
                        >
                          <option value="global">Global (Sem contexto local)</option>
                          <option value="book">Livro: A Tábua de Esmeralda</option>
                          <option value="research">Pesquisa: Gematria e Cosmologia</option>
                          <option value="event">Evento: Simpósio Zohar</option>
                          <option value="tree">Evolução Sefirótica (Tales)</option>
                        </select>
                      </div>
                    </div>

                    {/* Chat screen display */}
                    <div className="bg-[#050505] border border-stone-900 rounded-xl p-4.5 h-[300px] overflow-y-auto scrollbar-thin space-y-4">
                      {aiChatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                            msg.sender === "user" 
                              ? "bg-emerald-950/30 border border-emerald-900/50 text-emerald-200" 
                              : "bg-stone-900/40 border border-stone-850 text-stone-300 font-sans italic"
                          }`}>
                            <div className="flex items-center justify-between mb-1 text-[8px] font-mono uppercase text-stone-500">
                              <span>{msg.sender === "user" ? "Iniciado Tales" : "AEON Oracle (NVIDIA NIM Llama-3)"}</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <p className="font-garamond whitespace-pre-wrap">{msg.text}</p>
                            {msg.sender === "oracle" && (
                              <div className="flex items-center justify-between mt-2.5 border-t border-stone-850 pt-1.5">
                                <span className="text-[7.5px] font-mono text-emerald-500 uppercase tracking-widest font-bold bg-emerald-950/30 px-1 py-0.5 rounded">
                                  RAG ACTIVE
                                </span>
                                <button
                                  onClick={() => {
                                    setAudioVoiceActive(true);
                                    setCurrentNarratingText(msg.text);
                                    triggerNotification(`Sintonizando Riva TTS: Narrando e lendo resposta em voz alta.`);
                                    
                                    setTimeout(() => {
                                      setAudioVoiceActive(false);
                                    }, 4000);
                                  }}
                                  className="text-[8.5px] font-mono text-[#C8A96B] hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-[#C8A96B]" /> Ouvir por Voz (TTS)
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Glowing audio speaker feedback */}
                      {audioVoiceActive && (
                        <div className="flex items-center justify-center gap-1 bg-[#C8A96B]/15 border border-[#C8A96B]/30 rounded-full p-2.5 max-w bg-stone-950 text-xs text-[#C8A96B] animate-pulse">
                          <Volume2 className="w-4 h-4 text-[#C8A96B]" />
                          <span className="font-mono text-[9px] uppercase tracking-widest font-bold">Transmitindo voz em tempo real ({selectedVoice} - {selectedLanguage.toUpperCase()})...</span>
                          <div className="flex items-end gap-1.5 h-3">
                            <span className="w-1 h-2 bg-[#C8A96B] animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                            <span className="w-1 h-3 bg-[#C8A96B] animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                            <span className="w-1 h-1.5 bg-[#C8A96B] animate-bounce" style={{ animationDelay: "0.5s" }}></span>
                          </div>
                        </div>
                      )}

                      {isAiResponding && (
                        <div className="text-xs italic text-[#C8A96B] font-mono select-none animate-pulse">
                          <span>⚙️ Oracle consultando NIM embeddings e bibliotecas...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input line */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAiChatInput) return;

                      const userMsg = {
                        sender: "user" as const,
                        text: newAiChatInput,
                        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
                        context: aiContext
                      };

                      setAiChatMessages(prev => [...prev, userMsg]);
                      setNewAiChatInput("");
                      setIsAiResponding(true);

                      // Simulate smart contextual response
                      setTimeout(() => {
                        let responseText = `Recebi sua indagação acadêmica sobre o Templo. Nosso motor RAG local examinou os dados de índice em Alexandria. `;
                        
                        if (aiContext === "book") {
                          responseText = `Análise Especializada: Tábua de Esmeralda\n\nNossos tomos acadêmicos revelam que o axioma 'O que está embaixo é como o que está em cima' representa um circuito elétrico-quântico de ressonância natural. A transmutação alquímica expressa neste manuscrito de Hermes designa a reorganização molecular da psique do Adepto. Recomendo investigar o capítulo V do Corpus Hermeticum.`;
                        } else if (aiContext === "research") {
                          responseText = `Análise Especializada: Gematria e Cosmologia\n\nA sua tese busca relacionar as flutuações das esferas espaciais à ressonância numérica da Gematria clássica. Do ponto de vista conceitual de Llama-3-70B NIM, o modelo aponta que o número cabalístico de Kether relaciona-se formalmente às equações de entropia da relatividade.`;
                        } else if (aiContext === "event") {
                          responseText = `Análise Especializada: Simpósio Zohar\n\nDurante o debate, Frater Tales e Mestre Aurelius convergiram que a esfera invisível de Daath simboliza a ausência que tudo conecta. Um mapa conceitual dessa simetria foi gerado nos painéis integrados e a bibliografia aponta correlação com Eliphas Levi.`;
                        } else if (aiContext === "tree") {
                          responseText = `Análise Especializada: Conselheiro Sefirótico para Tales\n\nTales, vejo que sua disciplina (Geburah) e seu estudo estructurado (Binah) mostram vigor com notas elevadas. No entanto, sua presença prática (Malkuth) está ligeiramente negligenciada. Para seu propósito de transcendência acadêmica, recomendo dedicar 1 hora a mais na catalogação de ensaios no diário de Gnosis.`;
                        } else {
                          responseText += `\n\nContinuando suas reflexões na cátedra de Alexandria, o oráculo aconselha realizar uma busca analítica nos vídeos de YouTube integrados para ouvir debates de outros irmãos sobre este tema.`;
                        }

                        setAiChatMessages(prev => [...prev, {
                          sender: "oracle",
                          text: responseText,
                          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        }]);
                        setIsAiResponding(false);

                        // Increment metrics token representation
                        setAiMetrics(prev => ({
                          ...prev,
                          totalTokens: prev.totalTokens + Math.floor(Math.random() * 250) + 100,
                          totalQueries: prev.totalQueries + 1
                        }));

                        triggerNotification("O Oráculo formulou sua resposta contextualizada.");
                      }, 1800);
                    }}
                    className="flex gap-2 border-t border-stone-900 pt-3.5 mt-3"
                  >
                    <input
                      type="text"
                      value={newAiChatInput}
                      onChange={(e) => setNewAiChatInput(e.target.value)}
                      placeholder="Indague o Oráculo sintetizado NVIDIA..."
                      className="flex-1 bg-black border border-stone-850 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 placeholder-stone-700 font-sans"
                    />
                    
                    {/* Select Voice */}
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="bg-black border border-stone-850 rounded-xl text-[9px] p-2 text-stone-400 focus:outline-none cursor-pointer"
                      title="Escolha a Voz"
                    >
                      <option value="Hermético Solene">Voz: Solene ⚔️</option>
                      <option value="Mentor Clássico">Voz: Mentor 📜</option>
                      <option value="Voz Feminina Sophia">Voz: Sophia 🌌</option>
                    </select>

                    {/* Language translated selection */}
                    <select
                      value={selectedLanguage}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setSelectedLanguage(newLang);
                        triggerNotification(`Linguagem de voz alterada para: [${newLang.toUpperCase()}]`);
                      }}
                      className="bg-black border border-stone-850 rounded-xl text-[9px] p-2 text-stone-400 focus:outline-none cursor-pointer"
                      title="Escolha o Idioma"
                    >
                      <option value="pt">PT-BR 🇧🇷</option>
                      <option value="en">EN-US 🇺🇸</option>
                      <option value="es">ES-ES 🇪🇸</option>
                      <option value="fr">FR-FR 🇫🇷</option>
                      <option value="de">DE-DE 🇩🇪</option>
                      <option value="zh">ZH-CN 🇨🇳</option>
                      <option value="ja">JA-JP 🇯🇵</option>
                    </select>

                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-black font-mono-aeon text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer transition-colors"
                    >
                      Enviar
                    </button>
                  </form>
                </div>

              </div>

              {/* Advanced Cognitive Modules Area */}
              <div className="bg-[#0a0a0a]/50 border border-stone-850 rounded-2xl p-5 space-y-6">
                
                {/* Internal sub tabs of cognitive modules */}
                <div className="border-b border-stone-900 pb-3 flex flex-wrap gap-2.5">
                  <span className="text-[10px] text-emerald-400 font-mono-aeon uppercase tracking-widest font-bold self-center mr-4">Módulos Cognitivos:</span>
                  
                  {[
                    { id: "rag", label: "Indexador RAG" },
                    { id: "revisar", label: "Assessor de Pesquisas" },
                    { id: "videos", label: "IA para Aulas" }
                  ].map(modTab => (
                    <button
                      key={modTab.id}
                      onClick={() => {
                        setSelectedVideoForAiTools(modTab.id === "videos" ? "yt-1" : selectedVideoForAiTools);
                        setSelectedConceptNode(null);
                        setAiVideoExerciseCompleted(false);
                        setAiVideoExerciseCorrect(null);
                        setAiVideoExerciseChoice(null);
                        triggerNotification(`Mudando ferramenta cognitiva para: [${modTab.label}]`);
                      }}
                      className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                        selectedVideoForAiTools === modTab.id 
                          ? "bg-emerald-950/30 border-emerald-500 text-emerald-400" 
                          : "bg-black/60 border-stone-900 text-stone-400 hover:text-white hover:border-stone-800"
                      }`}
                    >
                      {modTab.label}
                    </button>
                  ))}
                </div>

                {/* Sub Tab: RAG INDEXER */}
                {selectedVideoForAiTools === "rag" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                    <div className="md:col-span-6 space-y-3">
                      <h5 className="font-cinzel text-xs text-white uppercase tracking-widest font-bold">Gestor de Conhecimento RAG</h5>
                      <p className="text-xs font-garamond text-stone-300 leading-relaxed leading-normal">
                        Alimente as respostas do AEON ORACLE indexando suas fontes locais. Nosso mecanismo NVIDIA RAG cria embeddings semânticos dinâmicos que cruzam referências de parágrafos literários do acervo do Templo.
                      </p>
                      <button
                        onClick={() => {
                          setIsIndexingSources(true);
                          triggerNotification("Enviando ordens de indexação para pods NVIDIA Retriever...");
                          setTimeout(() => {
                            setIsIndexingSources(false);
                            setRagSources(prev => prev.map(s => ({ ...s, status: "Indexed", lastIndexed: "Agora mesmo" })));
                            triggerNotification("Holograma RAG de Alexandria atualizado!");
                            addLog("NVIDIA RAG", "Re-indexação total de 5.1M tokens concluída com sucesso.", "success");
                          }, 1500);
                        }}
                        disabled={isIndexingSources}
                        className="py-1.5 px-4 bg-[#C8A96B]/15 hover:bg-[#C8A96B] hover:text-black text-[#C8A96B] font-mono-aeon text-[10px] font-bold uppercase tracking-widest rounded-lg border border-[#C8A96B]/30 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        {isIndexingSources ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mapeando Códices...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-pulse" /> Re-indexar Fontes Cognitivas
                          </>
                        )}
                      </button>
                    </div>

                    <div className="md:col-span-6 space-y-2">
                      {ragSources.map(src => (
                        <div key={src.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[9px] text-[#C8A96B] font-mono uppercase bg-[#C8A96B]/10 px-1.5 py-0.5 rounded mr-2 font-bold">{src.type}</span>
                            <span className="font-bold text-stone-300 font-sans">{src.name}</span>
                            <p className="text-[8.5px] text-stone-500 font-mono mt-1">Peso: {src.tokens} • Sinc: {src.lastIndexed}</p>
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                            {src.status === "Indexed" ? "Indexado" : "Pendente"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Tab: ACADEMIC PEER REVIEW ASSESSOR */}
                {selectedVideoForAiTools === "revisar" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                    
                    {/* Assessor selection draft */}
                    <div className="md:col-span-5 space-y-4">
                      <h5 className="font-cinzel text-xs text-white uppercase tracking-widest font-bold">Assessor IA de Artigos e Pesquisas</h5>
                      <p className="text-xs font-garamond text-stone-300 leading-normal mb-2">
                        Selecione um artigo em andamento nos rascunhos acadêmicos e submeta para análise crítica rigorosa da comissão avaliadora de Alexandria.
                      </p>

                      <div className="space-y-3 text-[10px] font-mono">
                        <div>
                          <label className="block text-stone-400 uppercase font-bold mb-1.5">Monografia Alvo:</label>
                          <select
                            value={aiReviewTargetResearch}
                            onChange={(e) => {
                              setAiReviewTargetResearch(e.target.value);
                              setAiReviewResult(null);
                            }}
                            className="w-full bg-black border border-stone-850 p-2 text-stone-250 focus:outline-none cursor-pointer rounded-lg text-xs"
                          >
                            <option value="Gematria e Cosmologia no Século XXI">Tales - Gematria e Cosmologia no Século XXI</option>
                            <option value="Axiomas de Hermes: Reinterpretações">Aurelius - Axiomas de Hermes: Reinterpretações</option>
                            <option value="Hermenêutica e Semiótica do Zohar">Vesta - Hermenêutica do Zohar e a Mitologia Antiga</option>
                          </select>
                        </div>
                        
                        <button
                          onClick={() => {
                            setIsAiReviewing(true);
                            triggerNotification(`Acionando painel avaliador Llama-3 NIM para monografia "${aiReviewTargetResearch}"...`);
                            
                            setTimeout(() => {
                              setIsAiReviewing(false);
                              setAiReviewResult(
                                `### REVISÃO POR PARES AUTORIZADA DA MONOGRAFIA\n\n` +
                                `**Título**: ${aiReviewTargetResearch}\n` +
                                `**Status Decisório**: APROVADO CONDICIONALMENTE (Comissão Editorial)\n\n` +
                                `#### 1. Inconsistências Identificadas\n` +
                                `O manuscrito propõe premissas consistentes sobre o sincronismo, mas carece de contextualização histórica acerca dos papiros gnósticos escavados no século XIX. Reorganize a seção de transições no terceiro capítulo.\n\n` +
                                `#### 2. Citações e Referências bibliográficas Recomendadas\n` +
                                `- *Corpus Hermeticum, Tradução Acadêmica Crítica* (Cátedra de Oxford).\n` +
                                `- *Agnostos Theos - Estudos do Semiótica de Alexandria* (Dion Fortune).\n\n` +
                                `#### 3. Proposta de Revisão Filológica\n` +
                                `Recomenda-se harmonizar o conceito de correspondência (Hermetismo) com as leis de entrelaçamento quântico.`
                              );
                              triggerNotification("Parecer avaliador de IA gerado com sucesso!");
                              addLog("NVIDIA NeMo Evaluator", `Parecer analítico emitido para: ${aiReviewTargetResearch}`, "success");
                            }, 1400);
                          }}
                          disabled={isAiReviewing}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-black font-mono-aeon text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
                        >
                          {isAiReviewing ? "⚙️ Analisando Linhas do Artigo..." : "Avaliar com NVIDIA NIM"}
                        </button>
                      </div>
                    </div>

                    {/* Report Output */}
                    <div className="md:col-span-7 bg-zinc-950 p-4 rounded-xl border border-stone-900 h-[220px] overflow-y-auto scrollbar-thin text-xs text-stone-300">
                      {aiReviewResult ? (
                        <div className="font-sans leading-relaxed whitespace-pre-wrap">
                          <p className="text-emerald-400 font-mono-aeon uppercase tracking-wider text-[10px] font-bold border-b border-stone-900 pb-2 mb-3">
                            ✓ Relatório do Templo Emitido
                          </p>
                          <div className="font-garamond text-xs whitespace-pre-wrap">{aiReviewResult}</div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col justify-center items-center text-center text-stone-500 font-garamond italic">
                          <AlertTriangle className="w-8 h-8 text-stone-700 mb-2 animate-bounce" />
                          <p>Nenhuma auditoria gerada pela IA de Alexandria ainda. Pressione "Avaliar com NVIDIA NIM".</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Sub Tab: IA VIDEO POST-CLASS PROCESSSING SUITE */}
                {selectedVideoForAiTools === "videos" && (
                  <div className="space-y-6 animate-fade-in text-xs text-[#F5F5F5]/90">
                    
                    {/* Header chooser */}
                    <div className="flex gap-4 items-center justify-between border-b border-stone-900 pb-3">
                      <div>
                        <h5 className="font-cinzel text-xs text-white uppercase tracking-widest font-bold">Processador de Vídeo Coletivos</h5>
                        <p className="font-garamond text-stone-400 leading-snug">Converta aulas e seminários gravados em flashcards, testes escolares e mapas mentais automáticos.</p>
                      </div>
                      <select
                        value={selectedVideoForAiTools === "videos" ? "yt-1" : "yt-1"}
                        className="bg-black border border-stone-850 rounded p-1.5 text-stone-300 cursor-pointer"
                        disabled
                      >
                        <option value="yt-1">Zohar & Esfera de Daath</option>
                      </select>
                    </div>

                    {/* Interactive Multi Sub module options */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Sub column 1: Flashcards */}
                      <div className="bg-zinc-950 p-4 border border-stone-900 rounded-xl flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] text-[#C8A96B] font-mono uppercase font-bold tracking-widest block mb-2">Módulo I: Flashcards Construtivos</span>
                          
                          {/* Flippable card preview */}
                          <div 
                            onClick={() => setAiVideoFlippedCardIndex(p => p === 0 ? null : 0)}
                            className="aspect-video w-full rounded-lg border border-[#C8A96B]/30 bg-black flex items-center justify-center p-3 text-center cursor-pointer hover:border-[#C8A96B] transition-all relative overflow-hiddenGroup"
                          >
                            <span className="absolute top-1 left-2 text-[8px] font-mono text-stone-600">CARD #01 (Toque para girar)</span>
                            {aiVideoFlippedCardIndex === 0 ? (
                              <p className="font-garamond text-emerald-300 text-[11px] leading-snug italic">
                                "Daath é a esfera invisível que atua como ponte mística de Daath, unificando as Sephiroth intelectuais com as morais."
                              </p>
                            ) : (
                              <p className="font-cinzel text-stone-200 text-xs font-bold leading-normal uppercase">
                                Qual o significado esotérico de Daath no Zohar?
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-[9.5px] text-stone-500 font-mono mt-3 leading-tight leading-normal">
                          Perguntas herméticas estimulam a retenção conceptual das aulas.
                        </div>
                      </div>

                      {/* Sub column 2: Interactive Evaluated Exercises */}
                      <div className="bg-zinc-950 p-4 border border-stone-900 rounded-xl flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] text-emerald-400 font-mono uppercase font-bold tracking-widest block mb-2">Módulo II: Teste Cognitivo Rápido</span>
                          
                          <p className="font-sans font-bold text-stone-200 mb-2 leading-snug">Cuál de las siguientes afirmaciones describe mejor a Solve et Coagula?</p>
                          
                          <div className="space-y-1.5 text-[10.5px]">
                            {[
                              { label: "Dissolução intelectual e fixação espiritual", id: 0 },
                              { label: "Isolamento social e repressão emocional", id: 1 },
                              { label: "Construção de templos físicos", id: 2 }
                            ].map(opt => (
                              <div
                                key={opt.id}
                                onClick={() => { if (!aiVideoExerciseCompleted) setAiVideoExerciseChoice(opt.id); }}
                                className={`p-2 rounded border cursor-pointer transition-colors flex items-center gap-2 ${
                                  aiVideoExerciseChoice === opt.id 
                                    ? "bg-emerald-950/20 border-emerald-500 text-emerald-300" 
                                    : "bg-[#050505] border-stone-900 hover:bg-stone-950 text-stone-400"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold ${aiVideoExerciseChoice === opt.id ? "bg-emerald-500 text-black font-sans border-emerald-500" : "border-stone-600"}`}>
                                  {aiVideoExerciseChoice === opt.id ? "✔" : ""}
                                </span>
                                <span className="font-sans text-[10px] leading-tight">{opt.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3">
                          {aiVideoExerciseCompleted ? (
                            <div className="p-2 rounded bg-black/60 border border-emerald-900/50 text-center font-mono text-[9px]">
                              {aiVideoExerciseCorrect ? (
                                <span className="text-emerald-400 font-bold">&#x2714; CORRETO! Sapiência em conformidade acadêmica.</span>
                              ) : (
                                <span className="text-red-400 font-bold">✘ INCORRETO. A reflexão verdadeira repousa na dissolução psíquica.</span>
                              )}
                              <button
                                onClick={() => {
                                  setAiVideoExerciseCompleted(false);
                                  setAiVideoExerciseChoice(null);
                                  setAiVideoExerciseCorrect(null);
                                }}
                                className="text-stone-500 hover:text-white underline block mx-auto mt-1 cursor-pointer"
                              >
                                Tentar novamente
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (aiVideoExerciseChoice === null) return;
                                setAiVideoExerciseCompleted(true);
                                const correct = aiVideoExerciseChoice === 0;
                                setAiVideoExerciseCorrect(correct);
                                triggerNotification(correct ? "Excelente! Resposta correta." : "Incorreto. Tente estudar as ciências clássicas.");
                              }}
                              disabled={aiVideoExerciseChoice === null}
                              className="w-full py-1.5 bg-[#C8A96B]/20 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black font-mono-aeon text-[10px] font-bold uppercase rounded"
                            >
                              Submeter Exercício
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sub column 3: Conceptual Mind Map Visual Concept Canvas */}
                      <div className="bg-zinc-950 p-4 border border-stone-900 rounded-xl flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] text-blue-400 font-mono uppercase font-bold tracking-widest block mb-2">Módulo III: Mapa Mental de Conexões</span>
                          <span className="text-[10px] text-stone-400 block font-garamond italic mb-3">Toque nos conceitos teológicos para revelar suas bibliografias e conexões esotéricas:</span>

                          {/* Concept SVGs nodes graph layout */}
                          <div className="bg-black/60 aspect-video w-full rounded-xl border border-stone-900 p-2 relative flex items-center justify-center overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 90">
                              
                              {/* Central Lines connectors */}
                              <line x1="80" y1="45" x2="30" y2="25" stroke={selectedConceptNode === "cabala" ? "#C8A96B" : "#1e293b"} strokeWidth="0.8" />
                              <line x1="80" y1="45" x2="130" y2="20" stroke={selectedConceptNode === "hermes" ? "#C8A96B" : "#1e293b"} strokeWidth="0.8" />
                              <line x1="80" y1="45" x2="80" y2="72" stroke={selectedConceptNode === "alquimia" ? "#C8A96B" : "#1e293b"} strokeWidth="0.8" />

                              {/* Concept Nodes - Central ORACLE */}
                              <circle cx="80" cy="45" r="7" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="0.6" className="animate-pulse" />
                              <text x="80" y="46.5" fontStyle="italic" fontSize="3.2" textAnchor="middle" fill="#10b981" fontWeight="bold">NIM</text>

                              {/* Nodes - Cabala */}
                              <g 
                                onClick={() => setSelectedConceptNode("cabala")}
                                onMouseEnter={() => setHoveredConceptNode("cabala")}
                                onMouseLeave={() => setHoveredConceptNode(null)}
                                className="cursor-pointer"
                              >
                                <circle cx="30" cy="25" r="5" fill="#C8A96B" fillOpacity={selectedConceptNode === "cabala" ? "0.3" : "0.1"} stroke="#C8A96B" strokeWidth="0.5" />
                                <text x="30" y="26" fontSize="2.8" textAnchor="middle" fill={selectedConceptNode === "cabala" ? "#FFF" : "#C8A96B"}>Zohar</text>
                              </g>

                              {/* Nodes - Hermes */}
                              <g 
                                onClick={() => setSelectedConceptNode("hermes")}
                                onMouseEnter={() => setHoveredConceptNode("hermes")}
                                onMouseLeave={() => setHoveredConceptNode(null)}
                                className="cursor-pointer"
                              >
                                <circle cx="130" cy="20" r="5" fill="#3b82f6" fillOpacity={selectedConceptNode === "hermes" ? "0.3" : "0.1"} stroke="#3b82f6" strokeWidth="0.5" />
                                <text x="130" y="21" fontSize="2.8" textAnchor="middle" fill={selectedConceptNode === "hermes" ? "#FFF" : "#3b82f6"}>Hermes</text>
                              </g>

                              {/* Nodes - Alquimia */}
                              <g 
                                onClick={() => setSelectedConceptNode("alquimia")}
                                onMouseEnter={() => setHoveredConceptNode("alquimia")}
                                onMouseLeave={() => setHoveredConceptNode(null)}
                                className="cursor-pointer"
                              >
                                <circle cx="80" cy="72" r="5" fill="#ec4899" fillOpacity={selectedConceptNode === "alquimia" ? "0.3" : "0.1"} stroke="#ec4899" strokeWidth="0.5" />
                                <text x="80" y="73" fontSize="2.8" textAnchor="middle" fill={selectedConceptNode === "alquimia" ? "#FFF" : "#ec4899"}>alchm</text>
                              </g>

                            </svg>

                            {/* Node details floating label */}
                            <div className="absolute bottom-1 left-2 text-[7.5px] font-mono text-stone-500 uppercase">
                              {selectedConceptNode ? `Ativo: ${selectedConceptNode}` : "Toque em um nodo"}
                            </div>
                          </div>
                        </div>

                        {/* Concept explanation depending on graph node */}
                        <div className="mt-3">
                          {selectedConceptNode === "cabala" && (
                            <div className="p-2 rounded bg-[#C8A96B]/10 border border-[#C8A96B]/30 animate-fade-in text-[10px]">
                              <p className="font-bold text-[#C8A96B] mb-0.5">Cúpula Sefirótica (Cabala)</p>
                              <p className="font-garamond italic text-stone-300">Conecta-se ao Zohar, Gematria teórica e as 10 esferas do macrocosmos. Biblioteca: Tomo I de Agripa.</p>
                            </div>
                          )}
                          {selectedConceptNode === "hermes" && (
                            <div className="p-2 rounded bg-blue-950/20 border border-blue-900/40 animate-fade-in text-[10px]">
                              <p className="font-bold text-blue-400 mb-0.5">Estudos Herméticos (Hermes)</p>
                              <p className="font-garamond italic text-stone-300">Vincula-se aos 7 axiomas da Tábua de Esmeralda de Alexandria. Biblioteca: Corpus Hermeticum.</p>
                            </div>
                          )}
                          {selectedConceptNode === "alquimia" && (
                            <div className="p-2 rounded bg-pink-950/20 border border-pink-900/40 animate-fade-in text-[10px]">
                              <p className="font-bold text-pink-400 mb-0.5">Alquimia Mental (Coagulação)</p>
                              <p className="font-garamond italic text-stone-300">Transmutação interior e o mistério de Solve et Coagula. Prática: Meditações profundas de Jung.</p>
                            </div>
                          )}
                          {!selectedConceptNode && (
                            <span className="text-[10px] text-stone-500 font-garamond italic block text-center">Nenhum conceito ativo. Toque em Zohar, Hermes ou Alchm para sintonizar correlações.</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: FIREBASE PLATFORM */}
          {internalTab === "firebase" && (
            <div className="space-y-6">
              
              {/* Top: Firebase integration credentials summary */}
              <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4 items-start col-span-2">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 font-cinzel text-xl font-bold flex-shrink-0">
                    F
                  </div>
                  <div>
                    <h3 className="text-sm font-cinzel font-bold text-white tracking-widest uppercase">Firebase Back-End Corporativo</h3>
                    <p className="text-xs font-garamond text-stone-400 italic mt-0.5">Banco de dados reativo, notificações push FCM e motor de análises</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-widest">Firestore: Ativo</span>
                      <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-widest">Auth: Conectivo</span>
                      <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded uppercase font-mono tracking-widest">Storage: Sincronizando</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      triggerNotification("Verificando consistência de regras de segurança base firestore.rules...");
                      addLog("Firebase Auth", "Executada validação completa de chaves de integridade", "success");
                    }}
                    className="px-4 py-1.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black border border-[#C8A96B]/30 font-mono-aeon text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Harden Firestore.rules
                  </button>
                </div>
              </div>

              {/* Middle row: Live Firestore metrics & Analytics charts (Pure SVG) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Live Firestore counters and rates */}
                <div className="col-span-12 lg:col-span-5 bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Database className="w-4 h-4 text-emerald-400" /> Firestore Métricas Reais
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[8.5px] uppercase font-mono text-stone-500 leading-none">Firestore Reads</span>
                        <p className="text-lg font-mono font-bold text-white mt-1">{firebaseMetrics.firestoreReads.toLocaleString()}</p>
                        <span className="text-[7.5px] text-green-400 font-mono mt-0.5 block flex-shrink-0">&#x25B2; 12% nas últimas 24h</span>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[8.5px] uppercase font-mono text-stone-500 leading-none">Firestore Writes</span>
                        <p className="text-lg font-mono font-bold text-white mt-1">{firebaseMetrics.firestoreWrites.toLocaleString()}</p>
                        <span className="text-[7.5px] text-green-400 font-mono mt-0.5 block">&#x25B2; 8% nas últimas 24h</span>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[8.5px] uppercase font-mono text-stone-500 leading-none">Morfologia de Armazenamento</span>
                        <p className="text-base font-mono font-bold text-stone-200 mt-1">{firebaseMetrics.storageSize}</p>
                        <span className="text-[7px] text-stone-500 font-mono block">Avatares & Feed de Alexandria</span>
                      </div>
                      <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[8.5px] uppercase font-mono text-stone-500 leading-none">Latência de Resposta</span>
                        <p className="text-base font-mono font-bold text-[#C8A96B] mt-1">{firebaseMetrics.avgLatency}</p>
                        <span className="text-[7.5px] text-amber-400 font-mono block">Média de Edge global</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500 flex justify-between">
                    <span>Firestore Enterprise Edition ativa</span>
                    <span className="text-amber-400 cursor-pointer hover:underline" onClick={() => window.open("https://firebase.google.com/pricing", "_blank")}> Spark Free Quota Info </span>
                  </div>
                </div>

                {/* Firebase Analytics Premium Graphical card */}
                <div className="col-span-12 lg:col-span-7 bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4.5 h-4.5 text-yellow-400" /> Firebase Analytics & Engajamento
                    </h4>
                    <p className="text-[11px] font-garamond italic text-[#F5F5F5]/40 mb-3 block">
                      "Curva síncrone de minutos dedicados ao estudo contemplativo e debates nos Círculos."
                    </p>

                    {/* Chart Container - Pure responsive high precision SVG line graph */}
                    <div className="bg-black/80 rounded-xl p-3 border border-white/5 h-[130px] flex items-center justify-center relative">
                      <div className="absolute left-2.5 top-2.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96B] animate-ping"></span>
                        <span className="text-[8px] font-mono uppercase text-stone-400">Geração de Sinergia Acadêmica (Semanas)</span>
                      </div>

                      <svg className="w-full h-full pt-6 px-4 hover:scale-[1.01] transition-transform overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="400" y2="20" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />
                        <line x1="0" y1="50" x2="400" y2="50" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />
                        <line x1="0" y1="80" x2="400" y2="80" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="0.5" />
                        
                        {/* Area gradient background */}
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C8A96B" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#C8A96B" stopOpacity="0.00" />
                          </linearGradient>
                        </defs>
                        <path d="M 0,85 C 50,55 100,75 150,45 C 200,30 250,55 300,20 C 350,15 400,35 400,35 L 400,100 L 0,100 Z" fill="url(#chartGrad)" />

                        {/* Line path */}
                        <path 
                          d="M 0,85 C 50,55 100,75 150,45 C 200,30 250,55 300,20 C 350,15 400,35 400,35" 
                          fill="none" 
                          stroke="#C8A96B" 
                          strokeWidth="2" 
                          strokeLinecap="round"
                        />

                        {/* Interactive dots and texts */}
                        <circle cx="300" cy="20" r="4.5" fill="#000" stroke="#C8A96B" strokeWidth="1.5" className="animate-pulse" />
                        <text x="280" y="10" fill="#C8A96B" fontSize="7" fontFamily="monospace">PICO: 147 Ativos</text>

                        {/* Axis labels */}
                        <text x="10" y="97" fill="#888" fontSize="6" fontFamily="monospace">Seg</text>
                        <text x="100" y="97" fill="#888" fontSize="6" fontFamily="monospace">Ter</text>
                        <text x="200" y="97" fill="#888" fontSize="6" fontFamily="monospace">Qua</text>
                        <text x="300" y="97" fill="#888" fontSize="6" fontFamily="monospace">Qui</text>
                        <text x="390" y="97" fill="#888" fontSize="6" fontFamily="monospace">Sex</text>
                      </svg>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500">
                    📈 Taxa de rejeição global: <span className="text-green-400 font-bold">1.2% (Excelente)</span> • Retenção acadêmica: 94.5%
                  </div>
                </div>

              </div>

              {/* Lower Sub grid: Remote Config and Push Messaging */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Firebase Remote Config Test panel */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Settings className="w-4 h-4 text-purple-400" /> Remote Config Console
                    </h4>
                    <p className="text-xs font-garamond text-stone-300 leading-relaxed mb-4">
                      Pilote recursos e flags operacionais em tempo real para os membros sem a necessidade de novos deploys. Sincronização em menos de um milissegundo.
                    </p>

                    <div className="space-y-3 p-3.5 bg-black/40 rounded-xl border border-white/5">
                      {[
                        { key: "enableOraculoSophia" as const, label: "Habilitar Sophia AI", desc: "Força renderização do oráculo cognitivo nos feeds" },
                        { key: "compactAgoraLayout" as const, label: "Layout Ágora Compacto", desc: "Condensa o tamanho de visualizações da redação" },
                        { key: "alphaIntegrations" as const, label: "Integrações Alpha Hub", desc: "Abre canais de Workspace para membros regulares" }
                      ].map(cfg => (
                        <div key={cfg.key} className="flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-white leading-tight">{cfg.label}</p>
                            <p className="text-[9px] text-[#F5F5F5]/40 leading-none mt-1">{cfg.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoteConfigToggle(cfg.key)}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                              remoteConfigs[cfg.key] ? "bg-[#C8A96B]" : "bg-neutral-800"
                            }`}
                          >
                            <div className={`bg-black w-5 h-5 rounded-full shadow transition-transform ${
                              remoteConfigs[cfg.key] ? "translate-x-5" : "translate-x-0"
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500">
                    📡 Sincronia: Remote Config Edge caching ativo (0ms TTL)
                  </div>
                </div>

                {/* Cloud Messaging notification sender tool */}
                <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                      <Bell className="w-4 h-4 text-orange-400" /> Firebase Cloud Messaging (FCM)
                    </h4>
                    <p className="text-xs font-garamond text-stone-300 leading-relaxed mb-4">
                      Dispare notificações instantâneas push dirigidas à tela de smartphones, tablets, TVs ou navegadores dos membros e mentores das escolas de Alexandria.
                    </p>

                    <form onSubmit={handleSendPushNotification} className="space-y-3 p-3.5 bg-black/40 rounded-xl border border-white/5">
                      <input
                        type="text"
                        value={cloudMessagingTitle}
                        onChange={(e) => setCloudMessagingTitle(e.target.value)}
                        placeholder="Título do Alerta (Ex: Conferência Extraordinária)"
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#C8A96B]"
                      />
                      <textarea
                        value={cloudMessagingBody}
                        onChange={(e) => setCloudMessagingBody(e.target.value)}
                        placeholder="Mensagem condensada para display de notificação push..."
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#C8A96B] h-12"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-[#C8A96B] hover:bg-white text-black font-mono-aeon text-[10.5px] font-bold uppercase rounded-lg tracking-wide transition-colors cursor-pointer"
                      >
                        Transmitir Push FCM
                      </button>
                    </form>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500 flex justify-between">
                    <span>Ativo em Safari/Chrome/Firefox/Android</span>
                    <span className="text-emerald-400">● 147 Dispositivos sintonizados</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CONTROL & HEALTH */}
          {internalTab === "admin" && (
            <div className="space-y-6">
              
              {/* Audit panel with active counters and health items */}
              <div className="bg-[#0a0a0a]/50 border border-[#C8A96B]/15 rounded-2xl p-6">
                <h3 className="font-cinzel text-sm font-bold text-[#C8A96B] mb-2 uppercase tracking-widest">Painel Administrativo de Integrações</h3>
                <p className="font-garamond text-xs text-[#F5F5F5]/60 italic mb-5 leading-relaxed">
                  Gerenciamento granular de segurança das chaves simétricas AES-256, limites de requisições de API, webhooks ativos e auditoria total. Estilo Bloomberg Terminal.
                </p>

                {/* API performance and limits block status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-950 p-4 rounded-xl border border-[#C8A96B]/25">
                    <span className="text-[8px] font-mono uppercase text-stone-500 tracking-wider block">CHAVES DE CRIPTOGRAFIA</span>
                    <span className="text-xs font-mono font-bold text-white block mt-1.5">AES-256-GCM Sincronizado</span>
                    <p className="text-[9px] text-[#C8A96B] font-mono mt-0.5 truncate uppercase">Chancela: Estável e Ativa</p>
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                    <span className="text-[8px] font-mono uppercase text-stone-500 tracking-wider block">RATE LIMIT LIMITADOR</span>
                    <span className="text-xs font-mono font-bold text-white block mt-1.5">60 requisições / minuto</span>
                    <p className="text-[9px] text-green-400 font-mono mt-0.5 uppercase">Uso atual: 4.2% (Estável)</p>
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-xl border border-white/5">
                    <span className="text-[8px] font-mono uppercase text-stone-500 tracking-wider block">SAÚDE DAS APIs (WORKSPACE)</span>
                    <span className="text-xs font-mono font-bold text-green-400 block mt-1.5">100% DISPONÍVEL</span>
                    <p className="text-[9px] text-stone-500 font-mono mt-0.5">Sem incidentes nas últimas 48h</p>
                  </div>
                </div>

                {/* Webhook Endpoint registry form */}
                <div className="bg-black/50 p-5 rounded-2xl border border-[#C8A96B]/15">
                  <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <CloudLightning className="w-4 h-4 text-[#C8A96B]" /> Canais de Webhooks de Integração
                  </h4>
                  <p className="text-xs font-garamond text-stone-300 leading-relaxed mb-4">
                    Alimentação dinâmica: envie eventos em formato JSON estruturado para outras redes sempre que houver novidades sobre a Cátedra de Alexandria (Publicação de Teses ou Conclusão de Graus).
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-xs flex justify-between items-center">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-white font-mono truncate">https://api.templo.aeon/alexandria-webhooks</p>
                        <p className="text-[9px] text-stone-500 mt-1">Sintoniza: <span className="text-amber-500 font-bold">tese_revisada, grau_atribuido, concilio_agendado</span></p>
                      </div>
                      <span className="text-[9px] bg-green-500/15 border border-green-500/30 text-green-400 px-2 py-0.5 rounded font-mono uppercase">ONLINE</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Insira a URL de Endpoint (Ex: https://notion-webhook.com/... )"
                        className="flex-1 bg-black border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#C8A96B]"
                      />
                      <button
                        onClick={() => {
                          triggerNotification("Endpoint registrado com sucesso!");
                          addLog("Admin Console", "Registrado novo canal de webhook", "success");
                        }}
                        className="px-4 bg-[#C8A96B] hover:bg-white text-black font-mono-aeon text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        Vincular
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOGS */}
          {internalTab === "logs" && (
            <div className="space-y-6">
              
              {/* Terminal simulation for sync log entries */}
              <div className="bg-[#0a0a0a]/80 border border-[#C8A96B]/20 rounded-2xl p-5 backdrop-blur-md">
                <div className="flex justify-between items-center border-b border-[#C8A96B]/20 pb-3 mb-4">
                  <div>
                    <h4 className="font-cinzel text-xs text-[#C8A96B] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" /> Monitor de Eventos Síncronas (Pub/Sub)
                    </h4>
                    <p className="text-[9px] text-stone-500 font-mono mt-0.5">Sincronização em tempo real de Alexandria • Criptografados de ponta-a-ponta</p>
                  </div>
                  <button
                    onClick={() => {
                      setSyncLogs([]);
                      triggerNotification("Logs limpos com sucesso.");
                    }}
                    className="text-[9px] text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded font-mono uppercase transition-colors"
                  >
                    Clear Terminal
                  </button>
                </div>

                <div className="bg-black/90 p-4 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed select-text overflow-y-auto max-h-[340px] h-[340px] flex flex-col gap-2 scrollbar-thin">
                  {syncLogs.length === 0 ? (
                    <div className="text-center text-stone-700 py-16">
                      <Terminal className="w-8 h-8 mx-auto stroke-1" />
                      <p className="mt-2 uppercase tracking-wide text-[10px]">Aguardando novas ações ou transmutações...</p>
                    </div>
                  ) : (
                    syncLogs.map(log => (
                      <div key={log.id} className={`flex items-start gap-2 ${
                        log.type === "success" ? "text-emerald-400" : log.type === "warning" ? "text-red-400 animate-pulse" : "text-sky-400"
                      }`}>
                        <span className="text-stone-600 flex-shrink-0">[{log.timestamp}]</span>
                        <span className="text-amber-500 font-bold flex-shrink-0">[{log.service}]</span>
                        <span className="text-[#F5F5F5]/90 italic select-text">"{log.message}"</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 text-[9.5px] font-mono text-stone-500 flex justify-between items-center">
                  <span>AES-256 Síncrone Auditoria Log • Conforme Termos de Privacidade da Cátedra</span>
                  <span className="text-stone-300">Total: {syncLogs.length} logs na sessão</span>
                </div>
              </div>
            </div>
          )}

          {/* Sincronização Inteligente Log Bar (Event-Driven Logs) */}
          <div className="bg-[#0a0a0a]/70 border border-[#C8A96B]/10 rounded-2xl p-4">
            <span className="text-[9px] font-mono-aeon uppercase tracking-widest text-stone-400 font-bold block mb-1">Mapeador Inteligente Sincrónico</span>
            <p className="text-xs text-stone-300 font-garamond italic">
              "Sempre que você publica uma pesquisa, entra em um círculo, conclui uma leitura ou participa de um evento, a malha Pub/Sub e Cloud Functions alimentam o Classroom, Calendar, Drive e seu perfil de forma unificada."
            </p>
          </div>

        </div>

      </div>

      {/* Linked Accounts Dialog Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border-2 border-[#C8A96B] max-w-sm w-full rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowAddAccountModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleAddMultipleAccount} className="space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-[#C8A96B] uppercase tracking-wider text-center">Vincular Conta Google Adicional</h3>
              
              <div>
                <label className="block text-[9.5px] uppercase font-mono text-stone-500 mb-1">Nome Associado</label>
                <input
                  type="text"
                  required
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Ex: Frater Tales (Pessoal)"
                  className="w-full bg-black border border-[#C8A96B]/30 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9.5px] uppercase font-mono text-stone-500 mb-1">E-mail Google / Workspace</label>
                <input
                  type="email"
                  required
                  value={newAccountEmail}
                  onChange={(e) => setNewAccountEmail(e.target.value)}
                  placeholder="Ex: tales.gmail@gmail.com"
                  className="w-full bg-black border border-[#C8A96B]/30 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-1.5 bg-neutral-900 text-stone-400 rounded-lg font-mono-aeon text-[10px] font-bold uppercase hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#C8A96B] text-black rounded-lg font-mono-aeon text-[10px] font-bold uppercase hover:bg-white"
                >
                  Conectar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
