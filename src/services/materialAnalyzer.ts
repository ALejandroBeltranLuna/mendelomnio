import { Elementbeast } from '../types/elementbeasts';
import { INITIAL_ELEMENTBEASTS, SCANNABLE_OBJECTS } from '../data/database';

export interface AnalysisResult {
  objectName: string;
  majorityMaterial: string;
  chemicalFormula: string;
  confidence: number;
  explanation: string;
  elementbeast: Elementbeast;
  abundancePercentage: number;
  purity: string;
}

/**
 * Intelligent Chemical Material Detector
 * Identifies the object, calculates its majority chemical element/compound, and finds its Elementbeast representation.
 */
export async function analyzeImageOrObject(
  imageSrc?: string,
  objectLabelHint?: string
): Promise<AnalysisResult> {
  // If we have a hint from user or simulated scanner:
  const query = (objectLabelHint || '').toLowerCase().trim();

  // Check if it matches any known scannable sample
  let matchedSample = SCANNABLE_OBJECTS.find(
    s => s.name.toLowerCase().includes(query) || s.majorityMaterial.toLowerCase().includes(query) || s.formula.toLowerCase() === query
  );

  // If not found, smart fuzzy chemical categorization
  let beastId = 'hidrogeno';
  let objectName = 'Objeto Desconocido de Materia';
  let majorityMaterial = 'Materia Orgánica y Agua';
  let formula = 'H2O / C';
  let explanation = 'Detectadas estructuras moleculares con base de hidrógeno y enlaces covalentes.';
  let abundance = 78;

  if (matchedSample) {
    beastId = matchedSample.beastId;
    objectName = matchedSample.name;
    majorityMaterial = matchedSample.majorityMaterial;
    formula = matchedSample.formula;
    explanation = matchedSample.description;
    abundance = 85 + Math.floor(Math.random() * 12);
  } else if (query.includes('vidrio') || query.includes('cristal') || query.includes('arena') || query.includes('cuarzo')) {
    beastId = 'silice_arena';
    objectName = 'Fragmento Vítreo';
    majorityMaterial = 'Dióxido de Silicio (Sílice)';
    formula = 'SiO2';
    explanation = 'Estructura tetraédrica de sílice amorfa de alta resistencia térmica.';
    abundance = 92;
  } else if (query.includes('cobre') || query.includes('cable') || query.includes('moneda')) {
    beastId = 'cobre';
    objectName = 'Conductor Metálico';
    majorityMaterial = 'Cobre Metálico';
    formula = 'Cu';
    explanation = 'Red metálica con mar de electrones de alta conductividad.';
    abundance = 99;
  } else if (query.includes('hierro') || query.includes('metal') || query.includes('acero') || query.includes('tornillo') || query.includes('clavo')) {
    beastId = 'hierro';
    objectName = 'Elemento de Acero / Hierro';
    majorityMaterial = 'Hierro Férrico';
    formula = 'Fe';
    explanation = 'Estructura cristalina ferromagnética con alta densidad de enlace.';
    abundance = 94;
  } else if (query.includes('sal') || query.includes('sodio') || query.includes('blanco')) {
    beastId = 'nacl';
    objectName = 'Cristales Salinos';
    majorityMaterial = 'Cloruro de Sodio (Sal Común)';
    formula = 'NaCl';
    explanation = 'Red cristalina cúbica centrada en las caras por enlace iónico fuerte.';
    abundance = 98;
  } else if (query.includes('agua') || query.includes('líquido') || query.includes('bebida') || query.includes('rio')) {
    beastId = 'agua';
    objectName = 'Muestra Acuosa';
    majorityMaterial = 'Monóxido de Dihidrógeno (Agua)';
    formula = 'H2O';
    explanation = 'Moléculas polares con puentes de hidrógeno y alta constante dieléctrica.';
    abundance = 99;
  } else if (query.includes('carbon') || query.includes('grafito') || query.includes('diamante') || query.includes('lapiz')) {
    beastId = 'carbono';
    objectName = 'Polímero / Carbono Mineral';
    majorityMaterial = 'Carbono Puro';
    formula = 'C';
    explanation = 'Hibridación sp2/sp3 capaz de forjar enlaces alotrópicos formidables.';
    abundance = 96;
  } else if (query.includes('calcio') || query.includes('hueso') || query.includes('tiza') || query.includes('concha')) {
    beastId = 'carbonato_calcio';
    objectName = 'Estructura Biocalcárea';
    majorityMaterial = 'Carbonato de Calcio';
    formula = 'CaCO3';
    explanation = 'Mineral calcáreo con propiedades neutralizadoras de acidez.';
    abundance = 89;
  } else if (query.includes('pila') || query.includes('bateria') || query.includes('reactivo') || query.includes('chispa')) {
    beastId = 'cesio';
    objectName = 'Celda Electroquímica';
    majorityMaterial = 'Metales Alcalinos Reactivos';
    formula = 'Cs / K';
    explanation = 'Emisión catiónica con potencial explosivo y pirofórico.';
    abundance = 88;
  } else if (query.includes('acido') || query.includes('veneno') || query.includes('toxico') || query.includes('sulfurico')) {
    beastId = 'acido_sulfurico';
    objectName = 'Emanación Corrosiva';
    majorityMaterial = 'Ácido Sulfúrico';
    formula = 'H2SO4';
    explanation = 'Ácido diprótico fuerte de corrosión destructiva inmediata.';
    abundance = 95;
  } else {
    // Random selection from database
    const randomBeast = INITIAL_ELEMENTBEASTS[Math.floor(Math.random() * INITIAL_ELEMENTBEASTS.length)];
    beastId = randomBeast.id;
    objectName = `Muestra de ${randomBeast.name}`;
    majorityMaterial = randomBeast.formula ? `${randomBeast.name} (${randomBeast.formula})` : randomBeast.name;
    formula = randomBeast.formula || randomBeast.symbol;
    explanation = randomBeast.visualDescription;
    abundance = 80 + Math.floor(Math.random() * 19);
  }

  const foundBeast = INITIAL_ELEMENTBEASTS.find(b => b.id === beastId) || INITIAL_ELEMENTBEASTS[0];

  return {
    objectName,
    majorityMaterial,
    chemicalFormula: formula,
    confidence: 0.94 + Math.random() * 0.05,
    explanation,
    elementbeast: foundBeast,
    abundancePercentage: abundance,
    purity: abundance > 90 ? 'Grado Reactivo Puro (P.A.)' : 'Grado Técnico / Natural',
  };
}
