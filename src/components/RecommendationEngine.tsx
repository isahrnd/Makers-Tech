import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  ThumbsUp, 
  User,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { getAllProducts, type Product } from '@/services/inventoryManager';

interface UserPreferences {
  budget: number;
  category: string;
  brand: string;
  usage: string;
}

const RecommendationEngine = () => {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 1500,
    category: '',
    brand: '',
    usage: ''
  });
  
  // Función simple para "login" (simulado)
  const handleLogin = () => {
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };
  
  // Algoritmo simple de recomendación
  const generateRecommendations = () => {
    const allProducts = getAllProducts();
    
    // Función simple para calcular score de recomendación
    const calculateScore = (product: Product): number => {
      let score = 0;
      
      // Factor precio (más puntos si está dentro del presupuesto)
      if (product.price <= preferences.budget) {
        score += 30;
      } else {
        score -= (product.price - preferences.budget) / 100;
      }
      
      // Factor rating (más puntos por mejor rating)
      score += product.rating * 10;
      
      // Factor stock (más puntos si hay disponibilidad)
      score += Math.min(product.stock * 5, 15);
      
      // Factor marca preferida
      if (preferences.brand && product.brand.toLowerCase().includes(preferences.brand.toLowerCase())) {
        score += 20;
      }
      
      // Factor categoría
      if (preferences.category && product.category.includes(preferences.category)) {
        score += 15;
      }
      
      return Math.max(0, score);
    };
    
    // Calcular scores y ordenar
    const scoredProducts = allProducts.map(product => ({
      ...product,
      score: calculateScore(product)
    })).sort((a, b) => b.score - a.score);
    
    // Clasificar en grupos
    const highly = scoredProducts.slice(0, 2);
    const recommended = scoredProducts.slice(2, 5);
    const notRecommended = scoredProducts.slice(5);
    
    return { highly, recommended, notRecommended };
  };
  
  const recommendations = isLoggedIn ? generateRecommendations() : null;
  
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Sistema de Recomendaciones</CardTitle>
            <CardDescription>
              Inicia sesión para recibir recomendaciones personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Ingresa tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-primary to-primary-glow"
              disabled={!userName.trim()}
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      {/* Header personalizado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Recomendaciones para {userName}
        </h1>
        <p className="text-muted-foreground mt-2">
          Productos seleccionados especialmente para ti
        </p>
      </div>
      
      {/* Panel de preferencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Ajustar Preferencias
          </CardTitle>
          <CardDescription>
            Personaliza tus recomendaciones según tus necesidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Presupuesto máximo</label>
              <Input
                type="number"
                value={preferences.budget}
                onChange={(e) => setPreferences({...preferences, budget: Number(e.target.value)})}
                placeholder="1500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoría preferida</label>
              <Input
                value={preferences.category}
                onChange={(e) => setPreferences({...preferences, category: e.target.value})}
                placeholder="gaming, premium, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Marca preferida</label>
              <Input
                value={preferences.brand}
                onChange={(e) => setPreferences({...preferences, brand: e.target.value})}
                placeholder="Apple, HP, Dell, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Uso principal</label>
              <Input
                value={preferences.usage}
                onChange={(e) => setPreferences({...preferences, usage: e.target.value})}
                placeholder="trabajo, gaming, estudio"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Productos Altamente Recomendados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Award className="w-5 h-5" />
            Altamente Recomendado
          </CardTitle>
          <CardDescription>
            Productos perfectos para tu perfil y presupuesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations?.highly.map(product => (
              <Card key={product.id} className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-accent text-accent-foreground">TOP CHOICE</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{product.brand} • {product.type}</p>
                  <p className="text-sm mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-accent">${product.price.toLocaleString()}</span>
                    <Badge variant={product.stock > 3 ? "default" : "secondary"}>
                      Stock: {product.stock}
                    </Badge>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <Zap className="w-4 h-4" />
                      <span>Match Score: {product.score.toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Productos Recomendados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ThumbsUp className="w-5 h-5" />
            Recomendado
          </CardTitle>
          <CardDescription>
            Buenas opciones que podrían interesarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations?.recommended.map(product => (
              <Card key={product.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className="border-primary text-primary">GOOD MATCH</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{product.name}</h4>
                  <p className="text-muted-foreground text-sm mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-primary">${product.price.toLocaleString()}</span>
                    <Badge variant="secondary">Stock: {product.stock}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <TrendingUp className="w-4 h-4" />
                    <span>Score: {product.score.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Productos No Recomendados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            No Recomendado
          </CardTitle>
          <CardDescription>
            Productos que no coinciden con tus preferencias actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {recommendations?.notRecommended.slice(0, 4).map(product => (
              <Card key={product.id} className="bg-muted/20">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">LOW MATCH</Badge>
                    <span className="text-xs text-muted-foreground">{product.rating}⭐</span>
                  </div>
                  <h5 className="font-medium text-sm mb-1">{product.name}</h5>
                  <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">${product.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">{product.score.toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Botón para volver a ajustar */}
      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => setIsLoggedIn(false)}
          className="mr-4"
        >
          Cambiar Usuario
        </Button>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          Actualizar Recomendaciones
        </Button>
      </div>
    </div>
  );
};

export default RecommendationEngine;