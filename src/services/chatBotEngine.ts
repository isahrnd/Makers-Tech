// Motor del ChatBot - lógica simple y clara, fácil de modificar
import { processUserMessage } from './nlpProcessor';
import { 
  getAllProducts, 
  getProductsByCategory, 
  searchProducts, 
  getProductById,
  getInventoryStats,
  getBrandStats,
  type Product 
} from './inventoryManager';

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface BotResponse {
  message: string;
  suggestedActions?: string[];
  products?: Product[];
}

// Respuestas del bot - fáciles de personalizar
const BOT_RESPONSES = {
  greeting: [
    "¡Hola! Soy el asistente de Makers Tech. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido a Makers Tech! Estoy aquí para ayudarte con nuestro inventario.",
    "¡Hola! ¿Te gustaría conocer nuestros productos disponibles?"
  ],
  unknown: [
    "No estoy seguro de entender tu pregunta. ¿Podrías ser más específico?",
    "Hmm, no logro entender eso. ¿Te gustaría saber sobre nuestro inventario, precios o características?",
    "Disculpa, no entendí bien. Puedo ayudarte con información sobre productos, precios y stock."
  ],
  noResults: [
    "Lo siento, no encontré productos que coincidan con tu búsqueda.",
    "No tengo información sobre eso en nuestro inventario actual.",
    "No encontré resultados. ¿Te gustaría ver todos nuestros productos disponibles?"
  ]
};

// Función principal del motor del ChatBot
export const processUserQuery = (userMessage: string): BotResponse => {
  // Procesar el mensaje del usuario
  const intent = processUserMessage(userMessage);
  
  // Generar respuesta según la intención detectada
  switch (intent.type) {
    case 'greeting':
      return generateGreetingResponse();
    
    case 'inventory':
      return generateInventoryResponse(intent.entities);
    
    case 'price':
      return generatePriceResponse(intent.entities);
    
    case 'specs':
      return generateSpecsResponse(intent.entities);
    
    case 'recommendation':
      return generateRecommendationResponse(intent.entities);
    
    default:
      return generateUnknownResponse();
  }
};

// Generar respuesta de saludo
const generateGreetingResponse = (): BotResponse => {
  const stats = getInventoryStats();
  return {
    message: `${getRandomResponse(BOT_RESPONSES.greeting)} 

🖥️ Tenemos ${stats.totalProducts} productos disponibles:
• ${stats.categories.computers} computadores
• ${stats.categories.accessories} accesorios  
• ${stats.categories.smartphones} smartphones

¿Qué te gustaría saber?`,
    suggestedActions: [
      "Ver todos los computadores",
      "Mostrar precios",
      "Recomiéndame algo"
    ]
  };
};

// Generar respuesta de inventario
const generateInventoryResponse = (entities: string[]): BotResponse => {
  let products: Product[] = [];
  let message = "";
  
  // Si mencionan una marca específica
  const mentionedBrand = entities.find(entity => 
    ['hp', 'dell', 'apple', 'samsung', 'logitech', 'keychron'].includes(entity)
  );
  
  if (mentionedBrand) {
    products = searchProducts(mentionedBrand);
    message = `Productos de ${mentionedBrand.toUpperCase()}:\n\n`;
  }
  // Si mencionan una categoría específica
  else if (entities.includes('computador') || entities.includes('laptop')) {
    products = getProductsByCategory('computers');
    message = `Computadores disponibles:\n\n`;
  }
  else if (entities.includes('teléfono') || entities.includes('smartphone')) {
    products = getProductsByCategory('smartphones');
    message = `Smartphones disponibles:\n\n`;
  }
  else if (entities.includes('accesorios')) {
    products = getProductsByCategory('accessories');
    message = `Accesorios disponibles:\n\n`;
  }
  else {
    // Mostrar resumen general
    const stats = getInventoryStats();
    const brandStats = getBrandStats();
    
    message = `📊 **Inventario actual:**

🖥️ **Computadores:** ${stats.categories.computers} disponibles
📱 **Smartphones:** ${stats.categories.smartphones} disponibles  
🖱️ **Accesorios:** ${stats.categories.accessories} disponibles

**Por marca:**
${Object.entries(brandStats).map(([brand, count]) => `• ${brand}: ${count} productos`).join('\n')}

**Total en stock:** ${stats.totalStock} unidades`;
  }
  
  // Agregar detalles de productos si hay productos específicos
  if (products.length > 0) {
    message += products.map(product => 
      `• **${product.name}** - ${product.brand}\n  Stock: ${product.stock} | Precio: $${product.price.toLocaleString()}`
    ).join('\n\n');
    
    if (products.length === 1) {
      message += "\n\n¿Te gustaría conocer más detalles de este producto?";
    } else {
      message += "\n\n¿Cuál de estos te interesa más?";
    }
  }
  
  return {
    message,
    products: products.length > 0 ? products : undefined,
    suggestedActions: products.length > 0 ? 
      ["Ver especificaciones", "Comparar precios"] : 
      ["Ver computadores", "Ver smartphones", "Ver accesorios"]
  };
};

// Generar respuesta de precios
const generatePriceResponse = (entities: string[]): BotResponse => {
  let products: Product[] = [];
  let message = "";
  
  // Buscar productos específicos mencionados
  if (entities.length > 0) {
    entities.forEach(entity => {
      const found = searchProducts(entity);
      products.push(...found);
    });
    
    // Remover duplicados
    products = products.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
  }
  
  if (products.length > 0) {
    message = `💰 **Precios encontrados:**\n\n`;
    message += products
      .sort((a, b) => a.price - b.price)
      .map(product => 
        `• **${product.name}** - ${product.brand}\n  💵 $${product.price.toLocaleString()} | Stock: ${product.stock}`
      ).join('\n\n');
  } else {
    // Mostrar rangos de precios generales
    const stats = getInventoryStats();
    message = `💰 **Información de precios:**

📊 Precio promedio: $${stats.averagePrice.toLocaleString()}

**Rangos por categoría:**
🖥️ Computadores: $1,299 - $1,999
📱 Smartphones: $1,099 - $1,299  
🖱️ Accesorios: $129 - $179

¿Te interesa alguna categoría en particular?`;
  }
  
  return {
    message,
    products: products.length > 0 ? products : undefined,
    suggestedActions: ["Ver más detalles", "Comparar opciones", "Ver por categoría"]
  };
};

// Generar respuesta de especificaciones
const generateSpecsResponse = (entities: string[]): BotResponse => {
  let products: Product[] = [];
  
  if (entities.length > 0) {
    entities.forEach(entity => {
      const found = searchProducts(entity);
      products.push(...found);
    });
    
    products = products.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
  }
  
  if (products.length === 0) {
    return {
      message: "No especificaste qué producto te interesa. ¿Podrías decirme de qué producto quieres conocer las características?",
      suggestedActions: ["Ver computadores", "Ver smartphones", "Ver accesorios"]
    };
  }
  
  if (products.length === 1) {
    const product = products[0];
    const specsText = Object.entries(product.specs)
      .map(([key, value]) => `• **${key}:** ${value}`)
      .join('\n');
    
    const message = `🔧 **${product.name} - ${product.brand}**

${specsText}

💰 **Precio:** $${product.price.toLocaleString()}
📦 **Stock:** ${product.stock} disponibles
⭐ **Rating:** ${product.rating}/5

${product.description}`;
    
    return {
      message,
      products: [product],
      suggestedActions: ["Ver precio", "Comparar con otros", "Más información"]
    };
  }
  
  // Múltiples productos
  const message = `🔧 **Especificaciones encontradas:**\n\n` +
    products.map(product => {
      const keySpecs = Object.entries(product.specs).slice(0, 2)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      return `• **${product.name}** - ${keySpecs}`;
    }).join('\n');
  
  return {
    message: message + "\n\n¿Cuál te gustaría conocer en detalle?",
    products,
    suggestedActions: ["Ver detalles completos", "Comparar todos"]
  };
};

// Generar respuesta de recomendación
const generateRecommendationResponse = (entities: string[]): BotResponse => {
  const allProducts = getAllProducts();
  
  // Algoritmo simple de recomendación basado en rating y popularidad
  const recommended = allProducts
    .filter(product => product.stock > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  const message = `⭐ **Mis recomendaciones top:**

${recommended.map((product, index) => 
    `${index + 1}. **${product.name}** - ${product.brand}
   💰 $${product.price.toLocaleString()} | ⭐ ${product.rating}/5
   ${product.description}`
  ).join('\n\n')}

¿Te gustaría conocer más sobre alguno de estos?`;
  
  return {
    message,
    products: recommended,
    suggestedActions: ["Ver detalles", "Comparar precios", "Más opciones"]
  };
};

// Generar respuesta para consultas no entendidas
const generateUnknownResponse = (): BotResponse => {
  return {
    message: `${getRandomResponse(BOT_RESPONSES.unknown)}

Puedo ayudarte con:
• 📦 Inventario y stock disponible
• 💰 Precios de productos  
• 🔧 Especificaciones técnicas
• ⭐ Recomendaciones personalizadas

¿Qué te gustaría saber?`,
    suggestedActions: ["Ver inventario", "Mostrar precios", "Recomiéndame algo"]
  };
};

// Función helper para obtener respuestas aleatorias
const getRandomResponse = (responses: string[]): string => {
  return responses[Math.floor(Math.random() * responses.length)];
};