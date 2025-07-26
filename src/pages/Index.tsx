import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, BarChart3, Target, Zap } from 'lucide-react';
import ChatBot from '@/components/ChatBot';
import ProductDashboard from '@/components/ProductDashboard';
import RecommendationEngine from '@/components/RecommendationEngine';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'recommendations'>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatBot />;
      case 'dashboard':
        return <ProductDashboard />;
      case 'recommendations':
        return <RecommendationEngine />;
      default:
        return <ChatBot />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Makers Tech Concierge</h1>
          <p className="text-primary-foreground/80">Sistema inteligente de asistencia tecnológica</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-card border-b p-4">
        <div className="max-w-6xl mx-auto flex gap-2">
          <Button
            variant={activeTab === 'chat' ? 'default' : 'outline'}
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            ChatBot
          </Button>
          <Button
            variant={activeTab === 'recommendations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('recommendations')}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Recomendaciones
          </Button>
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto h-[calc(100vh-200px)]">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
