
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Send, CornerDownLeft, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatRupees } from '@/utils/itineraryUtils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Hello! I am your travel assistant. Ask me about destinations, travel tips, or anything travel-related!',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { prompt: input },
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.response || "I couldn't find information about that. Please try a different question.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageContent = (content: string) => {
    // Replace $ with ₹ and convert mentions of USD to INR
    let formattedContent = content.replace(/\$(\d+)/g, (match, amount) => {
      const inr = Math.round(parseFloat(amount) * 83.13); // Use the same conversion rate
      return formatRupees(inr);
    });

    // Replace USD with INR
    formattedContent = formattedContent.replace(/USD/g, 'INR');
    
    // Convert markdown-style formatting
    formattedContent = formattedContent
      .split('\n')
      .map(line => {
        // Convert headers
        if (line.startsWith('# ')) {
          return `<h2 class="text-xl font-bold my-2">${line.slice(2)}</h2>`;
        }
        if (line.startsWith('## ')) {
          return `<h3 class="text-lg font-bold my-2">${line.slice(3)}</h3>`;
        }
        // Convert bullet points
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return `<li class="ml-4">${line.slice(2)}</li>`;
        }
        // Number lists
        if (/^\d+\.\s/.test(line)) {
          return `<li class="ml-4">${line.replace(/^\d+\.\s/, '')}</li>`;
        }
        // Regular paragraph
        if (line.trim()) {
          return `<p class="my-1">${line}</p>`;
        }
        return line;
      })
      .join('\n');

    return formattedContent;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Travel Assistant</h1>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ask Me Anything About Travel</CardTitle>
          <CardDescription>
            Get personalized recommendations for destinations, activities, budgeting and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user' 
                        ? 'bg-teal text-white' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === 'bot' ? (
                        <Bot className="h-4 w-4 mr-1" />
                      ) : (
                        <User className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs font-medium">
                        {message.role === 'bot' ? 'Travel Assistant' : 'You'}
                      </span>
                    </div>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                    />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Ask about destinations, travel tips, or itinerary ideas..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                <CornerDownLeft className="h-4 w-4" />
              </span>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Try asking questions like:</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["Best places to visit in India", "Budget trip to Goa", "When to visit Kerala", "Top attractions in Mumbai"].map(suggestion => (
            <Button 
              key={suggestion} 
              variant="outline" 
              size="sm"
              onClick={() => {
                setInput(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
