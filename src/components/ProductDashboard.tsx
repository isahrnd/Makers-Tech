import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Monitor, 
  Smartphone, 
  Mouse, 
  TrendingUp, 
  Package, 
  DollarSign,
  Star
} from 'lucide-react';
import { 
  getAllProducts, 
  getInventoryStats, 
  getBrandStats,
  getProductsByCategory 
} from '@/services/inventoryManager';

const ProductDashboard = () => {
  // Obtener datos del inventario
  const allProducts = getAllProducts();
  const stats = getInventoryStats();
  const brandStats = getBrandStats();
  
  // Datos para gráficos
  const categoryData = [
    { name: 'Computadores', value: stats.categories.computers, color: 'hsl(var(--primary))' },
    { name: 'Smartphones', value: stats.categories.smartphones, color: 'hsl(var(--accent))' },
    { name: 'Accesorios', value: stats.categories.accessories, color: 'hsl(var(--primary-glow))' }
  ];
  
  const brandData = Object.entries(brandStats).map(([brand, stock]) => ({
    brand: brand.charAt(0).toUpperCase() + brand.slice(1),
    stock
  }));
  
  const priceRanges = [
    { range: '$0-500', count: allProducts.filter(p => p.price < 500).length },
    { range: '$500-1000', count: allProducts.filter(p => p.price >= 500 && p.price < 1000).length },
    { range: '$1000-1500', count: allProducts.filter(p => p.price >= 1000 && p.price < 1500).length },
    { range: '$1500+', count: allProducts.filter(p => p.price >= 1500).length }
  ];
  
  return (
    <div className="space-y-6 p-6">
      {/* Header del Dashboard */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard Administrativo
        </h1>
        <p className="text-muted-foreground mt-2">
          Métricas y análisis del inventario de Makers Tech
        </p>
      </div>
      
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Productos diferentes en catálogo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Unidades disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${stats.averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              En todos los productos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {(allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Calificación de productos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Categoría</CardTitle>
            <CardDescription>Productos disponibles por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Stock por marca */}
        <Card>
          <CardHeader>
            <CardTitle>Stock por Marca</CardTitle>
            <CardDescription>Unidades disponibles por fabricante</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Análisis adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rangos de precio */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Precios</CardTitle>
            <CardDescription>Productos por rango de precio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priceRanges}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Lista de productos con stock bajo */}
        <Card>
          <CardHeader>
            <CardTitle>Productos con Stock Bajo</CardTitle>
            <CardDescription>Productos que necesitan reposición</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allProducts
                .filter(product => product.stock <= 2)
                .map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <Badge variant={product.stock === 1 ? "destructive" : "secondary"}>
                      {product.stock} en stock
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Productos más valorados */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Destacados</CardTitle>
          <CardDescription>Los productos mejor valorados de nuestro inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map(product => (
                <Card key={product.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{product.brand}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{product.type}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">${product.price.toLocaleString()}</span>
                    <Badge variant={product.stock > 3 ? "default" : "secondary"}>
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDashboard;