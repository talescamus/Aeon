import { AcademicStatus, Circle, LibraryBook, ResearchPaper, AcademicEvent, AgoraPost, NotificationItem, AcademicCertificate, PrivateChat } from "./types";

export const ACADEMIC_REQUIREMENTS: Record<AcademicStatus, { requirements: string; production: string; access: string }> = {
  [AcademicStatus.ASPIRANTE]: {
    requirements: "Ingresso aprovado por convite de membro interno. Realizar meditação preliminar.",
    production: "Nenhuma produção exigida. Período de mansa observação.",
    access: "Biblioteca Geral (obras elementares), fóruns de círculo público."
  },
  [AcademicStatus.ESTUDANTE]: {
    requirements: "Concluir a leitura de pelo menos 3 tomos basilares e preencher 5 anotações de estudo.",
    production: "Elaboração de um diário analítico resumido das leituras iniciais.",
    access: "Biblioteca Intermediária, permissão de envio de ensaios curtos para revisão."
  },
  [AcademicStatus.INICIADO]: {
    requirements: "Sessão de arguição mística por um Adepto e participação em 3 conferências ao vivo.",
    production: "Publicação do primeiro ensaio acadêmico nos arquivos do círculo correspondente.",
    access: "Participação ativa em fóruns fechados de Círculo, acesso a seções seladas de livros refinados."
  },
  [AcademicStatus.ADEPTO]: {
    requirements: "Apresentação e aprovação de monografia original. 1 ano de caminhada perseverante.",
    production: "Monografia extensiva sobre simbolismo tradicional aprovada por pareceristas de IA.",
    access: "Criação de novos tópicos acadêmicos, curadoria auxiliar de livros arcanos."
  },
  [AcademicStatus.PESQUISADOR]: {
    requirements: "Aprovação de tese mística no Conselho Geral. 2 artigos científicos publicados peer-to-peer.",
    production: "Investigações históricas e traduções de manuscritos raros comentadas.",
    access: "Canal direto de mentorias, liderança de grupos de debate rituais."
  },
  [AcademicStatus.MENTOR]: {
    requirements: "Indicação editorial unânime por 3 Mestres. Conclusão de 15 mentorias documentadas.",
    production: "Orientação ativa de teses e revisão por pares de monografias enviadas ao portal.",
    access: "Aprovação formal de publicações nos Círculos, moderação de conferências."
  },
  [AcademicStatus.GUARDIAO]: {
    requirements: "Defesa ritual de axiomas herméticos perante o Templo. Responsabilidade patrimonial da biblioteca.",
    production: "Curadoria avançada de acervo secreto e manutenção do egrégora digital.",
    access: "Selo de veto em ensaios, acesso total e irrestrito a obras de nível Arcano oculto."
  },
  [AcademicStatus.MESTRE]: {
    requirements: "Gnosis madura. Vida dedicada ao sacerdócio intelectual. Voto outorgado pelo conselho AEON.",
    production: "Teses que redefinem o entendimento do ocultismo moderno e alquimia integrativa.",
    access: "Acesso absoluto, chancela de filiações virtuais e coordenação de painéis ao vivo."
  }
};

export const INITIAL_BOOKS: LibraryBook[] = [
  {
    id: "h1",
    title: "Corpus Hermeticum",
    author: "Hermes Trismegistus",
    year: "Século II-III AD",
    category: "Hermetismo",
    difficulty: "Arcano",
    coverUrl: "",
    pages: 420,
    description: "O núcleo filosófico e teológico da tradição hermética descrita nos diálogos sagrados entre Hermes e Poimandres, versando sobre a criação, a alma humana e a ascensão através das esferas celestes.",
    status: "Lendo",
    currentPage: 87,
    fullText: `[TEXTO ORIGINAL TRADUZIDO - ESTUDO PRIVADO AEON]\n\nI. Aconteceu certa vez, enquanto eu meditava sobre as coisas que existem, e meu pensamento se elevava alto, enquanto meus sentidos corporais estavam refreados... que me pareceu ver um ser de tamanho imenso, sem limites definidos, que me chamou pelo nome e disse:\n\n– O que queres ouvir e ver, e o que tens em mente aprender e conhecer?\n\nII. E eu disse:\n\n– Quem és tu?\n\n– Eu sou Poimandres – disse ele –, a Mente do Supremo Poder (Nous). Eu sei o que desejas e estou contigo em todos os lugares.\n\nIII. Eu respondi:\n\n– Desejo aprender sobre as coisas que existem, compreender sua natureza e conhecer a Deus. Ó, como desejo ouvir!\n\nEle respondeu:\n\n– Guarda em tua mente tudo o que desejas aprender, e eu te ensinarei.\n\nIV. Com essas palavras, ele mudou de aspecto e, num momento, todas as coisas se abriram diante de mim, e vi uma visão ilimitada, todas as coisas tornadas luz, doce e alegre, e fiquei maravilhado ao contemplá-la. Mas, pouco depois, desceu uma treva sombria e terrível, que se desdobrava em espirais sinuosas como uma serpente...`
  },
  {
    id: "c1",
    title: "Zohar: O Livro do Esplendor",
    author: "Shimon bar Yochai",
    year: "1280",
    category: "Cabala",
    difficulty: "Arcano",
    coverUrl: "",
    pages: 1200,
    description: "A obra-prima do misticismo judaico, revelando os mistérios ocultos e a exegese esotérica da Torá. Examina as dez Sephiroth (emanações divinas) e os caminhos da Árvore da Vida.",
    status: "Não Iniciado",
    currentPage: 0,
    fullText: `[EXCERTO DO LIVRO DO RETRATO SACRO - ESTUDOS AVANÇADOS]\n\nNo início do decreto do Rei, Ele gravou um selo na aura celestial. Uma centelha de escuridão surgiu dentro do oculto dos ocultos, do mistério do Infinito (Ein Sof), como uma névoa que se forma no informe... Este ponto de luz brilhou e se expandiu, gerando as dez luzes que constituem as Sephiroth, canais cósmicos da inteligência divina que erguem a carruagem do universo (Merkabah). Escutai, iniciados: cada palavra da sagrada lei esconde segredos infinitos sobre a alma do Criador e os palácios superiores.`
  },
  {
    id: "h2",
    title: "O Caibalion (The Kybalion)",
    author: "Os Três Iniciados",
    year: "1908",
    category: "Hermetismo",
    difficulty: "Básico",
    coverUrl: "",
    pages: 220,
    description: "O sumário moderno dos sete grandes princípios do hermetismo universal: Mentalismo, Correspondência, Vibração, Polaridade, Ritmo, Causa e Efeito, e Gênero.",
    status: "Lido",
    currentPage: 220,
    fullText: `[OS SETE AXIOMAS DA LEI HERMÉTICA]\n\n1. O Princípio de Mentalismo: 'O Todo é Mente; o Universo é Mental.'\n2. O Princípio de Correspondência: 'O que está em cima é como o que está embaixo; o que está embaixo é como o que está em cima.'\n3. O Princípio de Vibração: 'Nada está parado; tudo se move; tudo vibra.'\n4. O Princípio de Polaridade: 'Tudo é duplo; tudo tem polos; tudo tem o seu oposto; o igual e o desigual são a mesma coisa; os opostos são idênticos em natureza, mas diferentes em graus; os extremos se tocam; todas as verdades são meias-verdades; todos os paradoxos podem ser reconciliados.'\n5. O Princípio de Ritmo: 'Tudo tem fluxo e refluxo; tudo tem suas marés; tudo sobe e desce; tudo se manifesta por oscilações compensadas; a medida do movimento à direita é a medida do movimento à esquerda; o ritmo é a compensação.'\n6. O Princípio de Causa e Efeito: 'Toda causa tem seu efeito; todo efeito tem sua causa; tudo acontece de acordo com a lei; o acaso é simplesmente um nome dado a uma lei não reconhecida; há muitos planos de causalidade, mas nada escapa à lei.'\n7. O Princípio de Gênero: 'O gênero está em tudo; tudo tem seus princípios masculino e feminino; o gênero se manifesta em todos os planos.'`
  },
  {
    id: "a1",
    title: "A Chave Maior de Salomão",
    author: "Rei Salomão (Grimório)",
    year: "Século XIV",
    category: "Grimórios",
    difficulty: "Avançado",
    coverUrl: "",
    pages: 350,
    description: "O mais influente guia de magia cerimonial salomônica do período medieval, estipulando a confecção de talismãs mágicos planetários, pentáculos de proteção e os ritos de evocação.",
    status: "Lendo",
    currentPage: 45,
    fullText: `[TEXTO SAGRADO DOS PENTÁCULOS PLANETÁRIOS]\n\nEste é o Primeiro Pentáculo de Marte: Ele é próprio para invocar os espíritos da natureza e constrangê-los a obedecer às tuas palavras. No centro está gravado o Nome Secreto de Deus e nas bordas estão desenhados os caracteres divinos que barram o avanço das forças da confusão espiritual. Limpa a mente de toda concupiscência terrena, acende os perfumes puros do incenso e desenha o círculo sagrado com o selo protetor de ferro antes de proferir as conjurações.`
  },
  {
    id: "g1",
    title: "Lemegeton: Clavicula Salomonis (Ars Goetia)",
    author: "Anônimo / Manuscrito Histórico",
    year: "Século XVII",
    category: "Demonologia",
    difficulty: "Avançado",
    coverUrl: "",
    pages: 180,
    description: "Estudos filológicos e históricos sobre as 72 inteligências goéticas e espíritos estipulados no clássico manuscrito salomônico, detalhando seus selos heráldicos e ritos geométricos.",
    status: "Não Iniciado",
    currentPage: 0,
    fullText: `[ARQUIVO FILOLÓGICO DA GOETIA - AEON]\n\nO primeiro espírito principal é um Rei que governa no Leste, chamado Bael. Ele ensina a ciência da invisibilidade e da transmutação mental. Manifesta-se em diversas formas: às vezes como um sapo, às vezes como um gato, e às vezes como um homem sábio de voz sutil. O seu selo deve ser desenhado em ouro maciço ou cobre sob uma atmosfera propícia à concentração intelectual dos arquétipos ocultos.`
  },
  {
    id: "r1",
    title: "Fama Fraternitatis",
    author: "Christian Rosenkreuz (Manifesto)",
    year: "1614",
    category: "Rosacrucianismo",
    difficulty: "Intermediário",
    coverUrl: "",
    pages: 140,
    description: "O manifesto inaugural que estabeleceu a misteriosa Fraternidade da Rosa-Cruz na Europa, pregando a reforma espiritual do homem e a união da ciência com a mística.",
    status: "Não Iniciado",
    currentPage: 0,
    fullText: `[MANIFESTO ROSACRUZ COMPLETO PARA MEMBROS]\n\nNós, os Irmãos do Colégio Invisível, declaramos a abertura de um portal de luz espiritual e intelectual sobre o mundo. O Irmão C.R., nosso luminar fundador, viajou pelo Oriente, sorveu dos segredos de Damcar e do Cairo, sintetizando a verdadeira Alquimia da Alma. Nossa Ordem não acumula bens, curamos os enfermos de graça e nosso selo brilha no silêncio interior sob a égide da rosa florescendo sobre o sacrifício da cruz.`
  },
  {
    id: "t1",
    title: "A Regra Secreta dos Cavaleiros Templários",
    author: "Bernardo de Claraval",
    year: "1129 AD",
    category: "Manuscritos Históricos",
    difficulty: "Intermediário",
    coverUrl: "",
    pages: 310,
    description: "Um mergulho acadêmico sobre os estatutos secretos atribuídos à Ordem dos Pobres Cavaleiros de Cristo, dividida entre ritos de ascetismo militar e mistérios gnósticos de Alexandria.",
    status: "Lido",
    currentPage: 310,
    fullText: `[DOCUMENTO HISTÓRICO - CÓDICE TEMPLÁRIO]\n\nQue nenhum irmão se orgulhe de sua força corporal ou das armas terrenas. A verdadeira fortaleza espiritual reside na obediência pura ao Altíssimo e no recolhimento solene do Templo de Salomão. Os segredos acumulados por nossos bravos predecessores nos arquivos herméticos sob o Monte do Templo em Jerusalém não pertencem a profanos. Guarde a regra sagrada e não revele as chaves iniciáticas sob pena de exílio da sagrada guilda.`
  }
];

export const INITIAL_CIRCLES: Circle[] = [
  {
    id: "cabala",
    name: "Círculo da Cabala Mística",
    icon: "Hexagon",
    description: "Estudos profundos das Sephiroth, emanações do Absoluto (Ein Sof), Gematria literária antiga, anjos planetários e a Árvore da Vida.",
    color: "#C8A96B",
    bgTexture: "rgba(200, 169, 107, 0.05)",
    studies: ["Árvore da Vida", "Doutrina das Sephiroth", "Zohar Geral", "Gematria Avançada", "Angelologia do Antigo Pacto"],
    libraryIds: ["c1", "a1"],
    forum: [
      {
        id: "post1",
        author: "Irmão Samuel",
        authorStatus: AcademicStatus.PESQUISADOR,
        title: "A Convergência de Netzach e Hod na Mente Iniciada",
        content: "Proponho uma reflexão sobre como a esfera da Vitória (Netzach, emoção pura) e do Esplendor (Hod, intelecto estruturado) encontram equilíbrio perfeito em Tiphereth, gerando a beleza integradora do eu.",
        date: "2026-06-02",
        replies: [
          {
            author: "Irmã Deborah",
            authorStatus: AcademicStatus.MENTOR,
            content: "Excelente análise, Samuel. O rigor científico de Hod protege o místico de delírios idealistas característicos de Netzach desregulado.",
            date: "2026-06-03"
          }
        ]
      }
    ],
    events: [
      {
        id: "ev1",
        title: "Exegese Avançada: O Livro de Isaías e a Cabala",
        date: "2026-06-15",
        time: "19:30",
        circleId: "cabala",
        zoomUrl: "https://zoom.us/j/98765432101",
        type: "Zoom",
        attendanceCount: 14
      }
    ],
    chat: [
      {
        id: "ch1",
        sender: "Irmão Samuel",
        senderStatus: AcademicStatus.PESQUISADOR,
        content: "Irmãos, iniciamos a contagem e análise dos valores de Gematria para a palavra 'Emet' (Verdade). Alguém gostaria de se unir ao caderno de anotações?",
        timestamp: "09:40"
      }
    ],
    files: [
      { id: "f1", name: "Gematria_Basilar_Tabela.pdf", size: "2.4 MB", uploadedBy: "Irmã Deborah", date: "2026-05-18", category: "Tabelas e Simbologias" }
    ]
  },
  {
    id: "hermetismo",
    name: "Círculo Hermético",
    icon: "Compass",
    description: "Investigações da Tradição Hermética herdada de Hermes Trismegistus. Alquimia interna, astrologia hermética e o Corpus Hermeticum.",
    color: "#8D6E3D",
    bgTexture: "rgba(141, 110, 61, 0.05)",
    studies: ["As Sete Leis do Caibalion", "Corpus Hermeticum", "Filosofia dos Elementos", "Astrologia Polar", "Alquimia Espiritual"],
    libraryIds: ["h1", "h2"],
    forum: [
      {
        id: "post2",
        author: "Mestre Aurelius",
        authorStatus: AcademicStatus.MESTRE,
        title: "A Verdadeira Transmutação do Chumbo em Ouro",
        content: "Alquimia física é apenas uma máscara infantil para atrair profanos cobiçosos. O verdadeiro labor do Alquimista é na retorta de seu próprio ser: purificar as paixões ignóbeis (chumbo) para brilhar a Luz de Kether (ouro).",
        date: "2026-05-28",
        replies: []
      }
    ],
    events: [
      {
        id: "ev2",
        title: "Conferência Global: Solve et Coagula no Desenvolvimento Humano",
        date: "2026-06-20",
        time: "21:00",
        circleId: "hermetismo",
        meetUrl: "https://meet.google.com/abc-defg-hij",
        type: "Google Meet",
        attendanceCount: 38
      }
    ],
    chat: [],
    files: [
      { id: "f2", name: "Tabula_Smaragdina_Traducoes.pdf", size: "1.1 MB", uploadedBy: "Mestre Aurelius", date: "2026-05-20", category: "Escrituras" }
    ]
  },
  {
    id: "angelico",
    name: "Círculo Angélico",
    icon: "ShieldAlert",
    description: "Estudos teológicos e simbólicos das Hierarquias Celestes de Dionísio Areopagita, Arcanjos Tradicionais, e manuscritos henquinos.",
    color: "#E2E8F0",
    bgTexture: "rgba(226, 232, 240, 0.03)",
    studies: ["Hierarquias Celestes", "Arcanjos Metatron e Sandalphon", "Simbolismo Geométrico do Templo", "Letras Sagradas e Estrelas"],
    libraryIds: ["a1"],
    forum: [],
    events: [],
    chat: [],
    files: []
  },
  {
    id: "goetia",
    name: "Círculo Goético",
    icon: "Skull",
    description: "Estudos filológicos rigorosos dos grimórios solomônicos medievais e do Ars Goetia sob lentes psicológicas, arquetípicas e históricas.",
    color: "#DC2626",
    bgTexture: "rgba(220, 38, 38, 0.05)",
    studies: ["Estudos de Manuscritos Medievais", "Estudo Junguiano dos Arquétipos Sombrios", "Clavicula Salomonis", "História dos Grimórios Continentais"],
    libraryIds: ["g1"],
    forum: [{
      id: "postg1",
      author: "Iniciado Dante",
      authorStatus: AcademicStatus.INICIADO,
      title: "Interpretação Junguiana das 72 Inteligências",
      content: "Minha tese analisa cada demônio descrito por Salomão como um complexo de sombra reprimida na consciência coletiva ocidental. Os ritos de controle do grimório funcionam como métodos antigos de terapia de desintegração e reintegração da psique.",
      date: "2026-06-08",
      replies: []
    }],
    events: [],
    chat: [],
    files: []
  },
  {
    id: "luciferiano",
    name: "Círculo Luciferiano",
    icon: "Flame",
    description: "Análise literária e esotérica do simbolismo da Estrela da Manhã (Prometeu). Autonomia espiritual, gnosticismo libertário e gnosis.",
    color: "#475569",
    bgTexture: "rgba(71, 85, 105, 0.04)",
    studies: ["Gnosticismo e Demiurgo", "Arquétipo Prometéico de Lúcifer", "Filosofia Ocultista Moderna", "A Busca pela Gnosis Divina"],
    libraryIds: ["g1"],
    forum: [],
    events: [],
    chat: [],
    files: []
  },
  {
    id: "rosacruz",
    name: "Círculo Rosacrucianismo",
    icon: "Sparkles",
    description: "Estudos místicos e intelectuais dos antigos Manifestos Rosacruzes, alquimia espiritual da alma, harmonia rítmica e gnosticismo cristão.",
    color: "#F43F5E",
    bgTexture: "rgba(244, 63, 94, 0.05)",
    studies: ["Manifestos: Fama, Confessio e Bodas Químicas", "Alquimia Espiritual Rosacruz", "A Geometria da Rosa Espiritual", "Estudos do Colégio Invisível"],
    libraryIds: ["r1"],
    forum: [],
    events: [],
    chat: [],
    files: []
  },
  {
    id: "templario",
    name: "Círculo Templário",
    icon: "Sword",
    description: "Pesquisa filológica e histórica detalhada sobre a Ordem Militar e Iniciática dos Templários. Esoterismo medieval e conexões com Alexandria.",
    color: "#B91C1C",
    bgTexture: "rgba(185, 28, 28, 0.05)",
    studies: ["História da Transição em Jerusalém", "Gnosticismo Alexandrino Medieval", "Escavações Convalidadas do Monte do Templo", "Regra dos Soldados de Cristo"],
    libraryIds: ["t1"],
    forum: [],
    events: [],
    chat: [],
    files: []
  }
];

export const INITIAL_RESEARCH: ResearchPaper[] = [
  {
    id: "p1",
    title: "A Cabala Sincrética e a Astrologia no Renascimento Italiano",
    author: "Irmão Samuel",
    authorStatus: AcademicStatus.PESQUISADOR,
    circleId: "cabala",
    abstract: "Este artigo examina a profunda união entre a Gematria hebraica clássica e as técnicas astrológicas de alinhamento planetário no Renascimento, notadamente sob o trabalho de Pico della Mirandola e Marsilio Ficino.",
    content: "No decorrer das investigações escolásticas do século XV, assistimos a um renascer das artes herméticas e à síncrese teológica. Nosso foco descansa na transição dos sete planetas celestes tradicionais para as Sephiroth correspondentes superiores: Saturno como Binah (Compreensão), Júpiter como Chesed (Misericórdia), Marte como Geburah (Severidade), o Sol como Tiphereth (Harmonia), Vênus como Netzach (Vitória), Mercúrio como Hod (Intelecto), e a Lua como Yesod (Fundação)...",
    date: "2026-05-12",
    tags: ["Renascimento", "Cabala Sincrética", "Astrologia Tradicional", "Marsilio Ficino"],
    reviews: [
      {
        reviewer: "Mestre Aurelius",
        reviewerStatus: AcademicStatus.MESTRE,
        approved: true,
        comment: "Trabalho primoroso. O resgate da influência de Pico della Mirandola adiciona solidez filológica invejável. Aprovado.",
        date: "2026-05-16"
      }
    ],
    status: "Aprovado",
    version: 1
  },
  {
    id: "p2",
    title: "Os Oito Axiomas Ocultos da Tábua de Esmeralda",
    author: "Irmã Deborah",
    authorStatus: AcademicStatus.MENTOR,
    circleId: "hermetismo",
    abstract: "Uma detalhada dissecação textual das poucas, todavia monumentais, linhas compostas em grego e árabe atribuídas ao mítico Hermes Trismegistus, decodificando o processo de auto-originação espiritual.",
    content: "O enigma da Tábua de Esmeralda (Tabula Smaragdina) desafia milênios. Analisando as versões árabes do códice Kitab Sirr al-Asrar, percebe-se que as operações indicadas não se referem à transmutação mineral. Na verdade, 'O vento carregou no seu ventre' denota que a alma desperta deve habitar o elemento sutil do ar (prana) antes de precipitar a sabedoria divina no corpo físico...",
    date: "2026-06-01",
    tags: ["Hermetismo", "Tábua de Esmeralda", "Alquimia da Alma", "Filologia Árabe"],
    reviews: [],
    status: "Em Revisão",
    version: 2
  }
];

export const GENERAL_CONFERENCES: AcademicEvent[] = [
  {
    id: "g_ev1",
    title: "Conferência Global: O Gnosticismo Alexandrino e o Evangelho de Tomé",
    date: "2026-06-18",
    time: "20:00",
    zoomUrl: "https://zoom.us/j/12345678901",
    type: "Zoom",
    attendanceCount: 45
  },
  {
    id: "g_ev2",
    title: "Painel de Doutores: A Tradição Esotérica de Frederico II da Prússia",
    date: "2026-06-25",
    time: "18:00",
    meetUrl: "https://meet.google.com/xyz-qtrs-mno",
    type: "Google Meet",
    attendanceCount: 29
  },
  {
    id: "rec1",
    title: "Ensaio Comentado: Gematria e Cosmologia (Gravado)",
    date: "2026-05-20",
    time: "1h 45 min",
    recordingUrl: "https://vimeo.com/aeon-private-recordings-1",
    type: "Teams",
    attendanceCount: 92
  }
];

export const INITIAL_AGORA_POSTS: AgoraPost[] = [
  {
    id: "ap1",
    author: "Mestre Aurelius",
    authorUsername: "@aurelius_aeon",
    authorStatus: AcademicStatus.MESTRE,
    content: "Dedicai as próximas vigílias ao estudo profundo do Zohar. O mistério das Sephiroth não reside em especulações vulgares, mas sim na autotransmutação do intelecto em sintonia com a emanação primordial de Ein Sof. Cada passagem oculta guarda reflexos de pura gnosis rítmica.",
    date: "2026-06-11 08:30",
    likes: 24,
    likedByMe: false,
    reposts: 8,
    comments: [
      {
        id: "ac1",
        author: "Irmã Deborah",
        authorStatus: AcademicStatus.MENTOR,
        content: "A sintonização de Netzach com Hod tem sido central nas minhas meditações matinais, Mestre.",
        date: "2026-06-11 08:52"
      }
    ],
    tags: ["Zohar", "Cabala", "Gnosis"]
  },
  {
    id: "ap2",
    author: "Irmã Deborah",
    authorUsername: "@deborah_mentor",
    authorStatus: AcademicStatus.MENTOR,
    content: "Acabo de finalizar a transcrição anotada do códice Kitab Sirr al-Asrar, a raiz árabe da Tábua de Esmeralda. A indicação 'O vento carregou no seu ventre' correlaciona-se ao prana cósmico que atua de forma sutil no despertar interior. Compartilhei os rascunhos originais no Círculo Hermético.",
    date: "2026-06-10 17:15",
    likes: 19,
    likedByMe: true,
    reposts: 5,
    comments: [],
    tags: ["Hermetismo", "TabulaSmaragdina", "Alquimia"]
  },
  {
    id: "ap3",
    author: "Irmão Samuel",
    authorUsername: "@samuel_pesquisador",
    authorStatus: AcademicStatus.PESQUISADOR,
    content: "Incrível ver como a biblioteca da AEON reúne o maior acervo digitalizado de grimórios antigos do mundo de maneira tão preservada e de alto contraste. Meu ensaio sobre a correspondência cosmológica e Gematria integrativa está recebendo novas revisões pelas comissões de Sophia IA.",
    date: "2026-06-09 14:02",
    likes: 15,
    likedByMe: false,
    reposts: 3,
    comments: [],
    tags: ["Biblioteca", "Gematria", "Manuscritos"]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "not1",
    type: "mention",
    title: "Mencionaram você na Ágora",
    description: "Mestre Aurelius citou suas recentes investigações sobre Gematria medieval no canal de Tópicos em Ascensão.",
    date: "Há 10 minutos",
    read: false,
    senderName: "Mestre Aurelius"
  },
  {
    id: "not2",
    type: "follow",
    title: "Novo seguidor acadêmico",
    description: "Soror Sophia de Alexandria (@sophia_iniciada) começou a seguir seus estudos ocultos.",
    date: "Há 1 hora",
    read: false,
    senderName: "Soror Sophia de Alexandria"
  },
  {
    id: "not3",
    type: "like",
    title: "Curtiram sua monografia",
    description: "Irmã Deborah curtiu seu artigo recentemente chancelado pela IA Aeon Sophia.",
    date: "Ontem",
    read: true,
    senderName: "Irmã Deborah"
  },
  {
    id: "not4",
    type: "event",
    title: "Concílio Próximo",
    description: "Lembrete: A Conferência 'Zohar: A Luz Espiritual das Esferas' iniciará no Templo em breve.",
    date: "15 de Junho",
    read: true
  }
];

export const INITIAL_CERTIFICATES: AcademicCertificate[] = [
  {
    id: "cert-001",
    title: "Certificado de Consagração de Pesquisador",
    recipientName: "Frater Tales de Alexandria",
    type: "Tese Laureada",
    issueDate: "11 de Junho de 2024",
    verifiableHash: "SHA-256/AEON-777-IX-DE89DA93F20A-SECURE",
    signers: ["Mestre Aurelius (Conselho Geral)", "Sophia AI Hermeneutics Verification"]
  },
  {
    id: "cert-002",
    title: "Chancela de Curador Adjunto da Biblioteca",
    recipientName: "Frater Tales de Alexandria",
    type: "Liderança de Círculo",
    issueDate: "15 de Janeiro de 2025",
    circleName: "Círculo da Cabala Mística",
    verifiableHash: "SHA-256/CABALA-AEON-89D93F11A-SECURE",
    signers: ["Guardiana Eleni (Arquivo Central)", "Irmã Deborah (Mentor)"]
  }
];

export const INITIAL_CHATS: PrivateChat[] = [
  {
    id: "chat-aurelius",
    recipientId: "aurelius",
    recipientName: "Mestre Aurelius",
    recipientStatus: AcademicStatus.MESTRE,
    messages: [
      { id: "cm1", sender: "them", content: "Saudações, Frater Tales. Analisei preliminarmente sua colocação sobre Tiphereth. De fato, a beleza é a chave para unificar Netzach e Hod.", timestamp: "Ontem, 11:32" },
      { id: "cm2", sender: "me", content: "Massa, Mestre! Agradeço pelas palavras de encorajamento. Estou finalizando a tradução para anexar como apêndice.", timestamp: "Ontem, 11:45" },
      { id: "cm3", sender: "them", content: "Excelente. Quando estiver pronto, submeta à Sofia para peer-review formal, e ela nos encaminhará o parecer.", timestamp: "Ontem, 12:01" }
    ],
    unreadCount: 0
  },
  {
    id: "chat-deborah",
    recipientId: "deborah",
    recipientName: "Irmã Deborah",
    recipientStatus: AcademicStatus.MENTOR,
    messages: [
      { id: "cm4", sender: "them", content: "Frater Tales, você possui cópias em alta resolução dos pentáculos da Chave Maior de Salomão?", timestamp: "Terça, 15:10" },
      { id: "cm5", sender: "me", content: "Com certeza, Deborah. Vou compartilhar o manuscrito decodificado diretamente aqui na aba de arquivos do Círculo.", timestamp: "Terça, 15:18" }
    ],
    unreadCount: 1
  }
];

