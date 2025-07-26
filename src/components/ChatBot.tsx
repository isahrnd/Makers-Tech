import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Zap } from 'lucide-react';
import { processUserQuery, type ChatMessage, type BotResponse } from '@/services/chatBotEngine';

const ChatBot = () => {
  // Estados del chat - simples y claros
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Mensaje de bienvenida automático
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: '¡Hola! Soy el asistente virtual de Makers Tech. ¿En qué puedo ayudarte hoy?',
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);
  
  // Scroll automático hacia abajo
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Función simple para enviar mensaje
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simular delay de respuesta del bot (para que se vea más natural)
    setTimeout(() => {
      const botResponse = processUserQuery(inputValue);
      
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse.message,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  // Manejar Enter para enviar
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Función para usar acciones sugeridas
  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };
  
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header del chat */}
      <div className="bg-gradient-to-r from-primary to-primary-glow p-6 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Makers Tech Assistant</h1>
            <p className="text-primary-foreground/80">Tu concierge tecnológico</p>
          </div>
        </div>
      </div>
      
      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.isBot ? 'justify-start' : 'justify-end'
              }`}
            >
              {message.isBot && (
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <Card className={`max-w-[80%] p-4 ${
                message.isBot 
                  ? 'bg-gradient-to-br from-card to-muted/50' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.text}
                </div>
                <div className={`text-xs mt-2 ${
                  message.isBot ? 'text-muted-foreground' : 'text-primary-foreground/70'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </Card>
              
              {!message.isBot && (
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          
          {/* Indicador de escritura */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <Card className="bg-gradient-to-br from-card to-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-muted-foreground text-sm">Escribiendo...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Acciones rápidas */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleSuggestedAction('¿Cuántos computadores tienen disponibles?')}
          >
            Ver inventario
          </Badge>
          <Badge 
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleSuggestedAction('¿Cuáles son los precios de las laptops?')}
          >
            Mostrar precios
          </Badge>
          <Badge 
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleSuggestedAction('Recomiéndame un computador')}
          >
            Recomendaciones
          </Badge>
        </div>
        
        {/* Input de mensaje */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;