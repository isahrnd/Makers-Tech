// Manejo simple del inventario - fácil de entender y modificar
import productsData from '../data/products.json';

export interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  stock: number;
  specs: Record<string, string>;
  category: string;
  description: string;
  rating: number;
}

export interface Inventory {
  computers: Product[];
  accessories: Product[];
  smartphones: Product[];
}

// Función simple para obtener todos los productos
export const getAllProducts = (): Product[] => {
  const inventory = productsData as Inventory;
  return [
    ...inventory.computers,
    ...inventory.accessories,
    ...inventory.smartphones
  ];
};

// Función simple para obtener productos por categoría
export const getProductsByCategory = (category: keyof Inventory): Product[] => {
  const inventory = productsData as Inventory;
  return inventory[category] || [];
};

// Función simple para buscar productos por nombre o marca
export const searchProducts = (query: string): Product[] => {
  const allProducts = getAllProducts();
  const searchTerm = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.type.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
};

// Función simple para obtener un producto por ID
export const getProductById = (id: string): Product | null => {
  const allProducts = getAllProducts();
  return allProducts.find(product => product.id === id) || null;
};

// Función simple para obtener estadísticas del inventario
export const getInventoryStats = () => {
  const allProducts = getAllProducts();
  
  return {
    totalProducts: allProducts.length,
    totalStock: allProducts.reduce((sum, product) => sum + product.stock, 0),
    categories: {
      computers: getProductsByCategory('computers').length,
      accessories: getProductsByCategory('accessories').length,
      smartphones: getProductsByCategory('smartphones').length
    },
    brands: getBrandStats(),
    averagePrice: Math.round(allProducts.reduce((sum, product) => sum + product.price, 0) / allProducts.length)
  };
};

// Función simple para obtener estadísticas por marca
export const getBrandStats = () => {
  const allProducts = getAllProducts();
  const brandStats: Record<string, number> = {};
  
  allProducts.forEach(product => {
    brandStats[product.brand] = (brandStats[product.brand] || 0) + product.stock;
  });
  
  return brandStats;
};