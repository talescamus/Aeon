export enum AcademicStatus {
  ASPIRANTE = "Aspirante",
  ESTUDANTE = "Estudante",
  INICIADO = "Iniciado",
  ADEPTO = "Adepto",
  PESQUISADOR = "Pesquisador",
  MENTOR = "Mentor",
  GUARDIAO = "Guardião",
  MESTRE = "Mestre"
}

export interface Member {
  id: string;
  initiaticName: string;
  avatarUrl: string;
  ingressDate: string;
  status: AcademicStatus;
  circles: string[]; // Circle IDs
  personalLibrary: string[]; // Book IDs
  academicHistory: {
    title: string;
    date: string;
    description: string;
  }[];
  certifications: string[];
  annotations: PrivateNote[];
}

export interface Circle {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  bgTexture: string;
  studies: string[];
  libraryIds: string[]; // Book IDs
  forum: ForumPost[];
  events: AcademicEvent[];
  chat: ChatMessage[];
  files: CircleFile[];
}

export interface ForumPost {
  id: string;
  author: string;
  authorStatus: AcademicStatus;
  title: string;
  content: string;
  date: string;
  replies: {
    author: string;
    authorStatus: AcademicStatus;
    content: string;
    date: string;
  }[];
}

export interface AcademicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  circleId?: string;
  zoomUrl?: string;
  meetUrl?: string;
  teamsUrl?: string;
  type: "Zoom" | "Google Meet" | "Teams";
  recordingUrl?: string;
  attendanceCount?: number;
  attendingByMe?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderStatus: AcademicStatus;
  content: string;
  timestamp: string;
}

export interface CircleFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  category: string;
}

export interface PrivateNote {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  associatedBookId?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  year: string;
  category: string;
  difficulty: "Básico" | "Intermediário" | "Avançado" | "Arcano";
  coverUrl: string;
  pages: number;
  description: string;
  status: "Lido" | "Lendo" | "Não Iniciado";
  currentPage: number;
  highlightedText?: string[]; // Saved highlights
  fullText?: string; // High-fidelity ancient text simulation
}

export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  authorStatus: AcademicStatus;
  circleId?: string;
  abstract: string;
  content: string;
  date: string;
  tags: string[];
  reviews: {
    reviewer: string;
    reviewerStatus: AcademicStatus;
    approved: boolean;
    comment: string;
    date: string;
  }[];
  status: "Submetido" | "Em Revisão" | "Aprovado" | "Arquivado";
  version: number;
}

export interface AgoraPost {
  id: string;
  author: string;
  authorUsername: string;
  authorAvatar?: string;
  authorStatus: AcademicStatus;
  content: string;
  date: string;
  likes: number;
  likedByMe?: boolean;
  reposts: number;
  repostedByMe?: boolean;
  comments: {
    id: string;
    author: string;
    authorStatus: AcademicStatus;
    content: string;
    date: string;
  }[];
  tags: string[];
  bookReferenceId?: string; // Optional reference to a book in library
  circleId?: string; // Optional circle restriction/origin
}

export interface PrivateChat {
  id: string;
  recipientName: string;
  recipientStatus: AcademicStatus;
  recipientId: string;
  messages: {
    id: string;
    sender: "me" | "them";
    content: string;
    timestamp: string;
    bookIdShared?: string;
    researchIdShared?: string;
  }[];
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  type: "follow" | "like" | "repost" | "comment" | "mention" | "event" | "system";
  title: string;
  description: string;
  date: string;
  read: boolean;
  senderName?: string;
}

export interface AcademicCertificate {
  id: string;
  title: string;
  recipientName: string;
  type: "Conclusão de Estudos" | "Serviço Editorial" | "Liderança de Círculo" | "Tese Laureada";
  issueDate: string;
  circleName?: string;
  verifiableHash: string;
  signers: string[];
}

export interface KnowledgeMapNode {
  id: string;
  label: string;
  detail: string;
}

export interface KnowledgeMapEdge {
  from: string;
  to: string;
}

export interface CloudFunctionCircleResponse {
  circle?: {
    name?: string;
    mentor?: { name?: string };
    members?: unknown[];
  };
  enrollmentCode?: string;
}

