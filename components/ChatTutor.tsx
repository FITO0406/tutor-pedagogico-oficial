'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { useTutor, Message } from '@/hooks/useTutor';
import { Recurso } from '@/types/recurso';

interface ChatTutorProps {
  recurso: Recurso;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatTutor({ recurso, isOpen, onClose }: ChatTutorProps) {
  const { 
    engine, 
    loadingProgress, 
    status, 
    isInitializing, 
    error, 
    initEngine, 
    generateResponse 
  } = useTutor();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Inicializar motor al abrir
  useEffect(() => {
    if (isOpen && !engine) {
      initEngine();
    }
  }, [isOpen, engine, initEngine]);

  // Prompt inicial con contexto
  useEffect(() => {
    if (engine && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `¡Hola! Soy tu Tutor Pedagógico Oficial. Estoy listo para ayudarte a entender el recurso: **"${recurso.titulo}"**. \n\n¿Tienes alguna pregunta sobre el contenido o cómo aplicarlo?`
        }
      ]);
    }
  }, [engine, recurso.titulo]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !engine || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const contextMessages: Message[] = [
        {
          role: 'system',
          content: `Eres un experto Tutor Pedagógico. Estás ayudando a un usuario con el siguiente recurso:
          Título: ${recurso.titulo}
          Descripción: ${recurso.descripcion}
          Materias: ${recurso.materia}
          
          Responde de forma clara, motivadora y educativa. Si no sabes algo, admítelo y sugiere consultar el recurso original.`
        },
        ...messages,
        userMessage
      ];

      const chunks = await generateResponse(contextMessages);
      let assistantContent = '';
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of chunks) {
        const delta = chunk.choices[0].delta.content || '';
        assistantContent += delta;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Error en el chat:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold">Tutor Pedagógico</h2>
                  <p className="text-xs text-blue-100">Local AI • 100% Gratuito</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              {!engine && !error && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">Cargando Inteligencia Local</p>
                    <p className="text-sm text-gray-500 max-w-[200px]">
                      Descargando el "cerebro" del tutor... ({loadingProgress}%)
                    </p>
                  </div>
                  <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Solo la primera vez</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
                  {error}. Prueba a recargar o usa un navegador moderno con WebGPU.
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-gray-100 text-gray-600 ml-2' : 'bg-blue-100 text-blue-600 mr-2'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.content || (isTyping && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : '')}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && messages[messages.length-1].role === 'user' && (
                <div className="flex justify-start">
                   <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 mr-2 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta algo sobre el recurso..."
                  disabled={!engine || isTyping}
                  className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-600/20 outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!engine || isTyping || !input.trim()}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-200 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-center space-x-1 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>IA Local • Privada • Gratuita</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
