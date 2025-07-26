// Procesador de lenguaje natural simple - fácil de entender y modificar
export interface Intent {
  type: 'inventory' | 'price' | 'specs' | 'recommendation' | 'greeting' | 'unknown';
  entities: string[];
  confidence: number;
}

// Palabras clave simples para detectar intenciones
const KEYWORDS = {
  inventory: [
    'cuántos', 'cantidad', 'stock', 'disponible', 'hay', 'tienen', 'inventario',
    'productos', 'computadores', 'laptops', 'teléfonos', 'accesorios'
  ],
  price: [
    'precio', 'costo', 'vale', 'cuesta', 'cuánto', 'barato', 'caro', 'económico',
    'presupuesto', 'dinero', 'pagar'
  ],
  specs: [
    'características', 'especificaciones', 'specs', 'procesador', 'ram', 'memoria',
    'pantalla', 'cámara', 'batería', 'almacenamiento', 'detalles', 'información'
  ],
  recommendation: [
    'recomienda', 'recomendación', 'mejor', 'cuál', 'qué', 'sugiere', 'aconseja',
    'comparar', 'diferencia', 'ventajas'
  ],
  greeting: [
    'hola', 'buenos', 'buenas', 'saludos', 'hi', 'hello', 'ayuda', 'servicio'
  ]
};

// Marcas y productos para detectar entidades
const ENTITIES = {
  brands: ['hp', 'dell', 'apple', 'samsung', 'logitech', 'keychron'],
  products: ['computador', 'laptop', 'teléfono', 'mouse', 'teclado', 'ssd', 'iphone', 'macbook'],
  categories: ['gaming', 'ultrabook', 'premium', 'flagship', 'peripherals', 'storage']
};

// Función principal para procesar el texto del usuario
export const processUserMessage = (message: string): Intent => {
  const normalizedMessage = message.toLowerCase();
  
  // Detectar tipo de intención
  const intentType = detectIntent(normalizedMessage);
  
  // Extraer entidades (marcas, productos, etc.)
  const entities = extractEntities(normalizedMessage);
  
  // Calcular confianza simple
  const confidence = calculateConfidence(normalizedMessage, intentType);
  
  return {
    type: intentType,
    entities,
    confidence
  };
};

// Función simple para detectar la intención principal
const detectIntent = (message: string): Intent['type'] => {
  let maxScore = 0;
  let detectedIntent: Intent['type'] = 'unknown';
  
  // Contar coincidencias de palabras clave para cada intención
  Object.entries(KEYWORDS).forEach(([intent, keywords]) => {
    const score = keywords.filter(keyword => message.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent as Intent['type'];
    }
  });
  
  return detectedIntent;
};

// Función simple para extraer entidades del mensaje
const extractEntities = (message: string): string[] => {
  const foundEntities: string[] = [];
  
  // Buscar marcas
  ENTITIES.brands.forEach(brand => {
    if (message.includes(brand)) {
      foundEntities.push(brand);
    }
  });
  
  // Buscar productos
  ENTITIES.products.forEach(product => {
    if (message.includes(product)) {
      foundEntities.push(product);
    }
  });
  
  // Buscar categorías
  ENTITIES.categories.forEach(category => {
    if (message.includes(category)) {
      foundEntities.push(category);
    }
  });
  
  return foundEntities;
};

// Función simple para calcular confianza
const calculateConfidence = (message: string, intentType: string): number => {
  if (intentType === 'unknown') return 0.1;
  
  const keywords = KEYWORDS[intentType as keyof typeof KEYWORDS] || [];
  const matches = keywords.filter(keyword => message.includes(keyword)).length;
  
  // Confianza basada en el número de coincidencias
  return Math.min(0.9, 0.3 + (matches * 0.2));
};