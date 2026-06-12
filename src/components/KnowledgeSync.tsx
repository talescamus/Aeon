import React, { useState } from "react";
import { 
  RefreshCw, 
  CheckCircle2, 
  FolderOpen, 
  GraduationCap, 
  FileSpreadsheet, 
  Clock, 
  AlertTriangle,
  CloudLightning,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  Database
} from "lucide-react";
import { Circle, Member } from "../types";

interface KnowledgeSyncProps {
  member: Member;
  circles: Circle[];
  triggerNotification: (text: string) => void;
}

interface SyncItem {
  status: "synced" | "pending" | "error";
  lastSync: string;
  itemCount: number;
  loading: boolean;
}

type SyncState = Record<string, {
  drive: SyncItem;
  classroom: SyncItem;
  sheets: SyncItem;
}>;

export default function KnowledgeSync({ member, circles, triggerNotification }: KnowledgeSyncProps) {
  // Let's filter only the circles the member is enrolled in
  const enrolledCircles = circles.filter(c => member.circles.includes(c.id));

  // Initialize status state for each circle and service
  const [syncState, setSyncState] = useState<SyncState>(() => {
    const initialState: SyncState = {};
    circles.forEach(circle => {
      // Mock some logical varying initial states
      const indexModifier = circle.id.charCodeAt(0) % 3;
      initialState[circle.id] = {
        drive: {
          status: indexModifier === 0 ? "pending" : "synced",
          lastSync: "Há 2 horas",
          itemCount: circle.files?.length || Math.floor(Math.random() * 5) + 3,
          loading: false
        },
        classroom: {
          status: indexModifier === 1 ? "pending" : "synced",
          lastSync: "Há 1 dia",
          itemCount: circle.studies?.length || Math.floor(Math.random() * 4) + 4,
          loading: false
        },
        sheets: {
          status: "synced",
          lastSync: "Há 4 horas",
          itemCount: Math.floor(Math.random() * 15) + 5,
          loading: false
        }
      };
    });
    return initialState;
  });

  const handleSyncService = (circleId: string, circleName: string, service: "drive" | "classroom" | "sheets") => {
    // Set service state as reloading
    setSyncState(prev => ({
      ...prev,
      [circleId]: {
        ...prev[circleId],
        [service]: {
          ...prev[circleId][service],
          loading: true
        }
      }
    }));

    const serviceLabel = 
      service === "drive" ? "Google Drive" : 
      service === "classroom" ? "Google Classroom" : 
      "Google Sheets";

    triggerNotification(`Iniciando conexão astral e sintonizando ${serviceLabel} para "${circleName}"...`);

    // Simulate realistic asynchronous network synchronization
    setTimeout(() => {
      setSyncState(prev => {
        const item = prev[circleId][service];
        return {
          ...prev,
          [circleId]: {
            ...prev[circleId],
            [service]: {
              ...item,
              status: "synced",
              lastSync: "Agora mesmo",
              itemCount: item.itemCount + (Math.random() > 0.7 ? 1 : 0), // potentially found new files/items
              loading: false
            }
          }
        };
      });
      triggerNotification(`Sincronização concluída com sucesso: ${serviceLabel} para "${circleName}" sintonizado.`);
    }, 1200);
  };

  const handleSyncAllForCircle = (circleId: string, circleName: string) => {
    triggerNotification(`Buscando sintonização total dos portais Workspace para "${circleName}"...`);
    
    // Trigger drive, classroom, sheets simultaneously
    (["drive", "classroom", "sheets"] as const).forEach(service => {
      setSyncState(prev => ({
        ...prev,
        [circleId]: {
          ...prev[circleId],
          [service]: {
            ...prev[circleId][service as "drive" | "classroom" | "sheets"],
            loading: true
          }
        }
      }));
    });

    setTimeout(() => {
      setSyncState(prev => {
        const circleState = prev[circleId];
        return {
          ...prev,
          [circleId]: {
            drive: { ...circleState.drive, status: "synced", lastSync: "Agora mesmo", loading: false, itemCount: circleState.drive.itemCount + 1 },
            classroom: { ...circleState.classroom, status: "synced", lastSync: "Agora mesmo", loading: false },
            sheets: { ...circleState.sheets, status: "synced", lastSync: "Agora mesmo", loading: false, itemCount: circleState.sheets.itemCount + 2 }
          }
        };
      });
      triggerNotification(`Portais totalmente purificados e sintonizados para o círculo "${circleName}".`);
    }, 1800);
  };

  const getStatusBadge = (status: "synced" | "pending" | "error") => {
    switch (status) {
      case "synced":
        return (
          <span className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-green-400 uppercase tracking-widest bg-green-950/40 px-2 py-0.5 rounded border border-green-900/30">
            <CheckCircle2 className="w-3 h-3 text-green-400" /> Sincronizado
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-yellow-500 uppercase tracking-widest bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-900/30">
            <Clock className="w-3 h-3 text-yellow-500" /> Pendente
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-red-500 uppercase tracking-widest bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
            <AlertTriangle className="w-3 h-3 text-red-500" /> Erro
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0a0a0a]/80 border border-[#C8A96B]/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between" id="knowledge-sync-panel">
      {/* Background radial highlight */}
      <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[#C8A96B]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title */}
      <div className="border-b border-stone-900 pb-4 mb-6">
        <div className="flex items-center gap-2 text-[#C8A96B] mb-1">
          <CloudLightning className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] uppercase font-mono-aeon tracking-wider">Conectores de Transmissão Cooperativa</span>
        </div>
        <h3 className="font-cinzel text-base font-bold text-white tracking-widest uppercase">Sincronização de Conhecimento</h3>
        <p className="font-garamond text-xs text-stone-400 italic">Mapeamento de integridade e transferência síncrona dos Círculos Iniciáticos ativos na sua conta Google Workspace.</p>
      </div>

      {/* Main content split */}
      {enrolledCircles.length === 0 ? (
        <div className="text-center py-10 border border-stone-900 border-dashed rounded-xl">
          <Database className="w-8 h-8 text-[#C8A96B]/20 mx-auto mb-2" />
          <p className="font-garamond text-xs italic text-stone-500">Você não possui inscrições ativas em Círculos de Estudo para sincronização.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {enrolledCircles.map((circle) => {
            const currentSync = syncState[circle.id] || {
              drive: { status: "pending", lastSync: "Nunca", itemCount: 0, loading: false },
              classroom: { status: "pending", lastSync: "Nunca", itemCount: 0, loading: false },
              sheets: { status: "pending", lastSync: "Nunca", itemCount: 0, loading: false }
            };

            return (
              <div key={circle.id} className="p-4 bg-black/40 border border-[#C8A96B]/10 hover:border-[#C8A96B]/20 rounded-xl relative overflow-hidden transition-all group">
                {/* Visual indicators */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1" 
                  style={{ backgroundColor: circle.color }}
                ></div>

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-900 pb-3 mb-4 pl-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#C8A96B]">{circle.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: circle.color }}></span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-garamond italic block mt-0.5">{circle.description}</span>
                  </div>

                  <button
                    onClick={() => handleSyncAllForCircle(circle.id, circle.name)}
                    disabled={currentSync.drive.loading || currentSync.classroom.loading || currentSync.sheets.loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A96B]/10 hover:bg-[#C8A96B] text-[#C8A96B] hover:text-black hover:border-transparent font-mono text-[9px] font-bold uppercase tracking-widest rounded-lg border border-[#C8A96B]/30 cursor-pointer transition-all shrink-0"
                  >
                    {currentSync.drive.loading || currentSync.classroom.loading || currentSync.sheets.loading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" /> Sintonizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" /> Re-Sincronizar Tudo
                      </>
                    )}
                  </button>
                </div>

                {/* Services grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-2">
                  
                  {/* Google Drive Block */}
                  <div className="p-3 bg-stone-950/80 border border-stone-900 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                            <FolderOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-white block uppercase tracking-wider">Google Drive</span>
                            <span className="text-[9px] text-stone-500 font-mono-aeon">{currentSync.drive.itemCount} Códices Ativos</span>
                          </div>
                        </div>
                        {getStatusBadge(currentSync.drive.status)}
                      </div>
                      <div className="text-[9px] font-mono-aeon text-stone-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Atualizado: {currentSync.drive.lastSync}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSyncService(circle.id, circle.name, "drive")}
                      disabled={currentSync.drive.loading}
                      className="mt-3.5 w-full py-1.5 bg-black hover:bg-stone-900 text-[8.5px] font-mono font-bold uppercase tracking-wider text-stone-400 hover:text-white rounded border border-stone-850 hover:border-stone-700 cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      {currentSync.drive.loading ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-[#C8A96B]" /> Sintonizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 text-[#C8A96B]" /> Re-Sincronizar Drive
                        </>
                      )}
                    </button>
                  </div>

                  {/* Google Classroom Block */}
                  <div className="p-3 bg-stone-950/80 border border-stone-900 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-white block uppercase tracking-wider">Google Classroom</span>
                            <span className="text-[9px] text-stone-500 font-mono-aeon">{currentSync.classroom.itemCount} Temas Síncronos</span>
                          </div>
                        </div>
                        {getStatusBadge(currentSync.classroom.status)}
                      </div>
                      <div className="text-[9px] font-mono-aeon text-stone-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Atualizado: {currentSync.classroom.lastSync}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSyncService(circle.id, circle.name, "classroom")}
                      disabled={currentSync.classroom.loading}
                      className="mt-3.5 w-full py-1.5 bg-black hover:bg-stone-900 text-[8.5px] font-mono font-bold uppercase tracking-wider text-stone-400 hover:text-white rounded border border-stone-850 hover:border-stone-700 cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      {currentSync.classroom.loading ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-[#C8A96B]" /> Sintonizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 text-[#C8A96B]" /> Re-Sincronizar Classroom
                        </>
                      )}
                    </button>
                  </div>

                  {/* Google Sheets Block */}
                  <div className="p-3 bg-stone-950/80 border border-stone-900 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-cyan-500/10 text-cyan-500 rounded border border-cyan-500/20">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-white block uppercase tracking-wider">Google Sheets</span>
                            <span className="text-[9px] text-stone-500 font-mono-aeon">{currentSync.sheets.itemCount} Linha de Notas</span>
                          </div>
                        </div>
                        {getStatusBadge(currentSync.sheets.status)}
                      </div>
                      <div className="text-[9px] font-mono-aeon text-stone-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Atualizado: {currentSync.sheets.lastSync}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSyncService(circle.id, circle.name, "sheets")}
                      disabled={currentSync.sheets.loading}
                      className="mt-3.5 w-full py-1.5 bg-black hover:bg-stone-900 text-[8.5px] font-mono font-bold uppercase tracking-wider text-stone-400 hover:text-white rounded border border-stone-850 hover:border-stone-700 cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      {currentSync.sheets.loading ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-[#C8A96B]" /> Sintonizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 text-[#C8A96B]" /> Re-Sincronizar Sheets
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
