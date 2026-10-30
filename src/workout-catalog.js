// Single source of truth for the ready-made workout cards and their static HTML fallback.
// Every circuit uses the existing share-link codec: no accounts and no tracking.
export const CATALOG_LANGUAGES=Object.freeze(['en','de','it','fr','es']);
export const WORKOUT_GROUPS=Object.freeze({
  "quick": [
    "Quick starts",
    "Schnell starten",
    "Allenamenti rapidi",
    "Séances express",
    "Entrenamientos rápidos"
  ],
  "everyday": [
    "Everyday fitness",
    "Fitness für jeden Tag",
    "Fitness quotidiano",
    "Forme au quotidien",
    "Fitness diario"
  ],
  "targeted": [
    "Targeted strength & stability",
    "Kraft & Stabilität gezielt",
    "Forza e stabilità mirate",
    "Force et stabilité ciblées",
    "Fuerza y estabilidad específicas"
  ]
});
export const WORKOUTS=Object.freeze([
  {
    "category": "quick",
    "focus": "full",
    "level": "beginner",
    "ids": [
      "squat",
      "kneePushup",
      "birdDog"
    ],
    "rounds": 2,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Quick full body",
      "Ganzkörper kompakt",
      "Corpo intero rapido",
      "Corps entier express",
      "Cuerpo completo rápido"
    ],
    "description": [
      "Three movements across legs, pressing and stability.",
      "Drei Übungen für Beine, Drücken und Stabilität.",
      "Tre esercizi per gambe, spinta e stabilità.",
      "Trois exercices pour les jambes, la poussée et le gainage.",
      "Tres ejercicios para piernas, empuje y estabilidad."
    ]
  },
  {
    "category": "quick",
    "focus": "full",
    "level": "beginner",
    "ids": [
      "squat",
      "kneePushup",
      "hipHinge",
      "birdDog"
    ],
    "rounds": 2,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Eight-minute reset",
      "Acht Minuten Bewegung",
      "Otto minuti di movimento",
      "Huit minutes de mouvement",
      "Ocho minutos de movimiento"
    ],
    "description": [
      "Four simple patterns with a little more lower-body work.",
      "Vier einfache Bewegungsmuster mit zusätzlicher Beinbelastung.",
      "Quattro movimenti semplici, con più lavoro per le gambe.",
      "Quatre mouvements simples avec un peu plus de travail des jambes.",
      "Cuatro movimientos sencillos con más trabajo de piernas."
    ]
  },
  {
    "category": "quick",
    "focus": "core",
    "level": "beginner",
    "ids": [
      "deadBug",
      "birdDog",
      "kneeForearmPlank"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Core activation",
      "Core aktivieren",
      "Attiva il core",
      "Activer le gainage",
      "Activación del core"
    ],
    "description": [
      "Slow coordination followed by a short knee-supported plank.",
      "Langsame Koordination und leichter Unterarmstütz auf Knien.",
      "Coordinazione lenta e plank sugli avambracci con ginocchia.",
      "Coordination lente et planche sur les genoux.",
      "Coordinación lenta y plancha con rodillas apoyadas."
    ]
  },
  {
    "category": "everyday",
    "focus": "full",
    "level": "beginner",
    "ids": [
      "squat",
      "kneePushup",
      "hipHinge",
      "birdDog",
      "stepJack"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Balanced full body",
      "Ganzkörper ausgewogen",
      "Corpo intero equilibrato",
      "Corps entier équilibré",
      "Cuerpo completo equilibrado"
    ],
    "description": [
      "A beginner-friendly mix of strength, control and low-impact movement.",
      "Einsteigerfreundlich: Kraft, Kontrolle und Bewegung ohne Sprünge.",
      "Forza, controllo e movimento senza salti, adatto ai principianti.",
      "Force, contrôle et mouvement sans saut, adaptés aux débutants.",
      "Fuerza, control y movimiento sin saltos para principiantes."
    ]
  },
  {
    "category": "everyday",
    "focus": "full",
    "level": "intermediate",
    "ids": [
      "reverseLunge",
      "pushup",
      "gluteBridgeMarch",
      "birdDog",
      "mountainClimber"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Full-body challenge",
      "Ganzkörper mit Anspruch",
      "Sfida corpo intero",
      "Défi corps entier",
      "Desafío de cuerpo completo"
    ],
    "description": [
      "Single-leg strength, pressing, stability and conditioning.",
      "Einbeinige Kraft, Drücken, Stabilität und Ausdauer.",
      "Forza su una gamba, spinte, stabilità e condizionamento.",
      "Force unilatérale, poussée, stabilité et cardio.",
      "Fuerza unilateral, empuje, estabilidad y resistencia."
    ]
  },
  {
    "category": "everyday",
    "focus": "full",
    "level": "beginner",
    "ids": [
      "squat",
      "inclinePushup",
      "hipHinge",
      "birdDog",
      "stepJack"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Quiet, low-impact circuit",
      "Leiser Zirkel ohne Sprünge",
      "Circuito silenzioso senza salti",
      "Circuit sans saut et discret",
      "Circuito silencioso sin saltos"
    ],
    "description": [
      "No jumping; incline push-ups need a stable elevated surface.",
      "Ohne Sprünge; für schräge Liegestütze eine stabile Auflage nutzen.",
      "Senza salti; serve un piano rialzato stabile per i piegamenti.",
      "Sans saut; les pompes inclinées nécessitent un appui stable.",
      "Sin saltos; las flexiones inclinadas requieren apoyo firme."
    ]
  },
  {
    "category": "targeted",
    "focus": "upper",
    "level": "beginner",
    "ids": [
      "inclinePushup",
      "deadBug",
      "snowAngel",
      "kneeForearmPlank",
      "birdDog"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Upper body & core",
      "Oberkörper & Core",
      "Parte superiore e core",
      "Haut du corps et gainage",
      "Tren superior y core"
    ],
    "description": [
      "One pressing movement plus shoulder and trunk control; no resisted pulling.",
      "Eine Druckübung plus Schulter- und Rumpfkontrolle; kein Ziehen mit Widerstand.",
      "Una spinta, controllo di spalle e core; senza trazione resistita.",
      "Une poussée, contrôle des épaules et du tronc; sans tirage résisté.",
      "Un empuje y control de hombros y abdomen; sin tracción resistida."
    ]
  },
  {
    "category": "targeted",
    "focus": "upper",
    "level": "intermediate",
    "ids": [
      "pushup",
      "deadBug",
      "snowAngel",
      "sidePlankL",
      "sidePlankR"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Upper body & core challenge",
      "Oberkörper & Core intensiv",
      "Sfida parte superiore e core",
      "Défi haut du corps et gainage",
      "Desafío de tren superior y core"
    ],
    "description": [
      "Pressing, shoulder movement and balanced side-plank holds; no resisted pulling.",
      "Drücken, Schulterbewegung und Seitstütz beidseits; kein Ziehen mit Widerstand.",
      "Spinta, mobilità delle spalle e plank laterale su entrambi i lati.",
      "Poussée, mobilité des épaules et planche latérale de chaque côté.",
      "Empuje, movimiento de hombros y plancha lateral a ambos lados."
    ]
  },
  {
    "category": "targeted",
    "focus": "legs",
    "level": "beginner",
    "ids": [
      "squat",
      "hipHinge",
      "gluteBridge",
      "calfRaise"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Leg strength foundations",
      "Beinkraft Grundlagen",
      "Forza gambe di base",
      "Bases de force des jambes",
      "Base de fuerza de piernas"
    ],
    "description": [
      "Four accessible lower-body patterns without jumps.",
      "Vier zugängliche Unterkörperübungen ohne Sprünge.",
      "Quattro movimenti accessibili per le gambe senza salti.",
      "Quatre mouvements accessibles pour les jambes, sans saut.",
      "Cuatro ejercicios accesibles para piernas, sin saltos."
    ]
  },
  {
    "category": "targeted",
    "focus": "legs",
    "level": "intermediate",
    "ids": [
      "reverseLunge",
      "hipHinge",
      "gluteBridgeMarch",
      "wallSit",
      "calfRaise"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Legs & glutes challenge",
      "Beine & Po intensiv",
      "Sfida gambe e glutei",
      "Défi jambes et fessiers",
      "Desafío de piernas y glúteos"
    ],
    "description": [
      "Squat, hinge and hip-stability work without duplicated lunge progressions.",
      "Knie-, Hüft- und Beckenstabilität ohne doppelte Ausfallschrittvarianten.",
      "Forza e stabilità di ginocchia, anche e glutei senza affondi duplicati.",
      "Force des jambes et stabilité des hanches, sans fentes redondantes.",
      "Fuerza y estabilidad de piernas y caderas sin zancadas repetidas."
    ]
  },
  {
    "category": "targeted",
    "focus": "core",
    "level": "intermediate",
    "ids": [
      "plank",
      "bicycle",
      "birdDog",
      "bearHold"
    ],
    "rounds": 3,
    "workSec": 40,
    "restSec": 20,
    "title": [
      "Core stability",
      "Rumpfstabilität",
      "Stabilità del core",
      "Stabilité du tronc",
      "Estabilidad del core"
    ],
    "description": [
      "A mix of bracing, rotation and coordination, not only static holds.",
      "Rumpfspannung, Rotation und Koordination statt nur Halten.",
      "Stabilità, rotazione e coordinazione, non solo tenute.",
      "Gainage, rotation et coordination, au-delà des maintiens.",
      "Estabilización, rotación y coordinación, no solo ejercicios estáticos."
    ]
  }
]);
