/**
 * The Elementbeasts: Core Type Definitions
 * Based on the official Production Bible by Alejandro Beltran Luna
 */

export type MatterState = 'Sólido' | 'Líquido' | 'Gaseoso' | 'Plasma' | 'Supercrítico';

export type ElementCategory = 
  | 'Alcalinos' 
  | 'Alcalinotérreos' 
  | 'Metales de Transición' 
  | 'Metales del Bloque p'
  | 'Metaloides' 
  | 'No Metales' 
  | 'Halógenos' 
  | 'Gases Nobles'
  | 'Compuesto Molecular'
  | 'Aleación'
  | 'Ácido / Base';

export type CriticalMode = 
  | 'Fase Supercrítica'
  | 'Alotropía Metaestable'
  | 'Superfluidez Cuántica'
  | 'Ionización de Plasma';

export type DebuffType = 'Corrosión' | 'Fragilización' | 'Disolución' | 'Amalgamación';

export type FieldEffect = 
  | 'Vacío Químico'
  | 'Excitación Eléctrica'
  | 'Oxidación Ambiental'
  | 'Campo Magnético'
  | 'Plasma Térmico';

export interface CreatureStats {
  hp: number;
  maxHp: number;
  fuerza: number; // Ataque (Mohs / Densidad)
  resistencia: number; // Defensa (Punto de Fusión / Energía de Enlace)
  velocidad: number; // Prioridad (Electronegatividad Pauling)
  poderEspecial: number; // pH (Acidez/Basicidad)
  masaAtomica: number;
  durezaMohs?: number;
  puntoFusionC?: number;
  electronegatividad?: number;
  ph?: number;
}

export interface SpecialProperty {
  name: string;
  description: string;
  effectCode: 'MAGNETICO' | 'ELASTICO' | 'LACERANTE' | 'ARISTOCRACIA_ISOTOPICA' | 'HIDRORREACCION' | 'CONDUCTOR' | 'REFRACTARIO' | 'OXIDANTE' | 'CORROSIVO';
}

export interface Elementbeast {
  id: string;
  name: string;
  symbol: string;
  atomicNumber?: number;
  formula?: string;
  isCompound: boolean;
  category: ElementCategory;
  state: MatterState;
  color: string;
  accentColor: string;
  visualDescription: string;
  lore: string;
  stats: CreatureStats;
  property: SpecialProperty;
  reactionHistory?: string; // Where it appeared in the series
  composition?: { elementId: string; count: number }[];
  avatarEmoji: string;
  imageUrl?: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  archetype: string;
  category: 'protagonista' | 'secundario' | 'sindicato';
  catchphrase: string;
  concept: string;
  visual: string;
  palette: string[];
  signatureGadget: string;
  starterElementId: string;
  motivation: string;
  weakness: string;
  evolutionArc: string;
  avatar: string;
  costCoins: number;
  isCensored?: boolean;
}

export interface EpisodeGuide {
  number: number;
  title: string;
  summary: string;
  scientificReaction: string;
  reactionFormula?: string;
  featuredBeasts: string[];
}

export interface ScannableObjectSample {
  id: string;
  name: string;
  description: string;
  majorityMaterial: string;
  formula: string;
  beastId: string;
  category: string;
  icon: string;
  color: string;
}

export interface BattleActionLog {
  id: string;
  turn: number;
  actor: 'player' | 'enemy' | 'system';
  message: string;
  actionType: 'attack' | 'synthesize' | 'critical' | 'field' | 'debuff' | 'cleanse' | 'recoil';
  damage?: number;
}
