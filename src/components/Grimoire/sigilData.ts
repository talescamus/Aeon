export interface SigilDefinition {
  id: string;
  name: string;
  category: "Alquimia" | "Cabala" | "Hermetismo" | "Selos" | "Angelicais" | "Rosacruzes" | "Astrológicos" | "Planetários";
  description: string;
  draw: (ctx: CanvasRenderingContext2D, size: number, color: string) => void;
}

export const SIGIL_LIST: SigilDefinition[] = [
  {
    id: "sol_gold",
    name: "Selo do Ouro Solar",
    category: "Alquimia",
    description: "Símbolo alquímico do Ouro Purificado (Sol), denotando perfeição espiritual e consciência divina.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      
      // Outer circle
      ctx.beginPath();
      ctx.arc(r, r, r - 5, 0, Math.PI * 2);
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(r, r, r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Rays
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = r + Math.cos(angle) * (r - 5);
        const y1 = r + Math.sin(angle) * (r - 5);
        const x2 = r + Math.cos(angle) * (r * 0.7);
        const y2 = r + Math.sin(angle) * (r * 0.7);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
  },
  {
    id: "mercury",
    name: "Selo de Mercúrio",
    category: "Alquimia",
    description: "Princípio vital ativo da Alquimia Espiritual, mediador celeste entre o macrocosmo e o microcosmo.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      // Central circle
      ctx.beginPath();
      ctx.arc(r, r + 5, r * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      // Horns (crescent on top)
      ctx.beginPath();
      ctx.arc(r, r - r * 0.35, r * 0.35, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();

      // Cross below
      ctx.beginPath();
      ctx.moveTo(r, r + 5 + r * 0.35);
      ctx.lineTo(r, r + 5 + r * 0.95);
      ctx.moveTo(r - r * 0.3, r + 5 + r * 0.65);
      ctx.lineTo(r + r * 0.3, r + 5 + r * 0.65);
      ctx.stroke();
    }
  },
  {
    id: "seal_solomon",
    name: "Selo Secreto de Salomão",
    category: "Selos",
    description: "Hexagrama sagrado de conjuração, representa o perfeito equilíbrio síncrono das polaridades e do éter.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      // Outer border circle
      ctx.beginPath();
      ctx.arc(r, r, r - 4, 0, Math.PI * 2);
      ctx.stroke();

      // Triangle 1 (pointing up)
      ctx.beginPath();
      ctx.moveTo(r, r - (r - 8));
      ctx.lineTo(r + (r - 8) * Math.sin(Math.PI/3), r + (r-8)/2);
      ctx.lineTo(r - (r - 8) * Math.sin(Math.PI/3), r + (r-8)/2);
      ctx.closePath();
      ctx.stroke();

      // Triangle 2 (pointing down)
      ctx.beginPath();
      ctx.moveTo(r, r + (r - 8));
      ctx.lineTo(r + (r - 8) * Math.sin(Math.PI/3), r - (r-8)/2);
      ctx.lineTo(r - (r - 8) * Math.sin(Math.PI/3), r - (r-8)/2);
      ctx.closePath();
      ctx.stroke();

      // Central eye
      ctx.beginPath();
      ctx.arc(r, r, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    id: "heptagram",
    name: "Heptagrama Babalon",
    category: "Hermetismo",
    description: "A Estrela dos Sete Raios da Ordem Hermética Áurea, ligada aos 7 planetas antigos da metafísica.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      // Circle
      ctx.beginPath();
      ctx.arc(r, r, r - 5, 0, Math.PI * 2);
      ctx.stroke();

      const points = [];
      const numPoints = 7;
      const step = 3; 
      const radius = r - 8;

      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI / numPoints) - Math.PI / 2;
        points.push({
          x: r + radius * Math.cos(angle),
          y: r + radius * Math.sin(angle)
        });
      }

      ctx.beginPath();
      let curr = 0;
      ctx.moveTo(points[curr].x, points[curr].y);
      for (let i = 0; i < numPoints; i++) {
        curr = (curr + step) % numPoints;
        ctx.lineTo(points[curr].x, points[curr].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  },
  {
    id: "tetragrammaton",
    name: "Selo de Kether / Tetragrammaton",
    category: "Cabala",
    description: "O Nome Inefável de Deus gravado em geometria circular. Estimula o foco espiritual absoluto e expansão.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.arc(r, r, r - 4, 0, Math.PI * 2);
      ctx.arc(r, r, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.moveTo(r + Math.cos(angle) * (r * 0.72), r + Math.sin(angle) * (r * 0.72));
        ctx.lineTo(r + Math.cos(angle) * (r - 4), r + Math.sin(angle) * (r - 4));
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(r, r, r * 0.35, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = `bold ${Math.floor(size * 0.12)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Y H W H", r, r);
    }
  },
  {
    id: "rosy_cross",
    name: "Rosa-Cruz Sagrada",
    category: "Rosacruzes",
    description: "Símbolo máximo da ressurreição espiritual, purificação e manifestação divina do microcosmo.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      // Draw cross
      ctx.beginPath();
      // Vertical bar
      ctx.strokeRect(r - r*0.12, r - r*0.8, r*0.24, r*1.6);
      // Horizontal bar
      ctx.strokeRect(r - r*0.8, r - r*0.12, r*1.6, r*0.24);
      ctx.stroke();

      // Golden rose center
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(r, r, r * 0.22, 0, Math.PI * 2);
      ctx.fill();

      // Petal segments
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(r, r, r * 0.12, 0, Math.PI * 2);
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.moveTo(r, r);
        ctx.lineTo(r + Math.cos(angle) * (r * 0.22), r + Math.sin(angle) * (r * 0.22));
      }
      ctx.stroke();
    }
  },
  {
    id: "gremory_angel",
    name: "Selo do Arcanjo Metatron",
    category: "Angelicais",
    description: "Selo angélico do escriba supremo, representando a ordem universal e a proteção cabalística.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      // Concentric circles
      ctx.beginPath();
      ctx.arc(r, r, r - 5, 0, Math.PI * 2);
      ctx.arc(r, r, r * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Metatron links/rays
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.moveTo(r + Math.cos(angle) * (r * 0.6), r + Math.sin(angle) * (r * 0.6));
        ctx.lineTo(r + Math.cos(angle + Math.PI/3) * (r - 5), r + Math.sin(angle + Math.PI/3) * (r - 5));
      }
      ctx.stroke();
    }
  },
  {
    id: "zodiac_astro",
    name: "Mandala Astrológica",
    category: "Astrológicos",
    description: "Representa a teia cósmica do tempo, as influências planetárias rítmicas e a carta de nascimento do ser.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.arc(r, r, r - 5, 0, Math.PI * 2);
      ctx.arc(r, r, r * 0.7, 0, Math.PI * 2);
      ctx.arc(r, r, r * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      // Divide into 12 houses
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.moveTo(r + Math.cos(angle) * (r * 0.3), r + Math.sin(angle) * (r * 0.3));
        ctx.lineTo(r + Math.cos(angle) * (r - 5), r + Math.sin(angle) * (r - 5));
      }
      ctx.stroke();

      // Draw planetary anchor center
      ctx.beginPath();
      ctx.arc(r, r, 2.5, 0, Math.PI*2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    id: "planetary_jupiter",
    name: "Selo Inteligente de Júpiter",
    category: "Planetários",
    description: "Representa generosidade espiritual, fomento acadêmico, sabedoria filosófica e expansão da mente.",
    draw: (ctx, size, color) => {
      const r = size / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      // Jupiter classic sigil glyph
      ctx.moveTo(r - r*0.3, r - r*0.3);
      ctx.quadraticCurveTo(r - r*0.1, r - r*0.5, r + r*0.3, r - r*0.3);
      ctx.lineTo(r - r*0.2, r + r*0.4);
      ctx.moveTo(r - r*0.5, r + r*0.1);
      ctx.lineTo(r + r*0.4, r + r*0.1);
      ctx.stroke();

      // Surround in protective circle
      ctx.beginPath();
      ctx.arc(r, r, r - 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
];
