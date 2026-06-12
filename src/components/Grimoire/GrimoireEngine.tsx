import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  Trash2, 
  Settings, 
  Save, 
  Play, 
  HelpCircle, 
  Paintbrush, 
  Stamp, 
  Eye, 
  Sparkles, 
  Compass, 
  ShieldAlert,
  Loader2,
  Database,
  CloudLightning,
  Volume2,
  Clock,
  Users,
  Grid,
  FileText,
  MousePointer,
  RotateCcw,
  Plus,
  Compass as CompassIcon,
  Mic,
  MicOff
} from "lucide-react";
import { SIGIL_LIST, SigilDefinition } from "./sigilData";
import {
  GrimoireState,
  renderGrimoirePage,
  SEPHIROTH_BOUNDS,
  GRIMOIRE_KNOWLEDGE_NODES,
  UserSigil,
  DrawingStroke,
  SacredGeometry,
  SephirothNode,
  KnowledgeNode
} from "./GrimoireContentCanvas";
import { Circle, LibraryBook, ResearchPaper } from "../../types";

// Dynamic Web Audio API synthesized custom physical sounds for tactile artifact feedback
const playPaperSwoosh = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(750, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.42);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseNode.start();
    noiseNode.stop(ctx.currentTime + 0.45);
    setTimeout(() => {
      try { ctx.close(); } catch (err) {}
    }, 550);
  } catch (err) {}
};

const playStampThump = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(95, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    const bufferSize = ctx.sampleRate * 0.28;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
       data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(110, ctx.currentTime);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);
    osc.connect(gain);
    gain.connect(ctx.destination);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    noise.start();
    noise.stop(ctx.currentTime + 0.3);
    setTimeout(() => {
      try { ctx.close(); } catch (err) {}
    }, 450);
  } catch (err) {}
};

let lastScribbleTime = 0;
const playQuillScribble = () => {
  const now = Date.now();
  if (now - lastScribbleTime < 160) return;
  lastScribbleTime = now;
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1100 + Math.random() * 900, ctx.currentTime);
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2400, ctx.currentTime);
    filter.Q.setValueAtTime(6, ctx.currentTime);
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.0018, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.11);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    noise.start();
    osc.stop(ctx.currentTime + 0.12);
    noise.stop(ctx.currentTime + 0.12);
    setTimeout(() => {
      try { ctx.close(); } catch (err) {}
    }, 150);
  } catch (err) {}
};

interface GrimoireEngineProps {
  books: LibraryBook[];
  circles: Circle[];
  researchPapers: ResearchPaper[];
  setSelectedBook: React.Dispatch<React.SetStateAction<LibraryBook | null>>;
  setSelectedCircle: React.Dispatch<React.SetStateAction<Circle | null>>;
  setActiveTab: (tab: string) => void;
  triggerNotification: (text: string) => void;
}

export default function GrimoireEngine({
  books,
  circles,
  researchPapers,
  setSelectedBook,
  setSelectedCircle,
  setActiveTab,
  triggerNotification
}: GrimoireEngineProps) {
  
  // React References for WebGL Scene
  const mountRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const flipCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Custom session chronicle log (Grimoire Timeline feature)
  const [timelineLogs, setTimelineLogs] = useState<{ id: string; time: string; text: string; actionType: string }[]>([
    { id: "init", time: "10:56:55", text: "Grimório Superior sintonizado na Egrégora de AEON", actionType: "system" }
  ]);

  const addTimelineLog = (text: string, actionType: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setTimelineLogs(prev => [
      { id: Date.now().toString(), time: timeStr, text, actionType },
      ...prev.slice(0, 20)
    ]);
  };

  // Grimoire State Management
  const [grimoireState, setGrimoireState] = useState<GrimoireState>(() => {
    const saved = localStorage.getItem("aeon_grimoire_data_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          currentPage: 1, 
          drawings: parsed.drawings || {},
          sigils: parsed.sigils || {},
          sephirahNotes: parsed.sephirahNotes || {},
          isDrawingMode: false,
          selectedSigilIdForStamp: null,
          activeColor: "#C8A96B",
          grimoireType: parsed.grimoireType || "Hermético",
          sacredGeometries: parsed.sacredGeometries || {},
          agingLevel: parsed.agingLevel || 4,
          inkStyle: parsed.inkStyle || "black"
        };
      } catch (e) {
        // Fallback
      }
    }
    return {
      currentPage: 1,
      drawings: {},
      sigils: {},
      sephirahNotes: {},
      isDrawingMode: false,
      selectedSigilIdForStamp: null,
      activeColor: "#C8A96B",
      grimoireType: "Hermético",
      sacredGeometries: {},
      agingLevel: 4,
      inkStyle: "black"
    };
  });

  // UI styling states
  const [ambientEnv, setAmbientEnv] = useState<"laboratory" | "library" | "archive" | "temple">("laboratory");
  const [paperStyle, setPaperStyle] = useState<"ancient" | "yellow" | "dark" | "alchemical">("ancient");
  const [coverStyle, setCoverStyle] = useState<"antique" | "black" | "emerald" | "royal" | "wooden" | "golden" | "bronze">("antique");
  const [brushWidth, setBrushWidth] = useState<number>(3);
  const [activeTool, setActiveTool] = useState<"draw" | "stamp" | "browse" | "geometry">("browse");
  const [oracleInsight, setOracleInsight] = useState<string>("");
  const [isOracleLoading, setIsOracleLoading] = useState<boolean>(false);

  // Sacred Geometry construction state
  const [selectedGeoType, setSelectedGeoType] = useState<"pentagram" | "hexagram" | "heptagram" | "flower" | "metatron">("pentagram");
  const [geoColor, setGeoColor] = useState<string>("#C8A96B");
  const [geoRadius, setGeoRadius] = useState<number>(140);

  // TTS Narrator Choice
  const [speechMode, setSpeechMode] = useState<"academic" | "classic" | "ceremonial">("classic");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Vocal Resonator & Frequency Analyzer (Microphone Soft Body Modulator)
  const [micEnabled, setMicEnabled] = useState<boolean>(false);
  const [currentMicIntensity, setCurrentMicIntensity] = useState<number>(0);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const micDataArrayRef = useRef<Uint8Array | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Active hover/selections in the book pages
  const [selectedSephira, setSelectedSephira] = useState<SephirothNode | null>(null);
  const [sephiraInputText, setSephiraInputText] = useState<string>("");
  const [selectedConcept, setSelectedConcept] = useState<KnowledgeNode | null>(null);

  // Simulated Multiplayer initiates editing the codex (cursors)
  const [simulatedPeers, setSimulatedPeers] = useState<number>(3);
  const [peerCursors, setPeerCursors] = useState<{ name: string; x: number; y: number; page: number }[]>([]);

  // Three.JS instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);

  // 3D meshes refs
  const bookCoverLeftRef = useRef<THREE.Mesh | null>(null);
  const bookCoverRightRef = useRef<THREE.Mesh | null>(null);
  const pageLeftMeshRef = useRef<THREE.Mesh | null>(null);
  const pageRightMeshRef = useRef<THREE.Mesh | null>(null);
  const pageFlipMeshRef = useRef<THREE.Mesh | null>(null);

  // 3D Textures refs
  const leftTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const rightTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const flipTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Flip animation metrics
  const flipProgressRef = useRef<{ val: number }>({ val: 0 });
  const isFlippingRef = useRef<boolean>(false);
  const flipDirectionRef = useRef<"forward" | "backward">("forward");

  // Multi-canvas setup helper
  useEffect(() => {
    const createHiddenCanvas = () => {
      const cv = document.createElement("canvas");
      cv.width = 1024;
      cv.height = 1024;
      return cv;
    };
    if (!leftCanvasRef.current) leftCanvasRef.current = createHiddenCanvas();
    if (!rightCanvasRef.current) rightCanvasRef.current = createHiddenCanvas();
    if (!flipCanvasRef.current) flipCanvasRef.current = createHiddenCanvas();
  }, []);

  // Sync canvas to text input state
  useEffect(() => {
    if (selectedSephira) {
      setSephiraInputText(grimoireState.sephirahNotes[selectedSephira.id] || "");
    }
  }, [selectedSephira, grimoireState.currentPage]);

  // Peer cursor simulation loop
  useEffect(() => {
    const names = ["Irmã Sophia", "Adepto Aurelius", "Frater Albertus", "Candidato Gabriel"];
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randomPeerIdx = Math.floor(Math.random() * names.length);
        const activePageIdx = grimoireState.currentPage + (Math.random() > 0.5 ? 0 : 1);
        const randomX = Math.floor(100 + Math.random() * 800);
        const randomY = Math.floor(150 + Math.random() * 700);

        setPeerCursors(prev => {
          const filtered = prev.filter(c => c.name !== names[randomPeerIdx]);
          return [{
            name: names[randomPeerIdx],
            x: randomX,
            y: randomY,
            page: activePageIdx
          }, ...filtered].slice(0, 3);
        });

        // Occasional peer drawings or actions trigger simulated notifications
        if (Math.random() > 0.85) {
          triggerNotification(`${names[randomPeerIdx]} está lendo pergaminhos na pág ${activePageIdx}.`);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [grimoireState.currentPage]);

  // Autosave when drawings, notes, geometries, or sigils vary
  useEffect(() => {
    const dataToSave = {
      drawings: grimoireState.drawings,
      sigils: grimoireState.sigils,
      sephirahNotes: grimoireState.sephirahNotes,
      grimoireType: grimoireState.grimoireType,
      sacredGeometries: grimoireState.sacredGeometries,
      agingLevel: grimoireState.agingLevel,
      inkStyle: grimoireState.inkStyle
    };
    localStorage.setItem("aeon_grimoire_data_v2", JSON.stringify(dataToSave));
  }, [grimoireState]);

  // Update canvas textures and redraw paper surfaces on any state change
  const redrawAllBookCanvases = () => {
    const leftIndex = grimoireState.currentPage;
    const rightIndex = grimoireState.currentPage + 1;

    // Redraw left
    const ctxL = leftCanvasRef.current?.getContext("2d");
    if (ctxL && leftCanvasRef.current) {
      renderGrimoirePage(ctxL, leftIndex, grimoireState, books, circles, researchPapers, selectedSephira || selectedConcept, paperStyle);
      if (leftTextureRef.current) leftTextureRef.current.needsUpdate = true;
    }

    // Redraw right
    const ctxR = rightCanvasRef.current?.getContext("2d");
    if (ctxR && rightCanvasRef.current) {
      renderGrimoirePage(ctxR, rightIndex, grimoireState, books, circles, researchPapers, selectedSephira || selectedConcept, paperStyle);
      if (rightTextureRef.current) rightTextureRef.current.needsUpdate = true;
    }
  };

  // Vocal Resonance / Microphone Analyzer Toggle
  const toggleMicResonator = async () => {
    if (micEnabled) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (micContextRef.current && micContextRef.current.state !== "closed") {
        try {
          await micContextRef.current.close();
        } catch (e) {}
      }
      micAnalyserRef.current = null;
      micDataArrayRef.current = null;
      micSourceRef.current = null;
      micContextRef.current = null;
      micStreamRef.current = null;
      setMicEnabled(false);
      setCurrentMicIntensity(0);
      addTimelineLog("Ressonador de voz desativado", "audio");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; // small fft size for low latency intensity calculations
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        source.connect(analyser);
        
        micStreamRef.current = stream;
        micContextRef.current = ctx;
        micSourceRef.current = source;
        micAnalyserRef.current = analyser;
        micDataArrayRef.current = dataArray;
        setMicEnabled(true);
        addTimelineLog("Ressonador de voz ativado! O tomo responde às suas ondulações vocais", "ritual");
        triggerNotification("Ressonador Vocal ativo: Suas emissões acústicas alteram o tomo sagrado em tempo real.");
      } catch (err) {
        console.error("Microphone access failed", err);
        triggerNotification("Falha ao acessar microfone. Certifique-se de conceder a permissão de áudio no painel principal.");
      }
    }
  };

  // Cleanup microphone resources on unmount
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (micContextRef.current && micContextRef.current.state !== "closed") {
        try {
          micContextRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    redrawAllBookCanvases();
  }, [grimoireState, books, circles, researchPapers, paperStyle, selectedSephira, selectedConcept]);

  // THREE.JS Engine setup
  useEffect(() => {
    if (!mountRef.current || !leftCanvasRef.current || !rightCanvasRef.current || !flipCanvasRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 550;

    // Fully clear out element's manual innerHTML before mounting new renderer to eliminate StrictMode duplicates
    if (mountRef.current) {
      mountRef.current.innerHTML = "";
    }

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#020202");
    scene.fog = new THREE.FogExp2("#020202", 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 6.2, 7.8);
    camera.lookAt(0, -0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer with high shadow mappings (AAA fidelity)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights with dynamic fog
    const ambientLight = new THREE.AmbientLight("#4a3728", 0.38);
    scene.add(ambientLight);

    // Volumetric flickering candle light
    const candleLight = new THREE.PointLight("#ff9f2a", 2.8, 22);
    candleLight.position.set(2.4, 3.4, 1.4);
    candleLight.castShadow = true;
    candleLight.shadow.mapSize.width = 1024;
    candleLight.shadow.mapSize.height = 1024;
    candleLight.shadow.bias = -0.0018;
    scene.add(candleLight);
    pointLightRef.current = candleLight;

    // Soft magical glow aura
    const auraLight = new THREE.PointLight("#4ca6e8", 2.0, 16);
    auraLight.position.set(-3, 2.5, -2);
    scene.add(auraLight);

    const dirLight = new THREE.DirectionalLight("#fff2d6", 0.65);
    dirLight.position.set(-1.5, 5, 4);
    scene.add(dirLight);

    // 5. Environmental Props Model (Ritualistic Stone Table)
    const tableGeom = new THREE.BoxGeometry(16, 0.25, 12);
    const tableMat = new THREE.MeshStandardMaterial({
      color: "#14110e",
      roughness: 0.95,
      metalness: 0.05,
    });
    const tableMesh = new THREE.Mesh(tableGeom, tableMat);
    tableMesh.position.set(0, -1.15, 0);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // Create the collective Book Group for smooth 3D hovering parallax effects
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // 6. BUILD BOOK COVERS with AAA Physical Materials
    const coverWidth = 2.72;
    const coverHeight = 3.62;
    const coverDepth = 0.082;

    const getMaterialProperties = () => {
      let color = "#2b1810";
      let roughness = 0.65;
      let metalness = 0.15;

      switch (coverStyle) {
        case "emerald":
          color = "#042414";
          roughness = 0.55;
          metalness = 0.2;
          break;
        case "royal":
          color = "#4c0c16";
          roughness = 0.5;
          metalness = 0.25;
          break;
        case "black":
          color = "#09090b";
          roughness = 0.7;
          metalness = 0.1;
          break;
        case "wooden":
          color = "#1f140d"; // Hand-carved walnut wood
          roughness = 0.88;
          metalness = 0.02;
          break;
        case "golden":
          color = "#d6aa38"; // Aged gold plating
          roughness = 0.18;
          metalness = 0.98;
          break;
        case "bronze":
          color = "#8f5726"; // Ornate bronze casting
          roughness = 0.32;
          metalness = 0.92;
          break;
        default:
          color = "#361b11"; // Antique brown leather
          roughness = 0.68;
          metalness = 0.12;
      }
      return { color, roughness, metalness };
    };

    const mats = getMaterialProperties();
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: mats.color,
      roughness: mats.roughness,
      metalness: mats.metalness,
    });

    const coverLeftGeom = new THREE.BoxGeometry(coverWidth, coverHeight, coverDepth);
    const coverLeft = new THREE.Mesh(coverLeftGeom, coverMaterial);
    coverLeft.position.set(-coverWidth / 2 - 0.02, -0.08, 0);
    coverLeft.rotation.x = Math.PI * 0.5; 
    coverLeft.receiveShadow = true;
    coverLeft.castShadow = true;
    bookGroup.add(coverLeft);
    bookCoverLeftRef.current = coverLeft;

    const coverRightGeom = new THREE.BoxGeometry(coverWidth, coverHeight, coverDepth);
    const coverRight = new THREE.Mesh(coverRightGeom, coverMaterial);
    coverRight.position.set(coverWidth / 2 + 0.02, -0.08, 0);
    coverRight.rotation.x = Math.PI * 0.5;
    coverRight.receiveShadow = true;
    coverRight.castShadow = true;
    bookGroup.add(coverRight);
    bookCoverRightRef.current = coverRight;

    // Embossed gold/bronze guidelines for ancient volumes
    const goldMat = new THREE.MeshStandardMaterial({
      color: "#C8A96B",
      metalness: 0.96,
      roughness: 0.18,
    });
    const frameLeftGeom = new THREE.BoxGeometry(coverWidth * 0.86, coverHeight * 0.86, 0.012);
    const frameLeft = new THREE.Mesh(frameLeftGeom, goldMat);
    frameLeft.position.set(0, -0.05, 0); 
    coverLeft.add(frameLeft);

    const frameRightGeom = new THREE.BoxGeometry(coverWidth * 0.86, coverHeight * 0.86, 0.012);
    const frameRight = new THREE.Mesh(frameRightGeom, goldMat);
    frameRight.position.set(0, 0.05, 0); 
    coverRight.add(frameRight);

    // Spine
    const spineGeom = new THREE.CylinderGeometry(0.08, 0.08, coverHeight, 20);
    const spineMesh = new THREE.Mesh(spineGeom, coverMaterial);
    spineMesh.rotation.x = Math.PI * 0.5;
    spineMesh.position.set(0, -0.1, 0);
    bookGroup.add(spineMesh);

    // 7. BUILD CANVAS PAPER SURFACES
    const pageWidth = 2.6;
    const pageHeight = 3.5;

    const leftTex = new THREE.CanvasTexture(leftCanvasRef.current);
    leftTex.minFilter = THREE.LinearFilter;
    leftTextureRef.current = leftTex;

    const rightTex = new THREE.CanvasTexture(rightCanvasRef.current);
    rightTex.minFilter = THREE.LinearFilter;
    rightTextureRef.current = rightTex;

    const pageMatLeft = new THREE.MeshStandardMaterial({
      map: leftTex,
      roughness: 0.94,
      metalness: 0.02,
    });

    const pageMatRight = new THREE.MeshStandardMaterial({
      map: rightTex,
      roughness: 0.94,
      metalness: 0.02,
    });

    // Curvatures matching realistic paper weight resistance
    const pageGeomLeft = new THREE.PlaneGeometry(pageWidth, pageHeight, 12, 3);
    const pageL = new THREE.Mesh(pageGeomLeft, pageMatLeft);
    pageL.rotation.x = -Math.PI * 0.5;
    pageL.position.set(-pageWidth / 2 - 0.01, -0.012, 0);
    pageL.castShadow = true;
    pageL.receiveShadow = true;
    bookGroup.add(pageL);
    pageLeftMeshRef.current = pageL;

    const pageGeomRight = new THREE.PlaneGeometry(pageWidth, pageHeight, 12, 3);
    const pageR = new THREE.Mesh(pageGeomRight, pageMatRight);
    pageR.rotation.x = -Math.PI * 0.5;
    pageR.position.set(pageWidth / 2 + 0.01, -0.012, 0);
    pageR.castShadow = true;
    pageR.receiveShadow = true;
    bookGroup.add(pageR);
    pageRightMeshRef.current = pageR;

    pageL.rotation.y = 0.075; 
    pageR.rotation.y = -0.075;

    // 8. ANIMATED FLIPPING SHEET (Dynamic curves engine)
    const flipTex = new THREE.CanvasTexture(flipCanvasRef.current);
    flipTex.minFilter = THREE.LinearFilter;
    flipTextureRef.current = flipTex;

    const pageGeomFlip = new THREE.PlaneGeometry(pageWidth, pageHeight, 30, 5);
    const pageMatFlip = new THREE.MeshStandardMaterial({
      map: flipTex,
      roughness: 0.95,
      metalness: 0.02,
      side: THREE.DoubleSide, 
    });

    const pageFlip = new THREE.Mesh(pageGeomFlip, pageMatFlip);
    pageFlip.position.set(0, 1000, 0); 
    bookGroup.add(pageFlip);
    pageFlipMeshRef.current = pageFlip;

    // 9. MAGICAL FLOATING PARTICLES (Dust swirling)
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6;
      positions[i + 1] = 0.4 + Math.random() * 3.6;
      positions[i + 2] = (Math.random() - 0.5) * 5;

      const randomSpark = Math.random();
      if (randomSpark > 0.5) {
        colors[i] = 1.0;     
        colors[i + 1] = 0.84; 
        colors[i + 2] = 0.22; 
      } else if (randomSpark > 0.2) {
        colors[i] = 0.3;     
        colors[i + 1] = 0.72; 
        colors[i + 2] = 1.0;  
      } else {
        colors[i] = 0.94;     
        colors[i + 1] = 0.22; 
        colors[i + 2] = 0.28; 
      }
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    redrawAllBookCanvases();

    // Mouse interactive tilt/rotation mechanics on the collective Book Group
    const par = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMoveParallax = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      par.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      par.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const handleMouseLeaveParallax = () => {
      par.targetX = 0;
      par.targetY = 0;
    };
    const canvasEl = renderer.domElement;
    canvasEl.addEventListener("mousemove", handleMouseMoveParallax);
    canvasEl.addEventListener("mouseleave", handleMouseLeaveParallax);

    // 10. ANIMATION TICK LOOP WITH SKELETAL RIGGING AND INTERACTIVE SOFT-BODY SIMULATION
    let animationFrameId: number;
    let clock = new THREE.Clock();

    // Initialize physical wave sheets and soft-body dampening arrays
    const leftCount = pageGeomLeft.attributes.position.count;
    const rightCount = pageGeomRight.attributes.position.count;
    const flipCount = pageGeomFlip.attributes.position.count;

    const leftOffsets = new Float32Array(leftCount);
    const leftVels = new Float32Array(leftCount);
    const rightOffsets = new Float32Array(rightCount);
    const rightVels = new Float32Array(rightCount);
    const flipOffsets = new Float32Array(flipCount);
    const flipVels = new Float32Array(flipCount);

    const tick = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth horizontal/vertical book group tilt interpolate (lerp)
      par.x += (par.targetX - par.x) * 0.06;
      par.y += (par.targetY - par.y) * 0.06;

      bookGroup.rotation.y = par.x * 0.16;
      bookGroup.rotation.x = par.y * 0.10;

      // Dynamic Candle brightness flicker
      if (pointLightRef.current) {
        const flicker = Math.sin(elapsed * 10) * Math.cos(elapsed * 6) * 0.26;
        pointLightRef.current.intensity = 2.6 + flicker;
      }

      // Cast a real-time ray from the mouse cursor to discover the precise 3D intersection target on pages
      const mouseRaycaster = new THREE.Raycaster();
      // NDC Coordinates: Invert par.y since visual targetY is down-positive (1 to -1 transition)
      const cursorVector = new THREE.Vector2(par.targetX, -par.targetY);
      mouseRaycaster.setFromCamera(cursorVector, camera);

      const interactiveTargets: THREE.Object3D[] = [];
      if (pageLeftMeshRef.current) interactiveTargets.push(pageLeftMeshRef.current);
      if (pageRightMeshRef.current) interactiveTargets.push(pageRightMeshRef.current);
      if (pageFlipMeshRef.current && isFlippingRef.current) interactiveTargets.push(pageFlipMeshRef.current);

      const rawIntersects = mouseRaycaster.intersectObjects(interactiveTargets);
      let pageHoverPt: THREE.Vector3 | null = null;
      if (rawIntersects.length > 0) {
        pageHoverPt = rawIntersects[0].point;
      }

      // MIC ANALYSIS: Compute real-time vocal frequency intensity and frequency bias
      let micIntensityFactor = 1.0;
      let micFrequencyBias = 0.0;

      if (micAnalyserRef.current && micDataArrayRef.current) {
        micAnalyserRef.current.getByteFrequencyData(micDataArrayRef.current);
        let sum = 0;
        let maxVal = 0;
        let maxIndex = 0;
        const totalElements = micDataArrayRef.current.length;
        for (let s = 0; s < totalElements; s++) {
          const val = micDataArrayRef.current[s];
          sum += val;
          if (val > maxVal) {
            maxVal = val;
            maxIndex = s;
          }
        }
        const avg = sum / totalElements;
        const currentRatio = avg / 255;
        // Map average volume to a responsive multiplier (up to 9x intensity multiplier)
        micIntensityFactor = 1.0 + currentRatio * 8.0;
        // Map most prominent frequency index/bin to frequency wave shift
        micFrequencyBias = maxIndex / totalElements;

        // Visual level updates with small random throttle to avoid lagging React renders
        if (Math.random() < 0.2) {
          setCurrentMicIntensity(Math.round(currentRatio * 100));
        }
      }

      // Rotate particles and drift them up with God rays feel
      if (particlesRef.current) {
        const pArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
        // Modulate dust swirling activity speed based on voice loudness too!
        const dustSpeedFactor = 1.0 + (micIntensityFactor - 1.0) * 1.5;
        for (let i = 0; i < particleCount * 3; i += 3) {
          pArray[i + 1] += 0.0042 * dustSpeedFactor; // Floats upwards faster with voice
          pArray[i] += Math.sin(elapsed * 0.6 + i) * 0.002 * dustSpeedFactor;

          if (pArray[i + 1] > 3.9) {
            pArray[i + 1] = 0.15;
            pArray[i] = (Math.random() - 0.5) * 5.5;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // 1. LEFT PAGE WORK - SPRING MASS INTERACTIVE LATTICE SHEARS
      if (pageLeftMeshRef.current) {
        const geom = pageLeftMeshRef.current.geometry;
        const posAttr = geom.attributes.position;
        const basePosArray = pageGeomLeft.attributes.position.array as Float32Array;
        
        const segmentsX = 12;
        const segmentsY = 3;

        for (let i = 0; i < leftCount; i++) {
          const idx = i * 3;
          const rx = basePosArray[idx];
          const ry = basePosArray[idx + 1];
          const rz = basePosArray[idx + 2];

          // World vertex location for raycast cursor distance mapping
          const vWorld = new THREE.Vector3(rx, ry, rz);
          pageLeftMeshRef.current.localToWorld(vWorld);

          // Cursor tactile depression force (bell curve indentation)
          let cursorDepressF = 0;
          if (pageHoverPt) {
            const hDist = vWorld.distanceTo(pageHoverPt);
            if (hDist < 0.95) {
              cursorDepressF = -0.16 * Math.pow(1.0 - hDist / 0.95, 2);
            }
          }

          // Volumetric heat convection current waves generated by active candle PointLight (heightened by speech)
          const candlePosition = pointLightRef.current ? pointLightRef.current.position : new THREE.Vector3(2.4, 3.4, 1.4);
          const candleDistance = vWorld.distanceTo(candlePosition);
          const heatConvectionWave = Math.sin(elapsed * (7.5 + micFrequencyBias * 12.0) + rx * 4.5 + ry * 2.5) 
            * (0.016 / (candleDistance + 0.35)) * micIntensityFactor;

          // Spring coupled mesh structural neighbors (Shear forces)
          let latticeCoupling = 0;
          let activeNeighbors = 0;

          const gx = i % (segmentsX + 1);
          const gy = Math.floor(i / (segmentsX + 1));

          if (gx > 0) { latticeCoupling += leftOffsets[i - 1] - leftOffsets[i]; activeNeighbors++; }
          if (gx < segmentsX) { latticeCoupling += leftOffsets[i + 1] - leftOffsets[i]; activeNeighbors++; }
          if (gy > 0) { latticeCoupling += leftOffsets[i - (segmentsX + 1)] - leftOffsets[i]; activeNeighbors++; }
          if (gy < segmentsY) { latticeCoupling += leftOffsets[i + (segmentsX + 1)] - leftOffsets[i]; activeNeighbors++; }

          // Spring restore coefficients
          const fSpring = -16.0 * leftOffsets[i];
          const fDamp = -2.8 * leftVels[i];
          const fShear = activeNeighbors > 0 ? (latticeCoupling / activeNeighbors) * 6.0 : 0;

          // Acoustic directly-induced vocal resonance waves on the grid
          const vocalResonanceWave = micAnalyserRef.current 
            ? Math.sin(elapsed * (22.0 + micFrequencyBias * 15.0) + rx * 8.0) * 0.045 * (micIntensityFactor - 1.0) 
            : 0;

          // Boundary stiffness control - Hinge spine (gx === 0) is rigid, outer frame (gx/segmentsX) is flexible
          const borderFreedom = gx / segmentsX;
          const fTotal = (fSpring + fDamp + fShear + cursorDepressF + heatConvectionWave + vocalResonanceWave) * borderFreedom;

          // Classical Euler Integration step
          leftVels[i] += fTotal * 0.016;
          leftOffsets[i] += leftVels[i] * 0.016;
          leftOffsets[i] = Math.max(-0.45, Math.min(0.45, leftOffsets[i]));

          // Synthesize base curve, dynamic soft-body offsets and fine air flutter (heightened by voice)
          const ambientWindFlutter = Math.sin(elapsed * (4.2 + micFrequencyBias * 4.0) + rx * 2.0) 
            * 0.008 * borderFreedom * micIntensityFactor;
          posAttr.setZ(i, rz + leftOffsets[i] + ambientWindFlutter);
        }
        posAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      // 2. RIGHT PAGE WORK - SPRING MASS INTERACTIVE LATTICE SHEARS
      if (pageRightMeshRef.current) {
        const geom = pageRightMeshRef.current.geometry;
        const posAttr = geom.attributes.position;
        const basePosArray = pageGeomRight.attributes.position.array as Float32Array;

        const segmentsX = 12;
        const segmentsY = 3;

        for (let i = 0; i < rightCount; i++) {
          const idx = i * 3;
          const rx = basePosArray[idx];
          const ry = basePosArray[idx + 1];
          const rz = basePosArray[idx + 2];

          const vWorld = new THREE.Vector3(rx, ry, rz);
          pageRightMeshRef.current.localToWorld(vWorld);

          let cursorDepressF = 0;
          if (pageHoverPt) {
            const hDist = vWorld.distanceTo(pageHoverPt);
            if (hDist < 0.95) {
              cursorDepressF = -0.16 * Math.pow(1.0 - hDist / 0.95, 2);
            }
          }

          const candlePosition = pointLightRef.current ? pointLightRef.current.position : new THREE.Vector3(2.4, 3.4, 1.4);
          const candleDistance = vWorld.distanceTo(candlePosition);
          const heatConvectionWave = Math.sin(elapsed * (7.5 + micFrequencyBias * 12.0) + rx * 4.5 + ry * 2.5) 
            * (0.016 / (candleDistance + 0.35)) * micIntensityFactor;

          let latticeCoupling = 0;
          let activeNeighbors = 0;

          const gx = i % (segmentsX + 1);
          const gy = Math.floor(i / (segmentsX + 1));

          if (gx > 0) { latticeCoupling += rightOffsets[i - 1] - rightOffsets[i]; activeNeighbors++; }
          if (gx < segmentsX) { latticeCoupling += rightOffsets[i + 1] - rightOffsets[i]; activeNeighbors++; }
          if (gy > 0) { latticeCoupling += rightOffsets[i - (segmentsX + 1)] - rightOffsets[i]; activeNeighbors++; }
          if (gy < segmentsY) { latticeCoupling += rightOffsets[i + (segmentsX + 1)] - rightOffsets[i]; activeNeighbors++; }

          const fSpring = -16.0 * rightOffsets[i];
          const fDamp = -2.8 * rightVels[i];
          const fShear = activeNeighbors > 0 ? (latticeCoupling / activeNeighbors) * 6.0 : 0;

          // Acoustic directly-induced vocal resonance waves on the grid
          const vocalResonanceWave = micAnalyserRef.current 
            ? Math.sin(elapsed * (22.0 + micFrequencyBias * 15.0) + rx * 8.0) * 0.045 * (micIntensityFactor - 1.0) 
            : 0;

          const borderFreedom = gx / segmentsX;
          const fTotal = (fSpring + fDamp + fShear + cursorDepressF + heatConvectionWave + vocalResonanceWave) * borderFreedom;

          rightVels[i] += fTotal * 0.016;
          rightOffsets[i] += rightVels[i] * 0.016;
          rightOffsets[i] = Math.max(-0.45, Math.min(0.45, rightOffsets[i]));

          const ambientWindFlutter = Math.sin(elapsed * (4.2 + micFrequencyBias * 4.0) + rx * 2.0) 
            * 0.008 * borderFreedom * micIntensityFactor;
          posAttr.setZ(i, rz + rightOffsets[i] + ambientWindFlutter);
        }
        posAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      // 3. FLIPPING SHEET SYSTEM - SKELETAL BONE JOINT KINEMATICS + AIR DRAG CORKSCREW SOFT BODY
      if (isFlippingRef.current && pageFlipMeshRef.current) {
        const progress = flipProgressRef.current.val; // sweeps 0 to 1
        
        let theta = 0;
        if (flipDirectionRef.current === "forward") {
          theta = progress * Math.PI; 
        } else {
          theta = (1 - progress) * Math.PI; 
        }

        const geom = pageFlipMeshRef.current.geometry as THREE.BufferGeometry;
        const posAttribute = geom.attributes.position;
        const basePosArray = pageGeomFlip.attributes.position.array as Float32Array; 

        const w = pageWidth;
        const segmentsX = 30;
        const segmentsY = 5;

        const flexAmplitude = 0.74; // Papyrus mechanical resistance bending factor

        // Iterate through rigged sheet vertices
        for (let i = 0; i < flipCount; i++) {
          const idx = i * 3;
          const rx = basePosArray[idx];
          const ry = basePosArray[idx + 1];
          const rz = basePosArray[idx + 2];

          const gx = i % (segmentsX + 1);
          const gy = Math.floor(i / (segmentsX + 1));

          // Soft-body wave propagation and shear couplings
          let latticeCoupling = 0;
          let activeNeighbors = 0;

          if (gx > 0) { latticeCoupling += flipOffsets[i - 1] - flipOffsets[i]; activeNeighbors++; }
          if (gx < segmentsX) { latticeCoupling += flipOffsets[i + 1] - flipOffsets[i]; activeNeighbors++; }
          if (gy > 0) { latticeCoupling += flipOffsets[i - (segmentsX + 1)] - flipOffsets[i]; activeNeighbors++; }
          if (gy < segmentsY) { latticeCoupling += flipOffsets[i + (segmentsX + 1)] - flipOffsets[i]; activeNeighbors++; }

          // Cursor physical repulsion/force modifier during dynamic flight
          let cursorPushForce = 0;
          if (pageHoverPt) {
            const approxLocalX = rx + w / 2;
            const approxU = approxLocalX / w;
            const approxAngle = theta - flexAmplitude * Math.sin(progress * Math.PI) * Math.sin(Math.PI * approxU);
            const approxXWorld = approxU * w * Math.cos(approxAngle) - w / 2;
            const approxZWorld = -approxU * w * Math.sin(approxAngle);
            const vWorldFlip = new THREE.Vector3(approxXWorld, ry, approxZWorld);
            pageFlipMeshRef.current.localToWorld(vWorldFlip);

            const distToHover = vWorldFlip.distanceTo(pageHoverPt);
            if (distToHover < 1.0) {
              cursorPushForce = 0.24 * Math.pow(1.0 - distToHover / 1.0, 2);
            }
          }

          const fSpring = -14.0 * flipOffsets[i];
          const fDamp = -2.2 * flipVels[i];
          const fShear = activeNeighbors > 0 ? (latticeCoupling / activeNeighbors) * 5.0 : 0;

          // Acoustic directly-induced vocal resonance waves on the grid
          const vocalResonanceWave = micAnalyserRef.current 
            ? Math.sin(elapsed * (22.0 + micFrequencyBias * 15.0) + rx * 8.0) * 0.05 * (micIntensityFactor - 1.0) 
            : 0;

          const borderFreedom = gx / segmentsX;
          const fTotal = (fSpring + fDamp + fShear + cursorPushForce + vocalResonanceWave) * borderFreedom;

          flipVels[i] += fTotal * 0.016;
          flipOffsets[i] += flipVels[i] * 0.016;
          flipOffsets[i] = Math.max(-0.45, Math.min(0.45, flipOffsets[i]));

          // SKELETAL CHAIN FORWARD KINEMATICS CALCULATION:
          // localX ratio goes from 0 (hinge spine) to 1.0 (outer border page corner)
          const localX = rx + w / 2;
          const u = localX / w;

          // Drag curl coefficient: Outer bone joints lag behind parent bones during high angular speeds
          const dynamicBoneCurl = flexAmplitude * Math.sin(progress * Math.PI) * Math.sin(Math.PI * u);
          
          let segmentAngle = 0;
          if (flipDirectionRef.current === "forward") {
            segmentAngle = theta - dynamicBoneCurl + (flipOffsets[i] * 0.72);
          } else {
            segmentAngle = theta + dynamicBoneCurl - (flipOffsets[i] * 0.72);
          }

          // Compute global mesh coordinated relative to spine bone
          const xPrime = u * w * Math.cos(segmentAngle) - w / 2;
          const zPrime = -u * w * Math.sin(segmentAngle) + (flipOffsets[i] * Math.cos(segmentAngle));
          
          const yDroop = Math.sin(progress * Math.PI) * u * 0.16; // gravity weight droop
          const yPrime = ry - yDroop + (flipOffsets[i] * Math.sin(segmentAngle) * 0.25);

          posAttribute.setXYZ(i, xPrime, yPrime, zPrime);
        }
        posAttribute.needsUpdate = true;
        geom.computeVertexNormals();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      canvasEl.removeEventListener("mousemove", handleMouseMoveParallax);
      canvasEl.removeEventListener("mouseleave", handleMouseLeaveParallax);
      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (err) {}
      }
      renderer.dispose();
    };
  }, [paperStyle, coverStyle]);

  // Dynamic Camera transitions onto specific hotspots on Book Pages (Three.js camera focusing)
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;

    if (selectedSephira) {
      // Focus on active Sephira node location inside book layout (immersing view)
      const relativeX = (selectedSephira.x - 512) / 250;
      const relativeY = -(selectedSephira.y - 512) / 250 - 0.2;
      
      gsap.to(camera.position, {
        x: relativeX * 0.45,
        y: 4.8,
        z: 4.8,
        duration: 1.1,
        ease: "power2.out"
      });
    } else if (selectedConcept) {
      // Focus on selected conceptual map axis
      const relativeX = (selectedConcept.x - 512) / 250;
      gsap.to(camera.position, {
        x: relativeX * 0.35,
        y: 4.9,
        z: 4.9,
        duration: 1.1,
        ease: "power2.out"
      });
    } else {
      // Reset to original aerial majestic view
      gsap.to(camera.position, {
        x: 0,
        y: 6.2,
        z: 7.8,
        duration: 1.1,
        ease: "power2.out"
      });
    }
  }, [selectedSephira, selectedConcept]);

  // Flip page action
  const handlePageFlip = (direction: "forward" | "backward") => {
    if (isFlippingRef.current) return;

    if (direction === "forward" && grimoireState.currentPage >= 8) {
      triggerNotification("Você alcançou o pergaminho final do Grimório. Os selos estão mantidos.");
      return;
    }
    if (direction === "backward" && grimoireState.currentPage <= 1) {
      triggerNotification("Você já está na capa de introdução do tomo.");
      return;
    }

    // Stop speaking if flip occurs
    stopReadingAloud();

    // Play tactile Web Audio physical paper-flipping synthesized sound
    playPaperSwoosh();

    isFlippingRef.current = true;
    flipDirectionRef.current = direction;

    flipProgressRef.current.val = 0;

    const flipLIndex = direction === "forward" ? grimoireState.currentPage + 1 : grimoireState.currentPage - 1;

    const ctxFlip = flipCanvasRef.current?.getContext("2d");
    if (ctxFlip && flipCanvasRef.current) {
      renderGrimoirePage(ctxFlip, flipLIndex, grimoireState, books, circles, researchPapers, selectedSephira || selectedConcept, paperStyle);
      if (flipTextureRef.current) flipTextureRef.current.needsUpdate = true;
    }

    if (pageFlipMeshRef.current) {
      pageFlipMeshRef.current.position.set(0, 0, 0.03); 
    }

    if (direction === "forward" && pageRightMeshRef.current) {
      pageRightMeshRef.current.position.y = -1000; 
    } else if (direction === "backward" && pageLeftMeshRef.current) {
      pageLeftMeshRef.current.position.y = -1000; 
    }

    gsap.to(flipProgressRef.current, {
      val: 1,
      duration: 1.25,
      ease: "power2.inOut",
      onComplete: () => {
        isFlippingRef.current = false;

        if (pageLeftMeshRef.current) pageLeftMeshRef.current.position.y = -0.012;
        if (pageRightMeshRef.current) pageRightMeshRef.current.position.y = -0.012;
        if (pageFlipMeshRef.current) pageFlipMeshRef.current.position.set(0, 1000, 0); 

        const nextP = direction === "forward" ? grimoireState.currentPage + 2 : grimoireState.currentPage - 2;
        setGrimoireState(prev => ({
          ...prev,
          currentPage: nextP
        }));

        addTimelineLog(`Navegou ao Códice ${nextP} e ${nextP+1}`, "navigation");
        redrawAllBookCanvases();
      }
    });
  };

  // Interact with 3D components coordinates mapping
  const handleCanvasClickOrDraw = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !mountRef.current) return;
    if (isFlippingRef.current) return; 

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, cameraRef.current);

    const targets = [];
    if (pageLeftMeshRef.current) targets.push(pageLeftMeshRef.current);
    if (pageRightMeshRef.current) targets.push(pageRightMeshRef.current);

    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length === 0) return;

    const hit = intersects[0];
    const hitMesh = hit.object as THREE.Mesh;
    const uv = hit.uv;
    if (!uv) return;

    const isLeftHit = hitMesh === pageLeftMeshRef.current;
    const clickedPageIndex = isLeftHit ? grimoireState.currentPage : grimoireState.currentPage + 1;

    const pixelX = Math.floor(uv.x * 1024);
    const pixelY = Math.floor((1 - uv.y) * 1024);

    // 1. TOOL: STAMP SACRED SIGIL
    if (activeTool === "stamp" && grimoireState.selectedSigilIdForStamp) {
      const newSigil: UserSigil = {
        id: "sig-" + Date.now(),
        sigilId: grimoireState.selectedSigilIdForStamp,
        x: pixelX,
        y: pixelY,
        size: 145,
        rotation: Math.random() * 0.4 - 0.2 // subtle tilt matching physical seal stamping
      };

      setGrimoireState(prev => {
        const pageList = prev.sigils[clickedPageIndex] || [];
        return {
          ...prev,
          sigils: {
            ...prev.sigils,
            [clickedPageIndex]: [...pageList, newSigil]
          }
        };
      });

      const design = SIGIL_LIST.find(p => p.id === grimoireState.selectedSigilIdForStamp);
      addTimelineLog(`Estampou Glifo [${design?.name || "Celestial"}] na pág ${clickedPageIndex}`, "stamp");
      triggerNotification(`Glifo sagrado sintonizado na posição (${pixelX}, ${pixelY}).`);
      
      // Play tactile Web Audio stamp thump sound
      playStampThump();

      // Trigger magical sparkle feedback in candlelight
      if (pointLightRef.current) {
        gsap.killTweensOf(pointLightRef.current);
        pointLightRef.current.intensity = 5.2; 
        gsap.to(pointLightRef.current, { intensity: 2.8, duration: 1.4 });
      }
      return;
    }

    // 2. TOOL: CREATE SACRED GEOMETRY SPOTS
    if (activeTool === "geometry") {
      const newGeom: SacredGeometry = {
        id: "geo-" + Date.now(),
        type: selectedGeoType,
        cx: pixelX,
        cy: pixelY,
        radius: geoRadius,
        color: geoColor,
        lineWidth: 1.8
      };

      setGrimoireState(prev => {
        const pageGeos = prev.sacredGeometries?.[clickedPageIndex] || [];
        return {
          ...prev,
          sacredGeometries: {
            ...prev.sacredGeometries,
            [clickedPageIndex]: [...pageGeos, newGeom]
          }
        };
      });

      addTimelineLog(`Construiu Geometria Sagrada [${selectedGeoType}] na pág ${clickedPageIndex}`, "geometry");
      triggerNotification(`Geometria Sagrada de ${selectedGeoType} materializada.`);
      playStampThump();
      return;
    }

    // 3. TOOL: BROWSE HOTSPOTS (Brings knowledge portal interaction)
    if (activeTool === "browse") {
      if (clickedPageIndex === 4) {
        let foundSeph: SephirothNode | null = null;
        let minDist = 75;
        SEPHIROTH_BOUNDS.forEach(node => {
          const d = Math.hypot(node.x - pixelX, node.y - pixelY);
          if (d < minDist) {
            minDist = d;
            foundSeph = node;
          }
        });

        if (foundSeph) {
          setSelectedSephira(foundSeph);
          setSelectedConcept(null);
          triggerNotification(`Inspecionando Sephirah de ${foundSeph.name} via câmera 3D.`);
          addTimelineLog(`Focou na Sephirah ${foundSeph.name}`, "focus");
        } else {
          setSelectedSephira(null);
        }
      }

      if (clickedPageIndex === 6) {
        let foundConcept: KnowledgeNode | null = null;
        let minDist = 70;
        GRIMOIRE_KNOWLEDGE_NODES.forEach(node => {
          const d = Math.hypot(node.x - pixelX, node.y - pixelY);
          if (d < minDist) {
            minDist = d;
            foundConcept = node;
          }
        });

        if (foundConcept) {
          setSelectedConcept(foundConcept);
          setSelectedSephira(null);
          triggerNotification(`Alinhamento do portal de ${foundConcept.label} ativo.`);
          addTimelineLog(`Ativou Portal de Conhecimento ${foundConcept.label}`, "portal_click");
        } else {
          setSelectedConcept(null);
        }
      }
    }
  };

  // Real-time brush drawings logic (Dragging support)
  const isDrawingProgressRef = useRef<boolean>(false);

  const handlePointerDownCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "draw") return;
    isDrawingProgressRef.current = true;
    handlePaintDrag(e, true); 
  };

  const handlePointerMoveCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingProgressRef.current || activeTool !== "draw") return;
    handlePaintDrag(e, false); 
  };

  const handlePointerUpCoords = () => {
    isDrawingProgressRef.current = false;
  };

  const handlePaintDrag = (e: React.MouseEvent<HTMLDivElement>, isNewStroke: boolean) => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !mountRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);
    raycaster.setFromCamera(mouse, cameraRef.current);

    const targets = [];
    if (pageLeftMeshRef.current) targets.push(pageLeftMeshRef.current);
    if (pageRightMeshRef.current) targets.push(pageRightMeshRef.current);

    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length === 0) return;

    const hit = intersects[0];
    const hitMesh = hit.object as THREE.Mesh;
    const uv = hit.uv;
    if (!uv) return;

    const isLeftHit = hitMesh === pageLeftMeshRef.current;
    const clickedPageIndex = isLeftHit ? grimoireState.currentPage : grimoireState.currentPage + 1;

    const pixelX = Math.floor(uv.x * 1024);
    const pixelY = Math.floor((1 - uv.y) * 1024);

    // Play tactile Web Audio quill writing friction feedback
    playQuillScribble();

    setGrimoireState(prev => {
      const pageStrokes = prev.drawings[clickedPageIndex] || [];
      
      if (isNewStroke) {
        const newStroke: DrawingStroke = {
          points: [{ x: pixelX, y: pixelY }],
          color: prev.activeColor,
          width: brushWidth,
          wetOpacity: 1.0
        };
        return {
          ...prev,
          drawings: {
            ...prev.drawings,
            [clickedPageIndex]: [...pageStrokes, newStroke]
          }
        };
      } else {
        if (pageStrokes.length === 0) return prev;
        const updatedStrokes = [...pageStrokes];
        const lastStroke = { ...updatedStrokes[updatedStrokes.length - 1] };
        lastStroke.points = [...lastStroke.points, { x: pixelX, y: pixelY }];
        updatedStrokes[updatedStrokes.length - 1] = lastStroke;

        return {
          ...prev,
          drawings: {
            ...prev.drawings,
            [clickedPageIndex]: updatedStrokes
          }
        };
      }
    });
  };

  // Full clean up action
  const handleClearCurrentPagesRaw = () => {
    const leftIndex = grimoireState.currentPage;
    const rightIndex = grimoireState.currentPage + 1;

    setGrimoireState(prev => ({
      ...prev,
      drawings: {
        ...prev.drawings,
        [leftIndex]: [],
        [rightIndex]: []
      },
      sigils: {
        ...prev.sigils,
        [leftIndex]: [],
        [rightIndex]: []
      },
      sacredGeometries: {
        ...prev.sacredGeometries,
        [leftIndex]: [],
        [rightIndex]: []
      }
    }));
    
    addTimelineLog("Realizou Purificação Total Tinta e Selos", "clear");
    triggerNotification("Purificação total concluída: pergaminhos limpos de tintas, geometrias e selos.");
  };

  // Direct notes sement-writing inside active Sephirah
  const handleSaveSephiraHandwrittenNote = () => {
    if (!selectedSephira) return;
    
    setGrimoireState(prev => ({
      ...prev,
      sephirahNotes: {
        ...prev.sephirahNotes,
        [selectedSephira.id]: sephiraInputText
      }
    }));
    addTimelineLog(`Registrou notas na Sephirah ${selectedSephira.name}`, "note");
    triggerNotification(`Gnose e saberes de ${selectedSephira.name} gravados e integrados no Códice.`);
  };

  // TRIGGER ORACLE AI CALLS (NVIDIA ORACLE INSIDE BOOK)
  const triggerTeurgicSophiaOracleInvocation = async () => {
    setIsOracleLoading(true);
    setOracleInsight("");
    triggerNotification("Conjurando o Oráculo Sophia de Alexandria...");

    if (pointLightRef.current) {
      gsap.killTweensOf(pointLightRef.current);
      pointLightRef.current.intensity = 6.2;
      pointLightRef.current.color.setHex(0x4ca6e8); 
      gsap.to(pointLightRef.current, { intensity: 2.8, duration: 2.5 });
    }

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberStatus: "Candidato Iniciado",
          studies: circles.map(c => c.name),
          notes: Object.values(grimoireState.sephirahNotes).join(" • ") || "Mapeamento ativo da Árvore da Vida e alquimia espiritual."
        })
      });

      const data = await response.json();
      setOracleInsight(data.insight || "O Oráculo sussurra em emanações de silêncio: sintonize reflexões da Árvore da Vida para transcrever visões.");
      addTimelineLog("Conjurou Revelações do Oráculo IA", "oracle");
    } catch (err) {
      setOracleInsight("O Oráculo sussurra: continue seus estudos síncronos. A caneta é sua espada espiritual, sintonize seu foco.");
    } finally {
      setIsOracleLoading(false);
      if (pointLightRef.current) {
        pointLightRef.current.color.setHex(0xffaa44);
      }
    }
  };

  // SPEECH SYNTHESIS ENGINE (Voice Reading System)
  const handleReadAloud = () => {
    if (isSpeaking) {
      stopReadingAloud();
      return;
    }

    if (!window.speechSynthesis) {
      triggerNotification("Seu navegador não oferece suporte para síntese de voz (TTS).");
      return;
    }

    setIsSpeaking(true);
    let textToSpeak = "";

    // Decide which text to voice-read based on current pages
    if (grimoireState.currentPage === 1) {
      textToSpeak = "Grimório de Aeon. Os Códices Celestiais da Egrégora de Estudo. Este tomo reage síncronamente ao seu espírito investigativo.";
    } else if (grimoireState.currentPage === 4 || grimoireState.currentPage === 5) {
      textToSpeak = selectedSephira 
        ? `Inspecionando emanação de ${selectedSephira.name}. Significado do caminho: ${selectedSephira.meaning}. Notas pessoais registradas: ${grimoireState.sephirahNotes[selectedSephira.id] || "nenhuma nota cadastrada ainda."}`
        : "Árvore da Vida, Otz Chiim. Clique em qualquer esfera no grimório para inspecionar saberes cabalísticos.";
    } else if (grimoireState.currentPage === 6 || grimoireState.currentPage === 7) {
      textToSpeak = selectedConcept
        ? `Lendo conceito de ${selectedConcept.label}. Descrição do eixo: ${selectedConcept.desc}`
        : "Núcleos de consciência Aeon. Conexões ativas de alquimia, cabala e hermetismo.";
    } else if (grimoireState.currentPage === 8) {
      textToSpeak = oracleInsight || "Conjuração de Sophia IA. O oráculo supremo sussurrará revelações místicas de seus estudos.";
    } else {
      textToSpeak = "Páginas rascunhadas de estudos livres de transmutação e sigilos planetários sintonizados.";
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "pt-BR";

    // Modulate speeds and voices according to "Narrator Modes"
    if (speechMode === "academic") {
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
    } else if (speechMode === "classic") {
      utterance.rate = 0.88;
      utterance.pitch = 0.95;
    } else if (speechMode === "ceremonial") {
      utterance.rate = 0.72; // deep slow cinematic
      utterance.pitch = 0.78;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    triggerNotification(`Narrador [${speechMode}] ativo.`);
    addTimelineLog(`Disparou Leitura de Voz [${speechMode}]`, "speech");
  };

  const stopReadingAloud = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    triggerNotification("Narrador interrompido.");
  };

  // Procedural Preset Generator Application
  const handleApplyPresetType = (type: NonNullable<GrimoireState["grimoireType"]>) => {
    let chosenPaper = paperStyle;
    let chosenCover = coverStyle;

    if (type === "Cabalístico") {
      chosenPaper = "yellow";
      chosenCover = "royal";
    } else if (type === "Astrológico") {
      chosenPaper = "dark";
      chosenCover = "black";
    } else if (type === "Alquímico") {
      chosenPaper = "alchemical";
      chosenCover = "wooden";
    } else if (type === "Templário") {
      chosenPaper = "ancient";
      chosenCover = "bronze";
    } else if (type === "Rosacruciano") {
      chosenPaper = "ancient";
      chosenCover = "emerald";
    } else {
      chosenPaper = "ancient";
      chosenCover = "antique";
    }

    setPaperStyle(chosenPaper);
    setCoverStyle(chosenCover);

    setGrimoireState(prev => ({
      ...prev,
      grimoireType: type
    }));

    addTimelineLog(`Gerador Procedural: Mudando para Grimório ${type}`, "preset_gen");
    triggerNotification(`Grimório procedural regenerado como: ${type}! Capa e ornamentos adaptados.`);
  };

  const getEnvOverlayClass = () => {
    switch (ambientEnv) {
      case "temple": return "from-[#080d16] to-black";
      case "archive": return "from-[#0a0c0a] to-black";
      case "library": return "from-[#110c08] to-black";
      default: return "from-[#0a0a0c] to-black";
    }
  };

  return (
    <div className={`grid grid-cols-12 gap-5 pb-8 bg-gradient-to-b ${getEnvOverlayClass()} p-4 rounded-3xl border border-[#C8A96B]/20 relative overflow-hidden`} id="aeon-grimoire-v2-container">
      
      {/* Golden top decorative bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8A96B]/50 to-transparent z-10"></div>

      {/* Control Tools Panel Floating (Left Column of Page View) */}
      <div className="col-span-12 xl:col-span-3 flex flex-col gap-4 z-20">
        
        {/* Title & App logo branding */}
        <div className="p-4 bg-black/60 border border-[#C8A96B]/15 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-[-50px] right-[-40px] w-28 h-28 bg-[#C8A96B]/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-[#C8A96B] mb-2">
            <BookOpen className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C8A96B]">Grimoire Engine v2_build</span>
          </div>
          <h3 className="font-cinzel text-base font-bold text-white tracking-widest">ARCANE CODEX V2</h3>
          <p className="font-serif text-stone-300 text-[11px] italic mt-1 leading-relaxed">
            Uma fusão viva de manuscrito renascentista, física realista e inteligência analítica de Sophia AI.
          </p>

          {/* Multiplayer Initiate Tracker */}
          <div className="mt-3 pt-2.5 border-t border-stone-900 flex justify-between items-center text-[10px] font-mono text-stone-400">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Iniciados Online:</span>
              <span className="text-emerald-400 font-bold">{simulatedPeers + 1}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded animate-pulse">Síncrono</span>
          </div>
        </div>

        {/* 1. Procedural Grimoire Generator */}
        <div className="p-4 bg-black/70 border border-stone-900 rounded-2xl space-y-3 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <Grid className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Gerador Procedural</span>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono text-stone-500 uppercase block">Selecionar Tipo de Manuscrito:</label>
            <select
              value={grimoireState.grimoireType || "Hermético"}
              onChange={(e) => handleApplyPresetType(e.target.value)}
              className="w-full bg-stone-950 border border-stone-850 py-2 px-3 rounded-xl text-[11px] text-[#C8A96B] font-mono hover:border-[#C8A96B]/50 transition-all focus:outline-none"
            >
              <option value="Hermético">Hermético (Tradicional)</option>
              <option value="Cabalístico">Cabalístico (Emanações Áureas)</option>
              <option value="Rosacruciano">Rosacruciano (Vilas de Flores)</option>
              <option value="Templário">Templário (Cruz de Bronze)</option>
              <option value="Alquímico">Alquímico (Walnut Wood)</option>
              <option value="Astrológico">Astrológico (Negro Sideral)</option>
              <option value="Filosófico">Filosófico (Clássico)</option>
              <option value="Acadêmico">Acadêmico (Formal)</option>
              <option value="Biblioteca Pessoal">Biblioteca Pessoal</option>
            </select>
          </div>
        </div>

        {/* 2. Tools & Stamping Selector */}
        <div className="p-4 bg-black/70 border border-stone-900 rounded-2xl space-y-4 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Interação Ativa</span>
            <span className="text-[9px] font-mono text-stone-500 capitalize">{activeTool}</span>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => {
                setActiveTool("browse");
                triggerNotification("Modo de Foco Ativo: Toque em Conexões e Esferas.");
              }}
              title="Explorar Portais de Conhecimento"
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                activeTool === "browse" 
                  ? "bg-[#C8A96B]/20 border-[#C8A96B] text-white" 
                  : "bg-black hover:bg-stone-900 border-stone-850 text-stone-400"
              }`}
            >
              <CompassIcon className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-mono tracking-tighter">Navegar</span>
            </button>

            <button
              onClick={() => {
                setActiveTool("draw");
                triggerNotification("Modo Caneta/Tinta ativado. Arraste no Tomo.");
              }}
              title="Escrever traços manuais"
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                activeTool === "draw" 
                  ? "bg-[#C8A96B]/20 border-[#C8A96B] text-white" 
                  : "bg-black hover:bg-stone-900 border-stone-850 text-stone-400"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-mono tracking-tighter">Caneta</span>
            </button>

            <button
              onClick={() => {
                setActiveTool("stamp");
                if (SIGIL_LIST.length > 0 && !grimoireState.selectedSigilIdForStamp) {
                  setGrimoireState(prev => ({ ...prev, selectedSigilIdForStamp: SIGIL_LIST[0].id }));
                }
                triggerNotification("Ateliê de Selos Celestiais aberto.");
              }}
              title="Estampar Glifos Ocultos"
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                activeTool === "stamp" 
                  ? "bg-[#C8A96B]/20 border-[#C8A96B] text-white" 
                  : "bg-black hover:bg-stone-900 border-stone-850 text-stone-400"
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-mono tracking-tighter">Selo</span>
            </button>

            <button
              onClick={() => {
                setActiveTool("geometry");
                triggerNotification("Editor de Geometria Sagrada ativo. Clique nas páginas.");
              }}
              title="Sacred Geometry Builder"
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                activeTool === "geometry" 
                  ? "bg-[#C8A96B]/20 border-[#C8A96B] text-white" 
                  : "bg-black hover:bg-stone-900 border-stone-850 text-stone-400"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[7.5px] font-mono tracking-tighter">Geometria</span>
            </button>
          </div>

          {/* Living Ink customizer options */}
          {activeTool === "draw" && (
            <div className="p-3 bg-stone-950 rounded-xl space-y-3.5 border border-stone-900 animate-slide-up text-[10px]">
              <div className="flex justify-between font-mono text-stone-400">
                <span>Tinta Viva Estilos</span>
                <span className="text-[#C8A96B] font-bold">Modulado</span>
              </div>

              <select
                value={grimoireState.inkStyle || "black"}
                onChange={(e) => setGrimoireState(prev => ({ ...prev, inkStyle: e.target.value as typeof prev.inkStyle }))}
                className="w-full bg-black border border-stone-850 p-1.5 rounded text-white font-mono"
              >
                <option value="quill">Pena Antiga (Acastanhada)</option>
                <option value="black">Tinta Preta Seca (Carvão)</option>
                <option value="gold">Shimmer Ouro Alquímico (Brilhante)</option>
                <option value="silver">Tinta Prata Estelar</option>
                <option value="ritual">Vermelho Ritualístico (Intenso)</option>
              </select>

              <div className="flex justify-between font-mono text-stone-400 pt-1">
                <span>Espessura:</span>
                <span>{brushWidth}px</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={brushWidth} 
                onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                className="w-full accent-[#C8A96B] h-1 bg-stone-900 rounded-lg" 
              />
            </div>
          )}

          {/* Stamped Sigils Selector customized */}
          {activeTool === "stamp" && (
            <div className="p-3 bg-stone-950 rounded-xl space-y-2 border border-stone-900 text-[10px]">
              <span className="font-mono text-stone-400 block mb-1">Selecione Selo da Biblioteca:</span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[140px] overflow-y-auto scrollbar pr-1">
                {SIGIL_LIST.map(sig => (
                  <button
                    key={sig.id}
                    onClick={() => {
                      setGrimoireState(prev => ({ ...prev, selectedSigilIdForStamp: sig.id }));
                      triggerNotification(`Selo Celestial Sintonizado: ${sig.name}`);
                    }}
                    className={`p-2 rounded-lg border text-left flex gap-2 items-center transition-all cursor-pointer ${
                      grimoireState.selectedSigilIdForStamp === sig.id 
                        ? "bg-[#C8A96B]/15 border-[#C8A96B] text-white" 
                        : "bg-black border-stone-900 text-stone-400"
                    }`}
                  >
                    <span className="text-[#C8A96B] font-bold">🜚</span>
                    <div className="truncate">
                      <span className="block text-[10px] font-bold leading-none">{sig.name}</span>
                      <span className="text-[8px] text-stone-500 font-mono italic block mt-0.5">{sig.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sacred Geometry Builder Panel */}
          {activeTool === "geometry" && (
            <div className="p-3 bg-stone-950 rounded-xl space-y-2 border border-stone-900 text-[9.5px] font-mono text-stone-400">
              <span className="text-[#C8A96B] uppercase tracking-wide font-bold block mb-1">Geometria Sagrada Matriz</span>
              
              <div className="space-y-2">
                <div>
                  <span className="block mb-1">Polígono Teológico:</span>
                  <select
                    value={selectedGeoType}
                    onChange={(e) => setSelectedGeoType(e.target.value as Parameters<typeof setSelectedGeoType>[0])}
                    className="w-full bg-black border border-stone-850 p-1.5 rounded text-white"
                  >
                    <option value="pentagram">Pentagrama Protetor</option>
                    <option value="hexagram">Hexagrama de Sintonização</option>
                    <option value="heptagram">Heptagrama das Sete Estrelas</option>
                    <option value="flower">Flor da Vida (Microcosmo)</option>
                    <option value="metatron">Cubo de Metatron (Completo)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block mb-1">Cor:</span>
                    <select
                      value={geoColor}
                      onChange={(e) => setGeoColor(e.target.value)}
                      className="w-full bg-black border border-stone-850 p-1 rounded text-white"
                    >
                      <option value="#C8A96B">Ouro Alquímico</option>
                      <option value="#be4ce8">Cabala Roxo</option>
                      <option value="#4ca6e8">Azul Sophia</option>
                      <option value="#d62828">Vermelho Fogo</option>
                    </select>
                  </div>
                  <div>
                    <span className="block mb-1">Raio (px):</span>
                    <input
                      type="number"
                      min="60"
                      max="220"
                      value={geoRadius}
                      onChange={(e) => setGeoRadius(parseInt(e.target.value) || 120)}
                      className="w-full bg-black border border-stone-850 p-1 rounded text-white text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1 text-[8.5px] text-stone-500 text-center">
                Clique nas páginas do Tomo 3D para estampar a geometria selecionada.
              </div>
            </div>
          )}
        </div>

        {/* Vocal Acoustic Resonator Section */}
        <div className="p-4 bg-black/70 border border-stone-900 rounded-2xl space-y-3 backdrop-blur-md">
          <div className="flex justify-between items-center pr-1">
            <div className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Ressonador Vocal</span>
            </div>
            {micEnabled ? (
              <span className="text-[8px] font-mono text-emerald-400 animate-pulse uppercase">Ativo</span>
            ) : (
              <span className="text-[8px] font-mono text-stone-500 uppercase">Inativo</span>
            )}
          </div>

          <p className="text-[9.5px] font-serif text-stone-400 leading-normal italic">
            Ative o captador acústico para modular as emanações de soft body e folhear dinâmico das páginas em tempo real com sua voz.
          </p>

          <button
            onClick={toggleMicResonator}
            className={`w-full py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              micEnabled
                ? "bg-red-950/20 hover:bg-red-950/40 border-red-900/50 text-red-400"
                : "bg-[#C8A96B]/10 hover:bg-[#C8A96B]/20 border-[#C8A96B]/30 text-[#C8A96B] hover:text-white"
            }`}
          >
            {micEnabled ? (
              <>
                <MicOff className="w-3.5 h-3.5" /> Desativar Ressonador
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 animate-pulse" /> Ativar Ressonador
              </>
            )}
          </button>

          {micEnabled && (
            <div className="p-2.5 bg-stone-950 rounded-xl space-y-2 border border-stone-900 animate-slide-up text-[9.5px] font-mono">
              <div className="flex justify-between text-stone-500 text-[8.5px]">
                <span>FREQUÊNCIA DE RESSONÂNCIA:</span>
                <span className="text-emerald-400 font-bold">{(currentMicIntensity > 0 ? 120 + currentMicIntensity * 2.8 : 0).toFixed(0)} Hz</span>
              </div>
              
              <div className="flex justify-between text-stone-500 text-[8.5px]">
                <span>MULTIPLICADOR DE IMPACTO:</span>
                <span className="text-[#C8A96B] font-bold">{(1.0 + (currentMicIntensity / 100) * 8.0).toFixed(1)}x</span>
              </div>

              {/* Dynamic waveform meter bar */}
              <div className="space-y-1">
                <span className="text-stone-500 text-[8px] block uppercase">Intensidade Vocal:</span>
                <div className="h-2 bg-stone-900 rounded overflow-hidden flex gap-[2px] p-[1.5px]">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const threshold = (idx / 12) * 100;
                    const isActive = currentMicIntensity >= threshold;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-sm transition-colors duration-100 ${
                          isActive
                            ? idx > 8
                              ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                              : idx > 5
                              ? "bg-yellow-500 shadow-[0_0_4px_rgba(234,179,8,0.5)]"
                              : "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                            : "bg-stone-950"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Physical Wear & Aging Customizer */}
        <div className="p-4 bg-black/70 border border-stone-900 rounded-2xl space-y-3.5 backdrop-blur-md">
          <div className="flex items-center gap-1 p-0.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">Estética do Volume Gasto</span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-stone-400">
              <span>Nível de Envelhecimento</span>
              <span className="text-stone-300 font-bold">{grimoireState.agingLevel} / 10</span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              value={grimoireState.agingLevel || 4}
              onChange={(e) => setGrimoireState(prev => ({ ...prev, agingLevel: parseInt(e.target.value) }))}
              className="w-full accent-[#C8A96B] h-1 bg-stone-900 rounded-lg"
            />
          </div>

          {/* Physical Material Style override */}
          <div className="grid grid-cols-2 gap-2 text-[8.5px] font-mono text-stone-400">
            <div>
              <span>Textura Celulosa:</span>
              <select
                value={paperStyle}
                onChange={(e) => setPaperStyle(e.target.value as Parameters<typeof setPaperStyle>[0])}
                className="w-full bg-stone-950 border border-stone-850 p-1.5 rounded mt-1 text-white"
              >
                <option value="ancient">Pergaminho Gasto</option>
                <option value="yellow">Papel Amarelado</option>
                <option value="dark">Alinhamento Negro</option>
                <option value="alchemical">Alquímico Secado</option>
              </select>
            </div>
            <div>
              <span>Capa Costurada:</span>
              <select
                value={coverStyle}
                onChange={(e) => setCoverStyle(e.target.value as Parameters<typeof setCoverStyle>[0])}
                className="w-full bg-stone-950 border border-stone-850 p-1.5 rounded mt-1 text-white"
              >
                <option value="antique">Couro Antigo</option>
                <option value="black">Couro Negro</option>
                <option value="royal">Imperial Vermelho</option>
                <option value="emerald">Esmeralda Oculta</option>
                <option value="wooden">Madeira Entalhada</option>
                <option value="golden">Ouro Envelhecido</option>
                <option value="bronze">Bronze Antigo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <button
            onClick={handleClearCurrentPagesRaw}
            className="flex-1 py-2.5 bg-stone-950 hover:bg-red-950/20 text-stone-400 hover:text-red-400 border border-stone-900 hover:border-red-900/40 font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Purificar Tomo
          </button>
        </div>

      </div>

      {/* Main interactive 3D WebGL Grimoire canvas (Center Column) */}
      <div className="col-span-12 xl:col-span-6 relative flex flex-col justify-between bg-black/90 border border-[#C8A96B]/15 rounded-2xl overflow-hidden shadow-[inset_0_0_120px_rgba(0,0,0,0.98)] min-h-[500px]">
        
        {/* Title Badge overlays */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
          <div className="text-left">
            <span className="text-[8.5px] text-[#C8A96B] uppercase font-mono tracking-wider block">Gnostologia 3D síncrona</span>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs font-bold text-white tracking-widest">TOMO SUPREMO DE ALEXANDRIA</span>
              {isFlippingRef.current && (
                <span className="text-[8px] text-yellow-500 font-mono uppercase bg-yellow-950/40 border border-yellow-900/30 px-1.5 py-0.5 rounded animate-pulse">Soft Body Sim 2.0...</span>
              )}
            </div>
          </div>
          <div className="bg-[#C8A96B]/10 border border-[#C8A96B]/40 px-3 py-1 rounded text-[8.5px] font-mono text-[#C8A96B] uppercase tracking-wider backdrop-blur-md">
            Mapeamento: {grimoireState.grimoireType || "Hermetismo"}
          </div>
        </div>

        {/* 3D WebGL parent wrapper holding interactive overlays and canvas container separately */}
        <div 
          onClick={handleCanvasClickOrDraw}
          onMouseDown={handlePointerDownCoords}
          onMouseMove={handlePointerMoveCoords}
          onMouseUp={handlePointerUpCoords}
          onMouseLeave={handlePointerUpCoords}
          className="flex-1 w-full relative min-h-[460px] cursor-crosshair flex flex-col"
          id="webgl-canvas-mount-parent"
        >
          {/* 3D WebGL Canvas Holder (Separated element so innerHTML wiping doesn't affect overlays) */}
          <div ref={mountRef} className="flex-1 w-full min-h-[460px] relative z-0" />

          {/* Instructions overlay depending on tools */}
          {activeTool === "browse" && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-stone-850 px-4 py-2.5 rounded-xl text-[10px] font-mono text-stone-400 text-center pointer-events-none animate-pulse z-10">
              Clique nos pontos das esferas (Sephiroth) e conexões para focar a câmera 3D.
            </div>
          )}
          {activeTool === "draw" && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-stone-850 px-4 py-2.5 rounded-xl text-[10px] font-mono text-stone-400 text-center pointer-events-none z-10">
              Arraste e trace diretamente nas páginas à caneta com o pigmento escolhido.
            </div>
          )}
        </div>

        {/* Interactive physical Page flip navigation bars (AAA weight) */}
        <div className="border-t border-stone-900 bg-stone-950/80 backdrop-blur p-4 flex justify-between items-center z-10">
          <button
            onClick={() => handlePageFlip("backward")}
            disabled={grimoireState.currentPage <= 1 || isFlippingRef.current}
            className="px-4 py-2.5 bg-black hover:bg-stone-900 border border-stone-850 text-stone-400 hover:text-white rounded-xl text-[9.5px] font-mono font-bold uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Páginas Anteriores
          </button>

          <div className="text-center font-cinzel text-xs text-stone-300 font-bold tracking-widest uppercase">
            Códice {grimoireState.currentPage} <span className="text-[#C8A96B] font-mono font-normal">e</span> {grimoireState.currentPage + 1} <span className="text-stone-600 font-mono font-normal">/ 8</span>
          </div>

          <button
            onClick={() => handlePageFlip("forward")}
            disabled={grimoireState.currentPage >= 8 || isFlippingRef.current}
            className="px-4 py-2.5 bg-[#C8A96B]/15 hover:bg-[#C8A96B] border border-[#C8A96B]/30 text-[#C8A96B] hover:text-black rounded-xl text-[9.5px] font-mono font-bold uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            Próximas Páginas <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Dynamic details sidebar linked directly to 3D book pages (Right Column) */}
      <div className="col-span-12 xl:col-span-3 flex flex-col gap-4 z-20">
        
        {/* 1. Synthetic Speech Voice Narrators */}
        <div className="p-4 bg-black/60 border border-[#C8A96B]/15 rounded-2xl space-y-3.5 backdrop-blur-md">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-[#C8A96B]" />
              <span className="text-[9.5px] font-mono font-bold text-stone-300 uppercase tracking-wider">Leitura de Voz</span>
            </div>
            {isSpeaking && (
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-[8.5px] font-mono text-stone-500 uppercase block">Estilo de Orador:</span>
            <div className="grid grid-cols-3 gap-1 text-[8px] font-mono">
              <button
                onClick={() => setSpeechMode("academic")}
                className={`py-1 rounded border ${speechMode === "academic" ? "bg-[#C8A96B]/10 border-[#C8A96B]" : "bg-black border-stone-850"}`}
              >
                Acadêmico
              </button>
              <button
                onClick={() => setSpeechMode("classic")}
                className={`py-1 rounded border ${speechMode === "classic" ? "bg-[#C8A96B]/10 border-[#C8A96B]" : "bg-black border-stone-850"}`}
              >
                Clássico
              </button>
              <button
                onClick={() => setSpeechMode("ceremonial")}
                className={`py-1 rounded border ${speechMode === "ceremonial" ? "bg-[#C8A96B]/10 border-[#C8A96B]" : "bg-black border-stone-850"}`}
              >
                Cerimonial
              </button>
            </div>
          </div>

          <button
            onClick={handleReadAloud}
            className={`w-full py-2 border rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isSpeaking 
                ? "bg-red-950/20 hover:bg-red-950/50 border-red-500 text-red-400" 
                : "bg-black hover:bg-[#C8A96B]/10 border-[#C8A96B]/40 text-[#C8A96B] hover:text-white"
            }`}
          >
            <Volume2 className="w-4 h-4" /> {isSpeaking ? "Interromper Narrativa" : "Ouvir esta Página"}
          </button>
        </div>

        {/* 2. Page contextual controls */}

        {/* Capa de Introdução context */}
        {grimoireState.currentPage === 1 && (
          <div className="p-4 bg-black/60 border border-stone-900 rounded-2xl flex-1 flex flex-col justify-between animate-fade-in text-[11px] backdrop-blur-md min-h-[280px]">
            <div>
              <span className="text-[8px] font-mono text-[#C8A96B] uppercase tracking-wider block mb-1">Cátedra de Estudos Ocultos</span>
              <h4 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase mb-2">CONVERSAÇÃO DE EGREGORAS</h4>
              <p className="font-serif text-stone-300 leading-relaxed italic mb-4">
                "Este livro é um organismo conceitual. Use as sintonizações e ritos no painel esquerdo para deixar seus traços digitais."
              </p>
              
              <div className="border-t border-stone-900 pt-3 space-y-2">
                <span className="text-[8.5px] font-mono text-stone-500 uppercase block">Distribuição de Códices</span>
                <div className="space-y-1 text-[10px] font-mono text-stone-400">
                  <div className="flex gap-1.5 items-center"><span className="text-[#C8A96B]">I-II.</span> Rascunhos e Selagens</div>
                  <div className="flex gap-1.5 items-center"><span className="text-[#C8A96B]">III-IV.</span> Árvore da Vida Sênior</div>
                  <div className="flex gap-1.5 items-center"><span className="text-[#C8A96B]">V-VI.</span> Eixos de Alexandria</div>
                  <div className="flex gap-1.5 items-center"><span className="text-[#C8A96B]">VII-VIII.</span> Oráculo Celeste Sophia</div>
                </div>
              </div>
            </div>

            <div className="p-2 bg-stone-950 border border-stone-900 rounded-xl mt-3 text-[9.5px]">
              <span className="text-[#C8A96B] font-mono font-bold block uppercase mb-1">Instrução Cabala</span>
              <p className="font-serif text-stone-400">Clique nas próximas páginas no rodapé para prosseguir à folha de rituais livres.</p>
            </div>
          </div>
        )}

        {/* Páginas 2-3 (Scribble space context) */}
        {(grimoireState.currentPage === 2 || grimoireState.currentPage === 3) && (
          <div className="p-4 bg-black/60 border border-stone-900 rounded-2xl flex-1 flex flex-col justify-between animate-fade-in text-[11px] backdrop-blur-md">
            <div>
              <span className="text-[8px] font-mono text-[#C8A96B] uppercase tracking-wider block mb-1">Cronista Místico</span>
              <h4 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase mb-2">ESBOÇOS ARCANOS</h4>
              
              <p className="font-serif text-stone-300 italic mb-4 leading-relaxed">
                "O arranjo das matérias dita como a egrégora expandirá. Carimbe selos e crie suas anotações livres."
              </p>

              <div className="space-y-2 border-t border-stone-900 pt-3">
                <span className="text-[8.5px] font-mono text-stone-500 uppercase block">Glifos Estampados Ativos</span>
                
                <div className="space-y-1 max-h-[140px] overflow-y-auto scrollbar pr-1">
                  {Object.entries(grimoireState.sigils).length === 0 ? (
                    <p className="font-serif text-stone-500 italic text-[11px]">Nenhum glifo ou selo estampado nestas páginas ainda.</p>
                  ) : (
                    Object.entries(grimoireState.sigils).map(([pg, sigList]) => 
                      (sigList as UserSigil[]).map((s: UserSigil) => {
                        const def = SIGIL_LIST.find(p => p.id === s.sigilId);
                        return (
                          <div key={s.id} className="p-1.5 bg-stone-950 border border-stone-900 rounded-lg flex justify-between items-center text-[9px] font-mono">
                            <span className="text-[#C8A96B] font-bold">{def?.name || "Selo"}</span>
                            <span className="text-stone-500">Pág. {pg}</span>
                          </div>
                        );
                      })
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-stone-950 border border-stone-900 rounded-xl mt-3 text-[10px]">
              <span className="text-red-400 font-mono font-bold block uppercase mb-1">Purificar e Limpar</span>
              <p className="font-serif text-stone-400">Você pode purificar essas tintas a qualquer momento para refazer rascunhos.</p>
            </div>
          </div>
        )}

        {/* Páginas 4-5 (Tree of Life context detailed editor!) */}
        {(grimoireState.currentPage === 4 || grimoireState.currentPage === 5) && (
          <div className="p-4 bg-black/60 border border-[#C8A96B]/15 rounded-2xl flex-1 flex flex-col justify-between animate-fade-in text-[11px] backdrop-blur-md">
            <div className="space-y-4">
              <span className="text-[8px] font-mono text-[#C8A96B] uppercase tracking-wider block mb-1">Controle da Sephirah</span>
              
              {selectedSephira ? (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase">{selectedSephira.name}</h4>
                  
                  <div className="text-[10px] font-serif text-stone-400 italic bg-black/40 border border-stone-900 p-2.5 rounded-xl">
                    {selectedSephira.meaning}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8.5px] uppercase tracking-wider text-stone-500 font-mono block">Gravar Saber nesta Esfera:</span>
                    <textarea
                      value={sephiraInputText}
                      onChange={(e) => setSephiraInputText(e.target.value)}
                      placeholder="Transcreva pensamentos misticos que se unem a este centro cósmico..."
                      rows={4}
                      className="w-full p-2.5 bg-stone-950 border border-stone-850 focus:border-[#C8A96B] rounded-xl text-[11px] text-stone-200 focus:outline-none placeholder-stone-600 resize-none font-serif"
                    ></textarea>
                    
                    <button
                      onClick={handleSaveSephiraHandwrittenNote}
                      className="w-full py-1.5 bg-[#C8A96B] text-black hover:text-white font-mono text-[9px] font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Gravar na Matriz <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-stone-500 space-y-2">
                  <Database className="w-7 h-7 text-[#C8A96B]/20 mx-auto animate-bounce" />
                  <p className="font-serif italic text-stone-400">Clique em qualquer esfera (Kether, Tiphereth, Yesod...) no Grimório 3D para focar a câmera e transcrever saberes no tomo.</p>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-stone-950 border border-stone-900 rounded-xl mt-3 text-[10px]">
              <span className="text-[#C8A96B] font-mono font-bold block uppercase mb-1">Atalho de Seções</span>
              <p className="font-serif text-stone-400">Cada anotação salva sintoniza o banco do Oráculo Supremo de Sophia.</p>
            </div>
          </div>
        )}

        {/* Páginas 6-7 (Knowledge portals mapping) */}
        {(grimoireState.currentPage === 6 || grimoireState.currentPage === 7) && (
          <div className="p-4 bg-black/60 border border-[#C8A96B]/15 rounded-2xl flex-1 flex flex-col justify-between animate-fade-in text-[11px] backdrop-blur-md">
            <div className="space-y-3">
              <span className="text-[8px] font-mono text-[#C8A96B] uppercase tracking-wider block mb-1">Portais Intelectuais</span>
              
              {selectedConcept ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex gap-2 items-center">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedConcept.color }}></span>
                    <h4 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase">{selectedConcept.label}</h4>
                  </div>
                  
                  <p className="font-serif text-stone-300 italic bg-black/50 border border-stone-900 p-2.5 rounded-xl leading-relaxed">
                    "{selectedConcept.desc}"
                  </p>

                  <div className="space-y-1.5 border-t border-stone-900 pt-3">
                    <span className="text-[8.5px] uppercase tracking-wider text-stone-500 font-mono block">Conectar com a Egrégora Principal:</span>
                    
                    <button
                      onClick={() => {
                        const testBook = books.find(b => b.category.toLowerCase().includes(selectedConcept.label.toLowerCase()));
                        if (testBook) {
                          setSelectedBook(testBook);
                          setActiveTab("library");
                          triggerNotification(`Abriu livro: "${testBook.title}".`);
                        } else {
                          setActiveTab("library");
                          triggerNotification(`Buscando saberes na biblioteca sobre ${selectedConcept.label}.`);
                        }
                      }}
                      className="w-full py-2 bg-stone-950 hover:bg-[#C8A96B]/15 border border-stone-850 hover:border-[#C8A96B]/50 rounded-xl text-[9px] font-mono font-bold uppercase text-[#C8A96B] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Viajar para Biblioteca de Livros ⟶
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("circles");
                        triggerNotification(`Localizando círculos que debatem ${selectedConcept.label}.`);
                      }}
                      className="w-full py-2 bg-stone-950 hover:bg-[#C8A96B]/15 border border-stone-850 hover:border-[#C8A96B]/50 rounded-xl text-[9px] font-mono font-bold uppercase text-[#C8A96B] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      Unir-se aos Círculos Associados ⟶
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-stone-500 space-y-2">
                  <Compass className="w-8 h-8 text-[#C8A96B]/20 mx-auto animate-spin" style={{ animationDuration: "12s" }} />
                  <p className="font-serif text-stone-400 italic">Clique nos portais conceituais (Alquimia, Cabala, Hermetismo, Gnosis) nas páginas do Grimório para desvelar links rápidos.</p>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-stone-950 border border-stone-900 rounded-xl mt-3 text-[10px]">
              <span className="text-[#C8A96B] font-mono font-bold block uppercase mb-1">Navegação Integrada</span>
              <p className="font-serif text-stone-400">Você acessa os núcleos da egrégora principal de forma transparente, sem sair do tomo físico.</p>
            </div>
          </div>
        )}

        {/* Página 8 (Invocation teurgic context) */}
        {grimoireState.currentPage === 8 && (
          <div className="p-4 bg-black/60 border border-[#C8A96B]/15 rounded-2xl flex-1 flex flex-col justify-between animate-fade-in text-[11px] backdrop-blur-md">
            <div className="space-y-4">
              <span className="text-[8px] font-mono text-[#C8A96B] uppercase tracking-wider block mb-1">Emanação Oracular</span>
              <h4 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase">CONJURAÇÃO SUPREMA</h4>
              
              <button
                onClick={triggerTeurgicSophiaOracleInvocation}
                disabled={isOracleLoading}
                className="w-full py-3 bg-[#C8A96B] hover:bg-stone-100 disabled:bg-stone-850 text-black font-mono text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#C8A96B]/15"
              >
                {isOracleLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Conectando Egrégora...
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-3.5 h-3.5" /> Conjurar Revelações Sophia
                  </>
                )}
              </button>

              <div className="p-3 bg-stone-950/90 border border-stone-900 rounded-xl relative max-h-[160px] overflow-y-auto scrollbar">
                <span className="text-[8px] font-mono text-[#C8A96B] uppercase tracking-wider block mb-1.5">Revelação:</span>
                {oracleInsight ? (
                  <p className="font-serif text-stone-300 italic leading-relaxed text-[10px] animate-fade-in">
                    "{oracleInsight}"
                  </p>
                ) : (
                  <p className="font-serif text-stone-500 italic text-[10px]">
                    Toque no botão de conjuração mística acima para sintonizar a sabedoria unificada de Sophia AI baseada no seu scholar.
                  </p>
                )}
              </div>
            </div>

            <div className="p-2 bg-stone-950 border border-stone-900 rounded-xl mt-3 text-[9.5px]">
              <span className="text-[#C8A96B] font-mono font-bold block uppercase mb-1">Eco Revelador</span>
              <p className="font-serif text-stone-400">Combine anotações para ver conselhos customizados sob o selo de Sophia.</p>
            </div>
          </div>
        )}

        {/* 3. Grimoire Action Timeline (Chronicle Log Feature) */}
        <div className="p-4 bg-black/60 border border-stone-900 rounded-2xl flex flex-col space-y-2 backdrop-blur-md max-h-[160px] overflow-hidden">
          <div className="flex justify-between items-center text-[9.5px] font-mono text-stone-400">
            <span className="uppercase font-bold">Cronologia de Estudos</span>
            <span className="text-[8px] text-stone-500">Histórico do Grimório</span>
          </div>
          <div className="space-y-1.5 overflow-y-auto pr-1 scrollbar flex-1 text-[9px] font-mono text-stone-500">
            {timelineLogs.map(log => (
              <div key={log.id} className="flex gap-2 items-start border-l border-stone-850 pl-2">
                <span className="text-[#C8A96B] font-bold text-[8px] bg-[#C8A96B]/5 px-1 rounded">{log.time}</span>
                <span className="text-stone-300 flex-1 leading-tight">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
